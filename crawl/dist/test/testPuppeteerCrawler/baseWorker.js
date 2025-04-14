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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var puppeteer = require('puppeteer');
var fs = require('fs');
var _a = require('./worker-task'), OnClickWorker = _a.OnClickWorker, WorkerPool = _a.WorkerPool; // WorkerPool 클래스 가져오기
function scrollToBottom(page) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.evaluate(function () {
                        window.scrollTo(0, document.body.scrollHeight);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function infiniteScroll(page_1) {
    return __awaiter(this, arguments, void 0, function (page, maxScrolls) {
        var previousHeight, scrollCount, currentHeight;
        if (maxScrolls === void 0) { maxScrolls = 20; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previousHeight = 0;
                    scrollCount = 0;
                    _a.label = 1;
                case 1:
                    if (!(scrollCount < maxScrolls)) return [3 /*break*/, 6];
                    scrollCount++;
                    return [4 /*yield*/, page.evaluate('document.body.scrollHeight')];
                case 2:
                    // 이전 높이 저장
                    previousHeight = _a.sent();
                    // 맨 아래로 스크롤
                    return [4 /*yield*/, scrollToBottom(page)];
                case 3:
                    // 맨 아래로 스크롤
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, page.evaluate('document.body.scrollHeight')];
                case 5:
                    currentHeight = _a.sent();
                    console.log("\uC2A4\uD06C\uB864 ".concat(scrollCount, "/").concat(maxScrolls, " \uC218\uD589 \uC911... (\uB192\uC774: ").concat(previousHeight, " \u2192 ").concat(currentHeight, ")"));
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, scrollCount];
            }
        });
    });
}
/**
 * total_url.json 파일을 업데이트하는 함수
 * 기존 파일이 있으면 그 내용을 유지하고 새 URL을 추가합니다
 * @param {string} baseUrl 기본 URL
 * @param {Set<string>} newUrls 새로 발견된 URL 집합
 * @returns {Promise<number>} 최종 저장된 URL 수
 */
