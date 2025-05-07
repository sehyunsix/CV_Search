import { WebCrawler } from './WebCrawler';
import { defaultLogger as logger } from '../utils/logger';
import { URLSTAUS } from '../url/RedisUrlManager';
import { ProtocolError ,TimeoutError  } from 'puppeteer';

export class ConcurrentWebCrawler {
  private crawler: WebCrawler;
  private concurrency: number;

  constructor(crawler: WebCrawler, concurrency: number = 4) {
    this.crawler = crawler;
    this.concurrency = concurrency;
  }

  async run(): Promise<void> {
    logger.debug(`ConcurrentWebCrawler 실행 (동시성: ${this.concurrency})`);

    await this.crawler.initialize();

    const workers = [];
    for (let i = 0; i < this.concurrency; i++) {
      workers.push(this.processUrls(i));
    }

    await Promise.all(workers);

    logger.debug('ConcurrentWebCrawler 실행 완료');
  }

  private async processUrls(workerId: number): Promise<void> {
    let visitCount = 0;

    while (true) {
      try {
        // 동시성 제어가 구현된 getNextUrl 사용
        const nextUrlInfo = await this.crawler.urlManager.getNextUrl();
        if (!nextUrlInfo) {
          logger.debug(`[작업자 ${workerId}] 더 이상 방문할 URL이 없습니다.`);
          continue;
        }

        visitCount++;
        logger.debug(`[작업자 ${workerId}] URL ${visitCount} 처리 중...`);

        const visitResult = await this.crawler.visitUrl(nextUrlInfo);

        if (visitResult.success === false) {
          this.crawler.urlManager.setURLStatus(visitResult.url, URLSTAUS.NOT_VISITED);
          continue;
        }

        if (!visitResult.text) {
          this.crawler.urlManager.setURLStatus(visitResult.url, URLSTAUS.NO_RECRUITINFO);
          logger.debug(`[작업자 ${workerId}] 텍스트 없음, 건너뜀.`);
          continue;
        }

        const isSaveSuccess = await this.crawler.urlManager.saveTextHash(visitResult.text);

        if (isSaveSuccess === false) {
          logger.debug(`[작업자 ${workerId}] 중복된 텍스트, 저장하지 않음.`);
          this.crawler.urlManager.setURLStatus(visitResult.url, URLSTAUS.NO_RECRUITINFO);
          continue;
        }

        await this.crawler.saveVisitResult(visitResult);

      } catch (error) {
        logger.error(`[작업자 ${workerId}] 오류 발생:`, error);
        if (error instanceof ProtocolError || error instanceof TimeoutError) {
            logger.error('프로토콜 에러 발생: 브라우저 연결 문제가 있을 수 있습니다');
            await this.crawler.browserManager.closeBrowser();
            const broswer = await this.crawler.browserManager.initBrowser()
            if (!broswer) {
                throw new Error("브라우저가 초기화되지 않았습니다.");
            }
            continue;
        }
        continue;
      }
      finally {
        logger.debug(`[작업자 ${workerId}] 완료. 총 ${visitCount}개 URL 방문`);
      }
    }
  }
}