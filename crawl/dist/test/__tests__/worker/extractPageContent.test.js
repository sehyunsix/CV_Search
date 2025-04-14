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
describe('BaseWorkerManager - extractPageContent', function () {
    var manager;
    var mockPage;
    beforeEach(function () {
        manager = new BaseWorkerManager();
        // 테스트용 페이지 콘텐츠
        var mockPageContent = {
            title: '테스트 페이지',
            meta: {
                'description': '페이지 설명',
                'keywords': '테스트, 단위 테스트, Jest'
            },
            text: '이것은 테스트 페이지 본문입니다.'
        };
        // 모의 페이지 객체
        mockPage = {
            evaluate: jest.fn().mockResolvedValue(mockPageContent)
        };
    });
    test('페이지 콘텐츠 추출', function () { return __awaiter(void 0, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, manager.extractPageContent(mockPage)];
                case 1:
                    content = _a.sent();
                    // evaluate 함수가 호출되었는지 확인
                    expect(mockPage.evaluate).toHaveBeenCalled();
                    // 반환된 콘텐츠 구조 확인
                    expect(content).toHaveProperty('title');
                    expect(content).toHaveProperty('meta');
                    expect(content).toHaveProperty('text');
                    // 콘텐츠 값 확인
                    expect(content.title).toBe('테스트 페이지');
                    expect(content.meta.description).toBe('페이지 설명');
                    expect(content.meta.keywords).toBe('테스트, 단위 테스트, Jest');
                    expect(content.text).toBe('이것은 테스트 페이지 본문입니다.');
                    return [2 /*return*/];
            }
        });
    }); });
    test('빈 페이지 콘텐츠 처리', function () { return __awaiter(void 0, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 빈 콘텐츠로 모킹 재설정
                    mockPage.evaluate.mockResolvedValue({
                        title: '',
                        meta: {},
                        text: ''
                    });
                    return [4 /*yield*/, manager.extractPageContent(mockPage)];
                case 1:
                    content = _a.sent();
                    // 빈 값도 정상적으로 처리되는지 확인
                    expect(content.title).toBe('');
                    expect(content.meta).toEqual({});
                    expect(content.text).toBe('');
                    return [2 /*return*/];
            }
        });
    }); });
});
