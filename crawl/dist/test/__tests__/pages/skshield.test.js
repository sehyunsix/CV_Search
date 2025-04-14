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
var _a = require('@crawl/baseWorker'), infiniteScroll = _a.infiniteScroll, extractAndExecuteScripts = _a.extractAndExecuteScripts;
describe('삼성 커리어 채용 페이지 크롤링 테스트', function () {
    var manager;
    var page;
    var targetUrl = 'https://www.skshieldusapply.com';
    var allowedDomains = ['skshieldusapply.com'];
    // 테스트 실행 시간 늘리기 (웹 크롤링은 시간이 소요될 수 있음)
    jest.setTimeout(60000);
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 브라우저 시작
                    // 새 페이지 생성
                    manager = new BaseWorkerManager();
                    return [4 /*yield*/, manager.initBrowser()];
                case 1:
                    _a.sent();
                    manager.maxUrl = 1;
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, manager.browser.newPage()];
                case 1:
                    // 각 테스트 전에 새 페이지 생성
                    page = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!page) return [3 /*break*/, 2];
                    return [4 /*yield*/, page.close().catch(function (err) { return console.warn('페이지 닫기 오류:', err); })];
                case 1:
                    _a.sent();
                    page = null;
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 테스트 후 브라우저 종료
                return [4 /*yield*/, manager.browser.close()];
                case 1:
                    // 테스트 후 브라우저 종료
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('페이지 접속 및 기본 정보 확인', function () { return __awaiter(void 0, void 0, void 0, function () {
        var title, currentUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 페이지 로드
                return [4 /*yield*/, page.goto(targetUrl, { waitUntil: 'networkidle2' })];
                case 1:
                    // 페이지 로드
                    _a.sent();
                    return [4 /*yield*/, page.title()];
                case 2:
                    title = _a.sent();
                    console.log("\uD398\uC774\uC9C0 \uC81C\uBAA9: ".concat(title));
                    expect(title).toContain('SK쉴더스 채용');
                    currentUrl = page.url();
                    expect(currentUrl).toContain(allowedDomains[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    test('visitUrl 함수 테스트', function () { return __awaiter(void 0, void 0, void 0, function () {
        var visitResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, manager.visitUrl({
                        url: targetUrl,
                        domain: allowedDomains[0]
                    })];
                case 1:
                    visitResult = _a.sent();
                    // 방문 성공 여부 확인
                    expect(visitResult.success).toBe(true);
                    // 방문 결과에 새 URL이 포함되어 있는지 확인 (최소 1개 이상)
                    expect(visitResult.crawledUrls.length).toBeGreaterThanOrEqual(1);
                    console.log("\uBC1C\uACAC\uB41C URL \uAC1C\uC218: ".concat(visitResult.crawledUrls.length));
                    // 발견된 URL 중 일부 출력 (디버깅용)
                    if (visitResult.crawledUrls.length > 0) {
                        console.log('발견된 URL 샘플:');
                        visitResult.crawledUrls.slice(0, 5).forEach(function (url) { return console.log(" - ".concat(url)); });
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    test('extractLinks 함수 테스트', function () { return __awaiter(void 0, void 0, void 0, function () {
        var links, allLinksValid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 페이지 로드
                return [4 /*yield*/, page.goto(targetUrl, { waitUntil: 'networkidle2' })];
                case 1:
                    // 페이지 로드
                    _a.sent();
                    return [4 /*yield*/, manager.extractLinks(page, allowedDomains)];
                case 2:
                    links = _a.sent();
                    // 추출된 링크가 있는지 확인
                    expect(links.length).toBeGreaterThan(0);
                    console.log("\uCD94\uCD9C\uB41C \uB9C1\uD06C \uC218: ".concat(links.length));
                    allLinksValid = links.every(function (link) {
                        return link.includes(allowedDomains[0]);
                    });
                    expect(allLinksValid).toBe(true);
                    // 추출된 링크 중 일부 출력
                    console.log('추출된 링크 샘플:');
                    links.slice(0, 5).forEach(function (link) {
                        console.log(" - ".concat(link));
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('extractAndExecuteScripts 함수 테스트', function () { return __awaiter(void 0, void 0, void 0, function () {
        var discoveredUrls, allLinksValid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, extractAndExecuteScripts(targetUrl, allowedDomains, manager.browser)];
                case 1:
                    discoveredUrls = _a.sent();
                    // 발견된 URL이 있는지 확인
                    expect(discoveredUrls).toBeDefined();
                    expect(Array.isArray(discoveredUrls)).toBe(true);
                    expect(discoveredUrls.length).toBeGreaterThan(0);
                    console.log("extractAndExecuteScripts \uACB0\uACFC - \uBC1C\uACAC\uB41C URL \uAC1C\uC218: ".concat(discoveredUrls.length));
                    // URL에 문제가 없는지 확인
                    discoveredUrls.forEach(function (url) {
                        expect(typeof url).toBe('string');
                        // URL 형식이 올바른지 확인 (에러 없이 생성됨)
                        expect(function () { return new URL(url); }).not.toThrow();
                    });
                    allLinksValid = discoveredUrls.every(function (link) {
                        return link.includes(allowedDomains[0]);
                    });
                    expect(allLinksValid).toBe(true);
                    // 발견된 URL 중 일부 출력
                    console.log('extractAndExecuteScripts 결과 URL 샘플:');
                    discoveredUrls.slice(0, 5).forEach(function (url) {
                        console.log(" - ".concat(url));
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
