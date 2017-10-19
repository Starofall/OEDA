webpackJsonp(["landingpage.module"],{

/***/ "../../../../../src/app/+landingpage/landingpage.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\r\n  <div class=\"row vertical-offset-100\">\r\n    <div class=\"col-md-4 col-md-offset-4\">\r\n      <div class=\"panel panel-default\">\r\n        <div class=\"panel-heading\">\r\n          <div class=\"navbar-brand\" style=\"float: none;text-align: center;font-size: xx-large;color:#F36A5A\" href=\"#\"><strong><i class=\"icon fa fa-cog\"></i>EDA Platform</strong>\r\n          </div>\r\n          <hr>\r\n          <h3 class=\"panel-title\" style=\"text-align: center\">Please sign in</h3>\r\n        </div>\r\n        <div class=\"panel-body\">\r\n          <form accept-charset=\"UTF-8\" role=\"form\">\r\n            <fieldset>\r\n              <div class=\"form-group\">\r\n                <input class=\"form-control\" placeholder=\"E-mail\" name=\"email\" type=\"text\">\r\n              </div>\r\n              <div class=\"form-group\">\r\n                <input class=\"form-control\" placeholder=\"Password\" name=\"password\" type=\"password\" value=\"\">\r\n              </div>\r\n              <!--<input class=\"navbar-brand btn btn-lg btn-default btn-block\"  type=\"submit\" value=\"Login\">-->\r\n              <a href=\"./control/dashboard\" class=\"navbar-brand btn btn-lg btn-default btn-block\">Login</a>\r\n            </fieldset>\r\n          </form>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "../../../../../src/app/+landingpage/landingpage.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LandingpageComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var LandingpageComponent = (function () {
    function LandingpageComponent() {
    }
    return LandingpageComponent;
}());
LandingpageComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-landingpage',
        template: __webpack_require__("../../../../../src/app/+landingpage/landingpage.component.html"),
        styles: ["\n    /deep/\n    body {\n      background: url(../../assets/img/background2.jpg);\n      background-size: cover;\n      background-color: #444;\n    }\n\n    .vertical-offset-100 {\n      padding-top: 100px;\n    }\n    \n\n  "]
    })
], LandingpageComponent);

//# sourceMappingURL=landingpage.component.js.map

/***/ }),

/***/ "../../../../../src/app/+landingpage/landingpage.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LandingPageModule", function() { return LandingPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__landingpage_routing__ = __webpack_require__("../../../../../src/app/+landingpage/landingpage.routing.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__landingpage_component__ = __webpack_require__("../../../../../src/app/+landingpage/landingpage.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shared_shared_module__ = __webpack_require__("../../../../../src/app/shared/shared.module.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var LandingPageModule = (function () {
    function LandingPageModule() {
    }
    return LandingPageModule;
}());
LandingPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_4__shared_shared_module__["a" /* SharedModule */],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* RouterModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__landingpage_routing__["a" /* routes */]),
        ],
        providers: [],
        declarations: [
            __WEBPACK_IMPORTED_MODULE_3__landingpage_component__["a" /* LandingpageComponent */]
        ]
    })
], LandingPageModule);

//# sourceMappingURL=landingpage.module.js.map

/***/ }),

/***/ "../../../../../src/app/+landingpage/landingpage.routing.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return routes; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__landingpage_component__ = __webpack_require__("../../../../../src/app/+landingpage/landingpage.component.ts");

var routes = [
    {
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_0__landingpage_component__["a" /* LandingpageComponent */],
        pathMatch: 'full',
    }
];
//# sourceMappingURL=landingpage.routing.js.map

/***/ })

});