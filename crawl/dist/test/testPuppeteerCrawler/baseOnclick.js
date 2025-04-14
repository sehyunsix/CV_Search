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
var fs = require('fs');
function extractAndExecuteScripts(url) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, result, page, currentUrl, pageData, inlineScripts, _loop_1, i, _loop_2, i, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer.launch({
                        headless: true, // 브라우저 UI를 표시
                    })];
                case 1:
                    browser = _a.sent();
                    result = [];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 14, 15, 16]);
                    return [4 /*yield*/, browser.newPage()];
                case 3:
                    page = _a.sent();
                    // 자바스크립트 대화상자(alert, confirm, prompt) 처리
                    page.on('dialog', function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("\uB300\uD654\uC0C1\uC790 \uAC10\uC9C0: ".concat(dialog.type(), ", \uBA54\uC2DC\uC9C0: ").concat(dialog.message()));
                                    return [4 /*yield*/, dialog.dismiss()];
                                case 1:
                                    _a.sent(); // 대화상자 닫기
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, page.goto(url, { waitUntil: 'networkidle2' })];
                case 4:
                    _a.sent();
                    console.log("\uD398\uC774\uC9C0 \uB85C\uB4DC \uC644\uB8CC: ".concat(url));
                    currentUrl = page.url();
                    console.log("\uD604\uC7AC URL: ".concat(currentUrl));
                    return [4 /*yield*/, page.evaluate(function () {
                            // 모든 스크립트 태그 수집
                            var scriptElements = Array.from(document.querySelectorAll('script'));
                            var scripts = scriptElements.map(function (script) {
                                return {
                                    type: script.type || 'text/javascript',
                                    src: script.src || null,
                                    content: script.src ? null : script.innerHTML
                                };
                            });
                            // 모든 링크 URL 수집
                            var linkElements = Array.from(document.querySelectorAll('a[href]'));
                            var links = linkElements.map(function (link) {
                                return {
                                    href: link.href,
                                    text: link.textContent.trim() || '[No Text]',
                                    id: link.id || null,
                                    className: link.className || null,
                                    onclick: link.getAttribute('onclick') || null
                                };
                            });
                            // onclick 속성을 가진 모든 요소 수집
                            var onclickElements = Array.from(document.querySelectorAll('[onclick]'));
                            var onclicks = onclickElements.map(function (element) {
                                return {
                                    tagName: element.tagName,
                                    id: element.id || null,
                                    className: element.className || null,
                                    onclick: element.getAttribute('onclick'),
                                    text: element.textContent.trim() || '[No Text]'
                                };
                            });
                            return { scripts: scripts, links: links, onclicks: onclicks };
                        })];
                case 5:
                    pageData = _a.sent();
                    console.log("".concat(pageData.scripts.length, "\uAC1C\uC758 \uC2A4\uD06C\uB9BD\uD2B8, ").concat(pageData.links.length, "\uAC1C\uC758 \uB9C1\uD06C, ").concat(pageData.onclicks.length, "\uAC1C\uC758 onclick \uC694\uC18C\uB97C \uCC3E\uC558\uC2B5\uB2C8\uB2E4."));
                    inlineScripts = pageData.scripts.filter(function (script) { return script.content && !script.src; });
                    // 1. 인라인 스크립트 처리
                    console.log("=== 인라인 스크립트 처리 중... ===");
                    _loop_1 = function (i) {
                        var script, scriptPage, beforeUrl, scriptResult, afterUrl, error_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    script = inlineScripts[i];
                                    console.log("\uC778\uB77C\uC778 \uC2A4\uD06C\uB9BD\uD2B8 ".concat(i + 1, "/").concat(inlineScripts.length, " \uC2E4\uD589 \uC911..."));
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 8, , 9]);
                                    return [4 /*yield*/, browser.newPage()];
                                case 2:
                                    scriptPage = _b.sent();
                                    // 자바스크립트 대화상자 처리
                                    scriptPage.on('dialog', function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.log("\uC2A4\uD06C\uB9BD\uD2B8 ".concat(i + 1, " \uB300\uD654\uC0C1\uC790 \uAC10\uC9C0: ").concat(dialog.type(), ", \uBA54\uC2DC\uC9C0: ").concat(dialog.message()));
                                                    return [4 /*yield*/, dialog.dismiss()];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    // 각 탭에 번호를 표시하기 위해 제목 변경
                                    return [4 /*yield*/, scriptPage.evaluate(function (index) {
                                            document.title = "\uC2A4\uD06C\uB9BD\uD2B8 \uC2E4\uD589 ".concat(index);
                                        }, i + 1)];
                                case 3:
                                    // 각 탭에 번호를 표시하기 위해 제목 변경
                                    _b.sent();
                                    return [4 /*yield*/, scriptPage.goto(currentUrl, { waitUntil: 'networkidle2' })];
                                case 4:
                                    _b.sent();
                                    // 콘솔 로그를 가로채서 출력
                                    scriptPage.on('console', function (msg) { return console.log("\uC2A4\uD06C\uB9BD\uD2B8 ".concat(i + 1, " \uCF58\uC194:"), msg.text()); });
                                    return [4 /*yield*/, scriptPage.url()];
                                case 5:
                                    beforeUrl = _b.sent();
                                    return [4 /*yield*/, scriptPage.evaluate(function (scriptContent) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, new Promise(function (resolve) {
                                                        // 3초 타임아웃 설정
                                                        var timeoutId = setTimeout(function () {
                                                            resolve({
                                                                success: true,
                                                                detectedUrl: null,
                                                                urlChanged: false,
                                                                message: '실행 완료 (타임아웃)'
                                                            });
                                                        }, 3000);
                                                        try {
                                                            // URL 변경 감지를 위한 기존 함수 백업
                                                            var originalAssign_1 = window.location.assign;
                                                            var originalReplace_1 = window.location.replace;
                                                            var originalOpen_1 = window.open;
                                                            // alert, confirm, prompt 함수 오버라이드
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
                                                            // 감지된 URL 저장 변수
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
                                                            // 스크립트 실행
                                                            console.log('스크립트 실행 시작');
                                                            eval(scriptContent);
                                                            console.log('스크립트 실행 완료');
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
                                                            console.error('스크립트 실행 오류:', error);
                                                            resolve({
                                                                success: false,
                                                                error: error.toString(),
                                                                message: '스크립트 실행 중 오류 발생'
                                                            });
                                                        }
                                                    })];
                                            });
                                        }); }, script.content)];
                                case 6:
                                    scriptResult = _b.sent();
                                    return [4 /*yield*/, scriptPage.url()];
                                case 7:
                                    afterUrl = _b.sent();
                                    console.log('afterUrl', afterUrl);
                                    // URL이 변경되었으나 감지되지 않았다면 결과 업데이트
                                    if (afterUrl !== beforeUrl) {
                                        scriptResult.urlChanged = true;
                                        scriptResult.detectedUrl = afterUrl;
                                        scriptResult.message = 'URL 변경 감지됨 (페이지 이동 확인)';
                                    }
                                    // 결과 저장
                                    scriptResult.originalScript = script.content.substring(0, 150) + (script.content.length > 150 ? '...' : '');
                                    scriptResult.sourceType = 'inline-script';
                                    scriptResult.index = i + 1;
                                    result.push(scriptResult);
                                    console.log("\uC2A4\uD06C\uB9BD\uD2B8 ".concat(i + 1, " \uC2E4\uD589 \uACB0\uACFC:"), scriptResult);
                                    return [3 /*break*/, 9];
                                case 8:
                                    error_2 = _b.sent();
                                    console.error("\uC778\uB77C\uC778 \uC2A4\uD06C\uB9BD\uD2B8 \uC2E4\uD589 \uC911 \uC624\uB958:", error_2);
                                    result.push({
                                        sourceType: 'inline-script',
                                        index: i + 1,
                                        success: false,
                                        error: error_2.toString(),
                                        message: '실행 중 예외 발생'
                                    });
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 6;
                case 6:
                    if (!(i < inlineScripts.length)) return [3 /*break*/, 9];
                    return [5 /*yield**/, _loop_1(i)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 6];
                case 9:
                    // 2. onclick 스크립트 처리
                    console.log("=== onclick 스크립트 처리 중... ===");
                    _loop_2 = function (i) {
                        var onclickItem, onclickPage, beforeUrl, onclickResult, afterUrl, error_3;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    onclickItem = pageData.onclicks[i];
                                    if (!onclickItem.onclick)
                                        return [2 /*return*/, "continue"];
                                    console.log("onclick \uC2A4\uD06C\uB9BD\uD2B8 ".concat(i + 1, "/").concat(pageData.onclicks.length, " \uC2E4\uD589 \uC911..."));
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 10, , 11]);
                                    return [4 /*yield*/, browser.newPage()];
                                case 2:
                                    onclickPage = _c.sent();
                                    // 자바스크립트 대화상자 처리
                                    onclickPage.on('dialog', function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.log("onclick ".concat(i + 1, " \uB300\uD654\uC0C1\uC790 \uAC10\uC9C0: ").concat(dialog.type(), ", \uBA54\uC2DC\uC9C0: ").concat(dialog.message()));
                                                    return [4 /*yield*/, dialog.dismiss()];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    // 각 탭에 번호를 표시하기 위해 제목 변경
                                    return [4 /*yield*/, onclickPage.evaluate(function (index) {
                                            document.title = "onclick \uC2E4\uD589 ".concat(index);
                                        }, i + 1)];
                                case 3:
                                    // 각 탭에 번호를 표시하기 위해 제목 변경
                                    _c.sent();
                                    return [4 /*yield*/, onclickPage.goto(currentUrl, { waitUntil: 'networkidle2' })];
                                case 4:
                                    _c.sent();
                                    // 콘솔 로그를 가로채서 출력
                                    onclickPage.on('console', function (msg) { return console.log("onclick ".concat(i + 1, " \uCF58\uC194:"), msg.text()); });
                                    return [4 /*yield*/, onclickPage.url()];
                                case 5:
                                    beforeUrl = _c.sent();
                                    return [4 /*yield*/, onclickPage.evaluate(function (onclickCode, elementInfo) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, new Promise(function (resolve) {
                                                        // 3초 타임아웃 설정
                                                        var timeoutId = setTimeout(function () {
                                                            resolve({
                                                                success: true,
                                                                message: '실행 완료 (타임아웃)'
                                                            });
                                                        }, 3000);
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
                                                            // onclick 코드 실행 (단순 eval만 사용)
                                                            eval(onclickCode);
                                                            console.log('onclick 실행 완료');
                                                            // 타임아웃 제거 및 결과 반환
                                                            clearTimeout(timeoutId);
                                                            resolve({
                                                                success: true,
                                                                message: '실행 완료'
                                                            });
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
                                        }); }, onclickItem.onclick, {
                                            tagName: onclickItem.tagName,
                                            id: onclickItem.id,
                                            className: onclickItem.className,
                                            text: onclickItem.text
                                        })];
                                case 6:
                                    onclickResult = _c.sent();
                                    // 실행 후 URL 확인하여 변경 감지
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                case 7:
                                    // 실행 후 URL 확인하여 변경 감지
                                    _c.sent();
                                    return [4 /*yield*/, onclickPage.url()];
                                case 8:
                                    afterUrl = _c.sent();
                                    console.log('afterUrl : ', afterUrl);
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
                                    // 결과 저장
                                    onclickResult.originalScript = onclickItem.onclick;
                                    onclickResult.sourceType = 'onclick';
                                    onclickResult.index = i + 1;
                                    onclickResult.elementInfo = {
                                        tagName: onclickItem.tagName,
                                        id: onclickItem.id,
                                        className: onclickItem.className,
                                        text: onclickItem.text
                                    };
                                    // fs.writeFileSync('onclick_results.json', JSON.stringify({ success: true }, null, 2));
                                    return [4 /*yield*/, onclickPage.close()];
                                case 9:
                                    // fs.writeFileSync('onclick_results.json', JSON.stringify({ success: true }, null, 2));
                                    _c.sent();
                                    result.push(onclickResult);
                                    console.log("onclick ".concat(i + 1, " \uC2E4\uD589 \uACB0\uACFC:"), onclickResult);
                                    return [3 /*break*/, 11];
                                case 10:
                                    error_3 = _c.sent();
                                    console.error("onclick \uC2E4\uD589 \uC911 \uC624\uB958:", error_3);
                                    result.push({
                                        sourceType: 'onclick',
                                        index: i + 1,
                                        success: false,
                                        error: error_3.toString(),
                                        elementInfo: {
                                            tagName: onclickItem.tagName,
                                            id: onclickItem.id,
                                            className: onclickItem.className,
                                            text: onclickItem.text
                                        },
                                        message: '실행 중 예외 발생'
                                    });
                                    return [3 /*break*/, 11];
                                case 11: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 10;
                case 10:
                    if (!(i < pageData.onclicks.length)) return [3 /*break*/, 13];
                    return [5 /*yield**/, _loop_2(i)];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12:
                    i++;
                    return [3 /*break*/, 10];
                case 13:
                    // 결과를 파일에 저장
                    fs.writeFileSync('script_execution_results.json', JSON.stringify(result, null, 2));
                    console.log("\uC2E4\uD589 \uACB0\uACFC\uB97C script_execution_results.json \uD30C\uC77C\uC5D0 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4.");
                    return [2 /*return*/, result];
                case 14:
                    error_1 = _a.sent();
                    console.error('전체 프로세스 오류:', error_1);
                    return [2 /*return*/, { error: error_1.toString() }];
                case 15:
                    // 브라우저 종료 전에 사용자에게 알림
                    console.log('모든 작업이 완료되었습니다. 브라우저를 검토한 후 아무 키나 눌러 종료하세요...');
                    return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    });
}
// 함수 실행 예시
var targetUrl = process.argv[2] || 'https://recruit.navercorp.com/';
console.log("\uB300\uC0C1 URL: ".concat(targetUrl));
extractAndExecuteScripts(targetUrl).then(function (results) {
    console.log('모든 스크립트 실행이 완료되었습니다.');
    console.log("\uCD1D ".concat(results.length, "\uAC1C\uC758 \uC2A4\uD06C\uB9BD\uD2B8/onclick \uC774\uBCA4\uD2B8 \uCC98\uB9AC \uACB0\uACFC\uAC00 \uC788\uC2B5\uB2C8\uB2E4."));
    // URL 변경이 감지된 항목만 필터링
    var urlChanges = results.filter(function (r) { return r.urlChanged && r.detectedUrl; });
    console.log("URL \uBCC0\uACBD\uC774 \uAC10\uC9C0\uB41C \uD56D\uBAA9: ".concat(urlChanges.length, "\uAC1C"));
    if (urlChanges.length > 0) {
        console.log('감지된 URL 목록:');
        urlChanges.forEach(function (item) {
            console.log("- [".concat(item.sourceType, " #").concat(item.index, "] ").concat(item.detectedUrl));
        });
    }
});
