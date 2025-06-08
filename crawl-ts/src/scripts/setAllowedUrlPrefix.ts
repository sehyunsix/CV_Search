import 'dotenv/config';
import { RedisClientType, createClient } from 'redis';
import { defaultLogger as logger } from '../../src/utils/logger';

logger.debug(`env config ... ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);

const redisClient = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: false, // 반드시 설정 !!
});

async function setAllowedUrlPrefix() {
  try {
    // Redis 클라이언트 연결
    await redisClient.connect();
    logger.info('Connected to Redis');

    // 'allowed_url_prefix' 키에 URL 접두사 설정
    const domains = await redisClient.sMembers('domains');
    for (const domain of domains) {
      logger.info(`Setting allowed URL prefix for domain: ${domain}`);
      await redisClient.sAdd(`allowed_url_prefix:${domain}`,'domain');
    }

  } catch (error) {
    logger.error('Error setting allowed URL prefixes:', error);
  } finally {
    // Redis 클라이언트 연결 종료
    await redisClient.quit();
    logger.info('Redis connection closed');
  }
}

setAllowedUrlPrefix()