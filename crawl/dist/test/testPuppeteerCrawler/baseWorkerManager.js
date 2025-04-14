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
var fs = require('fs');
var path = require('path');
var puppeteer = require('puppeteer');
// baseWorker에서 extractAndExecuteScripts 함수 가져오기
var extractAndExecuteScripts = require('./baseWorker').extractAndExecuteScripts;
/**
 * URL에서 기본 도메인을 추출하는 함수
 * @param {string} urlString URL 문자열
 * @returns {string} 기본 도메인
 */
function extractBaseDomain(urlString) {
    try {
        var parsedUrl = new URL(urlString);
        return parsedUrl.hostname;
    }
    catch (error) {
        console.error("URL \uD30C\uC2F1 \uC624\uB958: ".concat(urlString), error);
        return null;
    }
}
/**
 * URL이 특정 도메인에 속하는지 확인하는 함수
 * @param {string} urlString 확인할 URL
 * @param {string} baseDomain 기본 도메인
 * @returns {boolean} 속하면 true, 아니면 false
 */
function isUrlFromDomain(urlString, baseUrl) {
    if (!urlString || !baseUrl)
        return false;
    try {
        // 단순히 URL 문자열에 기본 URL 문자열이 포함되어 있는지 확인
        return urlString.includes(baseUrl);
    }
    catch (error) {
        console.error('URL 확인 중 오류:', error);
        return false;
    }
}
/**
 * total_url.json 파일에서 URL을 읽어오는 함수
 * @param {string} defaultUrl 파일이 없거나 읽기 오류 시 사용할 기본 URL
 * @returns {Array<string>} URL 배열
 */
function loadUrlsFromFile(defaultUrl) {
    try {
        // 파일 존재 여부 확인
        if (!fs.existsSync('total_url.json')) {
            console.log('total_url.json 파일이 존재하지 않습니다. 기본 URL을 사용합니다.');
            return [defaultUrl];
        }
        // 파일 읽기
        var data = fs.readFileSync('total_url.json', 'utf8');
        var urlData = JSON.parse(data);
        // urls 배열 확인
        if (!urlData || !Array.isArray(urlData.urls) || urlData.urls.length === 0) {
            console.log('total_url.json에 유효한 URL이 없습니다. 기본 URL을 사용합니다.');
            return [defaultUrl];
        }
        // 유효한 URL만 필터링
        var validUrls = urlData.urls.filter(function (url) {
            return url && typeof url === 'string' && url.startsWith('http');
        });
        if (validUrls.length === 0) {
            console.log('total_url.json에 유효한 URL이 없습니다. 기본 URL을 사용합니다.');
            return [defaultUrl];
        }
        console.log("total_url.json\uC5D0\uC11C ".concat(validUrls.length, "\uAC1C\uC758 \uC720\uD6A8\uD55C URL\uC744 \uB85C\uB4DC\uD588\uC2B5\uB2C8\uB2E4."));
        return validUrls;
    }
    catch (error) {
        console.error('total_url.json 파일 읽기 오류:', error);
        console.log('기본 URL을 사용합니다.');
        return [defaultUrl];
    }
}
/**
 * URL 탐색 관리자 클래스
 * 여러 URL을 큐에 넣고 순차적으로 탐색합니다.
 */
