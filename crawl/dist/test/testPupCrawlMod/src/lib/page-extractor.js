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
var PageExtractor = /** @class */ (function () {
    function PageExtractor(page) {
        this.page = page;
    }
    PageExtractor.prototype.extract = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pageData, inlineScripts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.evaluate(function () {
                            // 모든 스크립트 태그 수집
                            var scriptElements = Array.from(document.querySelectorAll('script'));
                            var scripts = scriptElements.map(function (script) {
                                return {
                                    type: script.type || 'text/javascript',
                                    src: script.src || null,
                                    content: script.src ? null : script.innerHTML
                                };
                            });
                            // 모든 링크 URL 수집
                            var linkElements = Array.from(document.querySelectorAll('a[href]'));
                            var links = linkElements.map(function (link) {
                                return {
                                    href: link.href,
                                    text: link.textContent.trim() || '[No Text]',
                                    id: link.id || null,
                                    className: link.className || null,
                                    onclick: link.getAttribute('onclick') || null
                                };
                            });
                            // onclick 속성을 가진 모든 요소 수집
                            var onclickElements = Array.from(document.querySelectorAll('[onclick]'));
                            var onclicks = onclickElements.map(function (element) {
                                return {
                                    tagName: element.tagName,
                                    id: element.id || null,
                                    className: element.className || null,
                                    onclick: element.getAttribute('onclick'),
                                    text: element.textContent.trim() || '[No Text]'
                                };
                            });
                            return { scripts: scripts, links: links, onclicks: onclicks };
                        })];
                    case 1:
                        pageData = _a.sent();
                        inlineScripts = pageData.scripts.filter(function (script) { return script.content && !script.src; });
                        // 결과 객체에 인라인 스크립트 추가
                        pageData.inlineScripts = inlineScripts;
                        return [2 /*return*/, pageData];
                }
            });
        });
    };
    return PageExtractor;
}());
module.exports = { PageExtractor: PageExtractor };
