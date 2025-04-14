"use strict";
var BaseWorkerManager = require('@crawl/baseWorkerManager').BaseWorkerManager;
var _a = require('@crawl/urlManager'), extractDomain = _a.extractDomain, isUrlAllowed = _a.isUrlAllowed;
// 모킹 설정
jest.mock('@database/mongodb-service');
jest.mock('puppeteer');
jest.mock('@crawl/baseWorker');
jest.mock('@config/config');
describe('BaseWorkerManager - isUrlAllowed', function () {
    var manager;
    beforeEach(function () {
        manager = new BaseWorkerManager({
            startUrl: 'https://example.com',
            baseDomain: 'example.com',
        });
        // extractDomain 함수 모킹
        manager.extractDomain = jest.fn(function (url) {
            try {
                return new URL(url).hostname;
            }
            catch (error) {
                return 'invalid-domain';
            }
        });
    });
    test('허용된 도메인 확인', function () {
        var allowedDomains = ['example.com', 'test.com'];
        // 허용되어야 하는 URL들
        var allowedUrls = [
            'https://example.com',
            'https://www.example.com',
            'https://sub.test.com/path',
            'http://test.com/page?query=1',
        ];
        allowedUrls.forEach(function (url) {
            expect(isUrlAllowed(url, allowedDomains)).toBe(true);
        });
    });
    test('허용되지 않은 도메인 확인', function () {
        var allowedDomains = ['example.com', 'test.com'];
        // 허용되지 않아야 하는 URL들
        var disallowedUrls = [
            'https://example.org',
            'https://test.org',
            'https://another-domain.com',
            'https://subdomain.another-domain.com',
        ];
        disallowedUrls.forEach(function (url) {
            expect(isUrlAllowed(url, allowedDomains)).toBe(false);
        });
    });
    test('잘못된 URL 처리', function () {
        var allowedDomains = ['example.com'];
        // 잘못된 형식의 URL
        var invalidUrls = [
            'invalid-url',
            'example.com', // 프로토콜이 없어 유효하지 않음
            'ftp://example.com', // 지원되지 않는 프로토콜
        ];
        invalidUrls.forEach(function (url) {
            expect(isUrlAllowed(url, allowedDomains)).toBe(false);
        });
    });
});
