/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib.ts":
/*!****************!*\
  !*** ./lib.ts ***!
  \****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "merge": () => (/* binding */ merge),
/* harmony export */   "roundTo": () => (/* binding */ roundTo),
/* harmony export */   "platforms": () => (/* binding */ platforms),
/* harmony export */   "lineHeightsToEm": () => (/* binding */ lineHeightsToEm),
/* harmony export */   "letterSpacing": () => (/* binding */ letterSpacing),
/* harmony export */   "sanitizeName": () => (/* binding */ sanitizeName),
/* harmony export */   "sanitizeFileName": () => (/* binding */ sanitizeFileName),
/* harmony export */   "hasDensityInFilename": () => (/* binding */ hasDensityInFilename),
/* harmony export */   "hasComponentInFilename": () => (/* binding */ hasComponentInFilename),
/* harmony export */   "themeName": () => (/* binding */ themeName)
/* harmony export */ });
// from https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6#gistcomment-3585151
const merge = (target, source) => {
    const result = Object.assign(Object.assign({}, target), source);
    const keys = Object.keys(result);
    for (const key of keys) {
        const tprop = target[key];
        const sprop = source[key];
        if (typeof tprop == 'object' && typeof sprop == 'object') {
            result[key] = merge(tprop, sprop);
        }
    }
    return result;
};
// round num to nearest multiple, i.e. 1.22 => 1.25
const roundTo = (num, multiple) => multiple * Math.round(num / multiple);
// mappings from Figma to Prism Semantics
const platforms = { Mobile: 'mobileWidth', Desktop: 'desktopWidth' };
// convert lineHeights in pixels to em, rounded by 0.125
const lineHeightsToEm = (lineHeightInPx, sizeInPx) => roundTo(lineHeightInPx / sizeInPx, 0.125);
// map percentage range [-2, 2] to semantic range [400, 800]
const letterSpacing = (percentage) => percentage * 100 + 600;
// convert string "Label 1 - Emphasis" => "Label1Emphasis"
const sanitizeName = (name) => name.replace(/[^a-zA-Z0-9]/g, '');
// generate file name "Label 1 - Emphasis" => "label1-emphasis"
const sanitizeFileName = (name) => name.replace(/[^a-zA-Z0-9]/g, '');
// check if fileName includes density type
const hasDensityInFilename = (name) => name.match(/\b(Regular|Expanded|Dense)+/gi);
// check if fileName includes components value
const hasComponentInFilename = (name) => name.match(/\b(Component)/gi);
// get themeName from fileName
const themeName = (name) => name
    .match(/\b(CxDx|CAVx|MxTx)+/g)
    .map(theme => {
    const mapping = {
        CxDx: 'default',
        CAVx: 'caviar',
        MxTx: 'merchant',
    };
    return mapping[theme];
})
    .pop()
    .toLowerCase();


/***/ }),

/***/ "./tokens.ts":
/*!*******************!*\
  !*** ./tokens.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sizes": () => (/* binding */ sizes),
/* harmony export */   "weights": () => (/* binding */ weights),
/* harmony export */   "lineHeightsPxToTokens": () => (/* binding */ lineHeightsPxToTokens)
/* harmony export */ });
// TODO: use theme-definitions default/typography/tokens/sizes.json
const sizes = {
    8: 100,
    10: 200,
    12: 300,
    14: 400,
    16: 500,
    18: 600,
    20: 700,
    22: 800,
    24: 900,
    32: 1000,
    40: 1100,
    48: 1200,
    56: 1300,
    64: 1400,
    72: 1500,
};
// TODO: use theme-definitions default/typography/tokens/weights.json
const weights = {
    Regular: 400,
    Medium: 500,
    Bold: 700,
    Extrabold: 800,
};
// TODO: use theme-definitions default/typography/tokens/line-heights.json
const lineHeightsPxToTokens = {
    8: 100,
    10: 200,
    12: 300,
    14: 400,
    16: 500,
    18: 600,
    20: 700,
    22: 800,
    24: 900,
    28: 1000,
    32: 1100,
    36: 1200,
    40: 1300,
    44: 1400,
    48: 1500,
    56: 1600,
    64: 1700,
    72: 1800,
    80: 1900,
    96: 2000,
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************!*\
  !*** ./code.ts ***!
  \*****************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib */ "./lib.ts");
/* harmony import */ var _tokens__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tokens */ "./tokens.ts");


