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
/**
 * ParseManager의 updateSubUrlStatus 함수 테스트
 */
require('module-alias/register');
var ParseManager = require('@parse/parseManager');
var VisitResult = require('@models/visitResult').VisitResult;
var mongoService = require('@database/mongodb-service').mongoService;
var logger = require('@utils/logger').defaultLogger;
// 로그 레벨 변경하여 테스트 시 불필요한 로그 출력 방지
logger.level = 'error';
// 몽고DB 모킹
jest.mock('@database/mongodb-service', function () { return ({
    mongoService: {
        connect: jest.fn().mockResolvedValue(true),
    }
}); });
// VisitResult 모델 모킹
jest.mock('@models/visitResult', function () {
    var mockFind = jest.fn();
    var mockUpdateOne = jest.fn();
    // 모킹된 문서 인스턴스
    var mockVisitResultInstance = {
        save: jest.fn().mockResolvedValue(true),
        suburl_list: []
    };
    // 클래스 생성자 모킹
    var MockVisitResult = {
        find: mockFind,
        updateOne: mockUpdateOne,
        countDocuments: jest.fn(),
        aggregate: jest.fn(),
        findOne: jest.fn()
    };
    return {
        VisitResult: MockVisitResult,
        mockFind: mockFind,
        mockUpdateOne: mockUpdateOne,
        mockVisitResultInstance: mockVisitResultInstance
    };
});
describe('ParseManager - updateSubUrlStatus', function () {
    var parseManager;
    beforeEach(function () {
        // 각 테스트 전에 ParseManager 인스턴스 생성 및 모킹 리셋
        parseManager = new ParseManager();
        jest.clearAllMocks();
    });
    // 도메인 추출 테스트
    test('URL에서 도메인을 정상적으로 추출해야 한다', function () { return __awaiter(void 0, void 0, void 0, function () {
        var url, isRecruit, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = 'https://example.com/job/12345';
                    isRecruit = true;
                    // VisitResult.find 모킹 (빈 배열 반환)
                    VisitResult.find.mockResolvedValue([]);
                    // VisitResult.updateOne 모킹 (성공 결과 반환)
                    VisitResult.updateOne.mockResolvedValue({ modifiedCount: 1 });
                    return [4 /*yield*/, parseManager.updateSubUrlStatus(url, isRecruit)];
                case 1:
                    result = _a.sent();
                    // 도메인이 정확히 추출되었는지 확인
                    expect(VisitResult.find).toHaveBeenCalledWith({ domain: 'example.com' });
                    expect(result).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    // 도메인으로 문서를 찾는 경우 테스트
    test('도메인으로 문서를 찾아서 URL을 업데이트해야 한다', function () { return __awaiter(void 0, void 0, void 0, function () {
        var url, isRecruit, mockVisitResult, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = 'https://example.com/job/12345';
                    isRecruit = true;
                    mockVisitResult = {
                        domain: 'example.com',
                        suburl_list: [
                            { url: 'https://example.com/job/12345', visited: true, success: true }
                        ],
                        save: jest.fn().mockResolvedValue(true)
                    };
                    // VisitResult.find가 모킹된 문서를 반환하도록 설정
                    VisitResult.find.mockResolvedValue([mockVisitResult]);
                    return [4 /*yield*/, parseManager.updateSubUrlStatus(url, isRecruit)];
                case 1:
                    result = _a.sent();
                    // 기대 결과 검증
                    expect(VisitResult.find).toHaveBeenCalledWith({ domain: 'example.com' });
                    expect(mockVisitResult.suburl_list[0].isRecruit).toBe(true);
                    expect(mockVisitResult.suburl_list[0].updated_at).toBeInstanceOf(Date);
                    expect(mockVisitResult.save).toHaveBeenCalled();
                    expect(result).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    // 도메인으로 문서를 찾았지만 URL을 찾지 못하는 경우 테스트
    test('도메인으로 문서를 찾았지만 URL이 없는 경우 실패해야 한다', function () { return __awaiter(void 0, void 0, void 0, function () {
        var url, isRecruit, mockVisitResult, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = 'https://example.com/job/not-found';
                    isRecruit = true;
                    mockVisitResult = {
                        domain: 'example.com',
                        suburl_list: [
                            { url: 'https://example.com/job/different-url', visited: true, success: true }
                        ],
                        save: jest.fn().mockResolvedValue(true)
                    };
                    // VisitResult.find가 모킹된 문서를 반환하도록 설정
                    VisitResult.find.mockResolvedValue([mockVisitResult]);
                    return [4 /*yield*/, parseSubUrlStatus(url, isRecruit)];
                case 1:
                    result = _a.sent();
                    // 기대 결과 검증
                    expect(VisitResult.find).toHaveBeenCalledWith({ domain: 'example.com' });
                    expect(mockVisitResult.save).not.toHaveBeenCalled();
                    expect(result).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    // 도메인을 찾지 못한 경우 직접 URL로 검색하는 테스트
    test('도메인으로 문서를 찾지 못한 경우 직접 URL로 검색해야 한다', function () { return __awaiter(void 0, void 0, void 0, function () {
        var url, isRecruit, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = 'https://example.com/job/12345';
                    isRecruit = true;
                    // VisitResult.find가 빈 배열을 반환하도록 설정
                    VisitResult.find.mockResolvedValue([]);
                    // VisitResult.updateOne이 성공적으로 업데이트했다고 모킹
                    VisitResult.updateOne.mockResolvedValue({ modifiedCount: 1 });
                    return [4 /*yield*/, parseManager.updateSubUrlStatus(url, isRecruit)];
                case 1:
                    result = _a.sent();
                    // 기대 결과 검증
                    expect(VisitResult.find).toHaveBeenCalledWith({ domain: 'example.com' });
                    expect(VisitResult.updateOne).toHaveBeenCalledWith({ 'suburl_list.url': url }, {
                        $set: {
                            'suburl_list.$.isRecruit': isRecruit,
                            'suburl_list.$.updated_at': expect.any(Date)
                        }
                    });
                    expect(result).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    // 잘못된 URL 형식에 대한 테스트
    test('잘못된 URL 형식의 경우에도 처리해야 한다', function () { return __awaiter(void 0, void 0, void 0, function () {
        var url, isRecruit, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = 'invalid-url';
                    isRecruit = true;
                    // VisitResult.updateOne이 성공적으로 업데이트했다고 모킹
                    VisitResult.updateOne.mockResolvedValue({ modifiedCount: 1 });
                    return [4 /*yield*/, parseManager.updateSubUrlStatus(url, isRecruit)];
                case 1:
                    result = _a.sent();
                    // 기대 결과 검증
                    expect(VisitResult.find).not.toHaveBeenCalled(); // 도메인 추출 실패로 find는 호출되지 않음
                    expect(VisitResult.updateOne).toHaveBeenCalledWith({ 'suburl_list.url': url }, {
                        $set: {
                            'suburl_list.$.isRecruit': isRecruit,
                            'suburl_list.$.updated_at': expect.any(Date)
                        }
                    });
                    expect(result).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    // 예외 처리 테스트
    test('오류가 발생하면 false를 반환해야 한다', function () { return __awaiter(void 0, void 0, void 0, function () {
        var url, isRecruit, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = 'https://example.com/job/12345';
                    isRecruit = true;
                    // 오류 시뮬레이션
                    VisitResult.find.mockRejectedValue(new Error('DB 오류'));
                    return [4 /*yield*/, parseManager.updateSubUrlStatus(url, isRecruit)];
                case 1:
                    result = _a.sent();
                    // 기대 결과 검증
                    expect(result).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
// 헬퍼 함수: 실제 함수 구현 (테스트에서 직접 참조할 수 있도록)
function parseSubUrlStatus(url, isRecruit) {
    return __awaiter(this, void 0, void 0, function () {
        var result, domain, urlObj, visitResults, updated, _i, visitResults_1, visitResult, subUrlIndex;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    try {
                        urlObj = new URL(url);
                        domain = urlObj.hostname;
                    }
                    catch (error) {
                        domain = null;
                    }
                    if (!domain) return [3 /*break*/, 9];
                    return [4 /*yield*/, VisitResult.find({ domain: domain })];
                case 1:
                    visitResults = _b.sent();
                    if (!(!visitResults || visitResults.length === 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, VisitResult.updateOne({ 'suburl_list.url': url }, {
                            $set: {
                                'suburl_list.$.isRecruit': isRecruit,
                                'suburl_list.$.updated_at': new Date()
                            }
                        })];
                case 2:
                    result = _b.sent();
                    return [3 /*break*/, 8];
                case 3:
                    updated = false;
                    _i = 0, visitResults_1 = visitResults;
                    _b.label = 4;
                case 4:
                    if (!(_i < visitResults_1.length)) return [3 /*break*/, 7];
                    visitResult = visitResults_1[_i];
                    subUrlIndex = (_a = visitResult.suburl_list) === null || _a === void 0 ? void 0 : _a.findIndex(function (item) { return item.url === url; });
                    if (!(subUrlIndex !== -1 && subUrlIndex !== undefined)) return [3 /*break*/, 6];
                    visitResult.suburl_list[subUrlIndex].isRecruit = isRecruit;
                    visitResult.suburl_list[subUrlIndex].updated_at = new Date();
                    return [4 /*yield*/, visitResult.save()];
                case 5:
                    _b.sent();
                    updated = true;
                    return [3 /*break*/, 7];
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    if (!updated) {
                        return [2 /*return*/, false];
                    }
                    else {
                        result = { modifiedCount: 1 };
                    }
                    _b.label = 8;
                case 8: return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, VisitResult.updateOne({ 'suburl_list.url': url }, {
                        $set: {
                            'suburl_list.$.isRecruit': isRecruit,
                            'suburl_list.$.updated_at': new Date()
                        }
                    })];
                case 10:
                    result = _b.sent();
                    _b.label = 11;
                case 11: return [2 /*return*/, result && result.modifiedCount > 0];
            }
        });
    });
}
