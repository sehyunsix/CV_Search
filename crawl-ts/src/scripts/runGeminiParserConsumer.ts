import * as dotenv from 'dotenv';
import { GeminiParser, ParseError } from '../parser/GeminiParser';
import { handleLiveMessage } from '../message/Consume';
import { defaultLogger as logger } from '../utils/logger';
import { IRawContent } from '../models/RecruitInfoModel';
import { ConsumeMessage } from 'amqplib';



// Load environment variables
dotenv.config();


(async () => {

  const parser = new GeminiParser();

  handleLiveMessage(
    (msg) => {
      if (msg) {
        const rawContent = JSON.parse(msg.content.toString()) as IRawContent;
        // verify
        parser.parseRawContentRetry(rawContent, 3)
        .then(
          (parseContent) => {
            if (!parseContent) {throw new ParseError("parsesContent가 존재하지 않습니다.")}
            return parser.makeDbRecruitInfo(parseContent ,rawContent)
          }
        )
        .catch(
          (error) => {
            if (error instanceof ParseError) {
              logger.error('Rawcontent를 파싱하는데 실패하였습니다.')
            }
            else {
              logger.error('DB DTO롤 만드는데 실패하였습니다.')
            }
          }
        )
        .then(
          (dbRecruitInfo) => {
              if (dbRecruitInfo) {
                recruitInfoRepository.createRecruitInfo(dbRecruitInfo);
              }
            }
        )
          .catch(
            (error) => {
              logger.error('새로운 채용공를 업데이트 하는데 실패하였습니다.')
            }

        )
      }
    }
  )

})()
/**
 * Initialize and start the GeminiParser as a RabbitMQ consumer
 */
export async function startGeminiParserConsumer(): Promise<void> {

  try {

       const parser = new GeminiParser();
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
        if (dbRecruitInfo.is_recruit_info === true && dbRecruitInfo.job_description && dbRecruitInfo.company_name && dbRecruitInfo.title) {
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

