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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var fs = require('fs').promises;
var path = require('path');
var Logger = /** @class */ (function () {
    function Logger(options) {
        if (options === void 0) { options = {}; }
        this.options = __assign({ logToConsole: true, logToFile: false, logLevel: 'info', logFilePath: 'crawler.log' }, options);
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3,
            trace: 4
        };
        this.currentLevel = this.levels[this.options.logLevel] || this.levels.info;
    }
    Logger.prototype.log = function (level) {
        var messages = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            messages[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var levelNum, timestamp, formattedMessage, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        levelNum = this.levels[level] || this.levels.info;
                        if (levelNum > this.currentLevel)
                            return [2 /*return*/];
                        timestamp = new Date().toISOString();
                        formattedMessage = "[".concat(timestamp, "] [").concat(level.toUpperCase(), "] ").concat(messages.join(' '));
                        if (this.options.logToConsole) {
                            if (level === 'error') {
                                console.error(formattedMessage);
                            }
                            else if (level === 'warn') {
                                console.warn(formattedMessage);
                            }
                            else {
                                console.log(formattedMessage);
                            }
                        }
                        if (!this.options.logToFile) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs.appendFile(this.options.logFilePath, formattedMessage + '\n')];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("\uD30C\uC77C\uC5D0 \uB85C\uADF8\uB97C \uC4F0\uB294 \uC911 \uC624\uB958 \uBC1C\uC0DD: ".concat(error_1.message));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Logger.prototype.error = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        return this.log.apply(this, __spreadArray(['error'], messages, false));
    };
    Logger.prototype.warn = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        return this.log.apply(this, __spreadArray(['warn'], messages, false));
    };
    Logger.prototype.info = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        return this.log.apply(this, __spreadArray(['info'], messages, false));
    };
    Logger.prototype.debug = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        return this.log.apply(this, __spreadArray(['debug'], messages, false));
    };
    Logger.prototype.trace = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        return this.log.apply(this, __spreadArray(['trace'], messages, false));
    };
    // 배치 시작/완료 등의 이벤트에 대한 로깅 헬퍼 함수
    Logger.prototype.startTask = function (taskName) {
        return this.info("===== ".concat(taskName, " \uC2DC\uC791 ====="));
    };
    Logger.prototype.endTask = function (taskName) {
        return this.info("===== ".concat(taskName, " \uC644\uB8CC ====="));
    };
    // 진행 상태 표시 (프로그레스 바 등 포함 가능)
    Logger.prototype.progress = function (current, total, taskName) {
        if (taskName === void 0) { taskName = ''; }
        var percent = Math.round((current / total) * 100);
        return this.info("".concat(taskName, " \uC9C4\uD589 \uC911: ").concat(current, "/").concat(total, " (").concat(percent, "%)"));
    };
    return Logger;
}());
// 싱글톤 인스턴스 생성
var logger = new Logger();
module.exports = { Logger: Logger, logger: logger };
