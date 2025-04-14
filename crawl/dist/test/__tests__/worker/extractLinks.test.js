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
// 모킹 설정
jest.mock('@database/mongodb-service');
jest.mock('puppeteer');
jest.mock('@crawl/baseWorker');
jest.mock('@config/config');
describe('BaseWorkerManager - extractLinks', function () {
    var manager;
    var mockPage;
    beforeEach(function () {
        manager = new BaseWorkerManager();
        // 모의 페이지 객체
        mockPage = {
            url: jest.fn().mockReturnValue('https://example.com/page'),
            evaluate: jest.fn().mockImplementation(function (fn, baseUrl, currentPath) {
                // 테스트 URL 목록 반환
                return [
                    'https://example.com/page1',
                    'https://example.com/page2',
                    'https://test.com/page1',
                    'https://other-domain.com/page',
                    'https://subdomain.example.com/page',
                    null, // 잘못된 URL 처리 테스트
                ].filter(Boolean); // null 값 제거
            }),
        };
    });
    test('페이지에서 링크 추출', function () { return __awaiter(void 0, void 0, void 0, function () {
        var allowedDomains, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allowedDomains = ['example.com', 'test.com'];
                    return [4 /*yield*/, manager.extractLinks(mockPage, allowedDomains)];
                case 1:
                    result = _a.sent();
                    // 페이지의 URL이 호출되었는지 확인
                    expect(mockPage.url).toHaveBeenCalled();
                    // evaluate 함수가 호출되었는지 확인
                    expect(mockPage.evaluate).toHaveBeenCalled();
                    // 허용된 URL만 결과에 포함되어야 함
                    expect(result).toContain('https://example.com/page1');
                    expect(result).toContain('https://example.com/page2');
                    expect(result).toContain('https://test.com/page1');
                    expect(result).toContain('https://subdomain.example.com/page');
                    expect(result).not.toContain('https://other-domain.com/page');
                    return [2 /*return*/];
            }
        });
    }); });
    test('도메인 필터링', function () { return __awaiter(void 0, void 0, void 0, function () {
        var allowedDomains, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allowedDomains = ['example.com'];
                    return [4 /*yield*/, manager.extractLinks(mockPage, allowedDomains)];
                case 1:
                    result = _a.sent();
                    // example.com 도메인의 URL만 포함되어야 함
                    expect(result.every(function (url) { return url.includes('example.com'); })).toBe(true);
                    expect(result.some(function (url) { return url.includes('test.com'); })).toBe(false);
                    expect(result.some(function (url) { return url.includes('other-domain.com'); })).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
