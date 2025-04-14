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
/**
 * Onclick 스크립트를 실행하는 작업자 클래스
 */
var OnClickWorker = /** @class */ (function () {
    /**
     * @param {Object} options 작업 옵션
     * @param {number} options.id 작업 ID
     * @param {string} options.currentUrl 기본 URL
     * @param {Object} options.onclickItem onclick 요소 정보
     * @param {number} options.index 작업 인덱스
     * @param {number} options.total 전체 작업 수
     * @param {boolean} options.headless 헤드리스 모드 여부
     * @param {number} options.timeout 시간 제한(ms)
     */
    function OnClickWorker(options) {
        this.id = options.id || Date.now();
        this.currentUrl = options.currentUrl;
        this.onclickItem = options.onclickItem;
        this.index = options.index;
        this.total = options.total;
        this.browser = null;
        this.page = null;
        this.headless = options.headless !== false;
        this.timeout = options.timeout || 3000;
        this.urlDetectionTimeout = options.urlDetectionTimeout || 3000;
    }
    /**
     * onclick 스크립트를 실행합니다.
     * @returns {Promise<Object>} 실행 결과
     */
    OnClickWorker.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var beforeUrl, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 작업 시작 로그
                        console.log("[Worker ".concat(this.id, "] onclick \uC2A4\uD06C\uB9BD\uD2B8 ").concat(this.index, "/").concat(this.total, " \uC2E4\uD589 \uC2DC\uC791..."));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 10]);
                        // 브라우저 및 페이지 초기화
                        return [4 /*yield*/, this.initialize()];
                    case 2:
                        // 브라우저 및 페이지 초기화
                        _a.sent();
                        // 페이지 설정
                        return [4 /*yield*/, this.setupPage()];
                    case 3:
                        // 페이지 설정
                        _a.sent();
                        return [4 /*yield*/, this.page.url()];
                    case 4:
                        beforeUrl = _a.sent();
                        return [4 /*yield*/, this.executeOnclick()];
                    case 5:
                        result = _a.sent();
                        // URL 변경 감지
                        return [4 /*yield*/, this.checkUrlChanges(result, beforeUrl)];
                    case 6:
                        // URL 변경 감지
                        _a.sent();
                        // 결과 형식 설정
                        this.formatResult(result);
                        // 자원 정리
                        return [4 /*yield*/, this.cleanup()];
                    case 7:
                        // 자원 정리
                        _a.sent();
                        console.log("[Worker ".concat(this.id, "] onclick ").concat(this.index, " \uC2E4\uD589 \uC644\uB8CC: ").concat(result.success ? (result.urlChanged ? '페이지 이동 감지' : '정상 실행') : '실패'));
                        return [2 /*return*/, result];
                    case 8:
                        error_1 = _a.sent();
                        console.error("[Worker ".concat(this.id, "] onclick \uC2E4\uD589 \uC911 \uC624\uB958:"), error_1);
                        // 브라우저가 열려있으면 닫기
                        return [4 /*yield*/, this.cleanup()];
                    case 9:
                        // 브라우저가 열려있으면 닫기
                        _a.sent();
                        return [2 /*return*/, {
                                sourceType: 'onclick',
                                index: this.index,
                                success: false,
                                error: error_1.toString(),
                                elementInfo: {
                                    tagName: this.onclickItem.tagName,
                                    id: this.onclickItem.id,
                                    className: this.onclickItem.className,
                                    text: this.onclickItem.text
                                },
                                message: '실행 중 예외 발생'
                            }];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 브라우저와 페이지를 초기화합니다.
     */
    OnClickWorker.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // 브라우저 시작
                        _a = this;
                        return [4 /*yield*/, puppeteer.launch({
                                headless: this.headless
                            })];
                    case 1:
                        // 브라우저 시작
                        _a.browser = _c.sent();
                        // 페이지 생성
                        _b = this;
                        return [4 /*yield*/, this.browser.newPage()];
                    case 2:
                        // 페이지 생성
                        _b.page = _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 페이지를 설정합니다.
     */
    OnClickWorker.prototype.setupPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 자바스크립트 대화상자 처리
                        this.page.on('dialog', function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("[Worker ".concat(this.id, "] onclick ").concat(this.index, " \uB300\uD654\uC0C1\uC790 \uAC10\uC9C0: ").concat(dialog.type(), ", \uBA54\uC2DC\uC9C0: ").concat(dialog.message()));
                                        return [4 /*yield*/, dialog.dismiss()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        // 각 탭에 번호를 표시하기 위해 제목 변경
                        return [4 /*yield*/, this.page.evaluate(function (index, id) {
                                document.title = "onclick \uC2E4\uD589 ".concat(index, " (Worker ").concat(id, ")");
                            }, this.index, this.id)];
                    case 1:
                        // 각 탭에 번호를 표시하기 위해 제목 변경
                        _a.sent();
                        // 콘솔 로그를 가로채서 출력
                        this.page.on('console', function (msg) { return console.log("[Worker ".concat(_this.id, "] onclick ").concat(_this.index, " \uCF58\uC194:"), msg.text()); });
                        // 페이지 로드
                        return [4 /*yield*/, this.page.goto(this.currentUrl, {
                                waitUntil: 'networkidle2',
                                timeout: 60000 // 충분한 로드 시간 제공
                            })];
                    case 2:
                        // 페이지 로드
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * onclick 스크립트를 실행합니다.
     * @returns {Promise<Object>} 실행 결과
     */
    OnClickWorker.prototype.executeOnclick = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.page.evaluate(function (onclickCode, elementInfo, timeout) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, new Promise(function (resolve) {
                                    // 타임아웃 설정
                                    var timeoutId = setTimeout(function () {
                                        resolve({
                                            success: true,
                                            message: '실행 완료 (타임아웃)'
                                        });
                                    }, timeout);
                                    try {
                                        // 대화상자 함수 오버라이드
                                        window.alert = function (message) {
                                            console.log('alert 호출됨:', message);
                                            return undefined;
                                        };
                                        window.confirm = function (message) {
                                            console.log('confirm 호출됨:', message);
                                            return true; // 항상 확인 버튼 클릭으로 처리
                                        };
                                        window.prompt = function (message, defaultValue) {
                                            console.log('prompt 호출됨:', message);
                                            return defaultValue || ''; // 기본값이나 빈 문자열 반환
                                        };
                                        // 실행될 onclick 코드에 대한 정보 출력
                                        console.log("".concat(elementInfo.tagName, " \uC694\uC18C\uC758 onclick \uC2E4\uD589: ").concat(onclickCode));
                                        // URL 변경 감지를 위한 기존 함수 백업
                                        var originalAssign_1 = window.location.assign;
                                        var originalReplace_1 = window.location.replace;
                                        var originalOpen_1 = window.open;
                                        var detectedUrl_1 = null;
                                        var urlChanged_1 = false;
                                        // location 함수 오버라이드
                                        window.location.assign = function (url) {
                                            console.log('location.assign 호출됨:', url);
                                            detectedUrl_1 = url;
                                            urlChanged_1 = true;
                                            clearTimeout(timeoutId);
                                            resolve({
                                                success: true,
                                                detectedUrl: url,
                                                urlChanged: true,
                                                message: 'location.assign 호출됨'
                                            });
                                            return originalAssign_1.call(window.location, url);
                                        };
                                        window.location.replace = function (url) {
                                            console.log('location.replace 호출됨:', url);
                                            detectedUrl_1 = url;
                                            urlChanged_1 = true;
                                            clearTimeout(timeoutId);
                                            resolve({
                                                success: true,
                                                detectedUrl: url,
                                                urlChanged: true,
                                                message: 'location.replace 호출됨'
                                            });
                                            return originalReplace_1.call(window.location, url);
                                        };
                                        // location.href 속성 재정의
                                        try {
                                            Object.defineProperty(window.location, 'href', {
                                                set: function (url) {
                                                    console.log('location.href 설정됨:', url);
                                                    detectedUrl_1 = url;
                                                    urlChanged_1 = true;
                                                    clearTimeout(timeoutId);
                                                    resolve({
                                                        success: true,
                                                        detectedUrl: url,
                                                        urlChanged: true,
                                                        message: 'location.href 설정됨'
                                                    });
                                                    return url;
                                                },
                                                get: function () {
                                                    return window.location.toString();
                                                }
                                            });
                                        }
                                        catch (e) {
                                            console.log('location.href 속성 재정의 실패:', e);
                                        }
                                        // window.open 오버라이드
                                        window.open = function (url) {
                                            console.log('window.open 호출됨:', url);
                                            detectedUrl_1 = url;
                                            urlChanged_1 = true;
                                            clearTimeout(timeoutId);
                                            resolve({
                                                success: true,
                                                detectedUrl: url,
                                                urlChanged: true,
                                                message: 'window.open 호출됨'
                                            });
                                            return originalOpen_1 ? originalOpen_1.call(window, url) : null;
                                        };
                                        // onclick 코드 실행
                                        eval(onclickCode);
                                        console.log('onclick 실행 완료');
                                        // URL이 변경되지 않았다면 바로 결과 반환
                                        if (!urlChanged_1) {
                                            clearTimeout(timeoutId);
                                            resolve({
                                                success: true,
                                                detectedUrl: null,
                                                urlChanged: false,
                                                message: '실행 완료 (URL 변경 없음)'
                                            });
                                        }
                                    }
                                    catch (error) {
                                        clearTimeout(timeoutId);
                                        console.error('onclick 실행 오류:', error);
                                        resolve({
                                            success: false,
                                            error: error.toString(),
                                            message: 'onclick 실행 중 오류 발생'
                                        });
                                    }
                                })];
                        });
                    }); }, this.onclickItem.onclick, {
                        tagName: this.onclickItem.tagName,
                        id: this.onclickItem.id,
                        className: this.onclickItem.className,
                        text: this.onclickItem.text
                    }, this.timeout)];
            });
        });
    };
    /**
     * URL 변경을 확인하고 결과에 반영합니다.
     * @param {Object} result 결과 객체
     * @param {string} beforeUrl 실행 전 URL
     */
    OnClickWorker.prototype.checkUrlChanges = function (result, beforeUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var afterUrl;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // URL 변경 감지를 위해 추가 대기
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, _this.urlDetectionTimeout); })];
                    case 1:
                        // URL 변경 감지를 위해 추가 대기
                        _a.sent();
                        return [4 /*yield*/, this.page.url()];
                    case 2:
                        afterUrl = _a.sent();
                        console.log("[Worker ".concat(this.id, "] afterUrl: ").concat(afterUrl));
                        // URL 변경 확인
                        if (afterUrl !== beforeUrl) {
                            result.urlChanged = true;
                            result.detectedUrl = afterUrl;
                            result.message = 'URL 변경 감지됨 (페이지 이동 확인)';
                            // 이 단계에서는 URL을 수집하지 않고 결과만 반환
                            // URL 수집은 메인 스레드에서 처리
                        }
                        else if (!result.urlChanged) {
                            result.urlChanged = false;
                            result.detectedUrl = null;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 결과 객체에 추가 정보를 설정합니다.
     * @param {Object} result 결과 객체
     */
    OnClickWorker.prototype.formatResult = function (result) {
        result.originalScript = this.onclickItem.onclick;
        result.sourceType = 'onclick';
        result.index = this.index;
        result.elementInfo = {
            tagName: this.onclickItem.tagName,
            id: this.onclickItem.id,
            className: this.onclickItem.className,
            text: this.onclickItem.text
        };
    };
    /**
     * 브라우저와 페이지 리소스를 정리합니다.
     */
    OnClickWorker.prototype.cleanup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.browser) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.browser.close()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error("[Worker ".concat(this.id, "] \uBE0C\uB77C\uC6B0\uC800 \uC885\uB8CC \uC911 \uC624\uB958:"), error_2);
                        return [3 /*break*/, 4];
                    case 4:
                        this.browser = null;
                        this.page = null;
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return OnClickWorker;
}());
/**
 * 작업 풀을 관리하는 클래스
 */
