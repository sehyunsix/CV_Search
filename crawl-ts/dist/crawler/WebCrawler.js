"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebCrawler = void 0;
const visitResult_1 = require("../models/visitResult");
const logger_1 = require("../utils/logger");
const urlUtils_1 = require("../url/urlUtils");
/**
 * 웹 크롤러 구현체
 * 브라우저, 콘텐츠 추출, URL 관리, DB 연결 컴포넌트를 조합한 크롤러
 */
class WebCrawler {
    /**
     * 웹 크롤러 생성자
     * @param options 크롤러 옵션
     */
    constructor(options) {
        this.isRunning = false;
        this.browserManager = options.browserManager;
        this.contentExtractor = options.contentExtractor;
        this.urlManager = options.urlManager;
        this.dbConnector = options.dbConnector;
        this.delayBetweenRequests = options.delayBetweenRequests;
        this.headless = options.headless;
        this.maxUrls = options.maxUrls;
        this.strategy = options.strategy;
    }
    /**
     * 크롤러 초기화
     */
    async initialize() {
        // 데이터베이스 연결
        await this.dbConnector.connect();
        logger_1.defaultLogger.debug('크롤러 초기화 완료');
    }
    /**
     * URL 방문 및 데이터 추출
     * @param urlInfo 방문할 URL 정보
     * @returns 방문 결과
     */
    async visitUrl(urlInfo) {
        const { url, domain } = urlInfo;
        logger_1.defaultLogger.debug(`=== URL 방문 시작: ${url} ===`);
        const startTime = Date.now();
        let subUrlResult = new visitResult_1.SubUrl({
            url: url,
            domain: domain,
            visited: true,
            visitedAt: new Date(),
        });
        let page;
        try {
            // 브라우저가 초기화되어 있는지 확인
            const browser = await this.browserManager.initBrowser();
            // 새 페이지 열기
            page = await browser.newPage();
            // 자바스크립트 대화상자 처리
            page.on('dialog', async (dialog) => {
                await dialog.dismiss();
            });
            // 페이지 로드
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000 // 30초
            });
            // 현재 URL 가져오기 (리다이렉트 가능성)
            subUrlResult.finalUrl = page.url();
            // 최종 URL의 도메인 확인
            subUrlResult.finalDomain = subUrlResult.finalUrl ? (0, urlUtils_1.extractDomain)(subUrlResult.finalUrl) : domain;
            try {
                // 페이지 내용 추출
                subUrlResult.pageContent = await this.contentExtractor.extractPageContent(page);
                subUrlResult.title = subUrlResult.pageContent.title;
                subUrlResult.text = subUrlResult.pageContent.text;
            }
            catch (error) {
                logger_1.defaultLogger.error('페이지 내용 추출 중 오류:', error);
                subUrlResult.errors.push({
                    type: 'content_extraction',
                    message: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined
                });
            }
            try {
                // 기본 링크 추출 (a 태그)
                const extractStartTime = Date.now();
                subUrlResult.herfUrls = await this.contentExtractor.extractLinks(page, [domain]);
                const extractRuntime = Date.now() - extractStartTime;
                logger_1.defaultLogger.eventInfo('extract_herf', { url, runtime: extractRuntime });
            }
            catch (error) {
                logger_1.defaultLogger.error('링크 추출 중 오류:', error);
                subUrlResult.errors.push({
                    type: 'link_extraction',
                    message: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined
                });
            }
            try {
                // JavaScript 실행을 통한 추가 URL 추출 (onclick 이벤트 등)
                // 이 예제에서는 간소화를 위해 생략하고 빈 배열 할당
                subUrlResult.onclickUrls = await this.contentExtractor.extractOnclickLinks(page, [domain]);
                logger_1.defaultLogger.debug('JavaScript 이벤트 처리 생략 (간소화된 구현)');
            }
            catch (error) {
                logger_1.defaultLogger.error('JavaScript 실행 중 오류:', error);
                subUrlResult.errors.push({
                    type: 'script_extraction',
                    message: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined,
                    url: subUrlResult.finalUrl
                });
            }
            subUrlResult.success = true;
            // 모든 발견된 URL 병합
            subUrlResult.crawledUrls = Array.from(new Set([
                ...(subUrlResult.herfUrls || []),
                ...(subUrlResult.onclickUrls || [])
            ]));
            // 통계 정보 업데이트
            subUrlResult.crawlStats = {
                total: subUrlResult.crawledUrls.length,
                href: subUrlResult.herfUrls?.length || 0,
                onclick: subUrlResult.onclickUrls?.length || 0,
                blocked_by_robots: 0,
                allowed_after_robots: subUrlResult.crawledUrls.length
            };
            const runtime = Date.now() - startTime;
            logger_1.defaultLogger.eventInfo('visit_url', { runtime });
            return subUrlResult;
        }
        catch (error) {
            // 오류 정보를 결과 객체에 추가
            subUrlResult.success = false;
            subUrlResult.error = error instanceof Error ? error.message : String(error);
            subUrlResult.errors.push({
                type: 'page_visit',
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            const runtime = Date.now() - startTime;
            logger_1.defaultLogger.eventError('visit_url', { runtime, error: subUrlResult.error });
            // 에러 스크린샷 저장
            await this.browserManager.saveErrorScreenshot(page, url);
            return subUrlResult;
        }
        finally {
            try {
                if (page) {
                    await page.close();
                    logger_1.defaultLogger.debug('페이지 닫기 완료');
                }
            }
            catch (pageCloseError) {
                logger_1.defaultLogger.error('페이지 닫기 중 오류:', pageCloseError);
            }
        }
    }
    /**
     * URL 큐 처리
     */
    async processQueue() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        try {
            // 데이터베이스 연결
            await this.dbConnector.connect();
            // 방문 URL 카운터
            let visitCount = 0;
            // URL을 하나씩 가져와 처리
            while (visitCount < this.maxUrls) {
                try {
                    const nextUrlInfo = await this.urlManager.getNextUrl();
                    if (!nextUrlInfo) {
                        logger_1.defaultLogger.debug('더 이상 방문할 URL이 없습니다.');
                        break;
                    }
                    visitCount++;
                    this.currentUrl = nextUrlInfo.url;
                    logger_1.defaultLogger.debug(`URL ${visitCount}/${this.maxUrls} 처리 중...`);
                    // URL 방문 및 처리
                    const visitResult = await this.visitUrl(nextUrlInfo);
                    // 결과를 데이터베이스에 저장
                    await this.dbConnector.saveVisitResult(visitResult);
                    // 요청 사이 지연 추가
                    if (visitCount < this.maxUrls) {
                        logger_1.defaultLogger.debug(`다음 URL 처리 전 ${this.delayBetweenRequests}ms 대기...`);
                        await new Promise(resolve => setTimeout(resolve, this.delayBetweenRequests));
                    }
                }
                catch (error) {
                    logger_1.defaultLogger.error(`URL 처리 중 오류:`, error);
                }
                finally {
                    await this.browserManager.closeBrowser();
                }
            }
            logger_1.defaultLogger.debug(`큐 처리 완료. 총 ${visitCount}개 URL 방문`);
        }
        catch (error) {
            logger_1.defaultLogger.error('큐 처리 중 오류:', error);
        }
        finally {
            await this.browserManager.closeBrowser();
            this.isRunning = false;
        }
    }
    /**
     * 크롤러 실행
     */
    async run() {
        logger_1.defaultLogger.debug(`WebCrawler 실행`);
        try {
            await this.initialize();
            await this.processQueue();
        }
        finally {
            await this.browserManager.closeBrowser();
        }
        logger_1.defaultLogger.debug('WebCrawler 실행 완료');
    }
}
exports.WebCrawler = WebCrawler;
//# sourceMappingURL=WebCrawler.js.map