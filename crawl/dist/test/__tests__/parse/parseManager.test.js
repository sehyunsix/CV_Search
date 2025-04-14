"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var ParseManager = require('@parse/parseManager');
var GeminiService = require('@parse/geminiService').GeminiService;
var MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
var mongoose = require('mongoose');
var _a = require('@models/visitResult'), VisitResult = _a.VisitResult, SubUrl = _a.SubUrl;
var RecruitInfo = require('@models/recruitInfo');
var logger = require('@utils/logger').defaultLogger;
var faker = require('@faker-js/faker').faker;
// GeminiService 모킹 - mockFaker 변수를 사용하여 faker 참조 문제 해결
jest.mock('@parse/geminiService', function () {
    // 모의 데이터 생성 함수
    var mockData = {
        companyNames: ['테스트 회사', '개발 기업', '소프트웨어 회사', 'IT 기업', '기술 스타트업'],
        departments: ['개발팀', '기술부서', 'R&D', '인프라팀', '프론트엔드팀', '백엔드팀'],
        experiences: ['신입', '경력 3년 이상', '경력 무관', '주니어', '시니어'],
        jobTypes: ['정규직', '계약직', '인턴', '프리랜서', '파트타임'],
        paragraphs: [
            '이 직무는 웹 개발과 관련된 업무를 담당합니다.',
            '소프트웨어 개발 및 유지보수 업무를 수행합니다.',
            '팀과 협업하여 고품질 소프트웨어를 개발합니다.',
            '애자일 방법론을 통한, 빠른 개발과 일정 진행을 합니다.',
            '새로운 기술을 연구하고 적용하여 업무를 혁신합니다.'
        ],
        requirements: [
            'JavaScript, TypeScript 능숙자',
            '컴퓨터 관련 학위 또는 유사 경험',
            'React, Vue.js 프레임워크 사용 경험',
            'SQL 및 NoSQL 데이터베이스 지식',
            '3년 이상의 개발 경험'
        ]
    };
    // 랜덤 항목 선택 함수
    var getRandomItem = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
    // 날짜 생성 함수
    var getRandomDate = function (future) {
        if (future === void 0) { future = false; }
        var date = new Date();
        if (future) {
            date.setDate(date.getDate() + Math.floor(Math.random() * 60) + 1);
        }
        else {
            date.setDate(date.getDate() - Math.floor(Math.random() * 10));
        }
        return date.toISOString().split('T')[0];
    };
    return {
        GeminiService: jest.fn().mockImplementation(function () { return ({
            parseRecruitment: jest.fn().mockImplementation(function (content) { return __awaiter(void 0, void 0, void 0, function () {
                var isRecruit;
                return __generator(this, function (_a) {
                    isRecruit = Math.random() > 0.5;
                    if (isRecruit) {
                        return [2 /*return*/, {
                                success: true,
                                isRecruit: true,
                                company_name: getRandomItem(mockData.companyNames),
                                department: getRandomItem(mockData.departments),
                                experience: getRandomItem(mockData.experiences),
                                description: getRandomItem(mockData.paragraphs),
                                job_type: getRandomItem(mockData.jobTypes),
                                posted_period: "".concat(getRandomDate(), " ~ ").concat(getRandomDate(true)),
                                requirements: getRandomItem(mockData.requirements),
                                preferred_qualifications: getRandomItem(mockData.paragraphs),
                                ideal_candidate: getRandomItem(mockData.paragraphs)
                            }];
                    }
                    else {
                        return [2 /*return*/, {
                                success: false,
                                isRecruit: false,
                                reason: '채용공고가 아닙니다. 일반 콘텐츠로 판단됩니다.'
                            }];
                    }
                    return [2 /*return*/];
                });
            }); })
        }); })
    };
});
// MongoDB 메모리 서버
var mongoServer;
var uri;
/**
 * 테스트 데이터 생성 함수
 */
function generateTestData() {
    return __awaiter(this, arguments, void 0, function (domainsCount, urlsPerDomain) {
        var domains, i, domain, visitResult, j, path, url, subUrl;
        if (domainsCount === void 0) { domainsCount = 2; }
        if (urlsPerDomain === void 0) { urlsPerDomain = 3; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    domains = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < domainsCount)) return [3 /*break*/, 4];
                    domain = faker.internet.domainName();
                    domains.push(domain);
                    visitResult = new VisitResult({
                        domain: domain,
                        url: "https://".concat(domain),
                        created_at: new Date(),
                        updated_at: new Date(),
                        suburl_list: []
                    });
                    for (j = 0; j < urlsPerDomain; j++) {
                        path = j === 0 ? '/' : "/".concat(faker.lorem.slug());
                        url = "https://".concat(domain).concat(path);
                        subUrl = {
                            url: url,
                            path: path,
                            visited: true,
                            success: true,
                            visitedAt: new Date(),
                            title: faker.lorem.sentence(),
                            text: faker.lorem.paragraphs(3),
                            meta: {
                                description: faker.lorem.paragraph(),
                                keywords: faker.lorem.words()
                            },
                            created_at: new Date(),
                            updated_at: new Date(),
                            isRecruit: null // 미분류 상태
                        };
                        visitResult.suburl_list.push(subUrl);
                    }
                    return [4 /*yield*/, visitResult.save()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, domains];
            }
        });
    });
}
/**
 * MongoDB 메모리 서버 시작 및 연결
 */