const figmaName = figma.root.name;
// get density based on file name, default to "regular"
const density = (0,_lib__WEBPACK_IMPORTED_MODULE_0__.hasDensityInFilename)(figmaName) ? (0,_lib__WEBPACK_IMPORTED_MODULE_0__.hasDensityInFilename)(figmaName).find(Boolean).toLowerCase() : 'regular';
// construct filename, ie
// - typography-tokens-doordash-expanded.json or
// - typography-tokens-caviar-regular-components.json
const fileName = `typography-tokens-${(0,_lib__WEBPACK_IMPORTED_MODULE_0__.themeName)(figmaName)}-${(0,_lib__WEBPACK_IMPORTED_MODULE_0__.hasComponentInFilename)(figmaName) ? `components` : density}.json`;
const styles = []; // list of semantics from figma
const mobile = {}; // map of mobile definitions for semantic style
const desktop = {}; // map desktop definitions (will be merged with mobile dictionary)
// loop over Figma styles
for (const style of figma.getLocalTextStyles()) {
    let [platform, name] = style.name.replace(/\s/g, '').split('/');
    if (platform !== 'Mobile' && platform !== 'Desktop') {
        // assuming component styles
        name = style.name.replace(/\//g, '');
        platform = 'Mobile';
    }
    else {
        name = name || platform; // if name is undefined, fall back to platform value
        platform = _lib__WEBPACK_IMPORTED_MODULE_0__.platforms[platform] == undefined ? 'Mobile' : platform; // use Mobile if mapping fails
    }
    const semantic = {
        name: (0,_lib__WEBPACK_IMPORTED_MODULE_0__.sanitizeName)(name),
        density: (density + 'Density'),
        platform: _lib__WEBPACK_IMPORTED_MODULE_0__.platforms[platform],
        size: _tokens__WEBPACK_IMPORTED_MODULE_1__.sizes[style.fontSize],
        weight: _tokens__WEBPACK_IMPORTED_MODULE_1__.weights[style.fontName.style],
        lineHeight: _tokens__WEBPACK_IMPORTED_MODULE_1__.lineHeightsPxToTokens[style.lineHeight['value']],
        letterSpacing: (0,_lib__WEBPACK_IMPORTED_MODULE_0__.letterSpacing)(style.letterSpacing.value),
    };
    styles.push(semantic);
}
for (const index in styles) {
    const style = styles[index];
    const definition = {
        [style.density]: {
            [style.platform]: {
                size: { value: `{typography.tokens.sizes.${style.size}.value}` },
                weight: { value: `{typography.semantics.weights.${style.weight}.value}` },
                lineHeight: { value: `{typography.tokens.lineHeights.${style.lineHeight}.value}` },
                letterSpacing: { value: `{typography.tokens.letterSpacings.${style.letterSpacing}.value}` },
            },
        },
    };
    style.platform == _lib__WEBPACK_IMPORTED_MODULE_0__.platforms.Mobile ? (mobile[style.name] = definition) : (desktop[style.name] = definition);
}
const outputForUI = {
    themeName: _lib__WEBPACK_IMPORTED_MODULE_0__.themeName,
    density,
    fileName,
    json: {
        textStyle: {
            semantics: (0,_lib__WEBPACK_IMPORTED_MODULE_0__.merge)(mobile, desktop),
        },
    },
};
figma.showUI(__html__, { width: 400, height: 400 });
figma.ui.postMessage(JSON.stringify(outputForUI));
// debugging output that will save time 'out in the field'
console.log('🛠 [Prism Tools] styles', styles);
console.log('🛠 [Prism Tools] outputForUI', outputForUI);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9saWIudHMiLCJ3ZWJwYWNrOi8vLy4vdG9rZW5zLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNPO0FBQ1AsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ08sbUJBQW1CO0FBQzFCO0FBQ087QUFDUDtBQUNPO0FBQ1A7QUFDTztBQUNQO0FBQ087QUFDUDtBQUNPO0FBQ1A7QUFDTztBQUNQO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQy9DQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7QUNOK0g7QUFDOUQ7QUFDakU7QUFDQTtBQUNBLGdCQUFnQiwwREFBb0IsY0FBYywwREFBb0I7QUFDdEU7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLCtDQUFTLFlBQVksR0FBRyw0REFBc0IscUNBQXFDO0FBQ3pILGtCQUFrQjtBQUNsQixrQkFBa0I7QUFDbEIsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQyxtQkFBbUIsMkNBQVMsOENBQThDO0FBQzFFO0FBQ0E7QUFDQSxjQUFjLGtEQUFZO0FBQzFCO0FBQ0Esa0JBQWtCLDJDQUFTO0FBQzNCLGNBQWMsMENBQUs7QUFDbkIsZ0JBQWdCLDRDQUFPO0FBQ3ZCLG9CQUFvQiwwREFBcUI7QUFDekMsdUJBQXVCLG1EQUFhO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsVUFBVSwwQkFBMEIsV0FBVyxPQUFPLEdBQUc7QUFDaEYseUJBQXlCLFVBQVUsK0JBQStCLGFBQWEsT0FBTyxHQUFHO0FBQ3pGLDZCQUE2QixVQUFVLGdDQUFnQyxpQkFBaUIsT0FBTyxHQUFHO0FBQ2xHLGdDQUFnQyxVQUFVLG1DQUFtQyxvQkFBb0IsT0FBTyxHQUFHO0FBQzNHLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQSxzQkFBc0Isa0RBQWdCO0FBQ3RDO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsMkNBQUs7QUFDNUIsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGZyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vYWh0Y3gvMGNkOTRlNjI2OTFmNTM5MTYwYjMyZWNkYTE4YWYzZDYjZ2lzdGNvbW1lbnQtMzU4NTE1MVxuZXhwb3J0IGNvbnN0IG1lcmdlID0gKHRhcmdldCwgc291cmNlKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCB0YXJnZXQpLCBzb3VyY2UpO1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhyZXN1bHQpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgICAgY29uc3QgdHByb3AgPSB0YXJnZXRba2V5XTtcbiAgICAgICAgY29uc3Qgc3Byb3AgPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiB0cHJvcCA9PSAnb2JqZWN0JyAmJiB0eXBlb2Ygc3Byb3AgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UodHByb3AsIHNwcm9wKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbi8vIHJvdW5kIG51bSB0byBuZWFyZXN0IG11bHRpcGxlLCBpLmUuIDEuMjIgPT4gMS4yNVxuZXhwb3J0IGNvbnN0IHJvdW5kVG8gPSAobnVtLCBtdWx0aXBsZSkgPT4gbXVsdGlwbGUgKiBNYXRoLnJvdW5kKG51bSAvIG11bHRpcGxlKTtcbi8vIG1hcHBpbmdzIGZyb20gRmlnbWEgdG8gUHJpc20gU2VtYW50aWNzXG5leHBvcnQgY29uc3QgcGxhdGZvcm1zID0geyBNb2JpbGU6ICdtb2JpbGVXaWR0aCcsIERlc2t0b3A6ICdkZXNrdG9wV2lkdGgnIH07XG4vLyBjb252ZXJ0IGxpbmVIZWlnaHRzIGluIHBpeGVscyB0byBlbSwgcm91bmRlZCBieSAwLjEyNVxuZXhwb3J0IGNvbnN0IGxpbmVIZWlnaHRzVG9FbSA9IChsaW5lSGVpZ2h0SW5QeCwgc2l6ZUluUHgpID0+IHJvdW5kVG8obGluZUhlaWdodEluUHggLyBzaXplSW5QeCwgMC4xMjUpO1xuLy8gbWFwIHBlcmNlbnRhZ2UgcmFuZ2UgWy0yLCAyXSB0byBzZW1hbnRpYyByYW5nZSBbNDAwLCA4MDBdXG5leHBvcnQgY29uc3QgbGV0dGVyU3BhY2luZyA9IChwZXJjZW50YWdlKSA9PiBwZXJjZW50YWdlICogMTAwICsgNjAwO1xuLy8gY29udmVydCBzdHJpbmcgXCJMYWJlbCAxIC0gRW1waGFzaXNcIiA9PiBcIkxhYmVsMUVtcGhhc2lzXCJcbmV4cG9ydCBjb25zdCBzYW5pdGl6ZU5hbWUgPSAobmFtZSkgPT4gbmFtZS5yZXBsYWNlKC9bXmEtekEtWjAtOV0vZywgJycpO1xuLy8gZ2VuZXJhdGUgZmlsZSBuYW1lIFwiTGFiZWwgMSAtIEVtcGhhc2lzXCIgPT4gXCJsYWJlbDEtZW1waGFzaXNcIlxuZXhwb3J0IGNvbnN0IHNhbml0aXplRmlsZU5hbWUgPSAobmFtZSkgPT4gbmFtZS5yZXBsYWNlKC9bXmEtekEtWjAtOV0vZywgJycpO1xuLy8gY2hlY2sgaWYgZmlsZU5hbWUgaW5jbHVkZXMgZGVuc2l0eSB0eXBlXG5leHBvcnQgY29uc3QgaGFzRGVuc2l0eUluRmlsZW5hbWUgPSAobmFtZSkgPT4gbmFtZS5tYXRjaCgvXFxiKFJlZ3VsYXJ8RXhwYW5kZWR8RGVuc2UpKy9naSk7XG4vLyBjaGVjayBpZiBmaWxlTmFtZSBpbmNsdWRlcyBjb21wb25lbnRzIHZhbHVlXG5leHBvcnQgY29uc3QgaGFzQ29tcG9uZW50SW5GaWxlbmFtZSA9IChuYW1lKSA9PiBuYW1lLm1hdGNoKC9cXGIoQ29tcG9uZW50KS9naSk7XG4vLyBnZXQgdGhlbWVOYW1lIGZyb20gZmlsZU5hbWVcbmV4cG9ydCBjb25zdCB0aGVtZU5hbWUgPSAobmFtZSkgPT4gbmFtZVxuICAgIC5tYXRjaCgvXFxiKEN4RHh8Q0FWeHxNeFR4KSsvZylcbiAgICAubWFwKHRoZW1lID0+IHtcbiAgICBjb25zdCBtYXBwaW5nID0ge1xuICAgICAgICBDeER4OiAnZGVmYXVsdCcsXG4gICAgICAgIENBVng6ICdjYXZpYXInLFxuICAgICAgICBNeFR4OiAnbWVyY2hhbnQnLFxuICAgIH07XG4gICAgcmV0dXJuIG1hcHBpbmdbdGhlbWVdO1xufSlcbiAgICAucG9wKClcbiAgICAudG9Mb3dlckNhc2UoKTtcbiIsIi8vIFRPRE86IHVzZSB0aGVtZS1kZWZpbml0aW9ucyBkZWZhdWx0L3R5cG9ncmFwaHkvdG9rZW5zL3NpemVzLmpzb25cbmV4cG9ydCBjb25zdCBzaXplcyA9IHtcbiAgICA4OiAxMDAsXG4gICAgMTA6IDIwMCxcbiAgICAxMjogMzAwLFxuICAgIDE0OiA0MDAsXG4gICAgMTY6IDUwMCxcbiAgICAxODogNjAwLFxuICAgIDIwOiA3MDAsXG4gICAgMjI6IDgwMCxcbiAgICAyNDogOTAwLFxuICAgIDMyOiAxMDAwLFxuICAgIDQwOiAxMTAwLFxuICAgIDQ4OiAxMjAwLFxuICAgIDU2OiAxMzAwLFxuICAgIDY0OiAxNDAwLFxuICAgIDcyOiAxNTAwLFxufTtcbi8vIFRPRE86IHVzZSB0aGVtZS1kZWZpbml0aW9ucyBkZWZhdWx0L3R5cG9ncmFwaHkvdG9rZW5zL3dlaWdodHMuanNvblxuZXhwb3J0IGNvbnN0IHdlaWdodHMgPSB7XG4gICAgUmVndWxhcjogNDAwLFxuICAgIE1lZGl1bTogNTAwLFxuICAgIEJvbGQ6IDcwMCxcbiAgICBFeHRyYWJvbGQ6IDgwMCxcbn07XG4vLyBUT0RPOiB1c2UgdGhlbWUtZGVmaW5pdGlvbnMgZGVmYXVsdC90eXBvZ3JhcGh5L3Rva2Vucy9saW5lLWhlaWdodHMuanNvblxuZXhwb3J0IGNvbnN0IGxpbmVIZWlnaHRzUHhUb1Rva2VucyA9IHtcbiAgICA4OiAxMDAsXG4gICAgMTA6IDIwMCxcbiAgICAxMjogMzAwLFxuICAgIDE0OiA0MDAsXG4gICAgMTY6IDUwMCxcbiAgICAxODogNjAwLFxuICAgIDIwOiA3MDAsXG4gICAgMjI6IDgwMCxcbiAgICAyNDogOTAwLFxuICAgIDI4OiAxMDAwLFxuICAgIDMyOiAxMTAwLFxuICAgIDM2OiAxMjAwLFxuICAgIDQwOiAxMzAwLFxuICAgIDQ0OiAxNDAwLFxuICAgIDQ4OiAxNTAwLFxuICAgIDU2OiAxNjAwLFxuICAgIDY0OiAxNzAwLFxuICAgIDcyOiAxODAwLFxuICAgIDgwOiAxOTAwLFxuICAgIDk2OiAyMDAwLFxufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgbWVyZ2UsIHBsYXRmb3JtcywgbGV0dGVyU3BhY2luZywgc2FuaXRpemVOYW1lLCBoYXNEZW5zaXR5SW5GaWxlbmFtZSwgaGFzQ29tcG9uZW50SW5GaWxlbmFtZSwgdGhlbWVOYW1lIH0gZnJvbSAnLi9saWInO1xuaW1wb3J0IHsgc2l6ZXMsIHdlaWdodHMsIGxpbmVIZWlnaHRzUHhUb1Rva2VucyB9IGZyb20gJy4vdG9rZW5zJztcbmNvbnN0IGZpZ21hTmFtZSA9IGZpZ21hLnJvb3QubmFtZTtcbi8vIGdldCBkZW5zaXR5IGJhc2VkIG9uIGZpbGUgbmFtZSwgZGVmYXVsdCB0byBcInJlZ3VsYXJcIlxuY29uc3QgZGVuc2l0eSA9IGhhc0RlbnNpdHlJbkZpbGVuYW1lKGZpZ21hTmFtZSkgPyBoYXNEZW5zaXR5SW5GaWxlbmFtZShmaWdtYU5hbWUpLmZpbmQoQm9vbGVhbikudG9Mb3dlckNhc2UoKSA6ICdyZWd1bGFyJztcbi8vIGNvbnN0cnVjdCBmaWxlbmFtZSwgaWVcbi8vIC0gdHlwb2dyYXBoeS10b2tlbnMtZG9vcmRhc2gtZXhwYW5kZWQuanNvbiBvclxuLy8gLSB0eXBvZ3JhcGh5LXRva2Vucy1jYXZpYXItcmVndWxhci1jb21wb25lbnRzLmpzb25cbmNvbnN0IGZpbGVOYW1lID0gYHR5cG9ncmFwaHktdG9rZW5zLSR7dGhlbWVOYW1lKGZpZ21hTmFtZSl9LSR7aGFzQ29tcG9uZW50SW5GaWxlbmFtZShmaWdtYU5hbWUpID8gYGNvbXBvbmVudHNgIDogZGVuc2l0eX0uanNvbmA7XG5jb25zdCBzdHlsZXMgPSBbXTsgLy8gbGlzdCBvZiBzZW1hbnRpY3MgZnJvbSBmaWdtYVxuY29uc3QgbW9iaWxlID0ge307IC8vIG1hcCBvZiBtb2JpbGUgZGVmaW5pdGlvbnMgZm9yIHNlbWFudGljIHN0eWxlXG5jb25zdCBkZXNrdG9wID0ge307IC8vIG1hcCBkZXNrdG9wIGRlZmluaXRpb25zICh3aWxsIGJlIG1lcmdlZCB3aXRoIG1vYmlsZSBkaWN0aW9uYXJ5KVxuLy8gbG9vcCBvdmVyIEZpZ21hIHN0eWxlc1xuZm9yIChjb25zdCBzdHlsZSBvZiBmaWdtYS5nZXRMb2NhbFRleHRTdHlsZXMoKSkge1xuICAgIGxldCBbcGxhdGZvcm0sIG5hbWVdID0gc3R5bGUubmFtZS5yZXBsYWNlKC9cXHMvZywgJycpLnNwbGl0KCcvJyk7XG4gICAgaWYgKHBsYXRmb3JtICE9PSAnTW9iaWxlJyAmJiBwbGF0Zm9ybSAhPT0gJ0Rlc2t0b3AnKSB7XG4gICAgICAgIC8vIGFzc3VtaW5nIGNvbXBvbmVudCBzdHlsZXNcbiAgICAgICAgbmFtZSA9IHN0eWxlLm5hbWUucmVwbGFjZSgvXFwvL2csICcnKTtcbiAgICAgICAgcGxhdGZvcm0gPSAnTW9iaWxlJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5hbWUgPSBuYW1lIHx8IHBsYXRmb3JtOyAvLyBpZiBuYW1lIGlzIHVuZGVmaW5lZCwgZmFsbCBiYWNrIHRvIHBsYXRmb3JtIHZhbHVlXG4gICAgICAgIHBsYXRmb3JtID0gcGxhdGZvcm1zW3BsYXRmb3JtXSA9PSB1bmRlZmluZWQgPyAnTW9iaWxlJyA6IHBsYXRmb3JtOyAvLyB1c2UgTW9iaWxlIGlmIG1hcHBpbmcgZmFpbHNcbiAgICB9XG4gICAgY29uc3Qgc2VtYW50aWMgPSB7XG4gICAgICAgIG5hbWU6IHNhbml0aXplTmFtZShuYW1lKSxcbiAgICAgICAgZGVuc2l0eTogKGRlbnNpdHkgKyAnRGVuc2l0eScpLFxuICAgICAgICBwbGF0Zm9ybTogcGxhdGZvcm1zW3BsYXRmb3JtXSxcbiAgICAgICAgc2l6ZTogc2l6ZXNbc3R5bGUuZm9udFNpemVdLFxuICAgICAgICB3ZWlnaHQ6IHdlaWdodHNbc3R5bGUuZm9udE5hbWUuc3R5bGVdLFxuICAgICAgICBsaW5lSGVpZ2h0OiBsaW5lSGVpZ2h0c1B4VG9Ub2tlbnNbc3R5bGUubGluZUhlaWdodFsndmFsdWUnXV0sXG4gICAgICAgIGxldHRlclNwYWNpbmc6IGxldHRlclNwYWNpbmcoc3R5bGUubGV0dGVyU3BhY2luZy52YWx1ZSksXG4gICAgfTtcbiAgICBzdHlsZXMucHVzaChzZW1hbnRpYyk7XG59XG5mb3IgKGNvbnN0IGluZGV4IGluIHN0eWxlcykge1xuICAgIGNvbnN0IHN0eWxlID0gc3R5bGVzW2luZGV4XTtcbiAgICBjb25zdCBkZWZpbml0aW9uID0ge1xuICAgICAgICBbc3R5bGUuZGVuc2l0eV06IHtcbiAgICAgICAgICAgIFtzdHlsZS5wbGF0Zm9ybV06IHtcbiAgICAgICAgICAgICAgICBzaXplOiB7IHZhbHVlOiBge3R5cG9ncmFwaHkudG9rZW5zLnNpemVzLiR7c3R5bGUuc2l6ZX0udmFsdWV9YCB9LFxuICAgICAgICAgICAgICAgIHdlaWdodDogeyB2YWx1ZTogYHt0eXBvZ3JhcGh5LnNlbWFudGljcy53ZWlnaHRzLiR7c3R5bGUud2VpZ2h0fS52YWx1ZX1gIH0sXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDogeyB2YWx1ZTogYHt0eXBvZ3JhcGh5LnRva2Vucy5saW5lSGVpZ2h0cy4ke3N0eWxlLmxpbmVIZWlnaHR9LnZhbHVlfWAgfSxcbiAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiB7IHZhbHVlOiBge3R5cG9ncmFwaHkudG9rZW5zLmxldHRlclNwYWNpbmdzLiR7c3R5bGUubGV0dGVyU3BhY2luZ30udmFsdWV9YCB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHN0eWxlLnBsYXRmb3JtID09IHBsYXRmb3Jtcy5Nb2JpbGUgPyAobW9iaWxlW3N0eWxlLm5hbWVdID0gZGVmaW5pdGlvbikgOiAoZGVza3RvcFtzdHlsZS5uYW1lXSA9IGRlZmluaXRpb24pO1xufVxuY29uc3Qgb3V0cHV0Rm9yVUkgPSB7XG4gICAgdGhlbWVOYW1lLFxuICAgIGRlbnNpdHksXG4gICAgZmlsZU5hbWUsXG4gICAganNvbjoge1xuICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgIHNlbWFudGljczogbWVyZ2UobW9iaWxlLCBkZXNrdG9wKSxcbiAgICAgICAgfSxcbiAgICB9LFxufTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogNDAwLCBoZWlnaHQ6IDQwMCB9KTtcbmZpZ21hLnVpLnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KG91dHB1dEZvclVJKSk7XG4vLyBkZWJ1Z2dpbmcgb3V0cHV0IHRoYXQgd2lsbCBzYXZlIHRpbWUgJ291dCBpbiB0aGUgZmllbGQnXG5jb25zb2xlLmxvZygn8J+boCBbUHJpc20gVG9vbHNdIHN0eWxlcycsIHN0eWxlcyk7XG5jb25zb2xlLmxvZygn8J+boCBbUHJpc20gVG9vbHNdIG91dHB1dEZvclVJJywgb3V0cHV0Rm9yVUkpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==