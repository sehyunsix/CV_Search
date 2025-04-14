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
/**
 * 채용 정보 검색 및 표시 기능
 */
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    var keywordsInput = document.getElementById('job-keywords');
    var limitSelect = document.getElementById('job-limit');
    var searchButton = document.getElementById('job-search-btn');
    var activeKeywordsContainer = document.getElementById('job-active-keywords');
    var resultsContainer = document.getElementById('job-results');
    var resultsCountContainer = document.getElementById('job-results-count');
    var prevPageButton = document.getElementById('job-prev-page');
    var nextPageButton = document.getElementById('job-next-page');
    var pageInfoSpan = document.getElementById('job-page-info');
    var API_JOBS = '/api/jobs';
    // State variables
    var currentPage = 1;
    var totalPages = 1;
    var currentKeywords = [];
    var currentLimit = parseInt(limitSelect.value);
    // Initialize
    init();
    // Event listeners
    searchButton.addEventListener('click', handleSearch);
    keywordsInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter')
            handleSearch();
    });
    prevPageButton.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            fetchResults();
        }
    });
    nextPageButton.addEventListener('click', function () {
        if (currentPage < totalPages) {
            currentPage++;
            fetchResults();
        }
    });
    limitSelect.addEventListener('change', function () {
        currentLimit = parseInt(limitSelect.value);
        currentPage = 1;
        fetchResults();
    });
    /**
     * 초기화 함수
     */
    function init() {
        // Check for URL parameters
        var urlParams = new URLSearchParams(window.location.search);
        var keywordsParam = urlParams.get('keywords');
        var pageParam = urlParams.get('page');
        var limitParam = urlParams.get('limit');
        if (keywordsParam) {
            currentKeywords = keywordsParam.split(',').map(function (k) { return k.trim(); }).filter(function (k) { return k; });
            keywordsInput.value = currentKeywords.join(', ');
            updateActiveKeywords();
        }
        if (pageParam && !isNaN(parseInt(pageParam))) {
            currentPage = parseInt(pageParam);
        }
        if (limitParam && !isNaN(parseInt(limitParam))) {
            currentLimit = parseInt(limitParam);
            limitSelect.value = currentLimit;
        }
        // 초기 결과 가져오기
        fetchResults();
    }
    /**
     * 검색 처리 함수
     */
    function handleSearch() {
        var inputValue = keywordsInput.value.trim();
        if (inputValue) {
            currentKeywords = inputValue.split(',').map(function (k) { return k.trim(); }).filter(function (k) { return k; });
            currentPage = 1;
            updateActiveKeywords();
            fetchResults();
        }
        else {
            currentKeywords = [];
            updateActiveKeywords();
            fetchResults();
        }
    }
    /**
     * 활성 키워드 업데이트 함수
     */
    function updateActiveKeywords() {
        activeKeywordsContainer.innerHTML = '';
        currentKeywords.forEach(function (keyword) {
            var keywordElem = document.createElement('span');
            keywordElem.className = 'keyword';
            keywordElem.textContent = keyword;
            var removeBtn = document.createElement('button');
            removeBtn.className = 'remove-keyword';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', function () {
                currentKeywords = currentKeywords.filter(function (k) { return k !== keyword; });
                keywordsInput.value = currentKeywords.join(', ');
                updateActiveKeywords();
                currentPage = 1;
                fetchResults();
            });
            keywordElem.appendChild(removeBtn);
            activeKeywordsContainer.appendChild(keywordElem);
        });
    }
    /**
     * 날짜 포맷팅 함수
     * @param {string} dateString - 날짜 문자열
     * @returns {string} 포맷팅된 날짜 문자열
     */
    function formatDate(dateString) {
        if (!dateString)
            return 'N/A';
        var date = new Date(dateString);
        if (isNaN(date.getTime()))
            return 'Invalid Date';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    /**
     * 채용공고 상태 확인 함수
     * @param {string} startDate - 시작일
     * @param {string} endDate - 종료일
     * @returns {Object} 상태 정보 객체
     */
    function getJobStatus(startDate, endDate) {
        var now = new Date();
        var start = new Date(startDate);
        var end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return { status: 'Unknown', class: '' };
        }
        if (now > end) {
            return { status: 'Expired', class: 'job-expired' };
        }
        // 7일 내 만료 여부 확인
        var sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(now.getDate() + 7);
        if (end <= sevenDaysFromNow) {
            return { status: 'Expiring Soon', class: 'job-expiring' };
        }
        return { status: 'Active', class: 'job-active' };
    }
    /**
     * 채용공고 카드 생성 함수
     * @param {Object} job - 채용공고 데이터
     * @returns {HTMLElement} 생성된 카드 요소
     */
    function createJobCard(job) {
        var jobStatus = getJobStatus(job.start_date, job.end_date);
        var card = document.createElement('div');
        card.className = 'job-card';
        var header = document.createElement('div');
        header.className = 'job-header';
        var companyDept = document.createElement('div');
        companyDept.innerHTML = "\n            <h3>".concat(job.department || job.title || 'Unspecified Position', "</h3>\n            <span class=\"job-company\">").concat(job.company_name || 'Unknown Company', "</span>\n        ");
        var dates = document.createElement('div');
        dates.className = 'job-dates';
        dates.innerHTML = "\n            <div>Posted: ".concat(formatDate(job.created_at), "</div>\n            <div>\n                <span class=\"job-status ").concat(jobStatus.class, "\">").concat(jobStatus.status, "</span>\n            </div>\n        ");
        header.appendChild(companyDept);
        header.appendChild(dates);
        var content = document.createElement('div');
        content.className = 'job-content';
        // 채용공고 세부 정보 테이블 생성
        var table = document.createElement('table');
        table.className = 'job-table';
        // 필드별 행 추가
        table.innerHTML = "\n            <tr>\n                <th>URL</th>\n                <td><a href=\"".concat(job.url, "\" target=\"_blank\" class=\"job-url\">").concat(job.url || 'N/A', "</a></td>\n            </tr>\n            <tr>\n                <th>Domain</th>\n                <td>").concat(job.domain || 'N/A', "</td>\n            </tr>\n            <tr>\n                <th>Company</th>\n                <td>").concat(job.company_name || 'N/A', "</td>\n            </tr>\n            <tr>\n                <th>Department</th>\n                <td>").concat(job.department || 'N/A', "</td>\n            </tr>\n            <tr>\n                <th>Experience</th>\n                <td>").concat(job.experience || 'N/A', "</td>\n            </tr>\n            <tr>\n                <th>Job Type</th>\n                <td>").concat(job.job_type || 'N/A', "</td>\n            </tr>\n            <tr>\n                <th>Application Period</th>\n                <td>").concat(formatDate(job.start_date), " - ").concat(formatDate(job.end_date), "</td>\n            </tr>\n            <tr>\n                <th>Description</th>\n                <td><div class=\"job-description\">").concat(job.description || 'N/A', "</div></td>\n            </tr>\n            <tr>\n                <th>Requirements</th>\n                <td><div class=\"job-requirements\">").concat(job.requirements || 'N/A', "</div></td>\n            </tr>\n            <tr>\n                <th>Preferred Qualifications</th>\n                <td><div class=\"job-preferred\">").concat(job.preferred_qualifications || 'N/A', "</div></td>\n            </tr>\n            <tr>\n                <th>Ideal Candidate</th>\n                <td>").concat(job.ideal_candidate || 'N/A', "</td>\n            </tr>\n            <tr>\n                <th>Status</th>\n                <td>").concat(job.status || 'N/A', "</td>\n            </tr>\n            <tr>\n                <th>Updated</th>\n                <td>").concat(formatDate(job.updated_at), "</td>\n            </tr>\n        ");
        content.appendChild(table);
        card.appendChild(header);
        card.appendChild(content);
        return card;
    }
    /**
     * 페이지네이션 업데이트 함수
     */
    function updatePagination() {
        pageInfoSpan.textContent = "Page ".concat(currentPage, " of ").concat(totalPages);
        prevPageButton.disabled = currentPage <= 1;
        nextPageButton.disabled = currentPage >= totalPages;
        // URL 상태 업데이트
        var params = new URLSearchParams();
        if (currentKeywords.length > 0) {
            params.set('keywords', currentKeywords.join(','));
        }
        params.set('page', currentPage);
        params.set('limit', currentLimit);
        var newUrl = "".concat(window.location.pathname, "?").concat(params.toString());
        history.replaceState(null, '', newUrl);
    }
    /**
     * 결과 가져오기 함수
     */
    function fetchResults() {
        return __awaiter(this, void 0, void 0, function () {
            var params, response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resultsContainer.innerHTML = '<div class="loading">Loading...</div>';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        params = new URLSearchParams();
                        if (currentKeywords.length > 0) {
                            params.set('keywords', currentKeywords.join(','));
                        }
                        params.set('page', currentPage);
                        params.set('limit', currentLimit);
                        return [4 /*yield*/, fetch("".concat(API_JOBS, "?").concat(params.toString()))];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        // 페이지네이션 정보 업데이트
                        totalPages = Math.ceil(data.total / currentLimit) || 1;
                        updatePagination();
                        // 결과 수 표시
                        resultsCountContainer.textContent = "Found ".concat(data.total, " recruitment positions");
                        // 결과 컨테이너 초기화
                        resultsContainer.innerHTML = '';
                        // 결과 표시 또는 결과 없음 메시지
                        if (data.jobs.length === 0) {
                            resultsContainer.innerHTML = '<div class="no-results">No recruitment positions found. Try different keywords.</div>';
                        }
                        else {
                            // 각 채용공고에 대한 카드 생성 및 추가
                            data.jobs.forEach(function (job) {
                                var jobCard = createJobCard(job);
                                resultsContainer.appendChild(jobCard);
                            });
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Error fetching results:', error_1);
                        resultsContainer.innerHTML = "<div class=\"error\">Error: ".concat(error_1.message, "</div>");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
});
