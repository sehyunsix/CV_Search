"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcurrentWebCrawler = void 0;
const logger_1 = require("../utils/logger");
class ConcurrentWebCrawler {
    constructor(crawler, concurrency = 4) {
        this.crawler = crawler;
        this.concurrency = concurrency;
    }
    async run() {
        logger_1.defaultLogger.debug(`ConcurrentWebCrawler 실행 (동시성: ${this.concurrency})`);
        await this.crawler.initialize();
        const workers = [];
        for (let i = 0; i < this.concurrency; i++) {
            workers.push(this.processUrls(i));
        }
        await Promise.all(workers);
        logger_1.defaultLogger.debug('ConcurrentWebCrawler 실행 완료');
    }
    async processUrls(workerId) {
        let visitCount = 0;
        while (true) {
            try {
                // 동시성 제어가 구현된 getNextUrl 사용
                const nextUrlInfo = await this.crawler.urlManager.getNextUrl();
                if (!nextUrlInfo) {
                    logger_1.defaultLogger.debug(`[작업자 ${workerId}] 더 이상 방문할 URL이 없습니다.`);
                    continue;
                }
                visitCount++;
                logger_1.defaultLogger.debug(`[작업자 ${workerId}] URL ${visitCount} 처리 중...`);
                const visitResult = await this.crawler.visitUrl(nextUrlInfo);
                if (visitResult.success === false) {
                    this.crawler.urlManager.setURLStatus(visitResult.url, "notvisited" /* URLSTAUS.NOT_VISITED */);
                    continue;
                }
                if (!visitResult.text) {
                    this.crawler.urlManager.setURLStatus(visitResult.url, "noRecruitInfo" /* URLSTAUS.NO_RECRUITINFO */);
                    logger_1.defaultLogger.debug(`[작업자 ${workerId}] 텍스트 없음, 건너뜀.`);
                    continue;
                }
                const isSaveSuccess = await this.crawler.urlManager.saveTextHash(visitResult.text);
                if (isSaveSuccess === false) {
                    logger_1.defaultLogger.debug(`[작업자 ${workerId}] 중복된 텍스트, 저장하지 않음.`);
                    this.crawler.urlManager.setURLStatus(visitResult.url, "noRecruitInfo" /* URLSTAUS.NO_RECRUITINFO */);
                    continue;
                }
                await this.crawler.saveVisitResult(visitResult);
            }
            catch (error) {
                logger_1.defaultLogger.error(`[작업자 ${workerId}] 오류 발생:`, error);
                throw new Error("작업자 브라우저 에러 발생");
            }
        }
        logger_1.defaultLogger.debug(`[작업자 ${workerId}] 완료. 총 ${visitCount}개 URL 방문`);
    }
}
exports.ConcurrentWebCrawler = ConcurrentWebCrawler;
//# sourceMappingURL=CocurrentCralwer.js.map