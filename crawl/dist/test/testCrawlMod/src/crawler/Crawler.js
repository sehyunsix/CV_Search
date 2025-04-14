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
// src/crawler/Crawler.js
var BrowserManager = require('./BrowserManager').BrowserManager;
var ElementExtractor = require('./ElementExtractor').ElementExtractor;
var ResultCollector = require('../utils/ResultCollector').ResultCollector;
var UrlTracker = require('../utils/UrlTracker').UrlTracker;
var InlineScriptRunner = require('../script-executor/InlineScriptRunner').InlineScriptRunner;
var OnClickRunner = require('../script-executor/OnClickRunner').OnClickRunner;
var Crawler = /** @class */ (function () {
    function Crawler(config) {
        if (config === void 0) { config = {}; }
        this.config = config;
        this.browserManager = new BrowserManager(config);
        this.elementExtractor = new ElementExtractor();
        this.resultCollector = new ResultCollector();
        this.urlTracker = new UrlTracker();
    }
    Crawler.prototype.crawl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var page, elements, inlineScriptRunner, inlineResults, onClickRunner, onClickResults, allResults, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, 10, 13]);
                        // 브라우저 설정
                        return [4 /*yield*/, this.browserManager.initialize()];
                    case 1:
                        // 브라우저 설정
                        _a.sent();
                        return [4 /*yield*/, this.browserManager.createPage()];
                    case 2:
                        page = _a.sent();
                        return [4 /*yield*/, page.goto(url)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.elementExtractor.extract(page)];
                    case 4:
                        elements = _a.sent();
                        inlineScriptRunner = new InlineScriptRunner(this.browserManager, this.urlTracker);
                        return [4 /*yield*/, inlineScriptRunner.execute(elements.inlineScripts, page.url())];
                    case 5:
                        inlineResults = _a.sent();
                        onClickRunner = new OnClickRunner(this.browserManager, this.urlTracker);
                        return [4 /*yield*/, onClickRunner.execute(elements.onclicks, page.url())];
                    case 6:
                        onClickResults = _a.sent();
                        allResults = __spreadArray(__spreadArray([], inlineResults, true), onClickResults, true);
                        return [4 /*yield*/, this.resultCollector.saveResults(allResults)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.resultCollector.saveUrls(this.urlTracker.getAllUrls())];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, allResults];
                    case 9:
                        error_1 = _a.sent();
                        console.error('크롤링 중 오류:', error_1);
                        return [2 /*return*/, { error: error_1.toString() }];
                    case 10:
                        if (!!this.config.keepBrowserOpen) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.browserManager.close()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    return Crawler;
}());
module.exports = { Crawler: Crawler };
