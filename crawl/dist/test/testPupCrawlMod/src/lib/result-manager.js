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
var fs = require('fs').promises;
var ResultManager = /** @class */ (function () {
    function ResultManager(options) {
        if (options === void 0) { options = {}; }
        this.outputDir = options.outputDir || '.';
    }
    ResultManager.prototype.saveResults = function (results_1) {
        return __awaiter(this, arguments, void 0, function (results, filename) {
            var filePath;
            if (filename === void 0) { filename = 'script_execution_results.json'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = "".concat(this.outputDir, "/").concat(filename);
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(results, null, 2))];
                    case 1:
                        _a.sent();
                        console.log("\uC2E4\uD589 \uACB0\uACFC\uB97C ".concat(filePath, " \uD30C\uC77C\uC5D0 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4."));
                        return [2 /*return*/, filePath];
                }
            });
        });
    };
    ResultManager.prototype.saveUrls = function (urls_1) {
        return __awaiter(this, arguments, void 0, function (urls, filename, baseUrl) {
            var filePath, urlArray, urlData;
            if (filename === void 0) { filename = 'total_url.json'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = "".concat(this.outputDir, "/").concat(filename);
                        urlArray = Array.from(urls).filter(function (url) { return url && typeof url === 'string' && url.startsWith('http'); });
                        urlData = {
                            baseUrl: baseUrl,
                            totalUrls: urlArray.length,
                            urls: urlArray.sort()
                        };
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(urlData, null, 2))];
                    case 1:
                        _a.sent();
                        console.log("\uCD1D ".concat(urlArray.length, "\uAC1C\uC758 URL\uC744 ").concat(filePath, " \uD30C\uC77C\uC5D0 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4."));
                        return [2 /*return*/, filePath];
                }
            });
        });
    };
    ResultManager.prototype.getUrlChanges = function (results) {
        return results.filter(function (r) { return r.urlChanged && r.detectedUrl; });
    };
    ResultManager.prototype.summarizeResults = function (results) {
        var summary = {
            total: results.length,
            successful: results.filter(function (r) { return r.success; }).length,
            failed: results.filter(function (r) { return !r.success; }).length,
            urlChanges: this.getUrlChanges(results).length
        };
        return summary;
    };
    return ResultManager;
}());
module.exports = { ResultManager: ResultManager };
