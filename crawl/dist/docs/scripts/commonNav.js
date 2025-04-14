"use strict";
if (typeof fetch === 'function') {
    var init_1 = function () {
        if (typeof scrollToNavItem !== 'function')
            return false;
        scrollToNavItem();
        // hideAllButCurrent not always loaded
        if (typeof hideAllButCurrent === 'function')
            hideAllButCurrent();
        return true;
    };
    fetch('./nav.inc.html')
        .then(function (response) { return response.ok ? response.text() : "".concat(response.url, " => ").concat(response.status, " ").concat(response.statusText); })
        .then(function (body) {
        document.querySelector('nav').innerHTML += body;
        // nav.js should be quicker to load than nav.inc.html, a fallback just in case
        return init_1();
    })
        .then(function (done) {
        if (done)
            return;
        var i = 0;
        (function waitUntilNavJs() {
            if (init_1())
                return;
            if (i++ < 100)
                return setTimeout(waitUntilNavJs, 300);
            console.error(Error('nav.js not loaded after 30s waiting for it'));
        })();
    })
        .catch(function (error) { return console.error(error); });
}
else {
    console.error(Error('Browser too old to display commonNav (remove commonNav docdash option)'));
}