function updateTotalUrlsJson(baseUrl, newUrls) {
    return __awaiter(this, void 0, void 0, function () {
        var urlData, fileContent, existingData, urlArray, allUrlsSet, mergedUrls, updatedData, newUrlsCount;
        return __generator(this, function (_a) {
            urlData = {
                baseUrl: baseUrl,
                totalUrls: 0,
                urls: []
            };
            try {
                // 파일이 존재하는지 확인
                if (fs.existsSync('total_url.json')) {
                    fileContent = fs.readFileSync('total_url.json', 'utf8');
                    existingData = JSON.parse(fileContent);
                    // 기존 데이터가 유효한 형식인지 확인
                    if (existingData && Array.isArray(existingData.urls)) {
                        console.log("\uAE30\uC874 total_url.json \uD30C\uC77C\uC5D0\uC11C ".concat(existingData.urls.length, "\uAC1C\uC758 URL\uC744 \uB85C\uB4DC\uD588\uC2B5\uB2C8\uB2E4."));
                        urlData = existingData;
                    }
                }
            }
            catch (error) {
                console.error('total_url.json 파일 읽기 오류:', error);
                console.log('새 파일을 생성합니다.');
            }
            urlArray = Array.from(newUrls).filter(function (url) { return url && typeof url === 'string' && url.startsWith('http'); });
            allUrlsSet = new Set(__spreadArray(__spreadArray([], urlData.urls, true), urlArray, true));
            mergedUrls = Array.from(allUrlsSet).sort();
            updatedData = {
                baseUrl: baseUrl,
                totalUrls: mergedUrls.length,
                urls: mergedUrls
            };
            // 파일에 저장
            fs.writeFileSync('total_url.json', JSON.stringify(updatedData, null, 2));
            newUrlsCount = mergedUrls.length - urlData.urls.length;
            console.log("total_url.json \uD30C\uC77C\uC774 \uC5C5\uB370\uC774\uD2B8\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
            console.log("- \uAE30\uC874 URL: ".concat(urlData.urls.length, "\uAC1C"));
            console.log("- \uC0C8\uB85C \uCD94\uAC00\uB41C URL: ".concat(newUrlsCount, "\uAC1C"));
            console.log("- \uCD1D URL: ".concat(mergedUrls.length, "\uAC1C"));
            return [2 /*return*/, mergedUrls.length];
        });
    });
}
function extractAndExecuteScripts(url) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, result, allUrls, page, currentUrl_1, pageData, inlineScripts, _loop_1, i, filteredOnclicks_1, workerPool, tasks, onclickResults, urlChanges, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer.launch({
                        headless: true,
                        urls: []
                        // 브라우저 UI를 표시
                    })];
                case 1:
                    browser = _a.sent();
                    result = [];
                    allUrls = new Set();
                    // 초기 URL 추가
                    allUrls.add(url);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 13, 14, 15]);
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
                    return [4 /*yield*/, page.goto(url, {
                            waitUntil: 'networkidle2',
                            timeout: 60000
                        })];
                case 4:
                    _a.sent();
                    console.log("\uD398\uC774\uC9C0 \uB85C\uB4DC \uC644\uB8CC: ".concat(url));
                    currentUrl_1 = page.url();
                    console.log("\uD604\uC7AC URL: ".concat(currentUrl_1));
                    // 현재 URL이 초기 URL과 다르다면 추가
                    if (currentUrl_1 !== url) {
                        allUrls.add(currentUrl_1);
                    }
                    // 스크립트와 링크 추출
                    return [4 /*yield*/, infiniteScroll(page)];
                case 5:
                    // 스크립트와 링크 추출
                    _a.sent();
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
                case 6:
                    pageData = _a.sent();
                    console.log("".concat(pageData.scripts.length, "\uAC1C\uC758 \uC2A4\uD06C\uB9BD\uD2B8, ").concat(pageData.links.length, "\uAC1C\uC758 \uB9C1\uD06C, ").concat(pageData.onclicks.length, "\uAC1C\uC758 onclick \uC694\uC18C\uB97C \uCC3E\uC558\uC2B5\uB2C8\uB2E4."));
                    // 페이지 내 모든 링크 URL 수집
                    pageData.links.forEach(function (link) {
                        if (link.href && link.href.startsWith('http')) {
                            allUrls.add(link.href);
                        }
                    });
                    // 스크립트 소스 URL 수집
                    pageData.scripts.forEach(function (script) {
                        if (script.src && script.src.startsWith('http')) {
                            allUrls.add(script.src);
                        }
                    });
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
                                    return [4 /*yield*/, scriptPage.goto(currentUrl_1, { waitUntil: 'networkidle2' })];
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
                                        // 감지된 URL을 전체 URL 목록에 추가
                                        if (afterUrl.startsWith('http')) {
                                            allUrls.add(afterUrl);
                                        }
                                    }
                                    // 감지된 URL이 있으면 전체 URL 목록에 추가
                                    if (scriptResult.detectedUrl && scriptResult.detectedUrl.startsWith('http')) {
                                        allUrls.add(scriptResult.detectedUrl);
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
                    _a.label = 7;
                case 7:
                    if (!(i < inlineScripts.length)) return [3 /*break*/, 10];
                    return [5 /*yield**/, _loop_1(i)];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 7];
                case 10:
                    // 2. onclick 스크립트 처리
                    console.log("=== onclick 스크립트 처리 중... ===");
                    filteredOnclicks_1 = pageData.onclicks.filter(function (item) { return item.onclick; });
                    if (filteredOnclicks_1.length === 0) {
                        console.log("유효한 onclick 이벤트가 없습니다.");
                    }
                    else {
                        console.log("".concat(filteredOnclicks_1.length, "\uAC1C\uC758 \uC720\uD6A8\uD55C onclick \uC774\uBCA4\uD2B8\uB97C \uCC98\uB9AC\uD569\uB2C8\uB2E4."));
                    }
                    workerPool = new WorkerPool(5);
                    tasks = filteredOnclicks_1.map(function (item, idx) { return ({
                        id: idx + 1,
                        currentUrl: currentUrl_1,
                        onclickItem: item,
                        index: idx + 1,
                        total: filteredOnclicks_1.length,
                        headless: true, // UI 표시 여부
                        timeout: 3000, // onclick 실행 타임아웃
                        urlDetectionTimeout: 3000 // URL 변경 감지 타임아웃
                    }); });
                    console.log("".concat(tasks.length, "\uAC1C\uC758 onclick \uC791\uC5C5\uC744 \uBCD1\uB82C\uB85C \uCC98\uB9AC\uD569\uB2C8\uB2E4..."));
                    return [4 /*yield*/, workerPool.processTasks(tasks)];
                case 11:
                    onclickResults = _a.sent();
                    // 결과 처리
                    onclickResults.forEach(function (onclickResult) {
                        // 감지된 URL을 전체 URL 목록에 추가
                        if (onclickResult.urlChanged && onclickResult.detectedUrl &&
                            onclickResult.detectedUrl.startsWith('http')) {
                            allUrls.add(onclickResult.detectedUrl);
                        }
                        // 결과를 배열에 추가
                        result.push(onclickResult);
                    });
                    console.log("".concat(onclickResults.length, "\uAC1C\uC758 onclick \uC774\uBCA4\uD2B8 \uCC98\uB9AC\uAC00 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4."));
                    urlChanges = onclickResults.filter(function (r) { return r.urlChanged && r.detectedUrl; });
                    console.log("URL \uBCC0\uACBD\uC774 \uAC10\uC9C0\uB41C \uD56D\uBAA9: ".concat(urlChanges.length, "\uAC1C"));
                    // 결과를 파일에 저장
                    fs.writeFileSync('script_execution_results.json', JSON.stringify(result, null, 2));
                    console.log("\uC2E4\uD589 \uACB0\uACFC\uB97C script_execution_results.json \uD30C\uC77C\uC5D0 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4.");
                    return [4 /*yield*/, updateTotalUrlsJson(url, allUrls)];
                case 12:
                    _a.sent();
                    return [2 /*return*/, result];
                case 13:
                    error_1 = _a.sent();
                    console.error('전체 프로세스 오류:', error_1);
                    return [2 /*return*/, { error: error_1.toString() }];
                case 14:
                    // 브라우저 종료 전에 사용자에게 알림
                    console.log('모든 작업이 완료되었습니다. 브라우저를 검토한 후 아무 키나 눌러 종료하세요...');
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    });
}
// 함수 실행 예시
var targetUrl = process.argv[2] || 'https://recruit.navercorp.com/rcrt/list.do';
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
module.exports = { extractAndExecuteScripts: extractAndExecuteScripts };
