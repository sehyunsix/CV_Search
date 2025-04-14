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
var WorkerTask = require('../worker/worker-task').WorkerTask;
var CrawlerManager = /** @class */ (function () {
    function CrawlerManager(options) {
        if (options === void 0) { options = {}; }
        this.options = __assign({ headless: true, maxConcurrency: 5, outputDir: '.', scriptTimeout: 30000, maxRetries: 2 }, options);
        this.browser = null;
        this.urlCollector = new URLCollector();
        this.resultManager = new ResultManager({ outputDir: this.options.outputDir });
        this.workerPool = new WorkerPool(this.options.maxConcurrency);
        this.results = [];
    }
    // [기존 코드...]
    CrawlerManager.prototype.processInlineScripts = function (currentUrl, inlineScripts) {
        return __awaiter(this, void 0, void 0, function () {
            var tasks, scriptResults, stats;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!inlineScripts || inlineScripts.length === 0) {
                            console.log("인라인 스크립트가 없습니다.");
                            return [2 /*return*/, []];
                        }
                        console.log("=== 인라인 스크립트 처리 중... ===");
                        tasks = inlineScripts.map(function (script, index) {
                            return WorkerTask.createScriptTask({
                                index: index + 1,
                                content: script.content,
                                url: currentUrl,
                                total: inlineScripts.length,
                                timeout: _this.options.scriptTimeout
                            });
                        });
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
                        stats = this.workerPool.getPerformanceStats();
                        console.log("\uC778\uB77C\uC778 \uC2A4\uD06C\uB9BD\uD2B8 \uC2E4\uD589 \uD1B5\uACC4: ".concat(tasks.length, "\uAC1C \uC791\uC5C5, ").concat(stats.completed, "\uAC1C \uC644\uB8CC, ").concat(stats.failed, "\uAC1C \uC2E4\uD328"));
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
                        tasks = filteredOnclicks.map(function (item, index) {
                            return WorkerTask.createOnclickTask({
                                index: index + 1,
                                content: item.onclick,
                                elementInfo: {
                                    tagName: item.tagName,
                                    id: item.id,
                                    className: item.className,
                                    text: item.text
                                },
                                url: currentUrl,
                                total: filteredOnclicks.length,
                                timeout: _this.options.scriptTimeout
                            });
                        });
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
    return CrawlerManager;
}());
module.exports = { CrawlerManager: CrawlerManager };
