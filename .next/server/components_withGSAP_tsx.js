"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "components_withGSAP_tsx";
exports.ids = ["components_withGSAP_tsx"];
exports.modules = {

/***/ "./components/withGSAP.tsx":
/*!*********************************!*\
  !*** ./components/withGSAP.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst WithGSAP = ({ children })=>{\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Import GSAP only on client-side\n        const importGSAP = async ()=>{\n            const gsapModule = await Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(__webpack_require__, /*! gsap */ \"gsap\", 23));\n            const ScrollTriggerModule = await Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(__webpack_require__, /*! gsap/dist/ScrollTrigger */ \"gsap/dist/ScrollTrigger\", 23));\n            const gsap = gsapModule.default;\n            const { ScrollTrigger } = ScrollTriggerModule;\n            gsap.registerPlugin(ScrollTrigger);\n        // Initialize GSAP animations here\n        // ...\n        };\n        importGSAP();\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: children\n    }, void 0, false);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WithGSAP);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL3dpdGhHU0FQLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBb0Q7QUFNcEQsTUFBTUUsV0FBb0MsQ0FBQyxFQUFFQyxRQUFRLEVBQUU7SUFDckRGLGdEQUFTQSxDQUFDO1FBQ1Isa0NBQWtDO1FBQ2xDLE1BQU1HLGFBQWE7WUFDakIsTUFBTUMsYUFBYSxNQUFNLDhHQUFPO1lBQ2hDLE1BQU1DLHNCQUFzQixNQUFNLG9KQUFPO1lBRXpDLE1BQU1DLE9BQU9GLFdBQVdHLE9BQU87WUFDL0IsTUFBTSxFQUFFQyxhQUFhLEVBQUUsR0FBR0g7WUFFMUJDLEtBQUtHLGNBQWMsQ0FBQ0Q7UUFFcEIsa0NBQWtDO1FBQ2xDLE1BQU07UUFDUjtRQUVBTDtJQUNGLEdBQUcsRUFBRTtJQUVMLHFCQUFPO2tCQUFHRDs7QUFDWjtBQUVBLGlFQUFlRCxRQUFRQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmlsbGEtYm9va2luZy8uL2NvbXBvbmVudHMvd2l0aEdTQVAudHN4PzgwMmQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnO1xuXG5pbnRlcmZhY2UgV2l0aEdTQVBQcm9wcyB7XG4gIGNoaWxkcmVuOiBSZWFjdE5vZGU7XG59XG5cbmNvbnN0IFdpdGhHU0FQOiBSZWFjdC5GQzxXaXRoR1NBUFByb3BzPiA9ICh7IGNoaWxkcmVuIH0pID0+IHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBJbXBvcnQgR1NBUCBvbmx5IG9uIGNsaWVudC1zaWRlXG4gICAgY29uc3QgaW1wb3J0R1NBUCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGdzYXBNb2R1bGUgPSBhd2FpdCBpbXBvcnQoJ2dzYXAnKTtcbiAgICAgIGNvbnN0IFNjcm9sbFRyaWdnZXJNb2R1bGUgPSBhd2FpdCBpbXBvcnQoJ2dzYXAvZGlzdC9TY3JvbGxUcmlnZ2VyJyk7XG4gICAgICBcbiAgICAgIGNvbnN0IGdzYXAgPSBnc2FwTW9kdWxlLmRlZmF1bHQ7XG4gICAgICBjb25zdCB7IFNjcm9sbFRyaWdnZXIgfSA9IFNjcm9sbFRyaWdnZXJNb2R1bGU7XG4gICAgICBcbiAgICAgIGdzYXAucmVnaXN0ZXJQbHVnaW4oU2Nyb2xsVHJpZ2dlcik7XG4gICAgICBcbiAgICAgIC8vIEluaXRpYWxpemUgR1NBUCBhbmltYXRpb25zIGhlcmVcbiAgICAgIC8vIC4uLlxuICAgIH07XG4gICAgXG4gICAgaW1wb3J0R1NBUCgpO1xuICB9LCBbXSk7XG4gIFxuICByZXR1cm4gPD57Y2hpbGRyZW59PC8+O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgV2l0aEdTQVA7ICJdLCJuYW1lcyI6WyJSZWFjdCIsInVzZUVmZmVjdCIsIldpdGhHU0FQIiwiY2hpbGRyZW4iLCJpbXBvcnRHU0FQIiwiZ3NhcE1vZHVsZSIsIlNjcm9sbFRyaWdnZXJNb2R1bGUiLCJnc2FwIiwiZGVmYXVsdCIsIlNjcm9sbFRyaWdnZXIiLCJyZWdpc3RlclBsdWdpbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/withGSAP.tsx\n");

/***/ })

};
;