"use strict";
document.addEventListener('DOMContentLoaded', function () {
    // Element references
    var searchBtn = document.getElementById('search-btn');
    var keywordsInput = document.getElementById('keywords');
    var limitSelect = document.getElementById('limit');
    var resultsDiv = document.getElementById('results');
    var resultsCountDiv = document.getElementById('results-count');
    var prevPageBtn = document.getElementById('prev-page');
    var nextPageBtn = document.getElementById('next-page');
    var pageInfoSpan = document.getElementById('page-info');
    var activeKeywordsDiv = document.getElementById('active-keywords');
    // State variables
    var currentPage = 1;
    var totalResults = 0;
    var totalPages = 1;
    var currentKeywords = [];
    // API base URL - change if needed
    var API_BASE_URL = '/api';
    var GEMINI_API_URL = '/parse-cv';
    /**
     * Performs the search request to the API
     */
    function performSearch() {
        var keywords = keywordsInput.value.trim();
        var limit = limitSelect.value;
        // Update current keywords list
        currentKeywords = keywords.split(',').map(function (k) { return k.trim(); }).filter(Boolean);
        displayActiveKeywords();
        // Construct the API URL
        var apiUrl = "".concat(API_BASE_URL, "/search?keywords=").concat(encodeURIComponent(keywords), "&limit=").concat(limit, "&page=").concat(currentPage);
        // Show loading state
        resultsDiv.innerHTML = '<div class="loading">검색 중...</div>';
        // Fetch data from the API
        fetch(apiUrl)
            .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then(function (data) {
            displayResults(data);
        })
            .catch(function (error) {
            resultsDiv.innerHTML = "<p>Error: ".concat(error.message, "</p>");
            console.error('Search error:', error);
        });
    }
    /**
     * Displays active keywords as tags
     */
    function displayActiveKeywords() {
        activeKeywordsDiv.innerHTML = '';
        currentKeywords.forEach(function (keyword) {
            var keywordTag = document.createElement('span');
            keywordTag.className = 'keyword-tag';
            keywordTag.textContent = keyword;
            activeKeywordsDiv.appendChild(keywordTag);
        });
    }
    /**
     * Highlights keywords in text content
     */
    function highlightKeywords(text) {
        if (!text)
            return '';
        var highlightedText = text;
        // Escape special characters in keywords for regex use
        var escapeRegExp = function (string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
        // Highlight each keyword
        currentKeywords.forEach(function (keyword) {
            if (!keyword)
                return;
            var regex = new RegExp("(".concat(escapeRegExp(keyword), ")"), 'gi');
            highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
        });
        return highlightedText;
    }
    /**
     * Formats date for display
     */
    function formatDate(dateString) {
        if (!dateString)
            return '';
        var date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    /**
     * Parses job posting content using Gemini API
     */
    function parseCV(textContent, resultId) {
        var parseButton = document.querySelector("#parse-btn-".concat(resultId));
        var parseResultDiv = document.querySelector("#parse-result-".concat(resultId));
        parseButton.disabled = true;
        parseButton.textContent = '분석 중...';
        parseResultDiv.innerHTML = '<div class="loading-small">분석 중입니다...</div>';
        // Call backend which will use Gemini API to parse the job posting
        fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: textContent }),
        })
            .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then(function (data) {
            displayParsedData(data, parseResultDiv);
            parseButton.textContent = '채용공고 분석하기';
            parseButton.disabled = false;
        })
            .catch(function (error) {
            console.error('Job posting parsing error:', error);
            parseResultDiv.innerHTML = "<p class=\"error\">\uBD84\uC11D \uC624\uB958: ".concat(error.message, "</p>");
            parseButton.textContent = '채용공고 분석하기';
            parseButton.disabled = false;
        });
    }
    /**
     * Displays parsed job posting data
     */
    function displayParsedData(data, container) {
        var html = '';
        if (data.success) {
            html += '<div class="parsed-cv-data">';
            if (data.company_name) {
                html += "<div class=\"cv-field\"><strong>\uD68C\uC0AC\uBA85:</strong> ".concat(data.company_name, "</div>");
            }
            if (data.department) {
                html += "<div class=\"cv-field\"><strong>\uBD80\uC11C:</strong> ".concat(data.department, "</div>");
            }
            if (data.experience) {
                html += "<div class=\"cv-field\"><strong>\uACBD\uB825 \uC694\uAD6C\uC0AC\uD56D:</strong> ".concat(data.experience, "</div>");
            }
            if (data.description) {
                html += "<div class=\"cv-field\"><strong>\uC9C1\uBB34 \uC124\uBA85:</strong> ".concat(data.description, "</div>");
            }
            if (data.job_type) {
                html += "<div class=\"cv-field\"><strong>\uACE0\uC6A9 \uD615\uD0DC:</strong> ".concat(data.job_type, "</div>");
            }
            if (data.posted_period) {
                html += "<div class=\"cv-field\"><strong>\uAC8C\uC2DC \uAE30\uAC04:</strong> ".concat(data.posted_period, "</div>");
            }
            if (data.requirements) {
                html += "<div class=\"cv-field\"><strong>\uD544\uC218 \uC694\uAC74:</strong> ".concat(data.requirements, "</div>");
            }
            if (data.preferred_qualifications) {
                html += "<div class=\"cv-field\"><strong>\uC6B0\uB300 \uC0AC\uD56D:</strong> ".concat(data.preferred_qualifications, "</div>");
            }
            if (data.ideal_candidate) {
                html += "<div class=\"cv-field\"><strong>\uC774\uC0C1\uC801\uC778 \uD6C4\uBCF4\uC790:</strong> ".concat(data.ideal_candidate, "</div>");
            }
            html += '</div>';
        }
        else {
            html = "<p class=\"error\">\uC774 \uB0B4\uC6A9\uC740 \uCC44\uC6A9\uACF5\uACE0\uAC00 \uC544\uB2CC \uAC83\uC73C\uB85C \uD310\uB2E8\uB429\uB2C8\uB2E4. \uC774\uC720: ".concat(data.reason || '알 수 없는 오류', "</p>");
        }
        container.innerHTML = html;
    }
    /**
     * Displays search results
     */
    function displayResults(data) {
        resultsDiv.innerHTML = '';
        if (!data.results || data.results.length === 0) {
            resultsDiv.innerHTML = '<p>검색 결과가 없습니다.</p>';
            return;
        }
        totalResults = data.totalResults || 0;
        totalPages = data.totalPages || 1;
        var limit = parseInt(limitSelect.value);
        // Update results count
        resultsCountDiv.textContent = "".concat(totalResults, "\uAC1C \uC911 ").concat(data.results.length, "\uAC1C \uACB0\uACFC \uD45C\uC2DC");
        // Update pagination
        updatePagination(totalPages);
        // Display each result
        data.results.forEach(function (result, index) {
            var resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            // Create result header with domain
            var header = document.createElement('div');
            header.className = 'result-header';
            var domain = document.createElement('span');
            domain.className = 'result-domain';
            domain.textContent = result.domain || '알 수 없는 도메인';
            header.appendChild(domain);
            resultItem.appendChild(header);
            // URL as link
            var urlLink = document.createElement('a');
            urlLink.href = result.url;
            urlLink.target = '_blank';
            urlLink.className = 'result-url';
            urlLink.textContent = result.url;
            resultItem.appendChild(urlLink);
            // Creation date
            if (result.createdAt) {
                var date = document.createElement('div');
                date.className = 'result-date';
                date.textContent = "\uC778\uB371\uC2F1 \uB0A0\uC9DC: ".concat(formatDate(result.createdAt));
                resultItem.appendChild(date);
            }
            // Text content section heading
            var textHeading = document.createElement('h3');
            textHeading.textContent = '내용:';
            textHeading.style.marginBottom = '8px';
            textHeading.style.marginTop = '15px';
            resultItem.appendChild(textHeading);
            // Text content without toggle
            var textContent = document.createElement('div');
            textContent.className = 'result-text';
            if (result.text) {
                textContent.innerHTML = highlightKeywords(result.text);
                resultItem.appendChild(textContent);
                // Create parse container (button and results side by side)
                var parseContainer = document.createElement('div');
                parseContainer.className = 'parse-container';
                // Add parse button
                var parseButton = document.createElement('button');
                parseButton.id = "parse-btn-".concat(index);
                parseButton.className = 'parse-btn';
                parseButton.textContent = '채용공고 분석하기';
                parseContainer.appendChild(parseButton);
                // Add parse result container
                var parseResultDiv = document.createElement('div');
                parseResultDiv.id = "parse-result-".concat(index);
                parseResultDiv.className = 'parse-result';
                parseContainer.appendChild(parseResultDiv);
                // Add event listener to button
                parseButton.addEventListener('click', function () { return parseCV(result.text, index); });
                resultItem.appendChild(parseContainer);
            }
            else {
                textContent.textContent = '내용이 없습니다.';
                textContent.style.fontStyle = 'italic';
                textContent.style.color = '#888';
                resultItem.appendChild(textContent);
            }
            resultsDiv.appendChild(resultItem);
        });
    }
    /**
     * Updates pagination controls
     */
    function updatePagination(pages) {
        pageInfoSpan.textContent = "\uD398\uC774\uC9C0 ".concat(currentPage, " / ").concat(pages || 1);
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= pages;
    }
    // Event listeners
    searchBtn.addEventListener('click', function () {
        currentPage = 1;
        performSearch();
    });
    keywordsInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            currentPage = 1;
            performSearch();
        }
    });
    prevPageBtn.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            performSearch();
        }
    });
    nextPageBtn.addEventListener('click', function () {
        if (currentPage < totalPages) {
            currentPage++;
            performSearch();
        }
    });
});
