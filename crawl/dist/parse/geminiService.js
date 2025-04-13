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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var _a = require('@google/generative-ai'), GoogleGenerativeAI = _a.GoogleGenerativeAI, SchemaType = _a.SchemaType;
var logger = require('@utils/logger').defaultLogger;
/**
 * Gemini API 서비스
 */
var GeminiService = /** @class */ (function () {
    /**
     * GeminiService 인스턴스 생성
     * @param {Object} options - 옵션
     * @param {string} options.apiKey - Gemini API 키 (기본값은 환경변수)
     * @param {string} options.model - 사용할 모델 (기본값: gemini-2.0-flash-lite)
     * @param {number} options.keyIndex - 사용할 API 키 인덱스 (기본값: 0)
     */
    function GeminiService(options) {
        if (options === void 0) { options = {}; }
        // 환경변수에서 콤마로 구분된 API 키 목록 가져오기
        this.apiKeys = process.env.GEMINI_API_KEYS ?
            process.env.GEMINI_API_KEYS.split(',').map(function (key) { return key.trim(); }) :
            [];
        // 단일 API 키도 지원 (기존 방식 호환성 유지)
        if (process.env.GEMINI_API_KEY && !this.apiKeys.includes(process.env.GEMINI_API_KEY)) {
            this.apiKeys.push(process.env.GEMINI_API_KEY);
        }
        // 옵션으로 전달된 키도 추가 (우선순위 부여)
        if (options.apiKey && !this.apiKeys.includes(options.apiKey)) {
            this.apiKeys.unshift(options.apiKey);
        }
        // 현재 사용할 키 인덱스 (순환 시 변경됨)
        this.currentKeyIndex = options.keyIndex || 0;
        if (this.currentKeyIndex >= this.apiKeys.length) {
            this.currentKeyIndex = 0;
        }
        // 현재 사용 중인 API 키
        this.apiKey = this.apiKeys.length > 0 ? this.apiKeys[this.currentKeyIndex] : null;
        //gemini-2.0-flash-exp
        this.modelName = 'gemini-2.0-flash-lite';
        // API 키 정보 로깅
        if (this.apiKeys.length > 0) {
            logger.debug("Gemini API \uD0A4 ".concat(this.apiKeys.length, "\uAC1C \uB85C\uB4DC\uB428. \uD604\uC7AC \uC778\uB371\uC2A4: ").concat(this.currentKeyIndex));
        }
        else {
            logger.debug('Gemini API 키가 설정되지 않았습니다. 테스트 환경으로 실행합니다.');
        }
        // API 키가 있는 경우에만 클라이언트 초기화
        if (this.apiKey) {
            this.initializeClient();
        }
    }
    /**
     * Gemini API 클라이언트 초기화
     */
    GeminiService.prototype.initializeClient = function () {
        try {
            this.genAI = new GoogleGenerativeAI(this.apiKey);
            logger.debug("Gemini API \uD074\uB77C\uC774\uC5B8\uD2B8 \uCD08\uAE30\uD654 \uC131\uACF5 (\uD0A4 \uC778\uB371\uC2A4: ".concat(this.currentKeyIndex, ")"));
        }
        catch (error) {
            logger.error("Gemini API \uD074\uB77C\uC774\uC5B8\uD2B8 \uCD08\uAE30\uD654 \uC2E4\uD328: ".concat(error.message));
            this.genAI = null;
        }
    };
    /**
     * 다음 API 키로 전환
     * @returns {boolean} 전환 성공 여부
     */
    GeminiService.prototype.rotateApiKey = function () {
        if (this.apiKeys.length <= 1) {
            logger.warn('사용 가능한 대체 API 키가 없습니다');
            return false;
        }
        // 다음 키 인덱스로 이동 (순환)
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
        this.apiKey = this.apiKeys[this.currentKeyIndex];
        // 새 키로 클라이언트 초기화
        this.initializeClient();
        logger.debug("API \uD0A4 \uBCC0\uACBD\uB428. \uC0C8 \uC778\uB371\uC2A4: ".concat(this.currentKeyIndex));
        return true;
    };
    /**
     * 콘텐츠 생성 메서드 (키 순환 로직 포함)
     * @param {string} prompt - 프롬프트
     * @param {string} content - 추가 컨텍스트 (선택적)
     * @param {number} retryCount - 재시도 횟수 (내부용)
     * @returns {Promise<string>} 생성된 콘텐츠
     */
    GeminiService.prototype.generateContent = function (prompt_1) {
        return __awaiter(this, arguments, void 0, function (prompt, content, retryCount) {
            var model, fullPrompt, result, error_1, isTooManyRequestsError;
            if (content === void 0) { content = ''; }
            if (retryCount === void 0) { retryCount = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this.genAI) {
                            throw new Error('Gemini API 키가 설정되지 않았습니다.');
                        }
                        model = this.genAI.getGenerativeModel({ model: this.modelName });
                        fullPrompt = content ? "".concat(prompt, "\n\n").concat(content) : prompt;
                        return [4 /*yield*/, model.generateContent(fullPrompt)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.response.text()];
                    case 2:
                        error_1 = _a.sent();
                        isTooManyRequestsError = error_1.message && error_1.message.includes('Too');
                        // API 키 순환 조건: 한도 초과 에러고, 재시도 횟수가 키 개수보다 적은 경우
                        if (isTooManyRequestsError && retryCount < this.apiKeys.length) {
                            logger.debug("API \uD55C\uB3C4 \uCD08\uACFC \uAC10\uC9C0\uB428: ".concat(error_1.message));
                            // 다음 키로 변경
                            if (this.rotateApiKey()) {
                                logger.debug("\uC0C8 API \uD0A4\uB85C \uC7AC\uC2DC\uB3C4 \uC911... (\uC2DC\uB3C4: ".concat(retryCount + 1, "/").concat(this.apiKeys.length, ")"));
                                // 재귀적으로 다시 시도 (재시도 카운터 증가)
                                return [2 /*return*/, this.generateContent(prompt, content, retryCount + 1)];
                            }
                        }
                        // 순환이 불가능하거나 다른 종류의 에러인 경우 에러 발생
                        logger.debug('Gemini API 요청 오류:', error_1);
                        throw new Error("Gemini API \uC694\uCCAD \uC2E4\uD328: ".concat(error_1.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 채용공고 파싱을 위한 스키마 정의
     * @returns {Object} 채용공고 정보를 위한 스키마
     */
    GeminiService.prototype.getRecruitmentSchema = function () {
        return {
            type: SchemaType.OBJECT,
            properties: {
                success: {
                    type: SchemaType.BOOLEAN,
                    description: "채용공고인지 여부",
                },
                reason: {
                    type: SchemaType.STRING,
                    description: "채용공고가 아닌 경우 이유",
                },
                company_name: {
                    type: SchemaType.STRING,
                    description: "회사명",
                },
                department: {
                    type: SchemaType.STRING,
                    description: "부서",
                },
                experience: {
                    type: SchemaType.STRING,
                    description: "경력 요구사항",
                },
                description: {
                    type: SchemaType.STRING,
                    description: "직무 설명",
                },
                job_type: {
                    type: SchemaType.STRING,
                    description: "고용 형태",
                },
                posted_period: {
                    type: SchemaType.STRING,
                    description: "게시 기간",
                },
                requirements: {
                    type: SchemaType.STRING,
                    description: "필수 요건",
                },
                preferred_qualifications: {
                    type: SchemaType.STRING,
                    description: "우대 사항",
                },
                ideal_candidate: {
                    type: SchemaType.STRING,
                    description: "이상적인 후보자",
                }
            },
            required: ["success"]
        };
    };
    /**
     * 채용공고 분석을 위한 프롬프트 생성
     * @param {string} content - 분석할 텍스트 내용
     * @returns {string} 프롬프트 텍스트
     */
    GeminiService.prototype.getRecruitmentPrompt = function (content) {
        return "\n\uB2F9\uC2E0\uC740 \uCC44\uC6A9\uACF5\uACE0 \uBD84\uC11D \uC804\uBB38\uAC00\uC785\uB2C8\uB2E4. \uB2E4\uC74C \uD14D\uC2A4\uD2B8\uB97C \uBD84\uC11D\uD558\uC5EC \uCC44\uC6A9\uACF5\uACE0\uC778\uC9C0 \uD310\uB2E8\uD558\uC138\uC694.\n\n\uB9CC\uC57D \uCC44\uC6A9\uACF5\uACE0\uB77C\uBA74, \uB2E4\uC74C \uC815\uBCF4\uB97C \uCD94\uCD9C\uD558\uC138\uC694:\n- company_name: \uD68C\uC0AC\uBA85\n- department: \uBD80\uC11C\n- experience: \uACBD\uB825 \uC694\uAD6C\uC0AC\uD56D\n- description: \uC9C1\uBB34 \uC124\uBA85\n- job_type: \uACE0\uC6A9 \uD615\uD0DC (\uC815\uADDC\uC9C1, \uACC4\uC57D\uC9C1 \uB4F1)\n- posted_period: \uAC8C\uC2DC \uAE30\uAC04\n- requirements: \uD544\uC218 \uC694\uAC74\n- preferred_qualifications: \uC6B0\uB300 \uC0AC\uD56D\n- ideal_candidate: \uC774\uC0C1\uC801\uC778 \uD6C4\uBCF4\uC790\n\n\uCC44\uC6A9\uACF5\uACE0\uAC00 \uB9DE\uC73C\uBA74 success\uB97C true\uB85C, \uC544\uB2C8\uBA74 false\uB85C \uC124\uC815\uD558\uACE0 \uC774\uC720\uB97C reason \uD544\uB4DC\uC5D0 \uC81C\uACF5\uD558\uC138\uC694.\n\uD14D\uC2A4\uD2B8\uB294 \uB2E4\uC74C\uACFC \uAC19\uC2B5\uB2C8\uB2E4:\n\n".concat(content, "\n");
    };
    /**
     * 채용공고 분석 메서드 (키 순환 로직 포함)
     * @param {string} content - 분석할 텍스트 내용
     * @param {number} retryCount - 재시도 횟수 (내부용)
     * @returns {Promise<Object>} 분석 결과 객체
     */
    GeminiService.prototype.parseRecruitment = function (content_1) {
        return __awaiter(this, arguments, void 0, function (content, retryCount) {
            var model, promptText, genAIResult, responseText, parsedResponse, error_2, isTooManyRequestsError;
            if (retryCount === void 0) { retryCount = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this.genAI) {
                            throw new Error('Gemini API 키가 설정되지 않았습니다.');
                        }
                        model = this.genAI.getGenerativeModel({
                            model: this.modelName,
                            generationConfig: {
                                responseMimeType: "application/json",
                                responseSchema: this.getRecruitmentSchema(),
                            },
                        });
                        promptText = this.getRecruitmentPrompt(content);
                        return [4 /*yield*/, model.generateContent(promptText)];
                    case 1:
                        genAIResult = _a.sent();
                        logger.debug(genAIResult.response.usageMetadata);
                        responseText = genAIResult.response.text();
                        logger.debug('Gemini API 응답 텍스트:', { responseText: responseText });
                        parsedResponse = JSON.parse(responseText);
                        return [2 /*return*/, parsedResponse];
                    case 2:
                        error_2 = _a.sent();
                        isTooManyRequestsError = error_2.message && error_2.message.includes('Too');
                        // API 키 순환 조건: 한도 초과 에러고, 재시도 횟수가 키 개수보다 적은 경우
                        if (isTooManyRequestsError && retryCount < this.apiKeys.length) {
                            logger.debug("API \uD55C\uB3C4 \uCD08\uACFC \uAC10\uC9C0\uB428: ".concat(error_2.message));
                            // 다음 키로 변경
                            if (this.rotateApiKey()) {
                                logger.debug("\uC0C8 API \uD0A4\uB85C \uC7AC\uC2DC\uB3C4 \uC911... (\uC2DC\uB3C4: ".concat(retryCount + 1, "/").concat(this.apiKeys.length, ")"));
                                // 재귀적으로 다시 시도 (재시도 카운터 증가)
                                return [2 /*return*/, this.parseRecruitment(content, retryCount + 1)];
                            }
                        }
                        // JSON 파싱 오류 특별 처리
                        if (error_2 instanceof SyntaxError) {
                            logger.error('JSON 파싱 오류:', error_2);
                            throw new Error('Gemini API 응답을 JSON으로 파싱할 수 없습니다');
                        }
                        // 일반 오류
                        logger.error('채용공고 분석 오류:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 현재 API 키 상태 조회
     * @returns {Object} API 키 상태 정보
     */
    GeminiService.prototype.getKeyStatus = function () {
        return {
            totalKeys: this.apiKeys.length,
            currentKeyIndex: this.currentKeyIndex,
            hasValidKey: !!this.apiKey,
            model: this.modelName
        };
    };
    return GeminiService;
}());
module.exports = {
    GeminiService: GeminiService
};