var BaseWorkerManager = /** @class */ (function () {
    /**
     * 생성자
     * @param {Object} options 옵션
     * @param {string} options.startUrl 시작 URL
     * @param {number} options.maxUrls 최대 방문 URL 수 (기본값: 100)
     * @param {string} options.resultFile 결과 저장 파일 경로 (기본값: 'result.json')
     * @param {number} options.delayBetweenRequests 요청 사이 지연 시간(ms) (기본값: 2000)
     */
    function BaseWorkerManager(options) {
        if (options === void 0) { options = {}; }
        this.startUrl = options.startUrl || 'https://recruit.navercorp.com/rcrt/list.do';
        this.maxUrls = options.maxUrls || 100;
        this.resultFile = options.resultFile || 'result.json';
        this.delayBetweenRequests = options.delayBetweenRequests || 500;
        this.baseDomain = 'https://recruit.navercorp.com';
        // URL 로드
        var initialUrls = options.loadFromFile !== false ?
            loadUrlsFromFile(this.startUrl) : [this.startUrl];
        // 첫 번째 URL을 기본 URL로 설정
        this.startUrl = initialUrls[0];
        // 기본 도메인 추출
        // this.baseDomain = extractBaseDomain(this.startUrl);
        // console.log(`기본 도메인: ${this.baseDomain} (${this.startUrl} 기준)`);
        // 방문할 URL 큐 (전체 URL 리스트로 초기화)
        this.urlQueue = __spreadArray([], initialUrls, true);
        // 방문한 URL 집합
        this.visitedUrls = new Set();
        // 결과 저장 배열
        this.results = [];
        // 초기 결과 파일 로드 (있는 경우)
        this.loadResults();
        // 실행 상태
        this.isRunning = false;
        console.log("BaseWorkerManager \uCD08\uAE30\uD654 \uC644\uB8CC. \uC2DC\uC791 URL: ".concat(this.startUrl, ", \uCD5C\uB300 \uBC29\uBB38 URL: ").concat(this.maxUrls));
    }
    /**
     * 기존 결과 파일이 있으면 로드
     */
    BaseWorkerManager.prototype.loadResults = function () {
        var _this = this;
        try {
            if (fs.existsSync(this.resultFile)) {
                var data = fs.readFileSync(this.resultFile, 'utf8');
                this.results = JSON.parse(data);
                // 이미 방문한 URL을 visitedUrls에 추가
                this.results.forEach(function (result) {
                    if (result.url) {
                        _this.visitedUrls.add(result.url);
                    }
                });
                console.log("\uAE30\uC874 \uACB0\uACFC \uD30C\uC77C\uC5D0\uC11C ".concat(this.results.length, "\uAC1C \uD56D\uBAA9\uACFC ").concat(this.visitedUrls.size, "\uAC1C \uBC29\uBB38 URL \uB85C\uB4DC\uB428"));
            }
        }
        catch (error) {
            console.error('결과 파일 로드 중 오류:', error);
            this.results = [];
        }
    };
    /**
     * 결과를 JSON 파일에 저장
     */
    BaseWorkerManager.prototype.saveResults = function () {
        try {
            fs.writeFileSync(this.resultFile, JSON.stringify(this.results, null, 2));
            console.log("\uACB0\uACFC\uAC00 ".concat(this.resultFile, "\uC5D0 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uCD1D ").concat(this.results.length, "\uAC1C \uD56D\uBAA9"));
        }
        catch (error) {
            console.error('결과 저장 중 오류:', error);
        }
    };
    /**
     * URL을 큐에 추가 (이미 방문한 URL은 추가하지 않음)
     * @param {string|Array<string>} urls 추가할 URL 또는 URL 배열
     */
    BaseWorkerManager.prototype.addUrlToQueue = function (urls) {
        var _this = this;
        if (!urls)
            return 0;
        var urlArray = Array.isArray(urls) ? urls : [urls];
        var addedCount = 0;
        urlArray.forEach(function (url) {
            // 유효한 URL이며 아직 방문하지 않았고 큐에 없는 경우에만 추가
            if (url && typeof url === 'string' && url.startsWith('http') &&
                !_this.visitedUrls.has(url) && !_this.urlQueue.includes(url)) {
                _this.urlQueue.push(url);
                addedCount++;
            }
        });
        if (addedCount > 0) {
            console.log("".concat(addedCount, "\uAC1C\uC758 \uC0C8 URL\uC774 \uD050\uC5D0 \uCD94\uAC00\uB428. \uD604\uC7AC \uD050 \uD06C\uAE30: ").concat(this.urlQueue.length));
        }
        return addedCount;
    };
    /**
     * 페이지의 내용을 추출
     * @param {Page} page Puppeteer 페이지 객체
     * @returns {Promise<Object>} 페이지 내용 객체
     */
    BaseWorkerManager.prototype.extractPageContent = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var used;
            return __generator(this, function (_a) {
                used = process.memoryUsage();
                return [2 /*return*/, page.evaluate(function () {
                        function extractTextFromNode(node) {
                            // 텍스트 노드인 경우
                            if (node.nodeType === Node.TEXT_NODE) {
                                return node.textContent.trim();
                            }
                            // 특정 태그는 건너뛰기 (스크립트, 스타일, 코드, noscript 등)
                            if (node.nodeName === 'SCRIPT' ||
                                node.nodeName === 'STYLE' ||
                                node.nodeName === 'CODE' ||
                                node.nodeName === 'NOSCRIPT' ||
                                node.nodeName === 'SVG') {
                                return '';
                            }
                            // 노드가 보이지 않는 경우 건너뛰기
                            try {
                                var style = window.getComputedStyle(node);
                                if (style && (style.display === 'none' || style.visibility === 'hidden')) {
                                    return '';
                                }
                            }
                            catch (e) {
                                // getComputedStyle은 요소 노드에서만 작동
                            }
                            // 자식 노드 처리
                            var text = '';
                            var childNodes = node.childNodes;
                            for (var i = 0; i < childNodes.length; i++) {
                                text += extractTextFromNode(childNodes[i]) + ' ';
                            }
                            return text.trim();
                        }
                        // 타이틀 추출
                        var title = document.title || '';
                        // 메타 태그 추출
                        var meta = {};
                        var metaTags = document.querySelectorAll('meta');
                        metaTags.forEach(function (tag) {
                            var name = tag.getAttribute('name') || tag.getAttribute('property');
                            var content = tag.getAttribute('content');
                            if (name && content) {
                                meta[name] = content;
                            }
                        });
                        // 주요 텍스트 내용 추출
                        var mainText = extractTextFromNode(document.body);
                        return {
                            title: title,
                            meta: meta,
                            mainText: mainText
                        };
                    })];
            });
        });
    };
    /**
     * 단일 URL 방문 및 처리
     * @param {string} url 방문할 URL
     */
    BaseWorkerManager.prototype.visitUrl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var browser, page, finalUrl, pageContent, pageInfo, workerResults, urlData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("=== URL \uBC29\uBB38 \uC2DC\uC791: ".concat(url, " ==="));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        // URL이 이미 방문된 경우
                        if (this.visitedUrls.has(url)) {
                            console.log("URL ".concat(url, "\uB294 \uC774\uBBF8 \uBC29\uBB38\uD588\uC2B5\uB2C8\uB2E4. \uAC74\uB108\uB701\uB2C8\uB2E4."));
                            return [2 /*return*/];
                        }
                        if (!isUrlFromDomain(url, this.baseDomain)) {
                            console.log("URL ".concat(url, "\uC740(\uB294) \uAE30\uBCF8 \uB3C4\uBA54\uC778(").concat(this.baseDomain, ")\uC5D0 \uC18D\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uAC74\uB108\uB701\uB2C8\uB2E4."));
                            return [2 /*return*/];
                        }
                        // URL을 방문했다고 표시
                        this.visitedUrls.add(url);
                        return [4 /*yield*/, puppeteer.launch({ headless: true })];
                    case 2:
                        browser = _a.sent();
                        return [4 /*yield*/, browser.newPage()];
                    case 3:
                        page = _a.sent();
                        // 페이지 로드
                        return [4 /*yield*/, page.goto(url, {
                                waitUntil: 'networkidle2',
                                timeout: 60000
                            })];
                    case 4:
                        // 페이지 로드
                        _a.sent();
                        finalUrl = page.url();
                        return [4 /*yield*/, this.extractPageContent(page)];
                    case 5:
                        pageContent = _a.sent();
                        pageInfo = {
                            url: finalUrl,
                            originalUrl: url !== finalUrl ? url : undefined,
                            title: pageContent.title,
                            meta: pageContent.meta,
                            text: pageContent.mainText,
                            visitedAt: new Date().toISOString()
                        };
                        // 결과 배열에 추가
                        this.results.push(pageInfo);
                        // 현재 결과 저장
                        this.saveResults();
                        // 브라우저 닫기
                        return [4 /*yield*/, browser.close()];
                    case 6:
                        // 브라우저 닫기
                        _a.sent();
                        // baseWorker 실행하여 스크립트/onclick 분석 및 새 URL 발견
                        console.log("".concat(url, " \uD398\uC774\uC9C0\uC5D0 \uB300\uD574 \uC2A4\uD06C\uB9BD\uD2B8/onclick \uBD84\uC11D \uC2E4\uD589..."));
                        return [4 /*yield*/, extractAndExecuteScripts(url)];
                    case 7:
                        workerResults = _a.sent();
                        if (workerResults && !workerResults.error) {
                            // total_url.json 파일에서 발견된 URL 읽기
                            try {
                                urlData = JSON.parse(fs.readFileSync('total_url.json', 'utf8'));
                                if (urlData && Array.isArray(urlData.urls)) {
                                    console.log("".concat(urlData.urls.length, "\uAC1C\uC758 URL\uC744 total_url.json\uC5D0\uC11C \uBC1C\uACAC\uD588\uC2B5\uB2C8\uB2E4."));
                                    this.addUrlToQueue(urlData.urls);
                                }
                            }
                            catch (error) {
                                console.error('total_url.json 파일 읽기 오류:', error);
                            }
                        }
                        else {
                            console.log('스크립트/onclick 분석 중 오류 발생:', (workerResults === null || workerResults === void 0 ? void 0 : workerResults.error) || '알 수 없는 오류');
                        }
                        console.log("=== URL \uBC29\uBB38 \uC644\uB8CC: ".concat(url, " ==="));
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _a.sent();
                        console.error("URL ".concat(url, " \uBC29\uBB38 \uC911 \uC624\uB958:"), error_1);
                        // 오류 정보도 결과에 기록
                        this.results.push({
                            url: url,
                            error: error_1.toString(),
                            visitedAt: new Date().toISOString()
                        });
                        // 오류가 있어도 결과 저장
                        this.saveResults();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 큐에 있는 모든 URL을 방문
     */
    BaseWorkerManager.prototype.processQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isRunning) {
                            console.log('이미 실행 중입니다.');
                            return [2 /*return*/];
                        }
                        this.isRunning = true;
                        console.log('URL 큐 처리 시작...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, 8, 9]);
                        _a.label = 2;
                    case 2:
                        if (!(this.urlQueue.length > 0 && this.visitedUrls.size < this.maxUrls)) return [3 /*break*/, 6];
                        url = this.urlQueue.shift();
                        return [4 /*yield*/, this.visitUrl(url)];
                    case 3:
                        _a.sent();
                        if (!(this.urlQueue.length > 0)) return [3 /*break*/, 5];
                        console.log("\uB2E4\uC74C URL \uCC98\uB9AC \uC804 ".concat(this.delayBetweenRequests, "ms \uB300\uAE30..."));
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, _this.delayBetweenRequests); })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 2];
                    case 6:
                        console.log("\uD050 \uCC98\uB9AC \uC644\uB8CC. \uCD1D ".concat(this.visitedUrls.size, "\uAC1C URL \uBC29\uBB38, \uB0A8\uC740 \uD050 \uD06C\uAE30: ").concat(this.urlQueue.length));
                        if (this.visitedUrls.size >= this.maxUrls) {
                            console.log("\uCD5C\uB300 URL \uC218(".concat(this.maxUrls, ")\uC5D0 \uB3C4\uB2EC\uD588\uC2B5\uB2C8\uB2E4."));
                        }
                        return [3 /*break*/, 9];
                    case 7:
                        error_2 = _a.sent();
                        console.error('큐 처리 중 오류:', error_2);
                        return [3 /*break*/, 9];
                    case 8:
                        this.isRunning = false;
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * total_url.json 파일 업데이트
     * 현재 큐에 있는 URL과 이미 방문한 URL을 포함
     */
    BaseWorkerManager.prototype.updateTotalUrls = function () {
        try {
            // 모든 URL 수집 (방문한 URL + 큐에 있는 URL)
            var allUrls = new Set(__spreadArray(__spreadArray([], this.visitedUrls, true), this.urlQueue, true));
            var urlData = {
                baseUrl: this.startUrl,
                totalUrls: allUrls.size,
                visitedUrls: this.visitedUrls.size,
                queuedUrls: this.urlQueue.length,
                urls: Array.from(allUrls).sort()
            };
            fs.writeFileSync('total_url.json', JSON.stringify(urlData, null, 2));
            console.log("total_url.json \uD30C\uC77C\uC774 \uC5C5\uB370\uC774\uD2B8\uB418\uC5C8\uC2B5\uB2C8\uB2E4. (\uCD1D ".concat(allUrls.size, "\uAC1C URL)"));
        }
        catch (error) {
            console.error('total_url.json 파일 업데이트 중 오류:', error);
        }
    };
    /**
     * 관리자 실행
     */
    BaseWorkerManager.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('BaseWorkerManager 실행...');
                        return [4 /*yield*/, this.processQueue()];
                    case 1:
                        _a.sent();
                        console.log('BaseWorkerManager 실행 완료');
                        return [2 /*return*/];
                }
            });
        });
    };
    return BaseWorkerManager;
}());
// 명령줄 인수에서 시작 URL 가져오기
var startUrl = process.argv[2] || 'https://recruit.navercorp.com/rcrt/list.do';
// 관리자 인스턴스 생성
var manager = new BaseWorkerManager({
    startUrl: startUrl,
    maxUrls: 200, // 최대 50개 URL만 방문
    delayBetweenRequests: 1000 // 요청 사이 3초 대기
});
// 관리자 실행
manager.run().then(function () {
    manager.saveResults();
    manager.updateTotalUrls();
    console.log('===== 크롤링 요약 =====');
    console.log("- \uBC29\uBB38\uD55C URL: ".concat(manager.visitedUrls.size, "\uAC1C"));
    console.log("- \uB0A8\uC740 \uD050 \uD06C\uAE30: ".concat(manager.urlQueue.length, "\uAC1C"));
    console.log("- \uACB0\uACFC \uD56D\uBAA9 \uC218: ".concat(manager.results.length, "\uAC1C"));
    console.log('모든 작업이 완료되었습니다.');
    process.exit(0);
}).catch(function (error) {
    console.error('실행 중 오류가 발생했습니다:', error);
    process.exit(1);
});
