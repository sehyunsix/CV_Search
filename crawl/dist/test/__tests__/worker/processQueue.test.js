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
describe('BaseWorkerManager - processQueue', function () {
    var manager;
    beforeEach(function () {
        // db 전역 객체 모킹
        global.db = {
            connect: jest.fn().mockResolvedValue(),
            disconnect: jest.fn().mockResolvedValue(),
            getDomainStats: jest.fn().mockResolvedValue({
                total: 10,
                visited: 5,
                pending: 5
            })
        };
        // BaseWorkerManager 인스턴스 생성
        manager = new BaseWorkerManager();
        manager.maxUrls = 3;
        manager.delayBetweenRequests = 100;
        // 필요한 메서드 모킹
        manager.initBrowser = jest.fn().mockResolvedValue({});
        manager.getNextUrl = jest.fn()
            .mockResolvedValueOnce({ url: 'https://example.com/page1', domain: 'example.com' })
            .mockResolvedValueOnce({ url: 'https://example.com/page2', domain: 'example.com' })
            .mockResolvedValueOnce(null); // 3번째는 null 반환하여 루프 종료
        manager.visitUrl = jest.fn().mockResolvedValue();
    });
    test('큐 처리 - 정상 시나리오', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, manager.processQueue()];
                case 1:
                    _a.sent();
                    // MongoDB 연결 확인
                    expect(global.db.connect).toHaveBeenCalled();
                    // 브라우저 초기화 확인
                    expect(manager.initBrowser).toHaveBeenCalled();
                    // getNextUrl 호출 횟수 확인
                    expect(manager.getNextUrl).toHaveBeenCalledTimes(3);
                    // visitUrl 호출 확인
                    expect(manager.visitUrl).toHaveBeenCalledTimes(2);
                    expect(manager.visitUrl).toHaveBeenNthCalledWith(1, 'https://example.com/page1', 'example.com');
                    expect(manager.visitUrl).toHaveBeenNthCalledWith(2, 'https://example.com/page2', 'example.com');
                    // 실행 상태 확인
                    expect(manager.isRunning).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    test('이미 실행 중일 때 중복 실행 방지', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    manager.isRunning = true;
                    return [4 /*yield*/, manager.processQueue()];
                case 1:
                    _a.sent();
                    // isRunning이 true일 때 getNextUrl이 호출되지 않아야 함
                    expect(manager.getNextUrl).not.toHaveBeenCalled();
                    expect(manager.visitUrl).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    test('오류 처리 - getNextUrl 실패', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 오류 시뮬레이션
                    manager.getNextUrl = jest.fn().mockRejectedValue(new Error('테스트 오류'));
                    return [4 /*yield*/, manager.processQueue()];
                case 1:
                    _a.sent();
                    // 오류가 발생해도 isRunning이 false로 변경되어야 함
                    expect(manager.isRunning).toBe(false);
                    expect(manager.visitUrl).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    test('오류 처리 - visitUrl 실패', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // visitUrl 실패 시뮬레이션
                    manager.visitUrl = jest.fn().mockRejectedValue(new Error('방문 오류'));
                    return [4 /*yield*/, manager.processQueue()];
                case 1:
                    _a.sent();
                    // 오류가 발생해도 isRunning이 false로 변경되어야 함
                    expect(manager.isRunning).toBe(false);
                    // 실패에도 불구하고 루프가 계속 진행되어야 함
                    expect(manager.getNextUrl).toHaveBeenCalledTimes(3);
                    expect(manager.visitUrl).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    test('최대 URL 제한 준수', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // getNextUrl이 항상 유효한 결과를 반환하도록 설정
                    manager.getNextUrl = jest.fn().mockResolvedValue({
                        url: 'https://example.com/page',
                        domain: 'example.com'
                    });
                    return [4 /*yield*/, manager.processQueue()];
                case 1:
                    _a.sent();
                    // maxUrls(3)만큼만 visitUrl이 호출되어야 함
                    expect(manager.visitUrl).toHaveBeenCalledTimes(3);
                    // getNextUrl은 maxUrls 횟수만큼만 호출되어야 함 (마지막 종료 조건 확인 제외)
                    expect(manager.getNextUrl).toHaveBeenCalledTimes(3);
                    return [2 /*return*/];
            }
        });
    }); });
    test('지연 시간 적용', function () { return __awaiter(void 0, void 0, void 0, function () {
        var processPromise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // setTimeout 모킹
                    jest.useFakeTimers();
                    // visitUrl이 실행된 후 비동기 작업이 완료되도록 Promise.resolve 사용
                    manager.visitUrl = jest.fn().mockImplementation(function () {
                        return Promise.resolve();
                    });
                    // processQueue가 두 번의 URL 방문 후 null을 받아 종료되도록 설정
                    manager.getNextUrl = jest.fn()
                        .mockResolvedValueOnce({ url: 'https://example.com/page1', domain: 'example.com' })
                        .mockResolvedValueOnce({ url: 'https://example.com/page2', domain: 'example.com' })
                        .mockResolvedValueOnce({ url: 'https://example.com/page2', domain: 'example.com' })
                        .mockResolvedValueOnce(null); // 3번째는 null 반환하여 루프 종료
                    manager.maxUrls = 4;
                    processPromise = manager.processQueue();
                    manager.delayBetweenRequests = 2000;
                    // 첫 번째 URL 처리 (getNextUrl 호출 및 visitUrl 실행)
                    return [4 /*yield*/, jest.advanceTimersByTimeAsync(manager.delayBetweenRequests)];
                case 1:
                    // 첫 번째 URL 처리 (getNextUrl 호출 및 visitUrl 실행)
                    _a.sent();
                    expect(manager.visitUrl).toHaveBeenCalledTimes(2);
                    // 지연 시간 진행
                    return [4 /*yield*/, jest.advanceTimersByTimeAsync(manager.delayBetweenRequests)];
                case 2:
                    // 지연 시간 진행
                    _a.sent();
                    expect(manager.visitUrl).toHaveBeenCalledTimes(3);
                    // 세 번째 호출에서 getNextUrl이 null을 반환하고 종료하도록 모든 타이머 실행
                    return [4 /*yield*/, jest.runAllTimersAsync()];
                case 3:
                    // 세 번째 호출에서 getNextUrl이 null을 반환하고 종료하도록 모든 타이머 실행
                    _a.sent();
                    // 작업 완료 대기
                    return [4 /*yield*/, processPromise];
                case 4:
                    // 작업 완료 대기
                    _a.sent();
                    // 실제 타이머 복원
                    jest.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
    test('결과가 없을 때 바로 종료', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // getNextUrl이 첫 호출에서 null 반환
                    manager.getNextUrl = jest.fn().mockResolvedValue(null);
                    return [4 /*yield*/, manager.processQueue()];
                case 1:
                    _a.sent();
                    // getNextUrl은 한 번만 호출되어야 함
                    expect(manager.getNextUrl).toHaveBeenCalledTimes(1);
                    // visitUrl은 호출되지 않아야 함
                    expect(manager.visitUrl).not.toHaveBeenCalled();
                    // 실행 상태는 false로 변경되어야 함
                    expect(manager.isRunning).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
