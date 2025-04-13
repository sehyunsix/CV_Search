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
var currentPage = 1;
var totalPages = 1;
var jobsPerPage = 10;
var currentJobs = [];
var filters = {
    jobType: '',
    experience: '',
    searchText: '',
    sortBy: 'created_at'
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
        loadJobListings();
    });
    document.getElementById('reset-filters').addEventListener('click', function () {
        currentPage = 1;
        document.getElementById('job-type').value = '';
        document.getElementById('experience').value = '';
        document.getElementById('search-text').value = '';
        document.getElementById('sort-by').value = 'created_at';
        filters = {
            jobType: '',
            experience: '',
            searchText: '',
            sortBy: 'created_at'
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
        var jobsContainer, apiUrl, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    jobsContainer = document.getElementById('jobs-container');
                    jobsContainer.innerHTML = '<div class="loading">Loading job listings...</div>';
                    apiUrl = "/api/mysql-jobs?page=".concat(currentPage, "&limit=").concat(jobsPerPage);
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
                    // Update the results count
                    document.getElementById('results-count').textContent = "Showing ".concat(currentJobs.length, " of ").concat(data.total, " job listings");
                    // Display the jobs
                    displayJobs(currentJobs);
                    // Update pagination controls
                    updatePagination();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error loading job listings:', error_1);
                    document.getElementById('jobs-container').innerHTML = "\n            <div class=\"error\">\n                <p>Error loading job listings. Please try again later.</p>\n                <p>Details: ".concat(error_1.message, "</p>\n            </div>\n        ");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Function to load filter options dynamically from available data
function loadFilterOptions() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, jobTypeSelect_1, experienceSelect_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/api/mysql-jobs/filters')];
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
                    error_2 = _a.sent();
                    console.error('Error loading filter options:', error_2);
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
        var postedDate = job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'Unknown';
        var expiryDate = job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Unknown';
        // Create the job card HTML
        var jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = "\n            <span class=\"mysql-info\">MySQL Stored</span>\n            <h3 class=\"job-title\">".concat(escapeHtml(job.title || 'Untitled Position'), "</h3>\n            <h4 class=\"company-name\">").concat(escapeHtml(job.company_name || 'Unknown Company'), "</h4>\n\n            <div class=\"job-meta\">\n                ").concat(job.department ? "<span class=\"department\">".concat(escapeHtml(job.department), "</span>") : '', "\n                ").concat(job.job_type ? "<span class=\"job-type\">".concat(escapeHtml(job.job_type), "</span>") : '', "\n                ").concat(job.experience ? "<span class=\"experience\">".concat(escapeHtml(job.experience), "</span>") : '', "\n            </div>\n\n            <div class=\"job-dates\">\n                <span class=\"posted-date\">Posted: ").concat(postedDate, "</span>\n                <span class=\"expiry-date\">Expires: ").concat(expiryDate, "</span>\n            </div>\n\n            <p class=\"job-description\">").concat(truncateText(job.description || 'No description available.', 150), "</p>\n\n            <div class=\"job-actions\">\n                <button class=\"view-details-btn\" data-job-id=\"").concat(job.id, "\">View Details</button>\n                ").concat(job.url ? "<a href=\"".concat(job.url, "\" target=\"_blank\" class=\"visit-site-btn\">Visit Original Post</a>") : '', "\n            </div>\n        ");
        jobsContainer.appendChild(jobCard);
    });
    // Add event listeners to the "View Details" buttons
    document.querySelectorAll('.view-details-btn').forEach(function (button) {
        button.addEventListener('click', function (event) {
            var jobId = event.target.getAttribute('data-job-id');
            var job = currentJobs.find(function (j) { return j.id == jobId; });
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
function showJobDetails(job) {
    var modal = document.getElementById('job-modal');
    var jobDetails = document.getElementById('job-details');
    // Format dates
    var postedDate = job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'Unknown';
    var endDate = job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Unknown';
    // Construct the modal content
    jobDetails.innerHTML = "\n        <div class=\"modal-header\">\n            <h2>".concat(escapeHtml(job.title || 'Untitled Position'), "</h2>\n            <h3>").concat(escapeHtml(job.company_name || 'Unknown Company'), "</h3>\n            <div class=\"mysql-tag\">MySQL Stored</div>\n        </div>\n\n        <div class=\"job-info-grid\">\n            <div class=\"info-group\">\n                <h4>Job Details</h4>\n                <ul>\n                    ").concat(job.department ? "<li><strong>Department:</strong> ".concat(escapeHtml(job.department), "</li>") : '', "\n                    ").concat(job.job_type ? "<li><strong>Job Type:</strong> ".concat(escapeHtml(job.job_type), "</li>") : '', "\n                    ").concat(job.experience ? "<li><strong>Experience Required:</strong> ".concat(escapeHtml(job.experience), "</li>") : '', "\n                </ul>\n            </div>\n\n            <div class=\"info-group\">\n                <h4>Dates</h4>\n                <ul>\n                    <li><strong>Posted Date:</strong> ").concat(postedDate, "</li>\n                    <li><strong>End Date:</strong> ").concat(endDate, "</li>\n                </ul>\n            </div>\n        </div>\n\n        <div class=\"job-description-section\">\n            <h4>Job Description</h4>\n            <p>").concat(formatMultiLineText(job.description || 'No description available.'), "</p>\n        </div>\n\n        ").concat(job.requirements ? "\n        <div class=\"job-requirements-section\">\n            <h4>Requirements</h4>\n            <p>".concat(formatMultiLineText(job.requirements), "</p>\n        </div>\n        ") : '', "\n\n        ").concat(job.preferred_qualifications ? "\n        <div class=\"job-qualifications-section\">\n            <h4>Preferred Qualifications</h4>\n            <p>".concat(formatMultiLineText(job.preferred_qualifications), "</p>\n        </div>\n        ") : '', "\n\n        ").concat(job.ideal_candidate ? "\n        <div class=\"job-candidate-section\">\n            <h4>Ideal Candidate</h4>\n            <p>".concat(formatMultiLineText(job.ideal_candidate), "</p>\n        </div>\n        ") : '', "\n\n        <div class=\"job-actions-footer\">\n            ").concat(job.url ? "<a href=\"".concat(job.url, "\" target=\"_blank\" class=\"btn primary-btn\">Visit Original Post</a>") : '', "\n            <button class=\"btn secondary-btn close-modal-btn\">Close</button>\n        </div>\n    ");
    // Add event listener to the close button in the modal
    document.querySelector('.close-modal-btn').addEventListener('click', function () {
        modal.style.display = 'none';
    });
    // Display the modal
    modal.style.display = 'block';
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
