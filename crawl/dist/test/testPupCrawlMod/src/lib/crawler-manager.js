"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var Browser = require('./browser').Browser;
var PageExtractor = require('./page-extractor').PageExtractor;
var ScriptExecutor = require('./script-executor').ScriptExecutor;
var ResultManager = require('./result-manager').ResultManager;
var URLCollector = require('./url-collector').URLCollector;
var WorkerPool = require('../worker/worker-pool').WorkerPool;
var CrawlerManager = /** @class */ (function () {
    function CrawlerManager(options) {
        if (options === void 0) { options = {}; }
        this.options = __assign({ headless: true, maxConcurrency: 5, outputDir: '.' }, options);
        this.browser = null;
        this.urlCollector = new URLCollector();
        this.resultManager = new ResultManager({ outputDir: this.options.outputDir });
        this.workerPool = new WorkerPool(this.options.maxConcurrency);
        this.results = [];
    }
    CrawlerManager.prototype.crawl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, currentUrl, pageExtractor, pageData, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, Browser.create(this.options)];
                    case 1:
                        _a.browser = _b.sent();
                        this.urlCollector.add(url);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 10, , 11]);
                        return [4 /*yield*/, this.browser.newPage()];
                    case 3:
                        page = _b.sent();
                        return [4 /*yield*/, page.goto(url, { waitUntil: 'networkidle2' })];
                    case 4:
                        _b.sent();
                        console.log("\uD398\uC774\uC9C0 \uB85C\uB4DC \uC644\uB8CC: ".concat(url));
                        currentUrl = page.url();
                        console.log("\uD604\uC7AC URL: ".concat(currentUrl));
                        this.urlCollector.add(currentUrl);
                        pageExtractor = new PageExtractor(page);
                        return [4 /*yield*/, pageExtractor.extract()];
                    case 5:
                        pageData = _b.sent();
                        console.log("".concat(pageData.scripts.length, "\uAC1C\uC758 \uC2A4\uD06C\uB9BD\uD2B8, ").concat(pageData.links.length, "\uAC1C\uC758 \uB9C1\uD06C, ").concat(pageData.onclicks.length, "\uAC1C\uC758 onclick \uC694\uC18C\uB97C \uCC3E\uC558\uC2B5\uB2C8\uB2E4."));
                        // URL 수집
                        this.collectUrls(pageData);
                        // 스크립트 및 onclick 이벤트 처리
                        return [4 /*yield*/, this.processInlineScripts(currentUrl, pageData.inlineScripts)];
                    case 6:
                        // 스크립트 및 onclick 이벤트 처리
                        _b.sent();
                        return [4 /*yield*/, this.processOnclickEvents(currentUrl, pageData.onclicks)];
                    case 7:
                        _b.sent();
                        // 결과 저장
                        return [4 /*yield*/, this.resultManager.saveResults(this.results, 'script_execution_results.json')];
                    case 8:
                        // 결과 저장
                        _b.sent();
                        return [4 /*yield*/, this.resultManager.saveUrls(this.urlCollector.getUrls(), 'total_url.json', url)];
                    case 9:
                        _b.sent();
                        return [2 /*return*/, this.results];
                    case 10:
                        error_1 = _b.sent();
                        console.error('크롤링 중 오류 발생:', error_1);
                        throw error_1;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    CrawlerManager.prototype.processInlineScripts = function (currentUrl, inlineScripts) {
        return __awaiter(this, void 0, void 0, function () {
            var tasks, scriptResults;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!inlineScripts || inlineScripts.length === 0) {
                            console.log("인라인 스크립트가 없습니다.");
                            return [2 /*return*/, []];
                        }
                        console.log("=== 인라인 스크립트 처리 중... ===");
                        tasks = inlineScripts.map(function (script, index) { return ({
                            type: 'inline-script',
                            index: index + 1,
                            content: script.content,
                            url: currentUrl,
                            total: inlineScripts.length
                        }); });
                        return [4 /*yield*/, this.workerPool.processTasks(tasks, function (task, worker) { return __awaiter(_this, void 0, void 0, function () {
                                var executor, result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            console.log("\uC778\uB77C\uC778 \uC2A4\uD06C\uB9BD\uD2B8 ".concat(task.index, "/").concat(task.total, " \uC2E4\uD589 \uC911..."));
                                            executor = new ScriptExecutor(worker.page, task.url);
                                            return [4 /*yield*/, executor.executeScript(task.content, task.index)];
                                        case 1:
                                            result = _a.sent();
                                            console.log("\uC2A4\uD06C\uB9BD\uD2B8 ".concat(task.index, " \uC2E4\uD589 \uACB0\uACFC:"), result.success ? (result.urlChanged ? '페이지 이동 감지' : '정상 실행') : '실패');
                                            return [2 /*return*/, result];
                                    }
                                });
                            }); })];
                    case 1:
                        scriptResults = _a.sent();
                        // 결과 처리
                        scriptResults.forEach(function (result) {
                            _this.handleScriptResult(result);
                            _this.results.push(result);
                        });
                        return [2 /*return*/, scriptResults];
                }
            });
        });
    };
    CrawlerManager.prototype.processOnclickEvents = function (currentUrl, onclicks) {
        return __awaiter(this, void 0, void 0, function () {
            var filteredOnclicks, tasks, onclickResults;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!onclicks || onclicks.length === 0) {
                            console.log("onclick 이벤트가 없습니다.");
                            return [2 /*return*/, []];
                        }
                        console.log("=== onclick 스크립트 처리 중... ===");
                        filteredOnclicks = onclicks.filter(function (item) { return item.onclick; });
                        if (filteredOnclicks.length === 0) {
                            console.log("유효한 onclick 이벤트가 없습니다.");
                            return [2 /*return*/, []];
                        }
                        tasks = filteredOnclicks.map(function (item, index) { return ({
                            type: 'onclick',
                            index: index + 1,
                            content: item.onclick,
                            elementInfo: {
                                tagName: item.tagName,
                                id: item.id,
                                className: item.className,
                                text: item.text
                            },
                            url: currentUrl,
                            total: filteredOnclicks.length
                        }); });
                        return [4 /*yield*/, this.workerPool.processTasks(tasks, function (task, worker) { return __awaiter(_this, void 0, void 0, function () {
                                var executor, result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            console.log("onclick \uC2A4\uD06C\uB9BD\uD2B8 ".concat(task.index, "/").concat(task.total, " \uC2E4\uD589 \uC911..."));
                                            executor = new ScriptExecutor(worker.page, task.url);
                                            return [4 /*yield*/, executor.executeOnclick(task.content, task.elementInfo, task.index)];
                                        case 1:
                                            result = _a.sent();
                                            console.log("onclick ".concat(task.index, " \uC2E4\uD589 \uACB0\uACFC:"), result.success ? (result.urlChanged ? '페이지 이동 감지' : '정상 실행') : '실패');
                                            return [2 /*return*/, result];
                                    }
                                });
                            }); })];
                    case 1:
                        onclickResults = _a.sent();
                        // 결과 처리
                        onclickResults.forEach(function (result) {
                            _this.handleScriptResult(result);
                            _this.results.push(result);
                        });
                        return [2 /*return*/, onclickResults];
                }
            });
        });
    };
    CrawlerManager.prototype.handleScriptResult = function (result) {
        if (result.detectedUrl && result.detectedUrl.startsWith('http')) {
            this.urlCollector.add(result.detectedUrl);
        }
    };
    CrawlerManager.prototype.collectUrls = function (pageData) {
        // 링크 URL 수집
        var linkUrlsAdded = this.urlCollector.addFromLinks(pageData.links);
        // 스크립트 소스 URL 수집
        var scriptUrlsAdded = this.urlCollector.addFromScripts(pageData.scripts);
        console.log("\uC218\uC9D1\uB41C URL: \uB9C1\uD06C ".concat(linkUrlsAdded, "\uAC1C, \uC2A4\uD06C\uB9BD\uD2B8 \uC18C\uC2A4 ").concat(scriptUrlsAdded, "\uAC1C"));
    };
    CrawlerManager.prototype.getURLChanges = function () {
        return this.resultManager.getUrlChanges(this.results);
    };
    CrawlerManager.prototype.getUrlCollector = function () {
        return this.urlCollector;
    };
    CrawlerManager.prototype.getResults = function () {
        return this.results;
    };
    CrawlerManager.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.browser) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.browser.close()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.workerPool) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.workerPool.close()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        console.log('브라우저와 워커 풀이 종료되었습니다.');
                        return [2 /*return*/];
                }
            });
        });
    };
    return CrawlerManager;
}());
module.exports = { CrawlerManager: CrawlerManager };
