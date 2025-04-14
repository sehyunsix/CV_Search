"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var puppeteer = require('puppeteer');
var BaseWorkerManager = require('@crawl/baseWorkerManager').BaseWorkerManager;
var extractAndExecuteScripts = require('@crawl/baseWorker').extractAndExecuteScripts;
var SubUrl = require('@models/visitResult').SubUrl;
var logger = require('@src/utils/logger').defaultLogger;
// 테스트 타임아웃 설정 (필요에 따라 조정)
jest.setTimeout(60000);
describe('네이버 채용 페이지 크롤링 테스트', function () {
    var browser;
    var manager;
    var page;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer.launch({
                        headless: 'new',
                        args: ['--no-sandbox', '--disable-setuid-sandbox']
                    })];
                case 1:
                    // 테스트용 브라우저 및 매니저 초기화
                    browser = _a.sent();
                    manager = new BaseWorkerManager({
                        browser: browser,
                        headless: 'new',
                        startUrl: 'https://recruit.navercorp.com/rcrt/list.do',
                        delayBetweenRequests: 1000, // 테스트에서는 딜레이 줄임
                        maxUrls: 1
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!browser) return [3 /*break*/, 2];
                    return [4 /*yield*/, browser.close()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, browser.newPage()];
                case 1:
                    // 각 테스트마다 새 페이지 생성
                    page = _a.sent();
                    // 자바스크립트 대화상자 자동 처리
                    page.on('dialog', function (dialog) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, dialog.dismiss()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!page) return [3 /*break*/, 2];
                    return [4 /*yield*/, page.close()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    test('기본 페이지 정보 추출 테스트', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pageContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 페이지 로드
                return [4 /*yield*/, page.goto('https://recruit.navercorp.com/rcrt/list.do', {
                        waitUntil: 'networkidle2',
                        timeout: 30000
                    })];
                case 1:
                    // 페이지 로드
                    _a.sent();
                    return [4 /*yield*/, manager.extractPageContent(page)];
                case 2:
                    pageContent = _a.sent();
                    // 검증
                    expect(pageContent).toBeDefined();
                    expect(pageContent.title).toBeDefined();
                    expect(pageContent.title.toLowerCase()).toContain('naver');
                    expect(pageContent.text).toBeDefined();
                    expect(pageContent.text.length).toBeGreaterThan(100); // 충분한 텍스트가 있어야 함
                    // 주요 키워드 확인
                    expect(pageContent.text.toLowerCase()).toContain('채용');
                    // 결과 로깅
                    logger.info("\uC81C\uBAA9: ".concat(pageContent.title));
                    logger.info("\uD14D\uC2A4\uD2B8 \uAE38\uC774: ".concat(pageContent.text.length, "\uC790"));
                    logger.info("\uD14D\uC2A4\uD2B8 \uC0D8\uD50C: ".concat(pageContent.text.substring(0, 200), "..."));
                    return [2 /*return*/];
            }
        });
    }); });
    test('링크 추출 테스트', function () { return __awaiter(void 0, void 0, void 0, function () {
        var links;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 페이지 로드
                return [4 /*yield*/, page.goto('https://recruit.navercorp.com/rcrt/list.do', {
                        waitUntil: 'networkidle2',
                        timeout: 30000
                    })];
                case 1:
                    // 페이지 로드
                    _a.sent();
                    return [4 /*yield*/, manager.extractLinks(page, ['navercorp.com'])];
                case 2:
                    links = _a.sent();
                    // 검증
                    expect(links).toBeDefined();
                    expect(Array.isArray(links)).toBe(true);
                    expect(links.length).toBeGreaterThan(0);
                    // 모든 링크가 navercorp.com 도메인인지 확인
                    links.forEach(function (link) {
                        expect(link).toContain('navercorp.com');
                    });
                    // 결과 로깅
                    logger.info("\uCD94\uCD9C\uB41C \uB9C1\uD06C \uC218: ".concat(links.length));
                    logger.info("\uB9C1\uD06C \uC0D8\uD50C: ".concat(links.slice(0, 5).join('\n')));
                    return [2 /*return*/];
            }
        });
    }); });
    test('onclick 스크립트 추출 테스트', function () { return __awaiter(void 0, void 0, void 0, function () {
        var url, domain, onclickUrls;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = 'https://recruit.navercorp.com/rcrt/list.do';
                    domain = ['navercorp.com'];
                    return [4 /*yield*/, extractAndExecuteScripts(url, domain, browser)];
                case 1:
                    onclickUrls = _a.sent();
                    // 검증
                    expect(onclickUrls).toBeDefined();
                    expect(Array.isArray(onclickUrls)).toBe(true);
                    // onclick URL이 발견되어야 함
                    expect(onclickUrls.length).toBeGreaterThan(0);
                    // 결과 로깅
                    logger.info("\uCD94\uCD9C\uB41C onclick URL \uC218: ".concat(onclickUrls.length));
                    if (onclickUrls.length > 0) {
                        logger.info("onclick URL \uC0D8\uD50C: ".concat(onclickUrls.slice(0, 5).join('\n')));
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    test('전체 방문 프로세스 테스트', function () { return __awaiter(void 0, void 0, void 0, function () {
        var urlInfo, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urlInfo = {
                        url: 'https://recruit.navercorp.com/rcrt/list.do',
                        domain: 'navercorp.com'
                    };
                    return [4 /*yield*/, manager.visitUrl(urlInfo)];
                case 1:
                    result = _a.sent();
                    // 결과가 SubUrl 인스턴스인지 확인
                    expect(result).toBeInstanceOf(SubUrl);
                    // 기본 필드 검증
                    expect(result.url).toBe(urlInfo.url);
                    expect(result.domain).toBe(urlInfo.domain);
                    expect(result.visited).toBe(true);
                    expect(result.success).toBe(true);
                    // 내용 검증
                    expect(result.title).toBeDefined();
                    expect(result.text).toBeDefined();
                    expect(result.text.length).toBeGreaterThan(100);
                    // 링크 추출 검증
                    expect(result.herfUrls).toBeDefined();
                    expect(Array.isArray(result.herfUrls)).toBe(true);
                    expect(result.herfUrls.length).toBeGreaterThan(0);
                    // onclick URL 추출 검증
                    expect(result.onclickUrls).toBeDefined();
                    expect(Array.isArray(result.onclickUrls)).toBe(true);
                    expect(result.onclickUrls.length).toBeGreaterThan(0);
                    // 병합된 URL 검증
                    expect(result.crawledUrls).toBeDefined();
                    expect(Array.isArray(result.crawledUrls)).toBe(true);
                    expect(result.crawledUrls.length).toBeGreaterThanOrEqual(result.herfUrls.length + result.onclickUrls.length -
                        // 중복 URL이 있을 수 있으므로 배열 길이 합계와 정확히 같지 않을 수 있음
                        Math.min(result.herfUrls.length, result.onclickUrls.length));
                    // 결과 로깅
                    logger.info("\uBC29\uBB38 \uACB0\uACFC \uC131\uACF5 \uC5EC\uBD80: ".concat(result.success));
                    logger.info("\uC81C\uBAA9: ".concat(result.title));
                    logger.info("\uD14D\uC2A4\uD2B8 \uAE38\uC774: ".concat(result.text.length, "\uC790"));
                    logger.info("\uCD94\uCD9C\uB41C href URL \uC218: ".concat(result.herfUrls.length));
                    logger.info("\uCD94\uCD9C\uB41C onclick URL \uC218: ".concat(result.onclickUrls.length));
                    logger.info("\uCD1D \uCD94\uCD9C\uB41C URL \uC218: ".concat(result.crawledUrls.length));
                    // onclick URL 샘플 출력
                    if (result.onclickUrls.length > 0) {
                        logger.info("onclick URL \uC0D8\uD50C:");
                        result.onclickUrls.slice(0, 3).forEach(function (url, i) {
                            logger.info("".concat(i + 1, ". ").concat(url));
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
