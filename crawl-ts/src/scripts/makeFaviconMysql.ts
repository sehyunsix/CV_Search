import 'dotenv/config';
import { Logger, defaultLogger as logger } from '../../src/utils/logger';
import { MysqlFaviconSequelize } from '../models/MysqlRecruitInfoModel';
import { RedisUrlManager } from '../url/RedisUrlManager';

async function main() {

  const redisUrlManager = new RedisUrlManager();
  await redisUrlManager.connect();
  const faviconList = await redisUrlManager.getAllFavicon();

  for (const data of faviconList) {
    try {
      const result = await MysqlFaviconSequelize.upsert({ domain: data.domain, logo: data.logo }, { returning: true });
      logger.debug('[MysqlRecruitInfoRepository][createRecruitInfo] 파비콘 저장 성공:', data.domain);
    } catch (error) {
      logger.error(`Error checking URL in MySQL: ${data.domain}`, error);
    }
  }


}

main()
  .then(() => {
    logger.info('Favicon data migration completed successfully.');
  })
  .catch((error) => {
    logger.error('Error during favicon data migration:', error);
  });