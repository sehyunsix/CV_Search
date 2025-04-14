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
 * 통계 페이지 JavaScript
 */
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    var refreshButton = document.getElementById('refresh-stats-btn');
    var totalUrlsElement = document.getElementById('total-urls');
    var recruitUrlsElement = document.getElementById('recruit-urls');
    var nonRecruitUrlsElement = document.getElementById('non-recruit-urls');
    var unclassifiedUrlsElement = document.getElementById('unclassified-urls');
    var lastUpdatedElement = document.getElementById('last-updated-time');
    var jobTypesSummaryElement = document.getElementById('job-types-summary');
    // Chart canvas elements
    var urlClassificationCanvas = document.getElementById('url-classification-chart');
    var jobTypesCanvas = document.getElementById('job-types-chart');
    var timelineCanvas = document.getElementById('timeline-chart');
    var totalVisitsElement = document.getElementById('total-visits');
    var totalSubUrlsElement = document.getElementById('total-sub-urls');
    var analyzedUrlsElement = document.getElementById('analyzed-urls');
    var recruitSubUrlsElement = document.getElementById('recruit-sub-urls');
    var nonRecruitSubUrlsElement = document.getElementById('non-recruit-sub-urls');
    var analysisRatioElement = document.getElementById('analysis-ratio');
    // 추가 차트 canvas
    var urlAnalysisCanvas = document.getElementById('url-analysis-chart');
    // 추가 차트 객체
    var urlAnalysisChart = null;
    // Chart objects
    var urlClassificationChart = null;
    var jobTypesChart = null;
    var timelineChart = null;
    // Initialize
    fetchStats();
    // Event listeners
    refreshButton.addEventListener('click', fetchStats);
    /**
     * 통계 데이터 가져오기
     */
    function fetchStats() {
        return __awaiter(this, void 0, void 0, function () {
            var response, result, statsData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('/api/stats')];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('통계 데이터를 가져오는데 실패했습니다.');
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        result = _a.sent();
                        // 서버 응답에서 data 속성 추출
                        if (!result.success || !result.data) {
                            throw new Error('서버 응답 형식이 올바르지 않습니다.');
                        }
                        statsData = result.data;
                        // 데이터 업데이트 시간 표시
                        lastUpdatedElement.textContent = new Date().toLocaleString();
                        // 통계 요약 정보 업데이트
                        updateStatsSummary(statsData);
                        if (statsData.visitUrlStats) {
                            renderUrlAnalysisChart(statsData.visitUrlStats);
                        }
                        // 차트 렌더링
                        renderRecruitmentChart(statsData.recruitmentStats);
                        renderJobTypesChart(statsData.jobTypeStats);
                        renderTimelineChart(statsData.timelineStats);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error fetching stats:', error_1);
                        alert('통계 데이터를 불러오는 중 오류가 발생했습니다: ' + error_1.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    /**
     * 통계 요약 정보 업데이트
     */
    function updateStatsSummary(data) {
        var recruitmentStats = data.recruitmentStats, jobTypeStats = data.jobTypeStats, experienceStats = data.experienceStats;
        // 채용공고 수 표시
        var totalRecruitments = recruitmentStats.total;
        totalUrlsElement.textContent = totalRecruitments.toLocaleString();
        recruitUrlsElement.textContent = totalRecruitments.toLocaleString();
        // 비채용공고와 미분류는 이제 사용하지 않음 - UI 호환성을 위해 0으로 설정
        nonRecruitUrlsElement.textContent = '0';
        unclassifiedUrlsElement.textContent = '0';
        // 직무 유형 요약 업데이트
        jobTypesSummaryElement.innerHTML = '';
        // 상위 5개 직무 유형만 표시 (정렬 후)
        var sortedTypes = Object.entries(jobTypeStats.types)
            .sort(function (a, b) { return b[1] - a[1]; })
            .slice(0, 5);
        // 각 직무 유형별 개수 표시
        sortedTypes.forEach(function (_a) {
            var type = _a[0], count = _a[1];
            var jobTypeElement = document.createElement('div');
            jobTypeElement.className = 'stat-item';
            jobTypeElement.innerHTML = "\n                <span class=\"stat-label\">".concat(type || 'Not specified', ":</span>\n                <span class=\"stat-value\">").concat(count.toLocaleString(), "</span>\n            ");
            jobTypesSummaryElement.appendChild(jobTypeElement);
        });
        // URL 통계 정보 추가
        if (data.visitUrlStats) {
            var urlStats = data.visitUrlStats;
            totalVisitsElement.textContent = urlStats.total_visits.toLocaleString();
            totalSubUrlsElement.textContent = urlStats.total_sub_urls.toLocaleString();
            analyzedUrlsElement.textContent = urlStats.analyzed_urls.toLocaleString();
            recruitSubUrlsElement.textContent = urlStats.recruit_urls.toLocaleString();
            nonRecruitSubUrlsElement.textContent = urlStats.non_recruit_urls.toLocaleString();
            analysisRatioElement.textContent = "".concat(urlStats.analysis_ratio, "%");
        }
    }
    /**
     * URL 분석 통계 차트 렌더링
     */
    function renderUrlAnalysisChart(urlStats) {
        // 기존 차트 제거
        if (urlAnalysisChart) {
            urlAnalysisChart.destroy();
        }
        // 데이터 준비
        var data = {
            labels: ['채용공고 URL', '비채용공고 URL', '미분석 URL'],
            datasets: [{
                    data: [
                        urlStats.recruit_urls,
                        urlStats.non_recruit_urls,
                        urlStats.total_sub_urls - urlStats.analyzed_urls
                    ],
                    backgroundColor: [
                        '#4caf50', // 채용공고 - 녹색
                        '#f44336', // 비채용공고 - 빨간색
                        '#9e9e9e' // 미분석 - 회색
                    ],
                    borderWidth: 1
                }]
        };
        // 차트 옵션
        var options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: "\uCD1D URL: ".concat(urlStats.total_sub_urls.toLocaleString(), " / \uBD84\uC11D \uBE44\uC728: ").concat(urlStats.analysis_ratio, "%")
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            var value = context.parsed;
                            var total = urlStats.total_sub_urls;
                            var percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return "".concat(context.label, ": ").concat(value.toLocaleString(), " (").concat(percentage, "%)");
                        }
                    }
                }
            }
        };
        // 차트 생성
        urlAnalysisChart = new Chart(urlAnalysisCanvas, {
            type: 'pie',
            data: data,
            options: options
        });
    }
    /**
     * 채용공고 차트 렌더링 (이전 URL 분류 차트 대체)
     */
    function renderRecruitmentChart(recruitmentStats) {
        // 기존 차트 제거
        if (urlClassificationChart) {
            urlClassificationChart.destroy();
        }
        // 대체 데이터: 경력 수준별 통계나 직무 유형을 표시
        // 여기서는 단순히 채용공고 전체 숫자를 원형 차트로 표시
        var data = {
            labels: ['채용공고'],
            datasets: [{
                    data: [recruitmentStats.total],
                    backgroundColor: ['#4caf50'], // 채용공고 - 녹색
                    borderWidth: 1
                }]
        };
        // 차트 옵션
        var options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: '채용공고 수: ' + recruitmentStats.total.toLocaleString()
                }
            }
        };
        // 차트 생성
        urlClassificationChart = new Chart(urlClassificationCanvas, {
            type: 'pie',
            data: data,
            options: options
        });
    }
    /**
     * 직무 유형 차트 렌더링
     */
    function renderJobTypesChart(jobTypeStats) {
        // 기존 차트 제거
        if (jobTypesChart) {
            jobTypesChart.destroy();
        }
        // 상위 5개 직무 유형만 표시 (정렬 후)
        var sortedTypes = Object.entries(jobTypeStats.types)
            .sort(function (a, b) { return b[1] - a[1]; })
            .slice(0, 5);
        var labels = sortedTypes.map(function (item) { return item[0] || 'Not specified'; });
        var values = sortedTypes.map(function (item) { return item[1]; });
        // 색상 배열
        var backgroundColors = [
            '#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#795548'
        ];
        // 데이터 준비
        var data = {
            labels: labels,
            datasets: [{
                    label: 'Job Type Count',
                    data: values,
                    backgroundColor: backgroundColors,
                    borderWidth: 1
                }]
        };
        // 차트 옵션
        var options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
        // 차트 생성
        jobTypesChart = new Chart(jobTypesCanvas, {
            type: 'bar',
            data: data,
            options: options
        });
    }
    /**
     * 시간별 채용공고 차트 렌더링
     */
    function renderTimelineChart(timelineData) {
        // 기존 차트 제거
        if (timelineChart) {
            timelineChart.destroy();
        }
        // 날짜 및 카운트 데이터 준비
        var labels = timelineData.map(function (item) { return item.date; });
        var counts = timelineData.map(function (item) { return item.count; });
        var data = {
            labels: labels,
            datasets: [
                {
                    label: '채용공고 수',
                    data: counts,
                    backgroundColor: 'rgba(76, 175, 80, 0.5)',
                    borderColor: '#4caf50',
                    borderWidth: 1
                }
            ]
        };
        // 차트 옵션
        var options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '날짜'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '채용공고 수'
                    }
                }
            }
        };
        // 차트 생성
        timelineChart = new Chart(timelineCanvas, {
            type: 'bar',
            data: data,
            options: options
        });
    }
});
