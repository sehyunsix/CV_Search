"use strict";
// src/utils/UrlTracker.js
var UrlTracker = /** @class */ (function () {
    function UrlTracker() {
        this.urls = new Set();
    }
    UrlTracker.prototype.addUrl = function (url) {
        if (url && typeof url === 'string' && url.startsWith('http')) {
            this.urls.add(url);
            return true;
        }
        return false;
    };
    UrlTracker.prototype.addUrlsFromLinks = function (links) {
        var _this = this;
        var count = 0;
        links.forEach(function (link) {
            if (_this.addUrl(link.href))
                count++;
        });
        return count;
    };
    UrlTracker.prototype.addUrlsFromScripts = function (scripts) {
        var _this = this;
        var count = 0;
        scripts.forEach(function (script) {
            if (script.src && _this.addUrl(script.src))
                count++;
        });
        return count;
    };
    UrlTracker.prototype.getAllUrls = function () {
        return Array.from(this.urls);
    };
    UrlTracker.prototype.hasUrl = function (url) {
        return this.urls.has(url);
    };
    UrlTracker.prototype.size = function () {
        return this.urls.size;
    };
    return UrlTracker;
}());
