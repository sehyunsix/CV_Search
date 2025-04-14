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
var fs = require('fs');
var path = require('path');
// 기본 설정
var defaultConfig = {
    browser: {
        headless: true,
        slowMo: 0,
        defaultViewport: null
    },
    crawler: {
        maxConcurrency: 5,
        timeout: 30000,
        waitUntil: 'networkidle2'
    },
    output: {
        dir: '.',
        resultFile: 'script_execution_results.json',
        urlFile: 'total_url.json'
    },
    script: {
        timeout: 3000,
        includeExternal: false
    }
};
// 설정 파일 로드
function loadConfig(configPath) {
    try {
        if (fs.existsSync(configPath)) {
            var configData = fs.readFileSync(configPath, 'utf8');
            var userConfig = JSON.parse(configData);
            return mergeConfigs(defaultConfig, userConfig);
        }
    }
    catch (error) {
        console.warn("\uC124\uC815 \uD30C\uC77C\uC744 \uB85C\uB4DC\uD558\uB294 \uC911 \uC624\uB958 \uBC1C\uC0DD: ".concat(error.message));
    }
    return defaultConfig;
}
// 설정 병합
function mergeConfigs(defaultConfig, userConfig) {
    var result = __assign({}, defaultConfig);
    for (var key in userConfig) {
        if (typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key]) &&
            typeof result[key] === 'object' && !Array.isArray(result[key])) {
            result[key] = mergeConfigs(result[key], userConfig[key]);
        }
        else {
            result[key] = userConfig[key];
        }
    }
    return result;
}
// 설정 파일 경로
var configPath = path.join(process.cwd(), 'crawler.config.json');
var config = loadConfig(configPath);
module.exports = { config: config };
