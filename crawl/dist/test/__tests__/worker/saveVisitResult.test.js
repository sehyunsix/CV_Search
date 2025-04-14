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
var mongoose = require('mongoose');
var MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
var _a = require('@models/visitResult'), VisitResult = _a.VisitResult, SubUrl = _a.SubUrl, extractDomain = _a.extractDomain;
// 모듈 로깅을 위한 모의 로거
var mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};
/**
 * 테스트용 saveVisitResult 함수 - BaseWorkerManager에서 추출
 * @param {Object|SubUrl} subUrlResult - visitUrl 함수의 반환 결과
 * @returns {Promise<boolean>} 성공 여부
 */
function saveVisitResult(subUrlResult) {
    return __awaiter(this, void 0, void 0, function () {
        var domain, url_1, domainDoc, existingUrlIndex, savedUrlEntry, subUrl, urlsToAdd, _loop_1, _i, urlsToAdd_1, newUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    domain = subUrlResult.domain;
                    url_1 = subUrlResult.url;
                    mockLogger.info("\uB3C4\uBA54\uC778 ".concat(domain, "\uC758 URL ").concat(url_1, " \uBC29\uBB38 \uACB0\uACFC \uC800\uC7A5 \uC911..."));
                    return [4 /*yield*/, VisitResult.findOne({ domain: domain })];
                case 1:
                    domainDoc = _a.sent();
                    if (!domainDoc) {
                        // 도메인 문서가 없으면 새로 생성
                        domainDoc = new VisitResult({
                            domain: domain,
                            suburl_list: [], // 빈 배열로 초기화
                        });
                        mockLogger.info("\uB3C4\uBA54\uC778 ".concat(domain, "\uC5D0 \uB300\uD55C \uC0C8 \uBB38\uC11C \uC0DD\uC131"));
                    }
                    // 2. 확인: suburl_list 배열이 없으면 초기화
                    if (!domainDoc.suburl_list) {
                        domainDoc.suburl_list = [];
                    }
                    existingUrlIndex = domainDoc.suburl_list.findIndex(function (item) { return item.url === url_1; });
                    if (existingUrlIndex >= 0) {
                        domainDoc.suburl_list[existingUrlIndex] = subUrlResult.toObject();
                        mockLogger.info("\uAE30\uC874 URL ".concat(url_1, " \uC815\uBCF4 \uC5C5\uB370\uC774\uD2B8 (SubUrl \uBAA8\uB378 \uC0AC\uC6A9)"));
                    }
                    else {
                        domainDoc.suburl_list.push(subUrlResult.toObject());
                        mockLogger.info("\uC0C8 URL ".concat(url_1, " \uC815\uBCF4 \uCD94\uAC00 (SubUrl \uBAA8\uB378 \uC0AC\uC6A9)"));
                    }
                    savedUrlEntry = domainDoc.suburl_list.find(function (item) { return item.url === url_1; });
                    if (savedUrlEntry) {
                        subUrl = new SubUrl(savedUrlEntry);
                        subUrl.logSummary(mockLogger);
                    }
                    mockLogger.info("\uB3C4\uBA54\uC778 ".concat(domain, " \uBB38\uC11C \uC800\uC7A5 \uC644\uB8CC"));
                    urlsToAdd = subUrlResult.crawledUrls || [];
                    _loop_1 = function (newUrl) {
                        var newUrlDomain, urlExists, newSubUrl, otherDomainDoc, urlExistsInOtherDomain, newSubUrl, urlError_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 5, , 6]);
                                    newUrlDomain = extractDomain(newUrl);
                                    if (!newUrlDomain)
                                        return [2 /*return*/, "continue"];
                                    urlExists = domainDoc.suburl_list.some(function (item) { return item.url === newUrl; });
                                    if (!(!urlExists && newUrlDomain === domain)) return [3 /*break*/, 1];
                                    newSubUrl = new SubUrl({
                                        url: newUrl,
                                        domain: newUrlDomain,
                                        visited: false,
                                        discoveredAt: new Date(),
                                        created_at: new Date()
                                    });
                                    // toObject()로 변환하여 추가
                                    domainDoc.suburl_list.push(newSubUrl.toObject());
                                    return [3 /*break*/, 4];
                                case 1:
                                    if (!(!urlExists && newUrlDomain !== domain)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, VisitResult.findOne({ domain: newUrlDomain })];
                                case 2:
                                    otherDomainDoc = _b.sent();
                                    if (!otherDomainDoc) {
                                        otherDomainDoc = new VisitResult({
                                            domain: newUrlDomain,
                                            suburl_list: [],
                                            created_at: new Date(),
                                            updated_at: new Date()
                                        });
                                    }
                                    if (!otherDomainDoc.suburl_list) {
                                        otherDomainDoc.suburl_list = [];
                                    }
                                    urlExistsInOtherDomain = otherDomainDoc.suburl_list.some(function (item) { return item.url === newUrl; });
                                    if (!!urlExistsInOtherDomain) return [3 /*break*/, 4];
                                    newSubUrl = new SubUrl({
                                        url: newUrl,
                                        domain: newUrlDomain,
                                        visited: false,
                                        discoveredAt: new Date(),
                                        created_at: new Date()
                                    });
                                    otherDomainDoc.suburl_list.push(newSubUrl.toObject());
                                    otherDomainDoc.updated_at = new Date();
                                    return [4 /*yield*/, otherDomainDoc.save()];
                                case 3:
                                    _b.sent();
                                    _b.label = 4;
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    urlError_1 = _b.sent();
                                    mockLogger.error("URL \uCD94\uAC00 \uC911 \uC624\uB958 (".concat(newUrl, "):"), urlError_1);
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, urlsToAdd_1 = urlsToAdd;
                    _a.label = 2;
                case 2:
                    if (!(_i < urlsToAdd_1.length)) return [3 /*break*/, 5];
                    newUrl = urlsToAdd_1[_i];
                    return [5 /*yield**/, _loop_1(newUrl)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    // 도메인 문서 저장
                    domainDoc.updated_at = new Date();
                    return [4 /*yield*/, domainDoc.save()];
                case 6:
                    _a.sent();
                    return [2 /*return*/, domainDoc]; // 테스트를 위해 저장된 도메인 문서 반환
                case 7:
                    error_1 = _a.sent();
                    mockLogger.error("\uBC29\uBB38 \uACB0\uACFC \uC800\uC7A5 \uC911 \uC624\uB958:", error_1);
                    throw error_1;
                case 8: return [2 /*return*/];
            }
        });
    });
}
describe('saveVisitResult 함수 테스트', function () {
    var mongoServer;
    // 각 테스트 전에 메모리 MongoDB 서버 시작 및 연결
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var uri;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, MongoMemoryServer.create()];
                case 1:
                    mongoServer = _a.sent();
                    uri = mongoServer.getUri();
                    return [4 /*yield*/, mongoose.connect(uri)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // 각 테스트 후에 MongoDB 연결 해제 및 서버 종료
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose.disconnect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, mongoServer.stop()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // 각 테스트 전에 컬렉션 초기화
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, VisitResult.deleteMany({})];
                case 1:
                    _a.sent();
                    jest.clearAllMocks();
                    return [2 /*return*/];
            }
        });
    }); });
    test('SubUrl 인스턴스를 suburl_list에 저장', function () { return __awaiter(void 0, void 0, void 0, function () {
        var subUrl, result, otherDomain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    subUrl = new SubUrl({
                        url: 'https://example.com/page1',
                        domain: 'example.com',
                        visited: true,
                        visitedAt: new Date(),
                        success: true,
                        title: '예시 페이지 1',
                        crawlStats: {
                            total: 10,
                            href: 8,
                            onclick: 2
                        },
                        crawledUrls: [
                            'https://example.com/page2',
                            'https://example.com/page3',
                            'https://other.com/page1'
                        ]
                    });
                    return [4 /*yield*/, saveVisitResult(subUrl)];
                case 1:
                    result = _a.sent();
                    // 결과 검증
                    expect(result).toBeDefined();
                    expect(result.domain).toBe('example.com');
                    expect(result.suburl_list).toHaveLength(3); // 원본 URL + 같은 도메인의 크롤링된 2개 URL
                    expect(result.suburl_list[0].url).toBe('https://example.com/page1');
                    expect(result.suburl_list[0].title).toBe('예시 페이지 1');
                    expect(result.suburl_list[0].visited).toBe(true);
                    expect(result.suburl_list[0].success).toBe(true);
                    expect(result.suburl_list[0].crawlStats.total).toBe(10);
                    // 크롤링된 URL이 같은 도메인에 저장되었는지 확인
                    expect(result.suburl_list[1].url).toBe('https://example.com/page2');
                    expect(result.suburl_list[1].visited).toBe(false);
                    expect(result.suburl_list[2].url).toBe('https://example.com/page3');
                    return [4 /*yield*/, VisitResult.findOne({ domain: 'other.com' })];
                case 2:
                    otherDomain = _a.sent();
                    expect(otherDomain).toBeDefined();
                    expect(otherDomain.suburl_list).toHaveLength(1);
                    expect(otherDomain.suburl_list[0].url).toBe('https://other.com/page1');
                    expect(otherDomain.suburl_list[0].visited).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    test('기존 URL 업데이트', function () { return __awaiter(void 0, void 0, void 0, function () {
        var initialSubUrl, initialDomain, updatedSubUrl, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    initialSubUrl = new SubUrl({
                        url: 'https://example.com/page1',
                        domain: 'example.com',
                        visited: false,
                        created_at: new Date(),
                        updated_at: new Date()
                    });
                    initialDomain = new VisitResult({
                        domain: 'example.com',
                        suburl_list: [initialSubUrl.toObject()]
                    });
                    return [4 /*yield*/, initialDomain.save()];
                case 1:
                    _a.sent();
                    updatedSubUrl = new SubUrl({
                        url: 'https://example.com/page1',
                        domain: 'example.com',
                        visited: true,
                        visitedAt: new Date(),
                        success: true,
                        title: '업데이트된 페이지 제목',
                        text: '업데이트된 텍스트 내용',
                        crawlStats: {
                            total: 15,
                            href: 12,
                            onclick: 3
                        }
                    });
                    // 로그 호출 메서드 스텁
                    updatedSubUrl.logSummary = jest.fn();
                    return [4 /*yield*/, saveVisitResult(updatedSubUrl)];
                case 2:
                    result = _a.sent();
                    // 결과 검증
                    expect(result).toBeDefined();
                    expect(result.domain).toBe('example.com');
                    expect(result.suburl_list).toHaveLength(1);
                    expect(result.suburl_list[0].url).toBe('https://example.com/page1');
                    expect(result.suburl_list[0].title).toBe('업데이트된 페이지 제목');
                    expect(result.suburl_list[0].visited).toBe(true);
                    expect(result.suburl_list[0].success).toBe(true);
                    expect(result.suburl_list[0].crawlStats.total).toBe(15);
                    return [2 /*return*/];
            }
        });
    }); });
    test('오류 처리', function () { return __awaiter(void 0, void 0, void 0, function () {
        var invalidSubUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    invalidSubUrl = new SubUrl({
                        domain: 'example.com',
                        // URL이 없으면 스키마 유효성 검사 오류가 발생해야 함
                    });
                    // 오류가 발생하는지 확인
                    return [4 /*yield*/, expect(saveVisitResult(invalidSubUrl)).rejects.toThrow()];
                case 1:
                    // 오류가 발생하는지 확인
                    _a.sent();
                    expect(mockLogger.error).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    test('크롤링된 URL 처리', function () { return __awaiter(void 0, void 0, void 0, function () {
        var subUrl, domains, exampleDomain, otherDomains;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    subUrl = new SubUrl({
                        url: 'https://example.com/page1',
                        domain: 'example.com',
                        visited: true,
                        visitedAt: new Date(),
                        success: true,
                        crawlStats: {
                            total: 5,
                            href: 3,
                            onclick: 2
                        },
                        crawledUrls: [
                            'https://example.com/page2',
                            'https://example.com/page3',
                            'https://other1.com/page1',
                            'https://other2.com/page1',
                            'https://other3.com/page1'
                        ]
                    });
                    // 로그 호출 메서드 스텁
                    subUrl.logSummary = jest.fn();
                    // saveVisitResult 함수 실행
                    return [4 /*yield*/, saveVisitResult(subUrl)];
                case 1:
                    // saveVisitResult 함수 실행
                    _a.sent();
                    return [4 /*yield*/, VisitResult.find({}).lean()];
                case 2:
                    domains = _a.sent();
                    expect(domains.length).toBe(4); // example.com + 3개의 other 도메인
                    exampleDomain = domains.find(function (d) { return d.domain === 'example.com'; });
                    expect(exampleDomain.suburl_list.length).toBe(3); // 원래 URL + 2개의 크롤링된 URL
                    otherDomains = domains.filter(function (d) { return d.domain !== 'example.com'; });
                    otherDomains.forEach(function (domain) {
                        expect(domain.suburl_list.length).toBe(1);
                        expect(domain.suburl_list[0].visited).toBe(false);
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
