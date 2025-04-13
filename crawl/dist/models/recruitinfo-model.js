"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitInfoModel = void 0;
// 기본 모델 클래스
var RecruitInfoModel = /** @class */ (function () {
    function RecruitInfoModel(data) {
        if (data === void 0) { data = {}; }
        this.title = data.title || '';
        this.url = data.url || '';
        this.company_name = data.company_name || '';
        this.department = data.department || '';
        this.experience = data.experience || '';
        this.description = data.description || '';
        this.job_type = data.job_type || '';
        this.start_date = data.start_date || new Date();
        this.end_date = data.end_date || new Date();
        this.requirements = data.requirements || '';
        this.raw_text = data.raw_text || '';
        this.preferred_qualifications = data.preferred_qualifications || '';
        this.ideal_candidate = data.ideal_candidate || '';
        this.posted_at = data.posted_at || new Date();
        this.expires_at = data.expires_at || null;
        this.success = data.success !== undefined ? data.success : false;
        this.reason = data.reason || '';
        this.created_at = data.created_at || new Date();
        this.updated_at = data.updated_at || new Date();
    }
    // 유효성 검사 메서드
    RecruitInfoModel.prototype.validate = function () {
        var _this = this;
        var requiredFields = [
            'title', 'url', 'company_name', 'department',
            'experience', 'description', 'job_type',
            'start_date', 'end_date', 'requirements', 'raw_text'
        ];
        var missingFields = requiredFields.filter(function (field) { return !_this[field]; });
        if (missingFields.length > 0) {
            throw new Error("Missing required fields: ".concat(missingFields.join(', ')));
        }
        // URL 유효성 검사
        if (!/^https?:\/\/.+/.test(this.url)) {
            throw new Error('Invalid URL format');
        }
        // 날짜 유효성 검사
        if (this.start_date && !(this.start_date instanceof Date)) {
            throw new Error('Invalid start_date format');
        }
        if (this.end_date && !(this.end_date instanceof Date)) {
            throw new Error('Invalid end_date format');
        }
        return true;
    };
    // 데이터 직렬화
    RecruitInfoModel.prototype.toJSON = function () {
        return {
            title: this.title,
            url: this.url,
            company_name: this.company_name,
            department: this.department,
            experience: this.experience,
            description: this.description,
            job_type: this.job_type,
            start_date: this.start_date,
            end_date: this.end_date,
            requirements: this.requirements,
            preferred_qualifications: this.preferred_qualifications,
            ideal_candidate: this.ideal_candidate,
            raw_text: this.raw_text,
            posted_at: this.posted_at,
            expires_at: this.expires_at,
            success: this.success,
            reason: this.reason,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    };
    // 정적 팩토리 메서드
    RecruitInfoModel.fromJSON = function (data) {
        return new RecruitInfoModel(data);
    };
    return RecruitInfoModel;
}());
exports.RecruitInfoModel = RecruitInfoModel;