var WorkerPool = /** @class */ (function () {
    /**
     * @param {number} maxConcurrency 최대 동시 실행 작업 수
     */
    function WorkerPool(maxConcurrency) {
        if (maxConcurrency === void 0) { maxConcurrency = 5; }
        this.maxConcurrency = maxConcurrency;
        this.active = 0;
        this.queue = [];
    }
    /**
     * 작업을 실행 큐에 추가합니다.
     * @param {Object} options 작업 옵션
     * @returns {Promise<Object>} 작업 결과
     */
    WorkerPool.prototype.enqueue = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var task = {
                            options: options,
                            execute: function () { return __awaiter(_this, void 0, void 0, function () {
                                var worker_1, result, error_3;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this.active++;
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, 4, 5]);
                                            worker_1 = new OnClickWorker(options);
                                            return [4 /*yield*/, worker_1.execute()];
                                        case 2:
                                            result = _a.sent();
                                            resolve(result);
                                            return [3 /*break*/, 5];
                                        case 3:
                                            error_3 = _a.sent();
                                            console.error("[WorkerPool] \uC791\uC5C5 \uC2E4\uD589 \uC624\uB958:", error_3);
                                            resolve({
                                                success: false,
                                                error: error_3.toString(),
                                                sourceType: 'onclick',
                                                index: options.index,
                                                message: '작업 풀에서 실행 중 오류 발생'
                                            });
                                            return [3 /*break*/, 5];
                                        case 4:
                                            this.active--;
                                            this.processQueue();
                                            return [7 /*endfinally*/];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); }
                        };
                        _this.queue.push(task);
                        _this.processQueue();
                    })];
            });
        });
    };
    /**
     * 큐에 있는 작업을 처리합니다.
     */
    WorkerPool.prototype.processQueue = function () {
        while (this.active < this.maxConcurrency && this.queue.length > 0) {
            var task = this.queue.shift();
            task.execute();
        }
    };
    /**
     * 여러 작업을 병렬로 처리합니다.
     * @param {Array<Object>} tasks 작업 옵션 배열
     * @returns {Promise<Array<Object>>} 작업 결과 배열
     */
    WorkerPool.prototype.processTasks = function (tasks) {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                promises = tasks.map(function (task) { return _this.enqueue(task); });
                return [2 /*return*/, Promise.all(promises)];
            });
        });
    };
    return WorkerPool;
}());
module.exports = { OnClickWorker: OnClickWorker, WorkerPool: WorkerPool };
