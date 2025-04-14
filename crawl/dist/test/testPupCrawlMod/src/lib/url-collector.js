"use strict";
var URLCollector = /** @class */ (function () {
    function URLCollector() {
        this.urls = new Set();
    }
    URLCollector.prototype.add = function (url) {
        if (url && typeof url === 'string' && url.startsWith('http')) {
            this.urls.add(url);
            return true;
        }
        return false;
    };
    URLCollector.prototype.addMultiple = function (urls) {
        if (!Array.isArray(urls))
            return 0;
        var added = 0;
        for (var _i = 0, urls_1 = urls; _i < urls_1.length; _i++) {
            var url = urls_1[_i];
            if (this.add(url))
                added++;
        }
        return added;
    };
    URLCollector.prototype.addFromLinks = function (links) {
        var _this = this;
        var added = links
            .filter(function (link) { return link.href && typeof link.href === 'string'; })
            .map(function (link) { return _this.add(link.href); })
            .filter(Boolean)
            .length;
        return added;
    };
    URLCollector.prototype.addFromScripts = function (scripts) {
        var _this = this;
        var added = scripts
            .filter(function (script) { return script.src && typeof script.src === 'string'; })
            .map(function (script) { return _this.add(script.src); })
            .filter(Boolean)
            .length;
        return added;
    };
    URLCollector.prototype.has = function (url) {
        return this.urls.has(url);
    };
    URLCollector.prototype.getUrls = function () {
        return this.urls;
    };
    URLCollector.prototype.getUrlsArray = function () {
        return Array.from(this.urls);
    };
    URLCollector.prototype.size = function () {
        return this.urls.size;
    };
    URLCollector.prototype.clear = function () {
        this.urls.clear();
    };
    return URLCollector;
}());
module.exports = { URLCollector: URLCollector };
