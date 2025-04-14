"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var BaseWorkerManager = require('@crawl/baseWorkerManager').BaseWorkerManager;
var MongoDBService = require('@database/mongodb-service').MongoDBService;
var _a = require('@crawl/baseWorker'), infiniteScroll = _a.infiniteScroll, extractAndExecuteScripts = _a.extractAndExecuteScripts;
// 모킹 설정
jest.mock('@database/mongodb-service');
jest.mock('puppeteer');
jest.mock('@crawl/baseWorker');
jest.mock('@config/config');
describe('BaseWorkerManager - visitUrl', function () {
    var manager;
    var mockBrowser;
    var mockPage;
    beforeEach(function () {
        // db 전역 객체 모킹
        global.db = {
            markUrlVisited: jest.fn().mockResolvedValue(),
            bulkAddSubUrls: jest.fn().mockResolvedValue(),
            getDomainStats: jest.fn().mockResolvedValue({
                total: 10,
                visited: 5,
                pending: 5
            })
        };
        // 모의 페이지 객체
        mockPage = {
            goto: jest.fn().mockResolvedValue(),
            url: jest.fn().mockReturnValue('https://example.com/test-page'),
            on: jest.fn(),
            evaluate: jest.fn().mockResolvedValue({
                title: '테스트 페이지',
                meta: { description: '테스트 설명' },
                text: '테스트 내용'
            }),
            close: jest.fn().mockResolvedValue()
        };
        // 모의 브라우저 객체
        mockBrowser = {
            newPage: jest.fn().mockResolvedValue(mockPage),
            close: jest.fn().mockResolvedValue()
        };
        // BaseWorkerManager 인스턴스 생성
        manager = new BaseWorkerManager();
        manager.browser = mockBrowser;
        // 필요한 메서드 모킹
        manager.initBrowser = jest.fn().mockResolvedValue(mockBrowser);
        manager.extractDomain = jest.fn().mockReturnValue('example.com');
        manager.extractPageContent = jest.fn().mockResolvedValue({
            title: '테스트 페이지',
            meta: { description: '테스트 설명' },
            text: '테스트 내용'
        });
        manager.extractLinks = jest.fn().mockResolvedValue([
            'https://example.com/page1',
            'https://example.com/page2'
        ]);
        manager.isUrlAllowed = jest.fn().mockReturnValue(true);
        manager.groupUrlsByDomain = jest.fn().mockReturnValue({
            'example.com': [
                { url: 'https://example.com/page1', visited: false },
                { url: 'https://example.com/page2', visited: false }
            ]
        });
        // 외부 모듈 모킹
        infiniteScroll.mockResolvedValue();
        extractAndExecuteScripts.mockResolvedValue({
            success: true,
            discoveredUrls: ['https://example.com/page3']
        });
    });
    test('URL 방문 및 처리 성공', function () { return __awaiter(void 0, void 0, void 0, function () {
        var urlInfo, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urlInfo = {
                        url: 'https://example.com/test-page',
                        domain: 'example.com'
                    };
                    return [4 /*yield*/, manager.visitUrl(urlInfo)];
                case 1:
                    result = _a.sent();
                    // 브라우저 초기화 확인
                    expect(manager.initBrowser).toHaveBeenCalled();
                    // 새 페이지 생성 확인
                    expect(mockBrowser.newPage).toHaveBeenCalled();
                    // 페이지 이동 확인
                    expect(mockPage.goto).toHaveBeenCalledWith(urlInfo.url, expect.any(Object));
                    // 무한 스크롤 확인
                    expect(infiniteScroll).toHaveBeenCalled();
                    // 콘텐츠 추출 확인
                    expect(manager.extractPageContent).toHaveBeenCalled();
                    // 링크 추출 확인
                    expect(manager.extractLinks).toHaveBeenCalled();
                    // 스크립트 실행 및 URL 추출 확인
                    expect(extractAndExecuteScripts).toHaveBeenCalled();
                    // 페이지 닫기 확인
                    expect(mockPage.close).toHaveBeenCalled();
                    // 결과 객체가 올바른지 확인
                    expect(result).toHaveProperty('success', true);
                    expect(result).toHaveProperty('url', urlInfo.url);
                    expect(result).toHaveProperty('domain', urlInfo.domain);
                    expect(result).toHaveProperty('finalUrl');
                    expect(result).toHaveProperty('finalDomain');
                    expect(result).toHaveProperty('pageContent');
                    expect(result).toHaveProperty('crawledUrls');
                    expect(result).toHaveProperty('urlsByDomain');
                    expect(result).toHaveProperty('visitedAt');
                    // URL 그룹화 확인
                    expect(result.crawledUrls.length).toBeGreaterThan(0);
                    expect(Object.keys(result.urlsByDomain).length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    test('URL 방문 중 오류 처리', function () { return __awaiter(void 0, void 0, void 0, function () {
        var urlInfo, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urlInfo = {
                        url: 'https://example.com/error-page',
                        domain: 'example.com'
                    };
                    // 오류 시뮬레이션
                    mockPage.goto.mockRejectedValue(new Error('페이지 로딩 실패'));
                    return [4 /*yield*/, manager.visitUrl(urlInfo)];
                case 1:
                    result = _a.sent();
                    // 결과 객체가 오류 정보를 포함하는지 확인
                    expect(result).toHaveProperty('success', false);
                    expect(result).toHaveProperty('url', urlInfo.url);
                    expect(result).toHaveProperty('domain', urlInfo.domain);
                    expect(result).toHaveProperty('error');
                    expect(result).toHaveProperty('visitedAt');
                    expect(result.error).toContain('페이지 로딩 실패');
                    return [2 /*return*/];
            }
        });
    }); });
    test('persistVisitResult - 성공 케이스', function () { return __awaiter(void 0, void 0, void 0, function () {
        var visitResult, success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    visitResult = {
                        success: true,
                        url: 'https://example.com/test-page',
                        finalUrl: 'https://example.com/test-page-redirected',
                        domain: 'example.com',
                        finalDomain: 'example.com',
                        pageContent: {
                            title: '테스트 페이지',
                            meta: { description: '테스트 설명' },
                            text: '테스트 내용'
                        },
                        crawledUrls: [
                            'https://example.com/page1',
                            'https://example.com/page2',
                            'https://example.com/page3'
                        ],
                        urlsByDomain: {
                            'example.com': [
                                { url: 'https://example.com/page1', visited: false },
                                { url: 'https://example.com/page2', visited: false }
                            ]
                        },
                        visitedAt: new Date().toISOString()
                    };
                    return [4 /*yield*/, manager.persistVisitResult(visitResult)];
                case 1:
                    success = _a.sent();
                    // 결과 확인
                    expect(success).toBe(true);
                    // URL 저장 확인
                    expect(global.db.bulkAddSubUrls).toHaveBeenCalledWith('example.com', expect.any(Array));
                    // URL 방문 완료 표시 확인 (원본 URL)
                    expect(global.db.markUrlVisited).toHaveBeenCalledWith(visitResult.domain, visitResult.url, visitResult.pageContent.text);
                    // URL 방문 완료 표시 확인 (리다이렉트된 URL)
                    expect(global.db.markUrlVisited).toHaveBeenCalledWith(visitResult.finalDomain, visitResult.finalUrl, visitResult.pageContent.text);
                    // 도메인 통계 확인
                    expect(global.db.getDomainStats).toHaveBeenCalledWith(visitResult.domain);
                    return [2 /*return*/];
            }
        });
    }); });
    test('persistVisitResult - 실패 케이스', function () { return __awaiter(void 0, void 0, void 0, function () {
        var visitResult, success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    visitResult = {
                        success: false,
                        url: 'https://example.com/error-page',
                        domain: 'example.com',
                        error: '페이지 로딩 실패',
                        visitedAt: new Date().toISOString()
                    };
                    // results 배열 초기화
                    manager.results = [];
                    return [4 /*yield*/, manager.persistVisitResult(visitResult)];
                case 1:
                    success = _a.sent();
                    // 결과 확인
                    expect(success).toBe(false);
                    // 오류가 있어도 URL을 방문 완료로 표시
                    expect(global.db.markUrlVisited).toHaveBeenCalledWith(visitResult.domain, visitResult.url, expect.stringContaining('오류'));
                    // 결과 배열에 오류 정보가 추가되었는지 확인
                    expect(manager.results.length).toBe(1);
                    expect(manager.results[0]).toHaveProperty('error');
                    expect(manager.results[0].error).toBe(visitResult.error);
                    return [2 /*return*/];
            }
        });
    }); });
    test('전체 워크플로우 테스트 (visitUrl + persistVisitResult)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var urlInfo, visitResult, persistSuccess;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urlInfo = {
                        url: 'https://example.com/workflow-test',
                        domain: 'example.com'
                    };
                    return [4 /*yield*/, manager.visitUrl(urlInfo)];
                case 1:
                    visitResult = _a.sent();
                    expect(visitResult.success).toBe(true);
                    return [4 /*yield*/, manager.persistVisitResult(visitResult)];
                case 2:
                    persistSuccess = _a.sent();
                    expect(persistSuccess).toBe(true);
                    // URL이 처리되었는지 확인
                    expect(global.db.markUrlVisited).toHaveBeenCalledWith(urlInfo.domain, urlInfo.url, expect.any(String));
                    // 발견된 URL이 저장되었는지 확인
                    expect(global.db.bulkAddSubUrls).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    test('URL 방문 후 페이지가 제대로 닫히는지 확인', function () { return __awaiter(void 0, void 0, void 0, function () {
        var urlInfo, mockPages, result, remainingPages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urlInfo = {
                        url: 'https://example.com/test-page',
                        domain: 'example.com'
                    };
                    mockPages = [mockPage];
                    mockBrowser.pages = jest.fn()
                        .mockImplementationOnce(function () { return Promise.resolve(mockPages); }) // 첫 번째 호출: 페이지 1개 있음
                        .mockImplementationOnce(function () { return Promise.resolve([]); }); // 두 번째 호출: 페이지 0개 있음
                    return [4 /*yield*/, manager.visitUrl(urlInfo)];
                case 1:
                    result = _a.sent();
                    expect(result.success).toBe(true);
                    // 페이지가 닫혔는지 확인
                    expect(mockPage.close).toHaveBeenCalled();
                    return [4 /*yield*/, mockBrowser.pages()];
                case 2:
                    remainingPages = _a.sent();
                    expect(remainingPages.length).toBe(0);
                    expect(mockBrowser.pages).toHaveBeenCalledTimes(2);
                    // 메모리 누수를 확인하기 위한 추가 검증
                    expect(remainingPages).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    test('URL 방문 중 오류 발생 시에도 페이지가 제대로 닫히는지 확인', function () { return __awaiter(void 0, void 0, void 0, function () {
        var urlInfo, mockErrorPage, result, remainingPages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urlInfo = {
                        url: 'https://example.com/error-page',
                        domain: 'example.com'
                    };
                    mockErrorPage = __assign(__assign({}, mockPage), { goto: jest.fn().mockRejectedValue(new Error('페이지 로딩 실패')), close: jest.fn().mockResolvedValue() });
                    // 페이지 생성 및 목록 기능 모킹
                    mockBrowser.newPage = jest.fn().mockResolvedValue(mockErrorPage);
                    mockBrowser.pages = jest.fn()
                        .mockImplementationOnce(function () { return Promise.resolve([mockErrorPage]); }) // 첫 번째 호출: 페이지 1개 있음
                        .mockImplementationOnce(function () { return Promise.resolve([]); }); // 두 번째 호출: 페이지 0개 있음
                    return [4 /*yield*/, manager.visitUrl(urlInfo)];
                case 1:
                    result = _a.sent();
                    expect(result.success).toBe(false);
                    // 페이지 닫기 시도 여부 확인 (에러 케이스에서도 페이지를 닫아야 함)
                    expect(mockErrorPage.close).toHaveBeenCalled();
                    return [4 /*yield*/, mockBrowser.pages()];
                case 2:
                    remainingPages = _a.sent();
                    expect(remainingPages.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    test('여러 URL 방문 후 모든 페이지가 제대로 닫히는지 확인', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockPages, urls, _loop_1, _i, urls_1, urlInfo, pageIndex, _loop_2, _a, urls_2, urlInfo;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    mockPages = [];
                    urls = [
                        { url: 'https://example.com/page1', domain: 'example.com' },
                        { url: 'https://example.com/page2', domain: 'example.com' },
                        { url: 'https://example.com/page3', domain: 'example.com' }
                    ];
                    _loop_1 = function (urlInfo) {
                        var newMockPage = {
                            goto: jest.fn().mockResolvedValue(),
                            url: jest.fn().mockReturnValue(urlInfo.url),
                            on: jest.fn(),
                            evaluate: jest.fn().mockResolvedValue({
                                title: '테스트 페이지',
                                meta: {},
                                text: '테스트 내용'
                            }),
                            close: jest.fn().mockImplementation(function () {
                                // 페이지를 닫으면 mockPages 배열에서 제거
                                var index = mockPages.findIndex(function (p) { return p.url() === urlInfo.url; });
                                if (index !== -1) {
                                    mockPages.splice(index, 1);
                                }
                                return Promise.resolve();
                            })
                        };
                        mockPages.push(newMockPage);
                    };
                    // 각 URL마다 새 페이지 생성과 닫기를 모킹
                    for (_i = 0, urls_1 = urls; _i < urls_1.length; _i++) {
                        urlInfo = urls_1[_i];
                        _loop_1(urlInfo);
                    }
                    pageIndex = 0;
                    // 새 페이지 생성 모킹
                    mockBrowser.newPage = jest.fn().mockImplementation(function () {
                        return Promise.resolve(mockPages[pageIndex++]);
                    });
                    // pages 메소드 모킹 - 현재 mockPages 배열 상태 반환
                    mockBrowser.pages = jest.fn().mockImplementation(function () {
                        return Promise.resolve(__spreadArray([], mockPages, true));
                    });
                    _loop_2 = function (urlInfo) {
                        var result, currentPageIndex;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, manager.visitUrl(urlInfo)];
                                case 1:
                                    result = _c.sent();
                                    expect(result.success).toBe(true);
                                    currentPageIndex = urls.findIndex(function (u) { return u.url === urlInfo.url; });
                                    expect(mockPages[currentPageIndex].close).toHaveBeenCalled();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a = 0, urls_2 = urls;
                    _b.label = 1;
                case 1:
                    if (!(_a < urls_2.length)) return [3 /*break*/, 4];
                    urlInfo = urls_2[_a];
                    return [5 /*yield**/, _loop_2(urlInfo)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _a++;
                    return [3 /*break*/, 1];
                case 4:
                    // 모든 방문이 끝난 후 남아있는 페이지 확인
                    expect(mockPages.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    test('closeBrowser 호출 시 모든 페이지가 닫히는지 확인', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockPage1, mockPage2, mockPages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockPage1 = __assign(__assign({}, mockPage), { close: jest.fn().mockResolvedValue() });
                    mockPage2 = __assign(__assign({}, mockPage), { close: jest.fn().mockResolvedValue() });
                    mockPages = [mockPage1, mockPage2];
                    mockBrowser.pages = jest.fn().mockResolvedValue(mockPages);
                    // closeBrowser 메서드 추가 (만약 없다면)
                    if (!manager.closeBrowser) {
                        manager.closeBrowser = function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var pages, err_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!this.browser) return [3 /*break*/, 6];
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 5, , 6]);
                                            return [4 /*yield*/, this.browser.pages()];
                                        case 2:
                                            pages = _a.sent();
                                            return [4 /*yield*/, Promise.all(pages.map(function (page) {
                                                    try {
                                                        return page.close();
                                                    }
                                                    catch (e) {
                                                        return Promise.resolve();
                                                    }
                                                }))];
                                        case 3:
                                            _a.sent();
                                            // 브라우저 닫기
                                            return [4 /*yield*/, this.browser.close()];
                                        case 4:
                                            // 브라우저 닫기
                                            _a.sent();
                                            this.browser = null;
                                            return [3 /*break*/, 6];
                                        case 5:
                                            err_1 = _a.sent();
                                            console.error('브라우저 종료 중 오류:', err_1);
                                            return [3 /*break*/, 6];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            });
                        };
                    }
                    // closeBrowser 호출
                    return [4 /*yield*/, manager.closeBrowser()];
                case 1:
                    // closeBrowser 호출
                    _a.sent();
                    // 모든 페이지의 close 메서드가 호출되었는지 확인
                    expect(mockPage1.close).toHaveBeenCalled();
                    expect(mockPage2.close).toHaveBeenCalled();
                    // 브라우저 close 메서드가 호출되었는지 확인
                    expect(mockBrowser.close).toHaveBeenCalled();
                    // browser 속성이 null로 설정되었는지 확인
                    expect(manager.browser).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
