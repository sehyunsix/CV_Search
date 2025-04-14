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
function extractScriptsAndUrls(url) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, result, page, currentUrl, scriptData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer.launch({ headless: "new" })];
                case 1:
                    browser = _a.sent();
                    result = null;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, 7, 9]);
                    return [4 /*yield*/, browser.newPage()];
                case 3:
                    page = _a.sent();
                    return [4 /*yield*/, page.goto(url, { waitUntil: 'networkidle2' })];
                case 4:
                    _a.sent();
                    console.log("\uD398\uC774\uC9C0 \uB85C\uB4DC \uC644\uB8CC: ".concat(url));
                    currentUrl = page.url();
                    return [4 /*yield*/, page.evaluate(function () {
                            // 모든 스크립트 태그 수집
                            var scriptElements = Array.from(document.querySelectorAll('script'));
                            // 인라인 스크립트와 외부 스크립트 분류
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
                                    text: link.textContent.trim() || '[No Text]'
                                };
                            });
                            return {
                                scripts: scripts,
                                links: links
                            };
                        })];
                case 5:
                    scriptData = _a.sent();
                    // 결과 객체 구성
                    result = {
                        originalUrl: url,
                        finalUrl: currentUrl,
                        scripts: scriptData.scripts,
                        links: scriptData.links
                    };
                    // 결과를 파일로 저장
                    fs.writeFileSync('page_data.json', JSON.stringify(result, null, 2));
                    console.log('결과가 page_data.json 파일에 저장되었습니다.');
                    return [3 /*break*/, 9];
                case 6:
                    error_1 = _a.sent();
                    console.error('오류 발생:', error_1);
                    return [3 /*break*/, 9];
                case 7: 
                // 브라우저 종료
                return [4 /*yield*/, browser.close()];
                case 8:
                    // 브라우저 종료
                    _a.sent();
                    console.log('브라우저 종료됨');
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/, result];
            }
        });
    });
}
// 사용 예:
var targetUrl = 'https://recruit.snowcorp.com/rcrt/list.do'; // 분석할 웹사이트 URL
extractScriptsAndUrls(targetUrl).then(function (result) {
    if (result) {
        console.log('작업 완료!');
        console.log("\uC2A4\uD06C\uB9BD\uD2B8 ".concat(result.scripts.length, "\uAC1C, \uB9C1\uD06C ").concat(result.links.length, "\uAC1C \uCD94\uCD9C \uC644\uB8CC"));
    }
    else {
        console.log('작업이 실패했습니다.');
    }
});
