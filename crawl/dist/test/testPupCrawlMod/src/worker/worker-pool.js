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
var Worker = require('worker_threads').Worker;
var path = require('path');
var os = require('os');
var puppeteer = require('puppeteer');
var WorkerPool = /** @class */ (function () {
    function WorkerPool(maxWorkers) {
        if (maxWorkers === void 0) { maxWorkers = 5; }
        this.maxWorkers = Math.min(maxWorkers, os.cpus().length);
        this.workers = [];
        this.taskQueue = [];
        this.activeWorkers = 0;
    }
    WorkerPool.prototype.processTasks = function (tasks, processor) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var results = new Array(tasks.length);
                        var completed = 0;
                        var started = 0;
                        var checkComplete = function () {
                            if (completed === tasks.length) {
                                resolve(results);
                            }
                        };
                        var startNextTask = function () {
                            if (started >= tasks.length)
                                return;
                            if (_this.activeWorkers >= _this.maxWorkers)
                                return;
                            var taskIndex = started++;
                            var task = tasks[taskIndex];
                            _this.activeWorkers++;
                            _this.getWorker().then(function (worker) {
                                processor(task, worker).then(function (result) {
                                    results[taskIndex] = result;
                                    _this.activeWorkers--;
                                    completed++;
                                    _this.releaseWorker(worker);
                                    startNextTask();
                                    checkComplete();
                                }).catch(function (error) {
                                    results[taskIndex] = {
                                        error: error.toString(),
                                        success: false,
                                        index: task.index,
                                        sourceType: task.type
                                    };
                                    _this.activeWorkers--;
                                    completed++;
                                    _this.releaseWorker(worker);
                                    startNextTask();
                                    checkComplete();
                                });
                            });
                            // 큐에 작업이 있고 활성 워커가 최대치보다 적으면 다음 작업 시작
                            if (_this.activeWorkers < _this.maxWorkers) {
                                setTimeout(startNextTask, 0);
                            }
                        };
                        // 최초 작업 시작
                        for (var i = 0; i < _this.maxWorkers && i < tasks.length; i++) {
                            startNextTask();
                        }
                    })];
            });
        });
    };
    WorkerPool.prototype.getWorker = function () {
        return __awaiter(this, void 0, void 0, function () {
            var worker_1, page;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.workers.length < this.maxWorkers)) return [3 /*break*/, 3];
                        return [4 /*yield*/, puppeteer.launch({ headless: true })];
                    case 1:
                        worker_1 = _a.sent();
                        return [4 /*yield*/, worker_1.newPage()];
                    case 2:
                        page = _a.sent();
                        return [2 /*return*/, { worker: worker_1, page: page }];
                    case 3: return [2 /*return*/, new Promise(function (resolve) {
                            _this.taskQueue.push(resolve);
                        })];
                }
            });
        });
    };
    WorkerPool.prototype.releaseWorker = function (worker) {
        if (this.taskQueue.length > 0) {
            var resolve = this.taskQueue.shift();
            resolve(worker);
        }
        else {
            this.workers.push(worker);
        }
    };
    WorkerPool.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(this.workers.map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                            var worker = _b.worker;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, worker.close()];
                                    case 1:
                                        _c.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                    case 1:
                        _a.sent();
                        this.workers = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    return WorkerPool;
}());
module.exports = { WorkerPool: WorkerPool };
