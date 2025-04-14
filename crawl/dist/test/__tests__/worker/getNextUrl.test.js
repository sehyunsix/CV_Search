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
jest.mock('puppeteer');
jest.mock('@crawl/baseWorker');
jest.mock('@config/config');
jest.mock('@database/mongodb-service');
describe('BaseWorkerManager - getNextUrl', function () {
    var manager;
    beforeEach(function () {
        // db 전역 객체 모킹
        global.db = {
            getDomains: jest.fn().mockResolvedValue([
                { domain: 'example.com', url: 'https://example.com' },
                { domain: 'test.com', url: 'https://test.com' },
                { domain: 'another.com', url: 'https://another.com' }
            ]),
            getUnvisitedUrls: jest.fn()
                .mockImplementation(function (domain, limit) {
                if (domain === 'example.com')
                    return Promise.resolve(['https://example.com/page1']);
                if (domain === 'test.com')
                    return Promise.resolve(['https://test.com/page1']);
                return Promise.resolve([]);
            }),
        };
        manager = new BaseWorkerManager();
    });
    test('순차적 전략으로 다음 URL 가져오기', function () { return __awaiter(void 0, void 0, void 0, function () {
        var nextUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 순차적 전략 설정
                    manager.strategy = 'sequential';
                    manager.currentDomainIndex = 0;
                    return [4 /*yield*/, manager.getNextUrl()];
                case 1:
                    nextUrl = _a.sent();
                    // 도메인 목록을 가져왔는지 확인
                    expect(global.db.getDomains).toHaveBeenCalled();
                    // 방문하지 않은 URL을 가져왔는지 확인
                    expect(global.db.getUnvisitedUrls).toHaveBeenCalledWith('example.com', 1);
                    // 반환된 URL 정보 확인
                    expect(nextUrl).toHaveProperty('url', 'https://example.com/page1');
                    expect(nextUrl).toHaveProperty('domain', 'example.com');
                    // 인덱스가 증가했는지 확인
                    expect(manager.currentDomainIndex).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    test('랜덤 전략으로 다음 URL 가져오기', function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalRandom, nextUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 랜덤 전략 설정
                    manager.strategy = 'random';
                    originalRandom = Math.random;
                    Math.random = jest.fn().mockReturnValue(0);
                    return [4 /*yield*/, manager.getNextUrl()];
                case 1:
                    nextUrl = _a.sent();
                    // 방문하지 않은 URL을 가져왔는지 확인
                    expect(global.db.getUnvisitedUrls).toHaveBeenCalled();
                    // 반환된 URL 정보 확인
                    expect(nextUrl).toHaveProperty('url');
                    expect(nextUrl).toHaveProperty('domain');
                    // Math.random 복원
                    Math.random = originalRandom;
                    return [2 /*return*/];
            }
        });
    }); });
    test('특정 도메인 전략으로 다음 URL 가져오기', function () { return __awaiter(void 0, void 0, void 0, function () {
        var nextUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 특정 도메인 전략 설정
                    manager.strategy = 'specific';
                    manager.baseDomain = 'test.com';
                    return [4 /*yield*/, manager.getNextUrl()];
                case 1:
                    nextUrl = _a.sent();
                    // 특정 도메인의 방문하지 않은 URL을 가져왔는지 확인
                    expect(global.db.getUnvisitedUrls).toHaveBeenCalledWith('test.com', 1);
                    // 반환된 URL 정보 확인
                    expect(nextUrl).toHaveProperty('url', 'https://test.com/page1');
                    expect(nextUrl).toHaveProperty('domain', 'test.com');
                    return [2 /*return*/];
            }
        });
    }); });
    test('방문할 URL이 없는 경우', function () { return __awaiter(void 0, void 0, void 0, function () {
        var nextUrl;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // 모든 도메인에 방문하지 않은 URL이 없도록 모킹
                    global.db.getUnvisitedUrls = jest.fn().mockResolvedValue([]);
                    // 순차적 전략으로 설정하되 중단을 위해 재귀 횟수 제한 설정
                    manager.strategy = 'sequential';
                    manager._recursionCount = ((_a = manager.availableDomains) === null || _a === void 0 ? void 0 : _a.length) || 3;
                    return [4 /*yield*/, manager.getNextUrl()];
                case 1:
                    nextUrl = _b.sent();
                    // null이 반환되어야 함
                    expect(nextUrl).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
