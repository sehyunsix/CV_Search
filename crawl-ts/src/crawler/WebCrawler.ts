import { ICrawler } from './ICrawler';
import { IBrowserManager } from '../browser/IBrowserManager';
import { IContentExtractor } from '../content/IContentExtractor';
import { SubUrl } from '../models/VisitResult';
import { defaultLogger as logger } from '../utils/logger';
import { extractDomain } from '../url/urlUtils';
import { Dialog ,Page ,ProtocolError} from 'puppeteer';
import { IMessageService } from '../message/IMessageService';
import { IUrlManager } from '../url/IUrlManager';
import { URLSTAUS } from '@url/RedisUrlManager';
import { TimeoutError } from 'sequelize/types';

  /**
   * 웹 크롤러 구현체
   * 브라우저, 콘텐츠 추출, URL 관리, DB 연결 컴포넌트를 조합한 크롤러
   */
  export class WebCrawler implements ICrawler {
    browserManager: IBrowserManager;
    contentExtractor: IContentExtractor;
    urlManager: IUrlManager;
    messageService: IMessageService;

    /**
     * 웹 크롤러 생성자
     * @param options 크롤러 옵션
     */
    constructor(options: {
      browserManager: IBrowserManager;
      contentExtractor: IContentExtractor;
      messageService: IMessageService;
      urlManager: IUrlManager;

    }) {
      this.browserManager = options.browserManager;
      this.contentExtractor = options.contentExtractor;
      this.urlManager = options.urlManager;
      this.messageService = options.messageService;
    }

    /**
     * 크롤러 초기화
     */
    async initialize(): Promise<void> {
      // 데이터베이스 연결
      await this.messageService.connect();

      await this.urlManager.connect();

      await this.browserManager.initBrowser();

      logger.debug('크롤러 초기화 완료');
    }

  /**
   * 페이지 방문 및 데이터 추출
   * @param urlInfo 방문할 URL 정보
   * @returns 방문 결과
   */
  async visitUrl(url: string, domain: string ): Promise<SubUrl> {


    logger.debug(`=== URL 방문 시작: ${url} ===`);
    const startTime = Date.now();

    let subUrlResult = new SubUrl({
      url: url,
      domain: domain,
      visitedAt: new Date(),
    });
    let page: Page;

    //페이지 생성
    return this.browserManager.getNewPage()
      .then((page) => {
        page.on('dialog', async (dialog: Dialog) => {
          await dialog.dismiss();
        });
        return page;
      })
      .then((page) => {
        page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 20000 // 20초
        });
        return page;
      })
      .then((page) => {
        subUrlResult.finalUrl = page.url();
        subUrlResult.finalDomain = subUrlResult.finalUrl ? extractDomain(subUrlResult.finalUrl) : domain;
        return this.contentExtractor.extractPageContent(page).then((results) => ({page, results }));
      })
      .then((context) => {
        // 페이지 내용 추출
        subUrlResult.title = context.results.title;
        subUrlResult.text = context.results.text;
        return this.contentExtractor.extractLinks(context.page, [domain]).then((results) => ({...context, results }));
      })
      .then((context) => {
        // 기본 링크 추출 (a 태그)
        subUrlResult.herfUrls = context.results;
        return this.contentExtractor.extractOnclickLinks(context.page, [domain]);
      })
      .then((onclickUrls) => {
        subUrlResult.onclickUrls = onclickUrls;
        subUrlResult.crawledUrls = Array.from(new Set([
          ...subUrlResult.herfUrls,
          ...subUrlResult.onclickUrls
        ]));
        subUrlResult.crawlStats = {
          total: subUrlResult.crawledUrls.length,
          href: subUrlResult.herfUrls?.length || 0,
          onclick: subUrlResult.onclickUrls?.length || 0,
          blocked_by_robots: 0,
          allowed_after_robots: subUrlResult.crawledUrls.length
        };
        subUrlResult.success = true;
        return subUrlResult;
      })
  }

  async saveVisitResult(result: SubUrl): Promise<boolean> {
    await this.messageService.sendVisitResult(result);
    result.crawledUrls.map((url) => {
      this.urlManager.addUrl(url, result.domain, URLSTAUS.NOT_VISITED)
    })
    await this.urlManager.setURLStatus(result.url, URLSTAUS.VISITED);
    return true;
  }

async processQueue(): Promise<void> {
    let visitCount = 0;
    while (true) {
      try {
        const nextUrlInfo = await this.urlManager.getNextUrl();
        if (!nextUrlInfo) {

          logger.debug('더 이상 방문할 URL이 없습니다.');
          break;
        }

        visitCount++;

        logger.debug(`URL ${visitCount} 처리 중...`);

        const visitResult = await this.visitUrl(nextUrlInfo.url, nextUrlInfo.domain);

        if (!visitResult.text) {
          logger.debug("텍스트 없음, 건너뜀.");
          continue;
        }

        const isSaveSuccess = await this.urlManager.saveTextHash(visitResult.text);
        if (isSaveSuccess===false) {
          logger.debug("중복된 텍스트, 저장하지 않음.");
          this.urlManager.setURLStatus(visitResult.url, URLSTAUS.NO_RECRUITINFO);
          continue;
        }

        await this.saveVisitResult(visitResult);

        // if (visitCount < this.maxUrls) {
        //   logger.debug(`다음 URL 처리 전 ${this.delayBetweenRequests}ms 대기...`);
        //   await new Promise(resolve => setTimeout(resolve, this.delayBetweenRequests));
        // }

      } catch (error) {
        throw error;
      }
    }
    logger.debug(`큐 처리 완료. 총 ${visitCount}개 URL 방문`);
}


  /**
   * 크롤러 실행
   */
  async run(): Promise<void> {
    logger.debug(`WebCrawler 실행`);
    try {
      await this.initialize();
      await this.processQueue();
    } finally {
      await this.browserManager.closeBrowser();
    }
    logger.debug('WebCrawler 실행 완료');
  }
}