function startMemoryMongoDB() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, MongoMemoryServer.create()];
                case 1:
                    mongoServer = _a.sent();
                    uri = mongoServer.getUri();
                    return [4 /*yield*/, mongoose.connect(uri, {
                            useNewUrlParser: true,
                            useUnifiedTopology: true
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, uri];
            }
        });
    });
}
/**
 * MongoDB 메모리 서버 종료 및 연결 해제
 */
function stopMemoryMongoDB() {
    return __awaiter(this, void 0, void 0, function () {
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
    });
}
// 테스트용 ParseManager 확장 클래스
var TestParseManager = /** @class */ (function (_super) {
    __extends(TestParseManager, _super);
    function TestParseManager(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        // 모킹된 GeminiService 사용
        _this.geminiService = new GeminiService();
        return _this;
    }
    // MongoDB 연결 오버라이드
    TestParseManager.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // 이미 메모리 DB에 연결되어 있으므로 아무것도 하지 않음
                return [2 /*return*/, mongoose.connection];
            });
        });
    };
    // getStatus 메서드 추가 (테스트에서 필요)
    TestParseManager.prototype.getStatus = function () {
        return {
            isRunning: this.isRunning,
            stats: this.stats,
            config: {
                batchSize: this.batchSize,
                delayBetweenRequests: this.delayBetweenRequests,
                maxRetries: this.maxRetries
            }
        };
    };
    return TestParseManager;
}(ParseManager));
describe('ParseManager', function () {
    var parseManager;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startMemoryMongoDB()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, generateTestData(2, 3)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 30000);
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, stopMemoryMongoDB()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () {
        parseManager = new TestParseManager({
            batchSize: 2,
            delayBetweenRequests: 100 // 테스트에서는 지연시간 최소화
        });
    });
    test('ParseManager 인스턴스가 생성되어야 함', function () {
        expect(parseManager).toBeDefined();
        expect(parseManager).toBeInstanceOf(ParseManager);
    });
    test('미분류 URL을 추출할 수 있어야 함', function () { return __awaiter(void 0, void 0, void 0, function () {
        var urls, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, parseManager.fetchUnclassifiedUrls(3)];
                case 1:
                    urls = _a.sent();
                    expect(Array.isArray(urls)).toBe(true);
                    expect(urls.length).toBeGreaterThan(0);
                    if (urls.length > 0) {
                        url = urls[0];
                        expect(url).toHaveProperty('url');
                        expect(url).toHaveProperty('domain');
                        expect(url).toHaveProperty('text');
                        expect(url).toHaveProperty('title');
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    test('URL 분석 요청이 성공해야 함', function () { return __awaiter(void 0, void 0, void 0, function () {
        var testUrl, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testUrl = {
                        url: 'https://example.com/test',
                        title: 'Test Job Posting',
                        text: 'This is a test job posting content.',
                        meta: { description: 'Job description' }
                    };
                    return [4 /*yield*/, parseManager.requestUrlParse(testUrl)];
                case 1:
                    result = _a.sent();
                    expect(result).toBeDefined();
                    expect(result).toHaveProperty('success');
                    expect(typeof result.success).toBe('boolean');
                    if (result.success) {
                        expect(result).toHaveProperty('company_name');
                        expect(result).toHaveProperty('description');
                    }
                    else {
                        expect(result).toHaveProperty('reason');
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    test('RecruitInfo 스키마로 데이터를 변환할 수 있어야 함', function () { return __awaiter(void 0, void 0, void 0, function () {
        var testUrl, geminiResponse, result;
        return __generator(this, function (_a) {
            testUrl = {
                domain: 'example.com',
                url: 'https://example.com/jobs/123',
                title: 'Senior Developer',
                text: 'Looking for an experienced developer',
                meta: { description: 'Job opportunity' }
            };
            geminiResponse = {
                isRecruit: true,
                success: true,
                company_name: '테스트 회사',
                department: '개발팀',
                experience: '경력 3년 이상',
                description: '소프트웨어 개발 업무',
                job_type: '정규직',
                posted_period: '2025-03-01 ~ 2025-04-01',
                requirements: 'JavaScript, Node.js',
                preferred_qualifications: 'TypeScript, React',
                ideal_candidate: '열정적인 개발자'
            };
            result = parseManager.convertToRecruitInfoSchema(geminiResponse, testUrl);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('url', testUrl.url);
            expect(result).toHaveProperty('company_name', geminiResponse.company_name);
            expect(result).toHaveProperty('domain', testUrl.domain);
            expect(result).toHaveProperty('start_date');
            expect(result).toHaveProperty('end_date');
            expect(result.start_date instanceof Date).toBe(true);
            expect(result.end_date instanceof Date).toBe(true);
            return [2 /*return*/];
        });
    }); });
    test('URL 상태를 업데이트할 수 있어야 함', function () { return __awaiter(void 0, void 0, void 0, function () {
        var urls, testUrl, result, updatedDoc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, parseManager.fetchUnclassifiedUrls(1)];
                case 1:
                    urls = _a.sent();
                    if (urls.length === 0) {
                        logger.warn('테스트할 URL이 없습니다');
                        return [2 /*return*/];
                    }
                    testUrl = urls[0].url;
                    return [4 /*yield*/, parseManager.updateSubUrlStatus(testUrl, true)];
                case 2:
                    result = _a.sent();
                    expect(typeof result).toBe('boolean');
                    return [4 /*yield*/, VisitResult.findOne({ 'suburl_list.url': testUrl }, { 'suburl_list.$': 1 })];
                case 3:
                    updatedDoc = _a.sent();
                    expect(updatedDoc).toBeDefined();
                    expect(updatedDoc.suburl_list[0]).toHaveProperty('isRecruit', true);
                    return [2 /*return*/];
            }
        });
    }); });
    test('채용공고 정보를 저장할 수 있어야 함', function () { return __awaiter(void 0, void 0, void 0, function () {
        var randomSlug, testRecruitInfo, result, savedDoc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    randomSlug = Math.random().toString(36).substring(7);
                    testRecruitInfo = {
                        domain: 'example.com',
                        url: "https://example.com/jobs/".concat(randomSlug),
                        title: 'Test Job',
                        company_name: '테스트 회사',
                        department: 'IT',
                        experience: '2+ years',
                        description: 'Test job description',
                        job_type: 'Full-time',
                        start_date: new Date(),
                        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        requirements: 'JavaScript, Node.js',
                        raw_text: 'Full job description here',
                        created_at: new Date(),
                        updated_at: new Date()
                    };
                    return [4 /*yield*/, parseManager.saveRecruitInfo(testRecruitInfo)];
                case 1:
                    result = _a.sent();
                    expect(result).toBeDefined();
                    expect(result).toHaveProperty('_id');
                    expect(result).toHaveProperty('url', testRecruitInfo.url);
                    expect(result).toHaveProperty('company_name', testRecruitInfo.company_name);
                    return [4 /*yield*/, RecruitInfo.findOne({ url: testRecruitInfo.url })];
                case 2:
                    savedDoc = _a.sent();
                    expect(savedDoc).toBeDefined();
                    expect(savedDoc.company_name).toBe(testRecruitInfo.company_name);
                    return [2 /*return*/];
            }
        });
    }); });
    test('단일 URL을 처리할 수 있어야 함', function () { return __awaiter(void 0, void 0, void 0, function () {
        var urls, testUrl, result, updatedDoc, savedRecruitInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, parseManager.fetchUnclassifiedUrls(1)];
                case 1:
                    urls = _a.sent();
                    if (urls.length === 0) {
                        logger.warn('테스트할 URL이 없습니다');
                        return [2 /*return*/];
                    }
                    testUrl = urls[0];
                    return [4 /*yield*/, parseManager.processUrl(testUrl)];
                case 2:
                    result = _a.sent();
                    expect(result).toBeDefined();
                    expect(result).toHaveProperty('url', testUrl.url);
                    expect(result).toHaveProperty('success', true);
                    expect(result).toHaveProperty('isRecruit');
                    return [4 /*yield*/, VisitResult.findOne({ 'suburl_list.url': testUrl.url }, { 'suburl_list.$': 1 })];
                case 3:
                    updatedDoc = _a.sent();
                    expect(updatedDoc).toBeDefined();
                    expect(updatedDoc.suburl_list[0].isRecruit !== null).toBe(true);
                    if (!result.isRecruit) return [3 /*break*/, 5];
                    return [4 /*yield*/, RecruitInfo.findOne({ url: testUrl.url })];
                case 4:
                    savedRecruitInfo = _a.sent();
                    expect(savedRecruitInfo).toBeDefined();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); });
    test('배치 처리를 실행할 수 있어야 함', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, parseManager.run(2)];
                case 1:
                    result = _a.sent();
                    expect(result).toBeDefined();
                    expect(result).toHaveProperty('success', true);
                    expect(result).toHaveProperty('stats');
                    expect(result.stats).toHaveProperty('processed');
                    expect(result.stats.processed).toBeGreaterThanOrEqual(0);
                    return [2 /*return*/];
            }
        });
    }); });
    test('상태 정보를 반환할 수 있어야 함', function () {
        var status = parseManager.getStatus();
        expect(status).toBeDefined();
        expect(status).toHaveProperty('isRunning');
        expect(status).toHaveProperty('stats');
        expect(status).toHaveProperty('config');
        expect(status.config).toHaveProperty('batchSize', 2);
        expect(status.config).toHaveProperty('delayBetweenRequests', 100);
    });
});
