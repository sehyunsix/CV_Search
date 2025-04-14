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
var currentPage = 1;
var totalPages = 1;
var jobsPerPage = 10;
var currentJobs = [];
var filters = {
    jobType: '',
    experience: '',
    searchText: '',
    sortBy: 'updated_at',
    completeDataOnly: false,
    itOnly: false
};
// Initialize when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Setup event listeners
    setupEventListeners();
    // Load initial job listings
    loadJobListings();
    // Load filter options
    loadFilterOptions();
});
// "완성도 통계 보기" 버튼을 추가하고 통계 표시 기능 구현
function setupCompletionStats() {
    var _this = this;
    // HTML 요소 추가 (적절한 위치에 삽입)
    var statsButton = document.createElement('button');
    statsButton.id = 'show-completion-stats';
    statsButton.className = 'filter-btn';
    statsButton.textContent = '데이터 완성도 통계 보기';
    // 버튼을 페이지에 삽입 (필터 섹션 다음에)
    var filterSection = document.querySelector('.filter-section');
    filterSection.after(statsButton);
    // 통계 표시 모달 생성
    var statsModal = document.createElement('div');
    statsModal.id = 'stats-modal';
    statsModal.className = 'modal';
    statsModal.innerHTML = "\n    <div class=\"modal-content wider-modal\">\n      <div class=\"modal-header\">\n        <h2>\uCC44\uC6A9\uACF5\uACE0 \uB370\uC774\uD130 \uC644\uC131\uB3C4 \uD1B5\uACC4</h2>\n        <span class=\"close-stats\">&times;</span>\n      </div>\n      <div id=\"stats-content\">\n        <div class=\"loading\">\uD1B5\uACC4 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911...</div>\n      </div>\n    </div>\n  ";
    document.body.appendChild(statsModal);
    // 이벤트 리스너 설정
    statsButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statsModal.style.display = 'block';
                    return [4 /*yield*/, loadCompletionStats()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    document.querySelector('.close-stats').addEventListener('click', function () {
        statsModal.style.display = 'none';
    });
    window.addEventListener('click', function (event) {
        if (event.target === statsModal) {
            statsModal.style.display = 'none';
        }
    });
}
// 완성도 통계 데이터 로드 함수
function loadCompletionStats() {
    return __awaiter(this, void 0, void 0, function () {
        var statsContent, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    statsContent = document.getElementById('stats-content');
                    statsContent.innerHTML = '<div class="loading">통계 데이터를 불러오는 중...</div>';
                    return [4 /*yield*/, fetch('/api/recruitinfos-claude/completion-stats')];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (!data.success) {
                        throw new Error(data.error || '통계 데이터를 불러오지 못했습니다.');
                    }
                    // 통계 데이터 표시
                    statsContent.innerHTML = "\n      <div class=\"stats-summary\">\n        <h3>\uC694\uC57D</h3>\n        <p>\uC804\uCCB4 \uCC44\uC6A9\uACF5\uACE0: <strong>".concat(data.totalDocuments, "</strong>\uAC1C</p>\n        <p>\uC644\uC804\uD55C \uB370\uC774\uD130\uB97C \uAC00\uC9C4 \uCC44\uC6A9\uACF5\uACE0: <strong>").concat(data.completeDocuments, "</strong>\uAC1C (").concat(data.completePercentage, "%)</p>\n      </div>\n\n      <h3>\uD544\uB4DC\uBCC4 \uC644\uC131\uB3C4</h3>\n      <table class=\"stats-table\">\n        <thead>\n          <tr>\n            <th>\uD544\uB4DC\uBA85</th>\n            <th>\uCC44\uC6CC\uC9C4 \uB370\uC774\uD130</th>\n            <th>\uC54C \uC218 \uC5C6\uC74C \uB370\uC774\uD130</th>\n            <th>\uBE44\uC5B4\uC788\uB294 \uB370\uC774\uD130</th>\n          </tr>\n        </thead>\n        <tbody>\n          ").concat(data.fieldStats.map(function (stat) { return "\n            <tr>\n              <td>".concat(stat.display, "</td>\n              <td>").concat(stat.filled, "\uAC1C (").concat(stat.filledPercentage, "%)</td>\n              <td>").concat(stat.unknown, "\uAC1C (").concat(stat.unknownPercentage, "%)</td>\n              <td>").concat(stat.empty, "\uAC1C (").concat(stat.emptyPercentage, "%)</td>\n            </tr>\n          "); }).join(''), "\n        </tbody>\n      </table>\n\n      <div class=\"stats-actions\">\n        <button id=\"load-complete-data\" class=\"primary-btn\">\uC644\uC804\uD55C \uB370\uC774\uD130\uC758 \uCC44\uC6A9\uACF5\uACE0\uB9CC \uBCF4\uAE30</button>\n      </div>\n    ");
                    // 완전한 데이터만 보기 버튼 이벤트 리스너
                    document.getElementById('load-complete-data').addEventListener('click', function () {
                        document.getElementById('complete-data-only').checked = true;
                        filters.completeDataOnly = true;
                        loadJobListings();
                        statsModal.style.display = 'none';
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('데이터 완성도 통계 로드 오류:', error_1);
                    document.getElementById('stats-content').innerHTML = "\n      <div class=\"error\">\n        <p>\uB370\uC774\uD130 \uC644\uC131\uB3C4 \uD1B5\uACC4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.</p>\n        <p>\uC790\uC138\uD55C \uB0B4\uC6A9: ".concat(error_1.message, "</p>\n      </div>\n    ");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Function to set up all event listeners
function setupEventListeners() {
    // Pagination controls
    document.getElementById('prev-page').addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            loadJobListings();
        }
    });
    document.getElementById('next-page').addEventListener('click', function () {
        if (currentPage < totalPages) {
            currentPage++;
            loadJobListings();
        }
    });
    // Filter controls
    document.getElementById('apply-filters').addEventListener('click', function () {
        currentPage = 1;
        filters.jobType = document.getElementById('job-type').value;
        filters.experience = document.getElementById('experience').value;
        filters.searchText = document.getElementById('search-text').value;
        filters.sortBy = document.getElementById('sort-by').value;
        filters.completeDataOnly = document.getElementById('complete-data-only').checked;
        filters.itOnly = document.getElementById('it-only').checked; // Add this line
        loadJobListings();
    });
    document.getElementById('reset-filters').addEventListener('click', function () {
        currentPage = 1;
        document.getElementById('job-type').value = '';
        document.getElementById('experience').value = '';
        document.getElementById('search-text').value = '';
        document.getElementById('sort-by').value = 'updated_at';
        document.getElementById('complete-data-only').checked = false;
        document.getElementById('it-only').checked = false; // Add this line
        filters = {
            jobType: '',
            experience: '',
            searchText: '',
            sortBy: 'updated_at',
            completeDataOnly: false,
            itOnly: false // Add this property
        };
        loadJobListings();
    });
    // Modal close button
    document.querySelector('.close').addEventListener('click', function () {
        document.getElementById('job-modal').style.display = 'none';
    });
    // Close modal when clicking outside of it
    window.addEventListener('click', function (event) {
        if (event.target === document.getElementById('job-modal')) {
            document.getElementById('job-modal').style.display = 'none';
        }
    });
}
// Function to load the job listings from the server
function loadJobListings() {
    return __awaiter(this, void 0, void 0, function () {
        var jobsContainer, apiUrl, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    jobsContainer = document.getElementById('jobs-container');
                    jobsContainer.innerHTML = '<div class="loading">Loading job listings...</div>';
                    apiUrl = "/api/recruitinfos-claude?page=".concat(currentPage, "&limit=").concat(jobsPerPage);
                    if (filters.jobType) {
                        apiUrl += "&jobType=".concat(encodeURIComponent(filters.jobType));
                    }
                    if (filters.experience) {
                        apiUrl += "&experience=".concat(encodeURIComponent(filters.experience));
                    }
                    if (filters.searchText) {
                        apiUrl += "&search=".concat(encodeURIComponent(filters.searchText));
                    }
                    if (filters.sortBy) {
                        apiUrl += "&sortBy=".concat(encodeURIComponent(filters.sortBy));
                    }
                    // Add complete data filter parameter
                    if (filters.completeDataOnly) {
                        apiUrl += "&complete=true";
                    }
                    // Add IT jobs only filter if the checkbox is checked
                    if (filters.itOnly) {
                        apiUrl += "&itOnly=true";
                    }
                    return [4 /*yield*/, fetch(apiUrl)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    currentJobs = data.jobs;
                    totalPages = Math.ceil(data.total / jobsPerPage);
                    // Update the results count with additional information when complete filter is active
                    if (filters.completeDataOnly) {
                        document.getElementById('results-count').innerHTML = "\n                <div class=\"results-stats\">\n                    <p>\uC644\uC804\uD55C \uB370\uC774\uD130\uC758 \uCC44\uC6A9\uACF5\uACE0: <strong>".concat(data.total, "</strong>\uAC1C\n                    ").concat(data.totalAll ? "(\uC804\uCCB4 ".concat(data.totalAll, "\uAC1C \uC911 ").concat(data.completeRatio, "%)") : '', "\n                    </p>\n                </div>\n            ");
                    }
                    else {
                        document.getElementById('results-count').textContent = "Showing ".concat(currentJobs.length, " of ").concat(data.total, " job listings");
                    }
                    // Display the jobs
                    displayJobs(currentJobs);
                    // Update pagination controls
                    updatePagination();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error loading job listings:', error_2);
                    document.getElementById('jobs-container').innerHTML = "\n            <div class=\"error\">\n                <p>Error loading job listings. Please try again later.</p>\n                <p>Details: ".concat(error_2.message, "</p>\n            </div>\n        ");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Function to load filter options dynamically from available data
function loadFilterOptions() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, jobTypeSelect_1, experienceSelect_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/api/recruitinfos-claude/filters')];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    jobTypeSelect_1 = document.getElementById('job-type');
                    jobTypeSelect_1.innerHTML = '<option value="">All Types</option>';
                    if (data.jobTypes && data.jobTypes.length) {
                        data.jobTypes.forEach(function (type) {
                            if (type) {
                                var option = document.createElement('option');
                                option.value = type;
                                option.textContent = type;
                                jobTypeSelect_1.appendChild(option);
                            }
                        });
                    }
                    experienceSelect_1 = document.getElementById('experience');
                    experienceSelect_1.innerHTML = '<option value="">All Levels</option>';
                    if (data.experienceLevels && data.experienceLevels.length) {
                        data.experienceLevels.forEach(function (level) {
                            if (level) {
                                var option = document.createElement('option');
                                option.value = level;
                                option.textContent = level;
                                experienceSelect_1.appendChild(option);
                            }
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error loading filter options:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Function to display the job listings
function displayJobs(jobs) {
    var jobsContainer = document.getElementById('jobs-container');
    jobsContainer.innerHTML = '';
    if (jobs.length === 0) {
        jobsContainer.innerHTML = '<div class="no-results">No job listings found matching your criteria.</div>';
        return;
    }
    jobs.forEach(function (job) {
        // Format dates
        job.title = company_name + job.department + job.job_type;
        var postedDate = job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'Unknown';
        var expiryDate = job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Unknown';
        // Check if data is complete
        var isComplete = job.company_name &&
            job.company_name !== 'Unknown Company' &&
            job.company_name !== '알 수 없음' &&
            job.company_name !== '명시되지 않음' &&
            job.description &&
            job.description !== 'No description available.' &&
            job.job_type &&
            job.job_type !== '' &&
            job.experience &&
            job.experience !== '';
        // Create the job card HTML
        var jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = "\n            <span class=\"parser-info\">Parsed by Claude</span>\n            <h3 class=\"job-title\">".concat(escapeHtml(job.title || 'Untitled Position'), "\n                <span class=\"").concat(isComplete ? 'complete-data-indicator' : 'complete-data-indicator incomplete-data-indicator', "\">\n                    ").concat(isComplete ? 'Complete Data' : 'Incomplete Data', "\n                </span>\n            </h3>\n            <h4 class=\"company-name\">").concat(escapeHtml(job.company_name || 'Unknown Company'), "</h4>\n\n            <div class=\"job-meta\">\n                ").concat(job.department ? "<span class=\"department\">".concat(escapeHtml(job.department), "</span>") : '', "\n                ").concat(job.job_type ? "<span class=\"job-type\">".concat(escapeHtml(job.job_type), "</span>") : '<span class="job-type missing">No Job Type</span>', "\n                ").concat(job.experience ? "<span class=\"experience\">".concat(escapeHtml(job.experience), "</span>") : '<span class="experience missing">No Experience Level</span>', "\n            </div>\n\n            <div class=\"job-dates\">\n                <span class=\"posted-date\">Posted: ").concat(postedDate, "</span>\n                <span class=\"expiry-date\">Expires: ").concat(expiryDate, "</span>\n            </div>\n\n            <p class=\"job-description\">").concat(truncateText(job.description || 'No description available.', 150), "</p>\n\n            <div class=\"job-actions\">\n                <button class=\"view-details-btn\" data-job-id=\"").concat(job._id, "\">View Details</button>\n                <a href=\"").concat(job.url, "\" target=\"_blank\" class=\"visit-site-btn\">Visit Original Post</a>\n            </div>\n        ");
        jobsContainer.appendChild(jobCard);
    });
    // Add event listeners to the "View Details" buttons
    document.querySelectorAll('.view-details-btn').forEach(function (button) {
        button.addEventListener('click', function (event) {
            var jobId = event.target.getAttribute('data-job-id');
            var job = currentJobs.find(function (j) { return j._id === jobId; });
            if (job) {
                showJobDetails(job);
            }
        });
    });
}
// Function to update pagination controls
function updatePagination() {
    var prevButton = document.getElementById('prev-page');
    var nextButton = document.getElementById('next-page');
    var pageInfo = document.getElementById('page-info');
    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;
    pageInfo.textContent = "Page ".concat(currentPage, " of ").concat(totalPages || 1);
}
// Function to show job details in a modal
// 수정: showJobDetails 함수 내에 MySQL 저장 버튼 추가
function showJobDetails(job) {
    var modal = document.getElementById('job-modal');
    var jobDetails = document.getElementById('job-details');
    // Format dates
    var postedDate = job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'Unknown';
    var startDate = job.start_date ? new Date(job.start_date).toLocaleDateString() : 'Unknown';
    var endDate = job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Unknown';
    // Construct the modal content
    jobDetails.innerHTML = "\n        <div class=\"modal-header\">\n            <h2>".concat(escapeHtml(job.title || 'Untitled Position'), "</h2>\n            <h3>").concat(escapeHtml(job.company_name || 'Unknown Company'), "</h3>\n            <div class=\"parser-tag\">Parsed by Claude</div>\n        </div>\n\n        <div class=\"job-info-grid\">\n            <div class=\"info-group\">\n                <h4>Job Details</h4>\n                <ul>\n                    ").concat(job.department ? "<li><strong>Department:</strong> ".concat(escapeHtml(job.department), "</li>") : '', "\n                    ").concat(job.job_type ? "<li><strong>Job Type:</strong> ".concat(escapeHtml(job.job_type), "</li>") : '', "\n                    ").concat(job.experience ? "<li><strong>Experience Required:</strong> ".concat(escapeHtml(job.experience), "</li>") : '', "\n                </ul>\n            </div>\n\n            <div class=\"info-group\">\n                <h4>Dates</h4>\n                <ul>\n                    <li><strong>Posted Date:</strong> ").concat(postedDate, "</li>\n                    <li><strong>Start Date:</strong> ").concat(startDate, "</li>\n                    <li><strong>End Date:</strong> ").concat(endDate, "</li>\n                </ul>\n            </div>\n        </div>\n\n        <div class=\"job-description-section\">\n            <h4>Job Description</h4>\n            <p>").concat(formatMultiLineText(job.description || 'No description available.'), "</p>\n        </div>\n\n        ").concat(job.requirements ? "\n        <div class=\"job-requirements-section\">\n            <h4>Requirements</h4>\n            <p>".concat(formatMultiLineText(job.requirements), "</p>\n        </div>\n        ") : '', "\n\n        ").concat(job.preferred_qualifications ? "\n        <div class=\"job-qualifications-section\">\n            <h4>Preferred Qualifications</h4>\n            <p>".concat(formatMultiLineText(job.preferred_qualifications), "</p>\n        </div>\n        ") : '', "\n\n        ").concat(job.ideal_candidate ? "\n        <div class=\"job-candidate-section\">\n            <h4>Ideal Candidate</h4>\n            <p>".concat(formatMultiLineText(job.ideal_candidate), "</p>\n        </div>\n        ") : '', "\n\n        <div class=\"job-actions-footer\">\n            <a href=\"").concat(job.url, "\" target=\"_blank\" class=\"btn primary-btn\">Visit Original Post</a>\n            <button id=\"save-to-mysql\" class=\"btn save-btn\">\uC800\uC7A5\uD558\uAE30 (MySQL)</button>\n            <button class=\"btn secondary-btn close-modal-btn\">Close</button>\n        </div>\n        <div id=\"save-result\" class=\"save-result\"></div>\n    ");
    // Add event listener to the close button in the modal
    document.querySelector('.close-modal-btn').addEventListener('click', function () {
        modal.style.display = 'none';
    });
    // Add event listener to the "Save to MySQL" button
    document.getElementById('save-to-mysql').addEventListener('click', function () {
        saveJobToMySql(job);
    });
    // Display the modal
    modal.style.display = 'block';
}
// Function to save a job to MySQL
function saveJobToMySql(job) {
    return __awaiter(this, void 0, void 0, function () {
        var saveResult, response, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    saveResult = document.getElementById('save-result');
                    saveResult.innerHTML = '<p class="saving">저장 중...</p>';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/mysql-jobs', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                title: job.title,
                                company_name: job.company_name,
                                job_type: job.job_type,
                                experience: job.experience,
                                department: job.department,
                                description: job.description,
                                requirements: job.requirements,
                                preferred_qualifications: job.preferred_qualifications,
                                ideal_candidate: job.ideal_candidate,
                                url: job.url,
                                posted_at: job.posted_at,
                                end_date: job.end_date
                            })
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    if (response.ok) {
                        saveResult.innerHTML = '<p class="success">채용공고가 MySQL에 성공적으로 저장되었습니다.</p>';
                        // MySQL 저장 성공 시 버튼 비활성화
                        document.getElementById('save-to-mysql').disabled = true;
                        document.getElementById('save-to-mysql').textContent = 'MySQL에 저장됨';
                        document.getElementById('save-to-mysql').classList.add('saved');
                    }
                    else {
                        throw new Error(result.error || '저장에 실패했습니다.');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error('Error saving job to MySQL:', error_4);
                    saveResult.innerHTML = "<p class=\"error\">\uC800\uC7A5 \uC2E4\uD328: ".concat(error_4.message, "</p>");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Helper function to truncate text
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength)
        return escapeHtml(text);
    return escapeHtml(text.substring(0, maxLength)) + '...';
}
// Helper function to format multi-line text
function formatMultiLineText(text) {
    if (!text)
        return '';
    var escaped = escapeHtml(text);
    return escaped.replace(/\n/g, '<br>').replace(/• /g, '&bull; ');
}
// Helper function to escape HTML
function escapeHtml(unsafe) {
    if (!unsafe)
        return '';
    return unsafe
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
function displayJobs(jobs) {
    var jobsContainer = document.getElementById('jobs-container');
    jobsContainer.innerHTML = '';
    if (jobs.length === 0) {
        jobsContainer.innerHTML = '<div class="no-results">No job listings found matching your criteria.</div>';
        return;
    }
    // 일괄 저장 버튼 추가
    var batchSaveContainer = document.createElement('div');
    batchSaveContainer.className = 'batch-actions';
    batchSaveContainer.innerHTML = "\n        <div class=\"batch-controls\">\n            <label>\n                <input type=\"checkbox\" id=\"select-all\"> \uC804\uCCB4 \uC120\uD0DD\n            </label>\n            <button id=\"batch-save\" class=\"batch-save-btn\" disabled>\uC120\uD0DD\uD56D\uBAA9 MySQL\uC5D0 \uC800\uC7A5</button>\n        </div>\n        <div id=\"batch-result\" class=\"batch-result\"></div>\n    ";
    jobsContainer.appendChild(batchSaveContainer);
    jobs.forEach(function (job) {
        // Format dates
        var postedDate = job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'Unknown';
        var expiryDate = job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Unknown';
        // Check if data is complete
        var isComplete = job.company_name &&
            job.company_name !== 'Unknown Company' &&
            job.company_name !== '알 수 없음' &&
            job.company_name !== '명시되지 않음' &&
            job.description &&
            job.description !== 'No description available.' &&
            job.job_type &&
            job.job_type !== '' &&
            job.experience &&
            job.experience !== '';
        // Create the job card HTML
        var jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = "\n            <div class=\"job-selection\">\n                <input type=\"checkbox\" class=\"job-checkbox\" data-job-id=\"".concat(job._id, "\">\n            </div>\n            <span class=\"parser-info\">Parsed by Claude</span>\n            <h3 class=\"job-title\">").concat(escapeHtml(job.title || 'Untitled Position'), "\n                <span class=\"").concat(isComplete ? 'complete-data-indicator' : 'complete-data-indicator incomplete-data-indicator', "\">\n                    ").concat(isComplete ? 'Complete Data' : 'Incomplete Data', "\n                </span>\n            </h3>\n            <h4 class=\"company-name\">").concat(escapeHtml(job.company_name || 'Unknown Company'), "</h4>\n\n            <div class=\"job-meta\">\n                ").concat(job.department ? "<span class=\"department\">".concat(escapeHtml(job.department), "</span>") : '', "\n                ").concat(job.job_type ? "<span class=\"job-type\">".concat(escapeHtml(job.job_type), "</span>") : '<span class="job-type missing">No Job Type</span>', "\n                ").concat(job.experience ? "<span class=\"experience\">".concat(escapeHtml(job.experience), "</span>") : '<span class="experience missing">No Experience Level</span>', "\n            </div>\n\n            <div class=\"job-dates\">\n                <span class=\"posted-date\">Posted: ").concat(postedDate, "</span>\n                <span class=\"expiry-date\">Expires: ").concat(expiryDate, "</span>\n            </div>\n\n            <p class=\"job-description\">").concat(truncateText(job.description || 'No description available.', 150), "</p>\n\n            <div class=\"job-actions\">\n                <button class=\"view-details-btn\" data-job-id=\"").concat(job._id, "\">View Details</button>\n                <a href=\"").concat(job.url, "\" target=\"_blank\" class=\"visit-site-btn\">Visit Original Post</a>\n            </div>\n        ");
        jobsContainer.appendChild(jobCard);
    });
    // Add event listeners to the "View Details" buttons
    document.querySelectorAll('.view-details-btn').forEach(function (button) {
        button.addEventListener('click', function (event) {
            var jobId = event.target.getAttribute('data-job-id');
            var job = currentJobs.find(function (j) { return j._id === jobId; });
            if (job) {
                showJobDetails(job);
            }
        });
    });
    // Add event listeners for batch selection
    setupBatchSelectionListeners();
}
// 일괄 선택 관련 이벤트 리스너 설정
function setupBatchSelectionListeners() {
    var selectAllCheckbox = document.getElementById('select-all');
    var jobCheckboxes = document.querySelectorAll('.job-checkbox');
    var batchSaveButton = document.getElementById('batch-save');
    // 전체 선택 체크박스
    selectAllCheckbox.addEventListener('change', function () {
        var _this = this;
        jobCheckboxes.forEach(function (checkbox) {
            checkbox.checked = _this.checked;
        });
        updateBatchSaveButton();
    });
    // 개별 체크박스
    jobCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', updateBatchSaveButton);
    });
    // 일괄 저장 버튼
    batchSaveButton.addEventListener('click', batchSaveToMySql);
    // 버튼 상태 업데이트
    function updateBatchSaveButton() {
        var checkedBoxes = document.querySelectorAll('.job-checkbox:checked');
        batchSaveButton.disabled = checkedBoxes.length === 0;
    }
}
// 선택한 채용공고를 MySQL에 일괄 저장
function batchSaveToMySql() {
    return __awaiter(this, void 0, void 0, function () {
        var batchResult, checkedBoxes, selectedJobIds, savedCount, failedCount, _loop_1, _i, selectedJobIds_1, jobId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    batchResult = document.getElementById('batch-result');
                    batchResult.innerHTML = '<p class="saving">선택한 항목을 저장 중...</p>';
                    checkedBoxes = document.querySelectorAll('.job-checkbox:checked');
                    selectedJobIds = Array.from(checkedBoxes).map(function (checkbox) { return checkbox.getAttribute('data-job-id'); });
                    savedCount = 0;
                    failedCount = 0;
                    _loop_1 = function (jobId) {
                        var job, response, error_5;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    job = currentJobs.find(function (j) { return j._id === jobId; });
                                    if (!job) return [3 /*break*/, 4];
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, fetch('/api/mysql-jobs', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                title: job.title || job.company_name + ' ' + job.defartment,
                                                company_name: job.company_name,
                                                job_type: job.job_type,
                                                experience: job.experience,
                                                department: job.department,
                                                description: job.description,
                                                requirements: job.requirements,
                                                preferred_qualifications: job.preferred_qualifications,
                                                ideal_candidate: job.ideal_candidate,
                                                url: job.url,
                                                posted_at: job.posted_at,
                                                end_date: job.end_date
                                            })
                                        })];
                                case 2:
                                    response = _b.sent();
                                    if (response.ok) {
                                        savedCount++;
                                    }
                                    else {
                                        failedCount++;
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_5 = _b.sent();
                                    console.error('Error saving job to MySQL:', error_5);
                                    failedCount++;
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, selectedJobIds_1 = selectedJobIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < selectedJobIds_1.length)) return [3 /*break*/, 4];
                    jobId = selectedJobIds_1[_i];
                    return [5 /*yield**/, _loop_1(jobId)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    // 결과 표시
                    batchResult.innerHTML = "\n        <p class=\"info\">\n            \uC800\uC7A5 \uC644\uB8CC: <span class=\"success\">".concat(savedCount, "\uAC1C</span> \uC131\uACF5,\n            <span class=\"error\">").concat(failedCount, "\uAC1C</span> \uC2E4\uD328\n        </p>\n    ");
                    // 저장된 항목의 체크박스를 비활성화하고 표시
                    checkedBoxes.forEach(function (checkbox) {
                        checkbox.disabled = true;
                        checkbox.parentElement.classList.add('saved');
                    });
                    // 전체 선택 체크박스 초기화
                    document.getElementById('select-all').checked = false;
                    // 저장 버튼 비활성화
                    document.getElementById('batch-save').disabled = true;
                    return [2 /*return*/];
            }
        });
    });
}
