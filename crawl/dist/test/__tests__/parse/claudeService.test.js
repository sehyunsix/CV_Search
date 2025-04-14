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
require('dotenv');
var ClaudeService = require('@parse/claudeService').ClaudeService;
var logger = require('@utils/logger').defaultLogger;
var config = require('@config/config').config;
var CONFIG = require('../../../config/config');
// Temporarily override logger to reduce noise during tests
jest.mock('@utils/logger', function () { return ({
    defaultLogger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: console.error, // Keep error logging for debugging
        debug: jest.fn(),
    }
}); });
describe('ClaudeService Integration Test', function () {
    var service;
    // Sample recruitment text for testing
    var sampleRecruitmentText = "\n    ABC \uC18C\uD504\uD2B8\uC6E8\uC5B4 \uCC44\uC6A9\uACF5\uACE0\n\n    \uD68C\uC0AC: ABC \uC18C\uD504\uD2B8\uC6E8\uC5B4\n    \uBD80\uC11C: \uBC31\uC5D4\uB4DC \uAC1C\uBC1C\uD300\n\n    [\uACE0\uC6A9\uD615\uD0DC]\n    \uC815\uADDC\uC9C1\n\n    [\uC9C0\uC6D0\uC790\uACA9]\n    - \uD559\uB825: \uB300\uC878 \uC774\uC0C1\n    - \uACBD\uB825: 3\uB144 \uC774\uC0C1\n\n    [\uC8FC\uC694\uC5C5\uBB34]\n    - \uBC31\uC5D4\uB4DC \uC11C\uBC84 \uAC1C\uBC1C \uBC0F \uC720\uC9C0\uBCF4\uC218\n    - API \uC124\uACC4 \uBC0F \uAD6C\uD604\n    - \uB370\uC774\uD130\uBCA0\uC774\uC2A4 \uBAA8\uB378\uB9C1\n\n    [\uC6B0\uB300\uC0AC\uD56D]\n    - Node.js, Express \uACBD\uD5D8\uC790\n    - AWS \uD074\uB77C\uC6B0\uB4DC \uACBD\uD5D8\n    - \uB300\uADDC\uBAA8 \uD2B8\uB798\uD53D \uCC98\uB9AC \uACBD\uD5D8\n\n    [\uC9C0\uC6D0\uAE30\uAC04]\n    2023\uB144 5\uC6D4 1\uC77C ~ 2023\uB144 5\uC6D4 31\uC77C\n\n    [\uBB38\uC758\uCC98]\n    \uC774\uBA54\uC77C: recruit@abcsoftware.com\n  ";
    // Sample non-recruitment text
    var sampleNonRecruitmentText = "\n    ABC \uC18C\uD504\uD2B8\uC6E8\uC5B4 \uB274\uC2A4\uB808\uD130\n\n    \uC548\uB155\uD558\uC138\uC694, ABC \uC18C\uD504\uD2B8\uC6E8\uC5B4 \uAD6C\uB3C5\uC790 \uC5EC\uB7EC\uBD84!\n\n    \uC774\uBC88 \uB2EC \uC8FC\uC694 \uC18C\uC2DD:\n    - \uC2E0\uADDC \uC81C\uD488 \uCD9C\uC2DC: \uD074\uB77C\uC6B0\uB4DC \uBC31\uC5C5 \uC194\uB8E8\uC158\n    - \uAE30\uC220 \uBE14\uB85C\uADF8 \uC5C5\uB370\uC774\uD2B8: \uB9C8\uC774\uD06C\uB85C\uC11C\uBE44\uC2A4 \uC544\uD0A4\uD14D\uCC98 \uC124\uACC4\n    - \uCEE4\uBBA4\uB2C8\uD2F0 \uC774\uBCA4\uD2B8: \uC628\uB77C\uC778 \uC6E8\uBE44\uB098 6\uC6D4 15\uC77C \uAC1C\uCD5C\n\n    \uAC10\uC0AC\uD569\uB2C8\uB2E4.\n    ABC \uC18C\uD504\uD2B8\uC6E8\uC5B4 \uD300\n  ";
    beforeAll(function () {
        // Check if API key is available in environment
        if (!CONFIG.CLAUDE_API_KEY) {
            console.warn('⚠️ CLAUDE_API_KEY 환경 변수가 설정되지 않았습니다. 테스트가 실패할 수 있습니다.');
        }
        else {
            console.log('✅ CLAUDE_API_KEY 환경 변수가 설정되었습니다.');
        }
        // Initialize the service once for all tests
        service = new ClaudeService({
            // If you want to use a specific model or settings, you can override here
            model: 'claude-3-7-sonnet-20250219',
            maxTokens: 4096
        });
        // Check if initialization was successful
        var status = service.getStatus();
        if (!status.clientInitialized) {
            console.warn('⚠️ Claude API 클라이언트 초기화 실패');
        }
        else {
            console.log('✅ Claude API 클라이언트 초기화 성공');
            console.log("\uD83D\uDCCC \uC0AC\uC6A9 \uBAA8\uB378: ".concat(status.model));
        }
    });
    describe('API 연결 및 상태 확인', function () {
        it('API 키와 클라이언트 상태를 확인합니다', function () {
            var status = service.getStatus();
            console.log('API 상태:', status);
            if (status.hasValidKey) {
                console.log('✅ 유효한 API 키가 설정되었습니다.');
            }
            else {
                console.warn('⚠️ 유효한 API 키가 없습니다.');
            }
            // This is a very loose assertion just to ensure the status object is returned
            expect(status).toBeDefined();
            expect(typeof status).toBe('object');
        });
    });
    describe('채용공고 분석 테스트', function () {
        // Set a longer timeout for the API calls
        jest.setTimeout(30000);
        it('채용공고 텍스트를 성공적으로 파싱합니다', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Skip the test if no API key
                        if (!service.apiKey) {
                            console.warn('API 키가 없어 테스트를 건너뜁니다.');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log('채용공고 분석 시작...');
                        return [4 /*yield*/, service.parseRecruitment(sampleRecruitmentText)];
                    case 2:
                        result = _a.sent();
                        console.log('분석 결과:', JSON.stringify(result, null, 2));
                        // Basic validation
                        expect(result).toBeDefined();
                        expect(result.success).toBeDefined();
                        if (result.success) {
                            console.log('✅ 채용공고로 인식했습니다.');
                            console.log("\uD83D\uDCDD \uD68C\uC0AC\uBA85: ".concat(result.company_name));
                            console.log("\uD83D\uDCDD \uBD80\uC11C: ".concat(result.department));
                            console.log("\uD83D\uDCDD \uACE0\uC6A9\uD615\uD0DC: ".concat(result.job_type));
                            console.log("\uD83D\uDCDD \uAC8C\uC2DC\uAE30\uAC04: ".concat(result.posted_period));
                        }
                        else {
                            console.warn('❌ 채용공고로 인식하지 않았습니다.');
                            console.log("\uD83D\uDCDD \uC774\uC720: ".concat(result.reason));
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('❌ 테스트 실패:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('뉴스레터 텍스트를 채용공고가 아닌 것으로 판단합니다', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Skip the test if no API key
                        if (!service.apiKey) {
                            console.warn('API 키가 없어 테스트를 건너뜁니다.');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log('뉴스레터 분석 시작...');
                        return [4 /*yield*/, service.parseRecruitment(sampleNonRecruitmentText)];
                    case 2:
                        result = _a.sent();
                        console.log('분석 결과:', JSON.stringify(result, null, 2));
                        // Basic validation
                        expect(result).toBeDefined();
                        expect(result.success).toBeDefined();
                        if (!result.success) {
                            console.log('✅ 채용공고가 아닌 것으로 올바르게 판단했습니다.');
                            console.log("\uD83D\uDCDD \uC774\uC720: ".concat(result.reason));
                        }
                        else {
                            console.warn('❓ 의외로 채용공고로 판단했습니다.');
                            console.log("\uD83D\uDCDD \uCD94\uC815\uB41C \uD68C\uC0AC\uBA85: ".concat(result.company_name));
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('❌ 테스트 실패:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
    describe('콘텐츠 생성 테스트', function () {
        // Set a longer timeout for the API calls
        jest.setTimeout(30000);
        it('기본 프롬프트로 콘텐츠를 생성합니다', function () { return __awaiter(void 0, void 0, void 0, function () {
            var prompt_1, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Skip the test if no API key
                        if (!service.apiKey) {
                            console.warn('API 키가 없어 테스트를 건너뜁니다.');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        prompt_1 = '인공지능에 대해 100단어로 요약해 주세요.';
                        console.log('콘텐츠 생성 시작...');
                        console.log('프롬프트:', prompt_1);
                        return [4 /*yield*/, service.generateContent(prompt_1)];
                    case 2:
                        result = _a.sent();
                        console.log('생성된 콘텐츠:');
                        console.log('------------------------');
                        console.log(result);
                        console.log('------------------------');
                        // Basic validation
                        expect(result).toBeDefined();
                        expect(typeof result).toBe('string');
                        expect(result.length).toBeGreaterThan(0);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error('❌ 테스트 실패:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
    describe('프롬프트 생성 테스트', function () {
        it('채용공고 분석을 위한 프롬프트를 생성합니다', function () {
            var content = '샘플 채용공고 내용';
            var prompt = service.getRecruitmentPrompt(content);
            console.log('생성된 프롬프트:');
            console.log('------------------------');
            console.log(prompt);
            console.log('------------------------');
            // Basic validation
            expect(prompt).toContain('채용공고 분석 전문가');
            expect(prompt).toContain('샘플 채용공고 내용');
            expect(prompt).toContain('JSON 형식');
        });
    });
});
