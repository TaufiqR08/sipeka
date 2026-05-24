"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "instrumentation";
exports.ids = ["instrumentation"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "(instrument)/./src/instrumentation.ts":
/*!********************************!*\
  !*** ./src/instrumentation.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   register: () => (/* binding */ register)\n/* harmony export */ });\n// Next.js Instrumentation — dijalankan otomatis saat server startup\n// Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation\nasync function register() {\n    // Hanya jalankan di server (Node.js runtime), bukan di edge\n    if (true) {\n        const { startNotifCron, noteNotifWaktu, noteNotifWaktuBrida } = await Promise.all(/*! import() */[__webpack_require__.e(\"vendor-chunks/node-cron\"), __webpack_require__.e(\"_instrument_src_lib_cron_notifCron_ts\")]).then(__webpack_require__.bind(__webpack_require__, /*! @/lib/cron/notifCron */ \"(instrument)/./src/lib/cron/notifCron.ts\"));\n        startNotifCron();\n        noteNotifWaktu();\n        noteNotifWaktuBrida();\n        console.log(\"✅ Cron jobs started via instrumentation\");\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGluc3RydW1lbnQpLy4vc3JjL2luc3RydW1lbnRhdGlvbi50cyIsIm1hcHBpbmdzIjoiOzs7O0FBQUEsb0VBQW9FO0FBQ3BFLHlGQUF5RjtBQUVsRixlQUFlQTtJQUNwQiw0REFBNEQ7SUFDNUQsSUFBSUMsSUFBcUMsRUFBRTtRQUN6QyxNQUFNLEVBQUVHLGNBQWMsRUFBRUMsY0FBYyxFQUFFQyxtQkFBbUIsRUFBRSxHQUFHLE1BQU0sMFFBQ3BFO1FBR0ZGO1FBQ0FDO1FBQ0FDO1FBRUFDLFFBQVFDLEdBQUcsQ0FBQztJQUNkO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaW1wZWcta2VzYmFuZ3BvbC8uL3NyYy9pbnN0cnVtZW50YXRpb24udHM/NGZhYiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBOZXh0LmpzIEluc3RydW1lbnRhdGlvbiDigJQgZGlqYWxhbmthbiBvdG9tYXRpcyBzYWF0IHNlcnZlciBzdGFydHVwXG4vLyBEb2NzOiBodHRwczovL25leHRqcy5vcmcvZG9jcy9hcHAvYnVpbGRpbmcteW91ci1hcHBsaWNhdGlvbi9vcHRpbWl6aW5nL2luc3RydW1lbnRhdGlvblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG4gIC8vIEhhbnlhIGphbGFua2FuIGRpIHNlcnZlciAoTm9kZS5qcyBydW50aW1lKSwgYnVrYW4gZGkgZWRnZVxuICBpZiAocHJvY2Vzcy5lbnYuTkVYVF9SVU5USU1FID09PSBcIm5vZGVqc1wiKSB7XG4gICAgY29uc3QgeyBzdGFydE5vdGlmQ3Jvbiwgbm90ZU5vdGlmV2FrdHUsIG5vdGVOb3RpZldha3R1QnJpZGEgfSA9IGF3YWl0IGltcG9ydChcbiAgICAgIFwiQC9saWIvY3Jvbi9ub3RpZkNyb25cIlxuICAgICk7XG5cbiAgICBzdGFydE5vdGlmQ3JvbigpO1xuICAgIG5vdGVOb3RpZldha3R1KCk7XG4gICAgbm90ZU5vdGlmV2FrdHVCcmlkYSgpO1xuXG4gICAgY29uc29sZS5sb2coXCLinIUgQ3JvbiBqb2JzIHN0YXJ0ZWQgdmlhIGluc3RydW1lbnRhdGlvblwiKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbInJlZ2lzdGVyIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUlVOVElNRSIsInN0YXJ0Tm90aWZDcm9uIiwibm90ZU5vdGlmV2FrdHUiLCJub3RlTm90aWZXYWt0dUJyaWRhIiwiY29uc29sZSIsImxvZyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(instrument)/./src/instrumentation.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("./webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(instrument)/./src/instrumentation.ts"));
module.exports = __webpack_exports__;

})();