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
exports.id = "app/next-api/revalidate/route";
exports.ids = ["app/next-api/revalidate/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fnext-api%2Frevalidate%2Froute&page=%2Fnext-api%2Frevalidate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fnext-api%2Frevalidate%2Froute.js&appDir=%2Fapp%2Ffrontend%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fapp%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fnext-api%2Frevalidate%2Froute&page=%2Fnext-api%2Frevalidate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fnext-api%2Frevalidate%2Froute.js&appDir=%2Fapp%2Ffrontend%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fapp%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _app_frontend_src_app_next_api_revalidate_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/next-api/revalidate/route.js */ \"(rsc)/./src/app/next-api/revalidate/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/next-api/revalidate/route\",\n        pathname: \"/next-api/revalidate\",\n        filename: \"route\",\n        bundlePath: \"app/next-api/revalidate/route\"\n    },\n    resolvedPagePath: \"/app/frontend/src/app/next-api/revalidate/route.js\",\n    nextConfigOutput,\n    userland: _app_frontend_src_app_next_api_revalidate_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZuZXh0LWFwaSUyRnJldmFsaWRhdGUlMkZyb3V0ZSZwYWdlPSUyRm5leHQtYXBpJTJGcmV2YWxpZGF0ZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRm5leHQtYXBpJTJGcmV2YWxpZGF0ZSUyRnJvdXRlLmpzJmFwcERpcj0lMkZhcHAlMkZmcm9udGVuZCUyRnNyYyUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGYXBwJTJGZnJvbnRlbmQmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ0U7QUFDL0U7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9hcHAvZnJvbnRlbmQvc3JjL2FwcC9uZXh0LWFwaS9yZXZhbGlkYXRlL3JvdXRlLmpzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL25leHQtYXBpL3JldmFsaWRhdGUvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL25leHQtYXBpL3JldmFsaWRhdGVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvbmV4dC1hcGkvcmV2YWxpZGF0ZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9hcHAvZnJvbnRlbmQvc3JjL2FwcC9uZXh0LWFwaS9yZXZhbGlkYXRlL3JvdXRlLmpzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fnext-api%2Frevalidate%2Froute&page=%2Fnext-api%2Frevalidate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fnext-api%2Frevalidate%2Froute.js&appDir=%2Fapp%2Ffrontend%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fapp%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./src/app/next-api/revalidate/route.js":
/*!**********************************************!*\
  !*** ./src/app/next-api/revalidate/route.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   dynamic: () => (/* binding */ dynamic),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/cache */ \"(rsc)/./node_modules/next/cache.js\");\n/* harmony import */ var next_cache__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_cache__WEBPACK_IMPORTED_MODULE_1__);\n\n\n// Runs on Vercel as a serverless function (dynamic, no cache)\nconst dynamic = \"force-dynamic\";\nconst runtime = \"nodejs\";\nconst PUBLIC_PATHS = [\n    \"/\",\n    \"/about\",\n    \"/stores\",\n    \"/offers\",\n    \"/contact\"\n];\nconst CACHE_TAGS = [\n    \"site-content\",\n    \"products\",\n    \"offers\",\n    \"announcements\",\n    \"testimonials\",\n    \"instagram-posts\"\n];\nasync function verifyAdmin(authHeader) {\n    if (!authHeader?.startsWith(\"Bearer \")) return false;\n    const backend = \"https://modern-digiconnect.preview.emergentagent.com\";\n    if (!backend) return false;\n    try {\n        const res = await fetch(`${backend}/api/auth/me`, {\n            headers: {\n                Authorization: authHeader\n            },\n            cache: \"no-store\"\n        });\n        if (!res.ok) return false;\n        const user = await res.json();\n        return user?.role === \"admin\";\n    } catch  {\n        return false;\n    }\n}\nasync function POST(request) {\n    const auth = request.headers.get(\"authorization\");\n    const ok = await verifyAdmin(auth);\n    if (!ok) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"unauthorized\"\n        }, {\n            status: 401\n        });\n    }\n    // Bust the cache for every public route + layout so nested pages refresh too\n    for (const p of PUBLIC_PATHS){\n        (0,next_cache__WEBPACK_IMPORTED_MODULE_1__.revalidatePath)(p);\n    }\n    (0,next_cache__WEBPACK_IMPORTED_MODULE_1__.revalidatePath)(\"/\", \"layout\");\n    // Also bust any fetch-tagged data\n    for (const t of CACHE_TAGS){\n        (0,next_cache__WEBPACK_IMPORTED_MODULE_1__.revalidateTag)(t);\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        revalidated: true,\n        paths: PUBLIC_PATHS,\n        tags: CACHE_TAGS,\n        at: Date.now()\n    });\n}\nasync function GET() {\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        hint: \"POST with Authorization: Bearer <admin JWT> to revalidate\"\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL25leHQtYXBpL3JldmFsaWRhdGUvcm91dGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUEyQztBQUNnQjtBQUUzRCw4REFBOEQ7QUFDdkQsTUFBTUcsVUFBVSxnQkFBZ0I7QUFDaEMsTUFBTUMsVUFBVSxTQUFTO0FBRWhDLE1BQU1DLGVBQWU7SUFBQztJQUFLO0lBQVU7SUFBVztJQUFXO0NBQVc7QUFDdEUsTUFBTUMsYUFBYTtJQUFDO0lBQWdCO0lBQVk7SUFBVTtJQUFpQjtJQUFnQjtDQUFrQjtBQUU3RyxlQUFlQyxZQUFZQyxVQUFVO0lBQ25DLElBQUksQ0FBQ0EsWUFBWUMsV0FBVyxZQUFZLE9BQU87SUFDL0MsTUFBTUMsVUFBVUMsc0RBQW1DO0lBQ25ELElBQUksQ0FBQ0QsU0FBUyxPQUFPO0lBQ3JCLElBQUk7UUFDRixNQUFNSSxNQUFNLE1BQU1DLE1BQU0sR0FBR0wsUUFBUSxZQUFZLENBQUMsRUFBRTtZQUNoRE0sU0FBUztnQkFBRUMsZUFBZVQ7WUFBVztZQUNyQ1UsT0FBTztRQUNUO1FBQ0EsSUFBSSxDQUFDSixJQUFJSyxFQUFFLEVBQUUsT0FBTztRQUNwQixNQUFNQyxPQUFPLE1BQU1OLElBQUlPLElBQUk7UUFDM0IsT0FBT0QsTUFBTUUsU0FBUztJQUN4QixFQUFFLE9BQU07UUFDTixPQUFPO0lBQ1Q7QUFDRjtBQUVPLGVBQWVDLEtBQUtDLE9BQU87SUFDaEMsTUFBTUMsT0FBT0QsUUFBUVIsT0FBTyxDQUFDVSxHQUFHLENBQUM7SUFDakMsTUFBTVAsS0FBSyxNQUFNWixZQUFZa0I7SUFDN0IsSUFBSSxDQUFDTixJQUFJO1FBQ1AsT0FBT25CLHFEQUFZQSxDQUFDcUIsSUFBSSxDQUFDO1lBQUVNLE9BQU87UUFBZSxHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUNwRTtJQUNBLDZFQUE2RTtJQUM3RSxLQUFLLE1BQU1DLEtBQUt4QixhQUFjO1FBQzVCSiwwREFBY0EsQ0FBQzRCO0lBQ2pCO0lBQ0E1QiwwREFBY0EsQ0FBQyxLQUFLO0lBQ3BCLGtDQUFrQztJQUNsQyxLQUFLLE1BQU02QixLQUFLeEIsV0FBWTtRQUMxQkoseURBQWFBLENBQUM0QjtJQUNoQjtJQUNBLE9BQU85QixxREFBWUEsQ0FBQ3FCLElBQUksQ0FBQztRQUFFVSxhQUFhO1FBQU1DLE9BQU8zQjtRQUFjNEIsTUFBTTNCO1FBQVk0QixJQUFJQyxLQUFLQyxHQUFHO0lBQUc7QUFDdEc7QUFFTyxlQUFlQztJQUNwQixPQUFPckMscURBQVlBLENBQUNxQixJQUFJLENBQUM7UUFBRWlCLE1BQU07SUFBNEQ7QUFDL0YiLCJzb3VyY2VzIjpbIi9hcHAvZnJvbnRlbmQvc3JjL2FwcC9uZXh0LWFwaS9yZXZhbGlkYXRlL3JvdXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGgsIHJldmFsaWRhdGVUYWcgfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuXG4vLyBSdW5zIG9uIFZlcmNlbCBhcyBhIHNlcnZlcmxlc3MgZnVuY3Rpb24gKGR5bmFtaWMsIG5vIGNhY2hlKVxuZXhwb3J0IGNvbnN0IGR5bmFtaWMgPSBcImZvcmNlLWR5bmFtaWNcIjtcbmV4cG9ydCBjb25zdCBydW50aW1lID0gXCJub2RlanNcIjtcblxuY29uc3QgUFVCTElDX1BBVEhTID0gW1wiL1wiLCBcIi9hYm91dFwiLCBcIi9zdG9yZXNcIiwgXCIvb2ZmZXJzXCIsIFwiL2NvbnRhY3RcIl07XG5jb25zdCBDQUNIRV9UQUdTID0gW1wic2l0ZS1jb250ZW50XCIsIFwicHJvZHVjdHNcIiwgXCJvZmZlcnNcIiwgXCJhbm5vdW5jZW1lbnRzXCIsIFwidGVzdGltb25pYWxzXCIsIFwiaW5zdGFncmFtLXBvc3RzXCJdO1xuXG5hc3luYyBmdW5jdGlvbiB2ZXJpZnlBZG1pbihhdXRoSGVhZGVyKSB7XG4gIGlmICghYXV0aEhlYWRlcj8uc3RhcnRzV2l0aChcIkJlYXJlciBcIikpIHJldHVybiBmYWxzZTtcbiAgY29uc3QgYmFja2VuZCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0JBQ0tFTkRfVVJMO1xuICBpZiAoIWJhY2tlbmQpIHJldHVybiBmYWxzZTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9hcGkvYXV0aC9tZWAsIHtcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYXV0aEhlYWRlciB9LFxuICAgICAgY2FjaGU6IFwibm8tc3RvcmVcIixcbiAgICB9KTtcbiAgICBpZiAoIXJlcy5vaykgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCByZXMuanNvbigpO1xuICAgIHJldHVybiB1c2VyPy5yb2xlID09PSBcImFkbWluXCI7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0KSB7XG4gIGNvbnN0IGF1dGggPSByZXF1ZXN0LmhlYWRlcnMuZ2V0KFwiYXV0aG9yaXphdGlvblwiKTtcbiAgY29uc3Qgb2sgPSBhd2FpdCB2ZXJpZnlBZG1pbihhdXRoKTtcbiAgaWYgKCFvaykge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcInVuYXV0aG9yaXplZFwiIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG4gIH1cbiAgLy8gQnVzdCB0aGUgY2FjaGUgZm9yIGV2ZXJ5IHB1YmxpYyByb3V0ZSArIGxheW91dCBzbyBuZXN0ZWQgcGFnZXMgcmVmcmVzaCB0b29cbiAgZm9yIChjb25zdCBwIG9mIFBVQkxJQ19QQVRIUykge1xuICAgIHJldmFsaWRhdGVQYXRoKHApO1xuICB9XG4gIHJldmFsaWRhdGVQYXRoKFwiL1wiLCBcImxheW91dFwiKTtcbiAgLy8gQWxzbyBidXN0IGFueSBmZXRjaC10YWdnZWQgZGF0YVxuICBmb3IgKGNvbnN0IHQgb2YgQ0FDSEVfVEFHUykge1xuICAgIHJldmFsaWRhdGVUYWcodCk7XG4gIH1cbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgcmV2YWxpZGF0ZWQ6IHRydWUsIHBhdGhzOiBQVUJMSUNfUEFUSFMsIHRhZ3M6IENBQ0hFX1RBR1MsIGF0OiBEYXRlLm5vdygpIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBoaW50OiBcIlBPU1Qgd2l0aCBBdXRob3JpemF0aW9uOiBCZWFyZXIgPGFkbWluIEpXVD4gdG8gcmV2YWxpZGF0ZVwiIH0pO1xufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInJldmFsaWRhdGVQYXRoIiwicmV2YWxpZGF0ZVRhZyIsImR5bmFtaWMiLCJydW50aW1lIiwiUFVCTElDX1BBVEhTIiwiQ0FDSEVfVEFHUyIsInZlcmlmeUFkbWluIiwiYXV0aEhlYWRlciIsInN0YXJ0c1dpdGgiLCJiYWNrZW5kIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX0JBQ0tFTkRfVVJMIiwicmVzIiwiZmV0Y2giLCJoZWFkZXJzIiwiQXV0aG9yaXphdGlvbiIsImNhY2hlIiwib2siLCJ1c2VyIiwianNvbiIsInJvbGUiLCJQT1NUIiwicmVxdWVzdCIsImF1dGgiLCJnZXQiLCJlcnJvciIsInN0YXR1cyIsInAiLCJ0IiwicmV2YWxpZGF0ZWQiLCJwYXRocyIsInRhZ3MiLCJhdCIsIkRhdGUiLCJub3ciLCJHRVQiLCJoaW50Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/next-api/revalidate/route.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fnext-api%2Frevalidate%2Froute&page=%2Fnext-api%2Frevalidate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fnext-api%2Frevalidate%2Froute.js&appDir=%2Fapp%2Ffrontend%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fapp%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();