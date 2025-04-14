"use strict";
console.log('hello from worker.js');
self.onmessage = function (msg) {
    console.log('message from main', msg.data);
    postMessage('message sent from worker');
};
