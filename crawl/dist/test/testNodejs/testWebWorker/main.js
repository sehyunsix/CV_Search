"use strict";
console.log('hello from main.js');
var worker = new Worker('worker.js');
worker.onmessage = function (msg) {
    console.log('message received from worker', msg.data);
};
worker.postMessage('message sent to worker');
console.log('hello from end of main');
