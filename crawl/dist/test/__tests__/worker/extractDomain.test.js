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
var BaseWorkerManager = require('@crawl/baseWorkerManager').BaseWorkerManager;
var extractDomain = require('@crawl/urlManager').extractDomain;
// BaseWorkerManager를 직접 import할 수 없으므로 모킹
jest.mock('@database/mongodb-service', function () {
    return {
        MongoDBService: jest.fn().mockImplementation(function () {
            return {
                connect: jest.fn().mockResolvedValue(),
                disconnect: jest.fn().mockResolvedValue(),
                getDomains: jest.fn().mockResolvedValue([]),
                getUnvisitedUrls: jest.fn().mockResolvedValue([]),
                markUrlVisited: jest.fn().mockResolvedValue(),
                bulkAddSubUrls: jest.fn().mockResolvedValue(),
                getDomainStats: jest.fn().mockResolvedValue({ total: 0, visited: 0, pending: 0 }),
            };
        })
    };
});
// 필요한 다른 모듈 모킹
jest.mock('puppeteer', function () { return ({
    launch: jest.fn().mockResolvedValue({
        close: jest.fn().mockResolvedValue(),
        newPage: jest.fn().mockResolvedValue({
            goto: jest.fn().mockResolvedValue(),
            evaluate: jest.fn().mockResolvedValue({}),
            on: jest.fn(),
            url: jest.fn().mockReturnValue('https://example.com'),
            close: jest.fn().mockResolvedValue(),
        }),
    }),
}); });
jest.mock('@crawl/baseWorker', function () { return ({
    infiniteScroll: jest.fn().mockResolvedValue(),
    extractAndExecuteScripts: jest.fn().mockResolvedValue({
        success: true,
        discoveredUrls: [],
    }),
}); });
jest.mock('@config/config', function () { return ({
    initialize: jest.fn(),
    PATHS: {
        RESULT_FILES: {
            MAIN_RESULT: 'test-results.json',
        },
    },
    DOMAINS: {
        ALLOWED: ['example.com', 'test.com'],
        DEFAULT_URL: 'https://example.com',
    },
    CRAWLER: {
        DELAY_BETWEEN_REQUESTS: 1000,
        MAX_URLS: 10,
        MAX_SCROLLS: 3,
        STRATEGY: 'sequential',
    },
    BROWSER: {
        HEADLESS: true,
        LAUNCH_ARGS: ['--no-sandbox'],
        TIMEOUT: {
            PAGE_LOAD: 30000,
        },
    },
}); });
describe('BaseWorkerManager - extractDomain', function () {
    var manager;
    beforeEach(function () {
        manager = new BaseWorkerManager({
            startUrl: 'https://example.com',
            baseDomain: 'example.com',
        });
    });
    test('URL에서 도메인 추출', function () { return __awaiter(void 0, void 0, void 0, function () {
        var urls, expectedDomains;
        return __generator(this, function (_a) {
            urls = [
                'https://example.com',
                'http://example.com/path',
                'https://subdomain.example.com/path?query=1',
                'https://www.example.co.uk/path',
                'https://test.com:8080/path',
            ];
            expectedDomains = [
                'example.com',
                'example.com',
                'subdomain.example.com',
                'www.example.co.uk',
                'test.com',
            ];
            urls.forEach(function (url, index) {
                var domain = extractDomain(url);
                expect(domain).toBe(expectedDomains[index]);
            });
            return [2 /*return*/];
        });
    }); });
    test('잘못된 URL 형식 처리', function () {
        var invalidUrls = [
            'invalid-url',
            'ftp://example.com',
            '//example.com',
            'example.com',
        ];
        // 모든 잘못된 URL에 대해 함수가 오류를 던지지 않고 기본값을 반환하는지 확인
        invalidUrls.forEach(function (url) {
            expect(function () { return extractDomain(url); }).not.toThrow();
        });
    });
});
