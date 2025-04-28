import * as dotenv from 'dotenv';
import { GeminiParser } from '../parser/GeminiParser';
import { MongoDbConnector } from '../database/MongoDbConnector';
import { MysqlRecruitInfoRepository } from '../database/MysqlRecruitInfoRepository';
import { MongoRecruitInfoRepository } from '../database/MongoRecruitInfoRepository';
import MessageService, { QueueNames } from '../message/MessageService';
import { RedisUrlManager, URLSTAUS } from '../url/RedisUrlManager';
import { ConsumeMessage } from 'amqplib';
import { defaultLogger as logger } from '../utils/logger';
import { IRawContent } from '../models/RecruitInfoModel';
import { MySqlConnector } from '../database/MySqlConnector';
import { MongoRecruitInfoModel } from '../models/MongoRecruitInfoModel';
import { mysqlRecruitInfoModel, mysqlRecruitInfoSequelize } from '../models/MysqlRecruitInfoModel';

// Load environment variables
dotenv.config();

/**
 * Initialize and start the GeminiParser as a RabbitMQ consumer
 */
export async function startGeminiParserConsumer(): Promise<void> {

  try {

       const parser = new GeminiParser({
          apiKey: process.env.GEMINI_API_KEY,
          apiKeys: process.env.GEMINI_API_KEYS?.split(','),
          model: process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest',
          dbConnector: new MySqlConnector(),
          cacheDbConnector: new MongoDbConnector(),
          cacheRecruitInfoRepository: new MongoRecruitInfoRepository(MongoRecruitInfoModel),
          recruitInfoRepository: new MysqlRecruitInfoRepository(mysqlRecruitInfoModel ,mysqlRecruitInfoSequelize),
          urlManager: new RedisUrlManager(),
          messageService: new MessageService(),
          useCache: true
        });
     const initialized = await parser.initialize();
    if (!initialized) {
      console.error('Failed to initialize GeminiParser');
      process.exit(1);
    }

    parser.messageService.handleLiveMessage(QueueNames.VISIT_RESULTS, async (msg : ConsumeMessage | null) => {
      if (msg) {
        const result = JSON.parse(msg.content.toString()) as IRawContent;
        logger.debug(result.url);
        const parsedContent = await parser.parseRawContent(result);
        let dbRecruitInfo = parser.makeDbRecruitInfo(parsedContent, result);
        // const saved = await this.saveParsedContent(dbRecruitInfo, { destination: 'db' });
        if (dbRecruitInfo.is_recruit_info === true && dbRecruitInfo.job_description) {
          await parser.urlManager.setURLStatus(dbRecruitInfo.url, URLSTAUS.HAS_RECRUITINFO);
          if (dbRecruitInfo.region_id) {
            dbRecruitInfo.region_id = (await parser.recruitInfoRepository.getRegionIdByCode(dbRecruitInfo.region_id))?.toString();
            logger.debug(`getRegionIdByCode : ${dbRecruitInfo.region_id}`);
          }
          await parser.recruitInfoRepository.createRecruitInfo(dbRecruitInfo);
          if (parser.cacheRecruitInfoRepository) {
            await parser.cacheRecruitInfoRepository.createRecruitInfo(dbRecruitInfo);
          }
        }
        else {
          await parser.urlManager.setURLStatus(dbRecruitInfo.url, URLSTAUS.NO_RECRUITINFO);
        }
      }
    });

    console.log('Starting GeminiParser as consumer...');
    console.log('GeminiParser consumer is now active and listening for messages');
    // Setup graceful shutdown

  } catch (error) {
    console.error('Error in startGeminiParserConsumer function:', error);
    // Ensure connections are closed even if there's an error
    try {
      console.log('Disconnected from services due to error');
    } catch (disconnectError) {
      console.error('Error disconnecting from services:', disconnectError);
    }
    process.exit(1);
  }
}

// Run the script if this file is executed directly
if (require.main === module) {
  startGeminiParserConsumer().catch(error => {
    console.error('Uncaught error:', error);
    process.exit(1);
  });
}