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
var ScriptExecutor = /** @class */ (function () {
    function ScriptExecutor(page, baseUrl) {
        this.page = page;
        this.baseUrl = baseUrl;
    }
    ScriptExecutor.prototype.executeScript = function (scriptContent, index) {
        return __awaiter(this, void 0, void 0, function () {
            var beforeUrl, scriptResult, afterUrl;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 자바스크립트 대화상자 처리
                        this.page.on('dialog', function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("\uC2A4\uD06C\uB9BD\uD2B8 ".concat(index, " \uB300\uD654\uC0C1\uC790 \uAC10\uC9C0: ").concat(dialog.type(), ", \uBA54\uC2DC\uC9C0: ").concat(dialog.message()));
                                        return [4 /*yield*/, dialog.dismiss()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        // 각 탭에 번호를 표시하기 위해 제목 변경
                        return [4 /*yield*/, this.page.evaluate(function (idx) {
                                document.title = "\uC2A4\uD06C\uB9BD\uD2B8 \uC2E4\uD589 ".concat(idx);
                            }, index)];
                    case 1:
                        // 각 탭에 번호를 표시하기 위해 제목 변경
                        _a.sent();
                        return [4 /*yield*/, this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' })];
                    case 2:
                        _a.sent();
                        // 콘솔 로그를 가로채서 출력
                        this.page.on('console', function (msg) { return console.log("\uC2A4\uD06C\uB9BD\uD2B8 ".concat(index, " \uCF58\uC194:"), msg.text()); });
                        return [4 /*yield*/, this.page.url()];
                    case 3:
                        beforeUrl = _a.sent();
                        return [4 /*yield*/, this.page.evaluate(function (content) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    // 여기에 기존의 스크립트 실행 코드 삽입
                                    return [2 /*return*/, new Promise(function (resolve) {
                                            // ... (기존 코드 그대로 사용)
                                        })];
                                });
                            }); }, scriptContent)];
                    case 4:
                        scriptResult = _a.sent();
                        return [4 /*yield*/, this.page.url()];
                    case 5:
                        afterUrl = _a.sent();
                        // URL이 변경되었으나 감지되지 않았다면 결과 업데이트
                        if (afterUrl !== beforeUrl && !scriptResult.urlChanged) {
                            scriptResult.urlChanged = true;
                            scriptResult.detectedUrl = afterUrl;
                            scriptResult.message = 'URL 변경 감지됨 (페이지 이동 확인)';
                        }
                        // 결과 가공
                        scriptResult.originalScript = scriptContent.substring(0, 150) + (scriptContent.length > 150 ? '...' : '');
                        scriptResult.sourceType = 'inline-script';
                        scriptResult.index = index;
                        return [2 /*return*/, scriptResult];
                }
            });
        });
    };
    ScriptExecutor.prototype.executeOnclick = function (onclickCode, elementInfo, index) {
        return __awaiter(this, void 0, void 0, function () {
            var beforeUrl, onclickResult, afterUrl;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 자바스크립트 대화상자 처리
                        this.page.on('dialog', function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("onclick ".concat(index, " \uB300\uD654\uC0C1\uC790 \uAC10\uC9C0: ").concat(dialog.type(), ", \uBA54\uC2DC\uC9C0: ").concat(dialog.message()));
                                        return [4 /*yield*/, dialog.dismiss()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        // 각 탭에 번호를 표시하기 위해 제목 변경
                        return [4 /*yield*/, this.page.evaluate(function (idx) {
                                document.title = "onclick \uC2E4\uD589 ".concat(idx);
                            }, index)];
                    case 1:
                        // 각 탭에 번호를 표시하기 위해 제목 변경
                        _a.sent();
                        return [4 /*yield*/, this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' })];
                    case 2:
                        _a.sent();
                        // 콘솔 로그를 가로채서 출력
                        this.page.on('console', function (msg) { return console.log("onclick ".concat(index, " \uCF58\uC194:"), msg.text()); });
                        return [4 /*yield*/, this.page.url()];
                    case 3:
                        beforeUrl = _a.sent();
                        return [4 /*yield*/, this.page.evaluate(function (code, info) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    // 여기에 기존의 onclick 실행 코드 삽입
                                    return [2 /*return*/, new Promise(function (resolve) {
                                            // ... (기존 코드 그대로 사용)
                                        })];
                                });
                            }); }, onclickCode, elementInfo)];
                    case 4:
                        onclickResult = _a.sent();
                        // 실행 후 URL 확인하여 변경 감지
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 5:
                        // 실행 후 URL 확인하여 변경 감지
                        _a.sent();
                        return [4 /*yield*/, this.page.url()];
                    case 6:
                        afterUrl = _a.sent();
                        // URL 변경 여부 확인 및 결과 업데이트
                        if (afterUrl !== beforeUrl) {
                            onclickResult.urlChanged = true;
                            onclickResult.detectedUrl = afterUrl;
                            onclickResult.message = 'URL 변경 감지됨 (페이지 이동 확인)';
                        }
                        else {
                            onclickResult.urlChanged = false;
                            onclickResult.detectedUrl = null;
                        }
                        // 결과 가공
                        onclickResult.originalScript = onclickCode;
                        onclickResult.sourceType = 'onclick';
                        onclickResult.index = index;
                        onclickResult.elementInfo = elementInfo;
                        return [2 /*return*/, onclickResult];
                }
            });
        });
    };
    return ScriptExecutor;
}());
module.exports = { ScriptExecutor: ScriptExecutor };
