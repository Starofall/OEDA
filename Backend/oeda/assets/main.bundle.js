webpackJsonp(["main"],{

/***/ "../../../../../src/$$_gendir lazy recursive":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"app/+control/control.module": [
		"../../../../../src/app/+control/control.module.ts",
		"control.module"
	],
	"app/+landingpage/landingpage.module": [
		"../../../../../src/app/+landingpage/landingpage.module.ts",
		"landingpage.module"
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = "../../../../../src/$$_gendir lazy recursive";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_notifications_dist__ = __webpack_require__("../../../../angular2-notifications/dist/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_notifications_dist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular2_notifications_dist__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = (function () {
    function AppComponent(viewContainerRef, notifiy) {
        this.notificationOptions = {
            timeOut: 1000,
            lastOnBottom: true,
            clickToClose: true,
            maxLength: 0,
            maxStack: 7,
            showProgressBar: false,
            pauseOnHover: true,
            preventDuplicates: false,
            preventLastDuplicates: 'visible',
            rtl: false,
            animate: 'fromRight',
            position: ['right', 'bottom']
        };
        this.viewContainerRef = viewContainerRef;
    }
    return AppComponent;
}());
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: "\n    <router-outlet></router-outlet>\n    <simple-notifications [options]=\"notificationOptions\"></simple-notifications>\n  "
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_angular2_notifications_dist__["NotificationsService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_angular2_notifications_dist__["NotificationsService"]) === "function" && _b || Object])
], AppComponent);

var _a, _b;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser_animations__ = __webpack_require__("../../../platform-browser/@angular/platform-browser/animations.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_routes__ = __webpack_require__("../../../../../src/app/app.routes.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shared_shared_module__ = __webpack_require__("../../../../../src/app/shared/shared.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__global_module__ = __webpack_require__("../../../../../src/app/global.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_angular2_notifications__ = __webpack_require__("../../../../angular2-notifications/dist/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_angular2_notifications___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_angular2_notifications__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["BrowserModule"],
            __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
            __WEBPACK_IMPORTED_MODULE_4__angular_router__["b" /* RouterModule */].forRoot(__WEBPACK_IMPORTED_MODULE_5__app_routes__["a" /* routes */]),
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["BrowserModule"],
            __WEBPACK_IMPORTED_MODULE_7__global_module__["a" /* GlobalModule */],
            __WEBPACK_IMPORTED_MODULE_6__shared_shared_module__["a" /* SharedModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_8_angular2_notifications__["SimpleNotificationsModule"].forRoot()
        ],
        providers: [],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/app/app.routes.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return routes; });
// import {ArtistRouteGuard} from "./shared/modules/auth/artist-routeguard.service";
var routes = [
    { path: 'control',
        //canActivate: [UserRouteGuard],
        loadChildren: 'app/+control/control.module#ControlModule' },
    // {path: 'artist', canActivate: [ArtistRouteGuard], loadChildren: 'app/+artist/artist.module#ArtistModule'},
    // {path: 'releases', loadChildren: 'app/+releases/releases.module#ReleasesModule'},
    // {path: 'scout', loadChildren: 'app/+scout/scout.module#ScoutModule'},
    // {path: 'auth', loadChildren: 'app/+auth/auth.module#AuthModule'},
    { path: '', loadChildren: 'app/+landingpage/landingpage.module#LandingPageModule' },
    { path: '**', pathMatch: 'full', redirectTo: '/' }
];
//# sourceMappingURL=app.routes.js.map

/***/ }),

/***/ "../../../../../src/app/global.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GlobalModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_notifications__ = __webpack_require__("../../../../angular2-notifications/dist/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_notifications___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular2_notifications__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_bootstrap_accordion__ = __webpack_require__("../../../../ng2-bootstrap/accordion/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap_progressbar__ = __webpack_require__("../../../../ng2-bootstrap/progressbar/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_bootstrap_pagination__ = __webpack_require__("../../../../ng2-bootstrap/pagination/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ng2_bootstrap_tabs__ = __webpack_require__("../../../../ng2-bootstrap/tabs/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ng2_bootstrap_modal__ = __webpack_require__("../../../../ng2-bootstrap/modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ng2_bootstrap_dropdown__ = __webpack_require__("../../../../ng2-bootstrap/dropdown/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_ng2_bootstrap_sortable__ = __webpack_require__("../../../../ng2-bootstrap/sortable/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ng2_bootstrap_popover__ = __webpack_require__("../../../../ng2-bootstrap/popover/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ng2_bootstrap__ = __webpack_require__("../../../../ng2-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_angular2_fontawesome__ = __webpack_require__("../../../../angular2-fontawesome/angular2-fontawesome.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_angular2_fontawesome___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_angular2_fontawesome__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};












// This module is imported into the app scope only (mainly for libraries that also load a service
// which we do not want to instantiate multiple times
var GlobalModule = (function () {
    function GlobalModule() {
    }
    return GlobalModule;
}());
GlobalModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_11_angular2_fontawesome__["Angular2FontawesomeModule"],
            __WEBPACK_IMPORTED_MODULE_1_angular2_notifications__["SimpleNotificationsModule"],
            __WEBPACK_IMPORTED_MODULE_2_ng2_bootstrap_accordion__["a" /* AccordionModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap_progressbar__["a" /* ProgressbarModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_5_ng2_bootstrap_tabs__["a" /* TabsModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_4_ng2_bootstrap_pagination__["a" /* PaginationModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_6_ng2_bootstrap_modal__["a" /* ModalModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_7_ng2_bootstrap_dropdown__["a" /* BsDropdownModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_9_ng2_bootstrap_popover__["a" /* PopoverModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_8_ng2_bootstrap_sortable__["a" /* SortableModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_10_ng2_bootstrap__["a" /* TooltipModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap_progressbar__["a" /* ProgressbarModule */].forRoot()
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_1_angular2_notifications__["SimpleNotificationsModule"]
        ],
        providers: []
    })
], GlobalModule);

//# sourceMappingURL=global.module.js.map

/***/ }),

/***/ "../../../../../src/app/shared/constants.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Constants; });
var Constants = (function () {
    function Constants() {
    }
    return Constants;
}());

//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "../../../../../src/app/shared/modules/auth/staff-routeguard.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserRouteGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user_service__ = __webpack_require__("../../../../../src/app/shared/modules/auth/user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helper_logger_service__ = __webpack_require__("../../../../../src/app/shared/modules/helper/logger.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angular2_notifications_dist__ = __webpack_require__("../../../../angular2-notifications/dist/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angular2_notifications_dist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_angular2_notifications_dist__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var UserRouteGuard = (function () {
    function UserRouteGuard(router, logger, userService, notifiy) {
        this.router = router;
        this.logger = logger;
        this.userService = userService;
        this.notifiy = notifiy;
    }
    UserRouteGuard.prototype.doUserCheck = function (state) {
        var _this = this;
        if (this.userService.isLoggedIn()) {
            this.logger.debug("RouteGuard - User is authed");
            return __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__["Observable"].of(true);
        }
        else {
            if (this.userService.getAuthTokenRaw().isEmpty) {
                this.logger.debug("RouteGuard - User has no auth token, direct send him to login");
                this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
                return __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__["Observable"].of(false);
            }
            else {
                this.logger.debug("RouteGuard - User auth expired - try to reauth");
                this.userService.tryTokenRenewal().subscribe(function (worked) {
                    _this.logger.debug("RouteGuard - re-auth worked");
                    _this.router.navigate([state.url]);
                    return true;
                }, function (failed) {
                    _this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
                    return false;
                });
            }
        }
    };
    UserRouteGuard.prototype.canLoad = function (router) {
        return true; // this.doUserCheck()
    };
    UserRouteGuard.prototype.canActivate = function (route, state) {
        return this.doUserCheck(state);
    };
    UserRouteGuard.prototype.canActivateChild = function (childRoute, state) {
        return this.doUserCheck(state);
    };
    return UserRouteGuard;
}());
UserRouteGuard = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__helper_logger_service__["a" /* LoggerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__helper_logger_service__["a" /* LoggerService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__user_service__["a" /* UserService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__user_service__["a" /* UserService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_5_angular2_notifications_dist__["NotificationsService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5_angular2_notifications_dist__["NotificationsService"]) === "function" && _d || Object])
], UserRouteGuard);

var _a, _b, _c, _d;
//# sourceMappingURL=staff-routeguard.service.js.map

/***/ }),

/***/ "../../../../../src/app/shared/modules/auth/user.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
/* unused harmony export Permission */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helper_logger_service__ = __webpack_require__("../../../../../src/app/shared/modules/helper/logger.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular2_jwt__ = __webpack_require__("../../../../angular2-jwt/angular2-jwt.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular2_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_angular2_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_monapt__ = __webpack_require__("../../../../monapt/dist/monapt.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_monapt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_monapt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var UserService = (function () {
    function UserService(http, router, log) {
        this.http = http;
        this.router = router;
        this.log = log;
        /** helper for the jwt token */
        this.jwtHelper = new __WEBPACK_IMPORTED_MODULE_4_angular2_jwt__["JwtHelper"]();
    }
    /** true if the user is logged in */
    UserService.prototype.isLoggedIn = function () {
        var _this = this;
        return this.getAuthTokenRaw().map(function (token) {
            return Object(__WEBPACK_IMPORTED_MODULE_6_monapt__["Try"])(function () { return !_this.jwtHelper.isTokenExpired(token); }).getOrElse(function () { return false; });
        }).getOrElse(function () { return false; });
    };
    UserService.prototype.tryTokenRenewal = function () {
        var _this = this;
        if (this.getAuthTokenRaw().isEmpty) {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"].throw("not logged in");
        }
        var authHeader = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["Headers"]();
        authHeader.append('Authorization', 'Bearer ' + this.getAuthTokenRaw().get());
        return this.http.post(__WEBPACK_IMPORTED_MODULE_7__environments_environment__["a" /* environment */].backendURL + "/auth/renew", {}, { headers: authHeader })
            .map(function (response) {
            _this.log.debug("UserService - reauth successful");
            _this.setAuthToken(response.json().token);
            return true;
        });
    };
    UserService.prototype.userIsInGroup = function (groupName) {
        return this.getAuthToken()
            .map(function (token) { return token.roles.indexOf(groupName) > -1; })
            .getOrElse(function () { return false; });
    };
    UserService.prototype.sessionExpiresDate = function () {
        var _this = this;
        return this.getAuthTokenRaw().map(function (token) { return _this.jwtHelper.getTokenExpirationDate(token); })
            .getOrElse(function () { return new Date(); });
    };
    /** tries to log in the user and stores the token in localStorage */
    UserService.prototype.login = function (request) {
        var _this = this;
        this.log.debug("UserService - starting LoginRequest");
        return this.http.post(__WEBPACK_IMPORTED_MODULE_7__environments_environment__["a" /* environment */].backendURL + "/auth/login", request)
            .map(function (response) {
            _this.log.debug("UserService - request successful");
            _this.setAuthToken(response.json().token);
            return true;
        });
    };
    /** returns the parsed token as JWTToken*/
    UserService.prototype.getAuthToken = function () {
        var _this = this;
        return this.getAuthTokenRaw().map(function (token) { return _this.jwtHelper.decodeToken(token); });
    };
    /** stores the token*/
    UserService.prototype.setAuthToken = function (token) {
        this.log.debug("UserService - storing token");
        localStorage.setItem('pinyal_token', token);
    };
    /** returns the token stored in localStorage*/
    UserService.prototype.getAuthTokenRaw = function () {
        var token = localStorage.getItem('oeda_token');
        if (token == null || token.split('.').length !== 3) {
            return __WEBPACK_IMPORTED_MODULE_6_monapt__["None"];
        }
        else {
            return new __WEBPACK_IMPORTED_MODULE_6_monapt__["Some"](token);
        }
    };
    /** logs out the user */
    UserService.prototype.logout = function () {
        this.log.debug("UserService - removing token");
        localStorage.removeItem('oeda_token');
        this.router.navigate(['/auth/login']);
    };
    /** checks if a user has a given permission */
    UserService.prototype.hasPermission = function (permission) {
        return true;
    };
    UserService.prototype.forcePermission = function (permission) {
        if (!this.isLoggedIn()) {
            this.log.warn("UserService - user is not logged in - sending to login");
            return this.router.navigate(['/auth/login']);
        }
        // check if the token has the given permission allowed
        var permissionNumber = this.getAuthToken().map(function (f) { return f.permissions; }).getOrElse(function () { return 0; });
        var toLessPermissions = (permissionNumber === 0);
        if (toLessPermissions) {
            this.log.warn("UserService - not enough access rights for this page");
            return this.router.navigate(['/']);
        }
        this.log.debug("UserService - user has all permissions for this page");
    };
    return UserService;
}());
UserService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_http__["Http"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_http__["Http"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__helper_logger_service__["a" /* LoggerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__helper_logger_service__["a" /* LoggerService */]) === "function" && _c || Object])
], UserService);

/** a permission in the system */
var Permission = (function () {
    function Permission(index, name) {
        this.index = index;
        this.name = name;
    }
    return Permission;
}());

/** allows access to the system status page */
Permission.FOUND_SYSINFO_READ = new Permission(0, "FOUND_SYSINFO_READ");
var _a, _b, _c;
//# sourceMappingURL=user.service.js.map

/***/ }),

/***/ "../../../../../src/app/shared/modules/helper/layout.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LayoutService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var LayoutService = (function () {
    function LayoutService(titleService) {
        this.titleService = titleService;
        this.header = {
            name: "",
            description: ""
        };
        /** user to store the state of the mobile navigation */
        this.mobileNavigationOpen = false;
    }
    /** sets the UI header with a name and a description*/
    LayoutService.prototype.setHeader = function (name, description) {
        this.titleService.setTitle(name + " | OEDA ");
        this.header.name = name;
        this.header.description = description;
    };
    return LayoutService;
}());
LayoutService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["Title"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["Title"]) === "function" && _a || Object])
], LayoutService);

var _a;
//# sourceMappingURL=layout.service.js.map

/***/ }),

/***/ "../../../../../src/app/shared/modules/helper/logger.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoggerService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var LoggerService = (function () {
    function LoggerService() {
        var _this = this;
        /** the current log level defined by the environment */
        this.level = __WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */].logLevel;
        this.OFF = 0;
        this.ERROR = 1;
        this.WARN = 2;
        this.INFO = 3;
        this.DEBUG = 4;
        this.LOG = 5;
        this.isErrorEnabled = function () { return _this.level >= _this.ERROR; };
        this.isWarnEnabled = function () { return _this.level >= _this.WARN; };
        this.isInfoEnabled = function () { return _this.level >= _this.INFO; };
        this.isDebugEnabled = function () { return _this.level >= _this.DEBUG; };
        this.isLogEnabled = function () { return _this.level >= _this.LOG; };
    }
    /** logs errors to console AND sends error to eventQ */
    LoggerService.prototype.error = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.isErrorEnabled() && console.error.apply(console, arguments);
    };
    /** warning logging to console */
    LoggerService.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.isWarnEnabled() && console.warn.apply(console, arguments);
    };
    /** info logging to console */
    LoggerService.prototype.info = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.isInfoEnabled() && console.info.apply(console, arguments);
    };
    /** debug logging to console */
    LoggerService.prototype.debug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.isDebugEnabled() && console.debug.apply(console, arguments);
    };
    /** normal logging to console */
    LoggerService.prototype.log = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.isLogEnabled() && console.log.apply(console, arguments);
    };
    return LoggerService;
}());
LoggerService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
], LoggerService);

//# sourceMappingURL=logger.service.js.map

/***/ }),

/***/ "../../../../../src/app/shared/modules/ui/debug-element.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DebugElementComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DebugElementComponent = (function () {
    function DebugElementComponent() {
        this.showDebug = false;
        this.isProduction = __WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */].production;
    }
    DebugElementComponent.prototype.keyboardInput = function (event) {
        if (event.key === 'F9') {
            this.showDebug = !this.showDebug;
        }
    };
    return DebugElementComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], DebugElementComponent.prototype, "element", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('window:keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DebugElementComponent.prototype, "keyboardInput", null);
DebugElementComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'debug-element',
        template: '<pre *ngIf="showDebug && !isProduction">{{element|json}}</pre>'
    })
], DebugElementComponent);

//# sourceMappingURL=debug-element.component.js.map

/***/ }),

/***/ "../../../../../src/app/shared/modules/ui/labeled-input-component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LabeledInputComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var LabeledInputComponent = (function () {
    function LabeledInputComponent() {
        var _this = this;
        this.modelChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.info = null;
        this.inputType = "text";
        this.minNumber = 0;
        this.maxNumber = 100;
        this.colSize = 6;
        this.placeholder = "";
        this.required = true;
        this.hasError = false;
        this.errorFunction = function () {
            if (_this.required) {
                return !_this.model[_this.key];
            }
            else {
                return false;
            }
        };
        this.onModelChange = function (ev) {
            _this.modelChanged.emit(ev);
        };
    }
    LabeledInputComponent.prototype.ngOnChanges = function (changes) {
        this.modelChanged.emit(changes);
    };
    return LabeledInputComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], LabeledInputComponent.prototype, "modelChanged", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputComponent.prototype, "info", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputComponent.prototype, "inputType", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputComponent.prototype, "minNumber", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputComponent.prototype, "maxNumber", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputComponent.prototype, "colSize", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputComponent.prototype, "name", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputComponent.prototype, "model", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], LabeledInputComponent.prototype, "key", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputComponent.prototype, "placeholder", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputComponent.prototype, "required", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputComponent.prototype, "hasError", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputComponent.prototype, "errorFunction", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputComponent.prototype, "onModelChange", void 0);
LabeledInputComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'labeled-input',
        template: "\n    <div class=\"col-md-{{colSize}}\" [ngClass]=\"{'has-error': hasError || errorFunction()}\">\n      <div class=\"sub-title\">{{name}}</div>\n      <div>\n        <input (ngModelChange)=\"onModelChange($event)\" *ngIf=\"inputType == 'number'\" class=\"form-control\" type=\"number\"\n               id=\"{{name}}Edit\" name=\"{{name}}-{{key}}\"\n               [(ngModel)]=\"model[key]\" [min]=\"minNumber\" [max]=\"maxNumber\">\n        <input (ngModelChange)=\"onModelChange($event)\" *ngIf=\"inputType == 'text'\" class=\"form-control\" type=\"text\"\n               id=\"{{name}}Edit\" name=\"{{name}}-{{key}}\"\n               [(ngModel)]=\"model[key]\" placeholder=\"{{placeholder}}\">\n      </div>\n    </div>\n  "
    })
], LabeledInputComponent);

//# sourceMappingURL=labeled-input-component.js.map

/***/ }),

/***/ "../../../../../src/app/shared/modules/ui/labeled-input-select-component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LabeledInputSelectComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var LabeledInputSelectComponent = (function () {
    function LabeledInputSelectComponent() {
        var _this = this;
        this.onModelChange = function (ev) {
            _this.modelChanged.emit(ev);
        };
        this.modelChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.info = null;
        this.colSize = 6;
        this.options = [];
    }
    return LabeledInputSelectComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputSelectComponent.prototype, "onModelChange", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], LabeledInputSelectComponent.prototype, "modelChanged", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputSelectComponent.prototype, "info", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputSelectComponent.prototype, "colSize", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputSelectComponent.prototype, "name", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputSelectComponent.prototype, "model", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], LabeledInputSelectComponent.prototype, "key", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], LabeledInputSelectComponent.prototype, "options", void 0);
LabeledInputSelectComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'labeled-input-select',
        template: "\n\n    <div class=\"col-md-{{colSize}}\">\n      <div class=\"sub-title\">{{name}}</div>\n      <div>\n        <select class=\"form-control\" id=\"{{name}}Edit\" name=\"{{name}}Edit\"\n                [(ngModel)]=\"model[key]\" (ngModelChange)=\"onModelChange($event)\" size=\"1\">\n          <option *ngFor=\"let i of options\" value=\"{{i.key}}\">{{i.label}}</option>\n        </select>\n      </div>\n    </div>\n  "
    })
], LabeledInputSelectComponent);

//# sourceMappingURL=labeled-input-select-component.js.map

/***/ }),

/***/ "../../../../../src/app/shared/modules/ui/ui.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UIModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__debug_element_component__ = __webpack_require__("../../../../../src/app/shared/modules/ui/debug-element.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__labeled_input_component__ = __webpack_require__("../../../../../src/app/shared/modules/ui/labeled-input-component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common__ = __webpack_require__("../../../common/@angular/common.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__labeled_input_select_component__ = __webpack_require__("../../../../../src/app/shared/modules/ui/labeled-input-select-component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var uiElements = [
    __WEBPACK_IMPORTED_MODULE_1__debug_element_component__["a" /* DebugElementComponent */],
    __WEBPACK_IMPORTED_MODULE_2__labeled_input_component__["a" /* LabeledInputComponent */],
    __WEBPACK_IMPORTED_MODULE_5__labeled_input_select_component__["a" /* LabeledInputSelectComponent */]
];
var UIModule = (function () {
    function UIModule() {
    }
    return UIModule;
}());
UIModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_3__angular_common__["CommonModule"],
            __WEBPACK_IMPORTED_MODULE_4__angular_forms__["a" /* FormsModule */],
        ],
        exports: uiElements,
        providers: [],
        declarations: uiElements
    })
], UIModule);

//# sourceMappingURL=ui.module.js.map

/***/ }),

/***/ "../../../../../src/app/shared/modules/util/util.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UtilModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_service__ = __webpack_require__("../../../../../src/app/shared/modules/util/util.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var UtilModule = (function () {
    function UtilModule() {
    }
    return UtilModule;
}());
UtilModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_http__["HttpModule"],
        ],
        exports: [],
        providers: [
            __WEBPACK_IMPORTED_MODULE_2__util_service__["a" /* UtilService */]
        ]
    })
], UtilModule);

//# sourceMappingURL=util.module.js.map

/***/ }),

/***/ "../../../../../src/app/shared/modules/util/util.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UtilService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__("../../../../../src/app/shared/constants.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var UtilService = (function (_super) {
    __extends(UtilService, _super);
    function UtilService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UtilService.prototype.capitalize = function (s) {
        return s && s[0].toUpperCase() + s.slice(1).toLowerCase();
    };
    return UtilService;
}(__WEBPACK_IMPORTED_MODULE_1__constants__["a" /* Constants */]));
UtilService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
], UtilService);

//# sourceMappingURL=util.service.js.map

/***/ }),

/***/ "../../../../../src/app/shared/shared.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SharedModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular2_jwt__ = __webpack_require__("../../../../angular2-jwt/angular2-jwt.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular2_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_angular2_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common__ = __webpack_require__("../../../common/@angular/common.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ng2_bootstrap_accordion__ = __webpack_require__("../../../../ng2-bootstrap/accordion/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ng2_bootstrap_progressbar__ = __webpack_require__("../../../../ng2-bootstrap/progressbar/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ng2_bootstrap_modal__ = __webpack_require__("../../../../ng2-bootstrap/modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_angular2_notifications__ = __webpack_require__("../../../../angular2-notifications/dist/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_angular2_notifications___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_angular2_notifications__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__util_http_interceptor__ = __webpack_require__("../../../../../src/app/shared/util/http-interceptor.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__util_custom_error_handler__ = __webpack_require__("../../../../../src/app/shared/util/custom-error-handler.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__modules_helper_logger_service__ = __webpack_require__("../../../../../src/app/shared/modules/helper/logger.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__modules_auth_user_service__ = __webpack_require__("../../../../../src/app/shared/modules/auth/user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__modules_helper_layout_service__ = __webpack_require__("../../../../../src/app/shared/modules/helper/layout.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__modules_auth_staff_routeguard_service__ = __webpack_require__("../../../../../src/app/shared/modules/auth/staff-routeguard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__modules_util_util_module__ = __webpack_require__("../../../../../src/app/shared/modules/util/util.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_angular2_datatable__ = __webpack_require__("../../../../angular2-datatable/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_angular2_datatable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16_angular2_datatable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__util_data_service__ = __webpack_require__("../../../../../src/app/shared/util/data-service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__modules_ui_ui_module__ = __webpack_require__("../../../../../src/app/shared/modules/ui/ui.module.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



















var SharedModule = SharedModule_1 = (function () {
    function SharedModule() {
    }
    /** defines the behaviour of angular2-jwt */
    SharedModule.authHttpServiceFactory = function (http, options) {
        return new __WEBPACK_IMPORTED_MODULE_2_angular2_jwt__["AuthHttp"](new __WEBPACK_IMPORTED_MODULE_2_angular2_jwt__["AuthConfig"]({
            tokenName: 'oeda_token',
            globalHeaders: [{ 'Content-Type': 'application/json' }],
        }), http, options);
    };
    SharedModule.forRoot = function () {
        return {
            ngModule: SharedModule_1,
            // Here (and only here!) are all global shared services
            providers: [
                {
                    provide: __WEBPACK_IMPORTED_MODULE_3__angular_http__["Http"],
                    useFactory: __WEBPACK_IMPORTED_MODULE_9__util_http_interceptor__["a" /* HttpInterceptor */].httpInterceptorFactory,
                    deps: [__WEBPACK_IMPORTED_MODULE_3__angular_http__["XHRBackend"], __WEBPACK_IMPORTED_MODULE_3__angular_http__["RequestOptions"], __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injector"]]
                },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_2_angular2_jwt__["AuthHttp"],
                    useFactory: SharedModule_1.authHttpServiceFactory,
                    deps: [__WEBPACK_IMPORTED_MODULE_3__angular_http__["Http"], __WEBPACK_IMPORTED_MODULE_3__angular_http__["RequestOptions"]]
                },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ErrorHandler"],
                    useClass: __WEBPACK_IMPORTED_MODULE_10__util_custom_error_handler__["a" /* CustomErrorHandler */]
                },
                __WEBPACK_IMPORTED_MODULE_11__modules_helper_logger_service__["a" /* LoggerService */],
                __WEBPACK_IMPORTED_MODULE_12__modules_auth_user_service__["a" /* UserService */],
                __WEBPACK_IMPORTED_MODULE_13__modules_helper_layout_service__["a" /* LayoutService */],
                __WEBPACK_IMPORTED_MODULE_14__modules_auth_staff_routeguard_service__["a" /* UserRouteGuard */],
                __WEBPACK_IMPORTED_MODULE_8_angular2_notifications__["NotificationsService"]
            ]
        };
    };
    return SharedModule;
}());
SharedModule = SharedModule_1 = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_4__angular_common__["CommonModule"],
            __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["HttpModule"],
            __WEBPACK_IMPORTED_MODULE_5_ng2_bootstrap_accordion__["a" /* AccordionModule */],
            __WEBPACK_IMPORTED_MODULE_6_ng2_bootstrap_progressbar__["a" /* ProgressbarModule */],
            __WEBPACK_IMPORTED_MODULE_7_ng2_bootstrap_modal__["a" /* ModalModule */],
            __WEBPACK_IMPORTED_MODULE_15__modules_util_util_module__["a" /* UtilModule */],
            __WEBPACK_IMPORTED_MODULE_16_angular2_datatable__["DataTableModule"],
            __WEBPACK_IMPORTED_MODULE_18__modules_ui_ui_module__["a" /* UIModule */]
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_4__angular_common__["CommonModule"],
            __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["HttpModule"],
            __WEBPACK_IMPORTED_MODULE_7_ng2_bootstrap_modal__["a" /* ModalModule */],
            __WEBPACK_IMPORTED_MODULE_5_ng2_bootstrap_accordion__["a" /* AccordionModule */],
            __WEBPACK_IMPORTED_MODULE_15__modules_util_util_module__["a" /* UtilModule */],
            __WEBPACK_IMPORTED_MODULE_6_ng2_bootstrap_progressbar__["a" /* ProgressbarModule */],
            __WEBPACK_IMPORTED_MODULE_16_angular2_datatable__["DataTableModule"],
            __WEBPACK_IMPORTED_MODULE_18__modules_ui_ui_module__["a" /* UIModule */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_12__modules_auth_user_service__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_11__modules_helper_logger_service__["a" /* LoggerService */],
            __WEBPACK_IMPORTED_MODULE_14__modules_auth_staff_routeguard_service__["a" /* UserRouteGuard */],
            __WEBPACK_IMPORTED_MODULE_13__modules_helper_layout_service__["a" /* LayoutService */],
            __WEBPACK_IMPORTED_MODULE_17__util_data_service__["a" /* DataService */]
            // should always be empty
        ]
    })
], SharedModule);

var SharedModule_1;
//# sourceMappingURL=shared.module.js.map

/***/ }),

/***/ "../../../../../src/app/shared/util/custom-error-handler.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomErrorHandler; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_helper_logger_service__ = __webpack_require__("../../../../../src/app/shared/modules/helper/logger.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular2_notifications__ = __webpack_require__("../../../../angular2-notifications/dist/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular2_notifications___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_angular2_notifications__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CustomErrorHandler = (function () {
    function CustomErrorHandler(log, notify) {
        this.log = log;
        this.notify = notify;
    }
    // handles exceptions in angular2 and forwards them to eventq
    CustomErrorHandler.prototype.handleError = function (error) {
        this.log.error("RUNTIME_ERROR", error);
        this.notify.error("Application Error", "Please reload...");
        console.log("-ERROR-");
        console.error(error);
    };
    return CustomErrorHandler;
}());
CustomErrorHandler = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__modules_helper_logger_service__["a" /* LoggerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__modules_helper_logger_service__["a" /* LoggerService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2_angular2_notifications__["NotificationsService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_angular2_notifications__["NotificationsService"]) === "function" && _b || Object])
], CustomErrorHandler);

var _a, _b;
//# sourceMappingURL=custom-error-handler.js.map

/***/ }),

/***/ "../../../../../src/app/shared/util/data-service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular2_jwt__ = __webpack_require__("../../../../angular2-jwt/angular2-jwt.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular2_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular2_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_notifications__ = __webpack_require__("../../../../angular2-notifications/dist/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_notifications___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular2_notifications__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_helper_logger_service__ = __webpack_require__("../../../../../src/app/shared/modules/helper/logger.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var DataService = (function () {
    function DataService(http, authHttp, notify, log) {
        this.http = http;
        this.authHttp = authHttp;
        this.notify = notify;
        this.log = log;
        this.runningExperiments = [
            {
                name: "RTX Test 1",
                status: "RUNNING",
                complete: 0.5
            },
            {
                name: "RTX Test 2",
                status: "RUNNING",
                complete: 0.2
            },
            {
                name: "RTX Test 3",
                status: "RUNNING",
                complete: 0.8
            }
        ];
    }
    return DataService;
}());
DataService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_4__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__angular_http__["Http"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_http__["Http"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0_angular2_jwt__["AuthHttp"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0_angular2_jwt__["AuthHttp"]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1_angular2_notifications__["NotificationsService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_angular2_notifications__["NotificationsService"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__modules_helper_logger_service__["a" /* LoggerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__modules_helper_logger_service__["a" /* LoggerService */]) === "function" && _d || Object])
], DataService);

var _a, _b, _c, _d;
//# sourceMappingURL=data-service.js.map

/***/ }),

/***/ "../../../../../src/app/shared/util/http-interceptor.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HttpInterceptor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HttpInterceptor = HttpInterceptor_1 = (function (_super) {
    __extends(HttpInterceptor, _super);
    function HttpInterceptor(backend, defaultOptions, injector) {
        var _this = _super.call(this, backend, defaultOptions) || this;
        _this.injector = injector;
        _this._router = null;
        setTimeout(function () { return _this._router = injector.get(__WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]); });
        return _this;
    }
    HttpInterceptor.httpInterceptorFactory = function (xhrBackend, requestOptions, injector) {
        return new HttpInterceptor_1(xhrBackend, requestOptions, injector);
    };
    HttpInterceptor.prototype.request = function (url, options) {
        return this.intercept(_super.prototype.request.call(this, url, options));
    };
    HttpInterceptor.prototype.get = function (url, options) {
        return this.intercept(_super.prototype.get.call(this, url, options));
    };
    HttpInterceptor.prototype.post = function (url, body, options) {
        return this.intercept(_super.prototype.post.call(this, url, body, this.getRequestOptionArgs(options)));
    };
    HttpInterceptor.prototype.put = function (url, body, options) {
        return this.intercept(_super.prototype.put.call(this, url, body, this.getRequestOptionArgs(options)));
    };
    HttpInterceptor.prototype.delete = function (url, options) {
        return this.intercept(_super.prototype.delete.call(this, url, options));
    };
    HttpInterceptor.prototype.getRequestOptionArgs = function (options) {
        if (options == null) {
            options = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["RequestOptions"]();
        }
        if (options.headers == null) {
            options.headers = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["Headers"]();
        }
        options.headers.append('Content-Type', 'application/json');
        return options;
    };
    HttpInterceptor.prototype.intercept = function (observable) {
        var _this = this;
        return observable.catch(function (err, source) {
            if (err.status == 401) {
                setTimeout(function () { return _this._router.navigate(['/auth/login'], {
                    queryParams: { returnUrl: _this._router.currentRouterState.snapshot.url }
                }); });
                return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].empty();
            }
            // offline case
            // if (err.status == 0 && !err.ok) {
            //   return Observable.throw(err);
            // }
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].throw(err);
        });
    };
    return HttpInterceptor;
}(__WEBPACK_IMPORTED_MODULE_0__angular_http__["Http"]));
HttpInterceptor = HttpInterceptor_1 = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_http__["ConnectionBackend"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_http__["ConnectionBackend"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_http__["RequestOptions"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_http__["RequestOptions"]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_core__["Injector"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_core__["Injector"]) === "function" && _c || Object])
], HttpInterceptor);

var HttpInterceptor_1, _a, _b, _c;
//# sourceMappingURL=http-interceptor.js.map

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false,
    logLevel: 5,
    backendURL: "none"
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ "../../../../moment/locale recursive ^\\.\\/.*$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": "../../../../moment/locale/af.js",
	"./af.js": "../../../../moment/locale/af.js",
	"./ar": "../../../../moment/locale/ar.js",
	"./ar-dz": "../../../../moment/locale/ar-dz.js",
	"./ar-dz.js": "../../../../moment/locale/ar-dz.js",
	"./ar-kw": "../../../../moment/locale/ar-kw.js",
	"./ar-kw.js": "../../../../moment/locale/ar-kw.js",
	"./ar-ly": "../../../../moment/locale/ar-ly.js",
	"./ar-ly.js": "../../../../moment/locale/ar-ly.js",
	"./ar-ma": "../../../../moment/locale/ar-ma.js",
	"./ar-ma.js": "../../../../moment/locale/ar-ma.js",
	"./ar-sa": "../../../../moment/locale/ar-sa.js",
	"./ar-sa.js": "../../../../moment/locale/ar-sa.js",
	"./ar-tn": "../../../../moment/locale/ar-tn.js",
	"./ar-tn.js": "../../../../moment/locale/ar-tn.js",
	"./ar.js": "../../../../moment/locale/ar.js",
	"./az": "../../../../moment/locale/az.js",
	"./az.js": "../../../../moment/locale/az.js",
	"./be": "../../../../moment/locale/be.js",
	"./be.js": "../../../../moment/locale/be.js",
	"./bg": "../../../../moment/locale/bg.js",
	"./bg.js": "../../../../moment/locale/bg.js",
	"./bn": "../../../../moment/locale/bn.js",
	"./bn.js": "../../../../moment/locale/bn.js",
	"./bo": "../../../../moment/locale/bo.js",
	"./bo.js": "../../../../moment/locale/bo.js",
	"./br": "../../../../moment/locale/br.js",
	"./br.js": "../../../../moment/locale/br.js",
	"./bs": "../../../../moment/locale/bs.js",
	"./bs.js": "../../../../moment/locale/bs.js",
	"./ca": "../../../../moment/locale/ca.js",
	"./ca.js": "../../../../moment/locale/ca.js",
	"./cs": "../../../../moment/locale/cs.js",
	"./cs.js": "../../../../moment/locale/cs.js",
	"./cv": "../../../../moment/locale/cv.js",
	"./cv.js": "../../../../moment/locale/cv.js",
	"./cy": "../../../../moment/locale/cy.js",
	"./cy.js": "../../../../moment/locale/cy.js",
	"./da": "../../../../moment/locale/da.js",
	"./da.js": "../../../../moment/locale/da.js",
	"./de": "../../../../moment/locale/de.js",
	"./de-at": "../../../../moment/locale/de-at.js",
	"./de-at.js": "../../../../moment/locale/de-at.js",
	"./de-ch": "../../../../moment/locale/de-ch.js",
	"./de-ch.js": "../../../../moment/locale/de-ch.js",
	"./de.js": "../../../../moment/locale/de.js",
	"./dv": "../../../../moment/locale/dv.js",
	"./dv.js": "../../../../moment/locale/dv.js",
	"./el": "../../../../moment/locale/el.js",
	"./el.js": "../../../../moment/locale/el.js",
	"./en-au": "../../../../moment/locale/en-au.js",
	"./en-au.js": "../../../../moment/locale/en-au.js",
	"./en-ca": "../../../../moment/locale/en-ca.js",
	"./en-ca.js": "../../../../moment/locale/en-ca.js",
	"./en-gb": "../../../../moment/locale/en-gb.js",
	"./en-gb.js": "../../../../moment/locale/en-gb.js",
	"./en-ie": "../../../../moment/locale/en-ie.js",
	"./en-ie.js": "../../../../moment/locale/en-ie.js",
	"./en-nz": "../../../../moment/locale/en-nz.js",
	"./en-nz.js": "../../../../moment/locale/en-nz.js",
	"./eo": "../../../../moment/locale/eo.js",
	"./eo.js": "../../../../moment/locale/eo.js",
	"./es": "../../../../moment/locale/es.js",
	"./es-do": "../../../../moment/locale/es-do.js",
	"./es-do.js": "../../../../moment/locale/es-do.js",
	"./es.js": "../../../../moment/locale/es.js",
	"./et": "../../../../moment/locale/et.js",
	"./et.js": "../../../../moment/locale/et.js",
	"./eu": "../../../../moment/locale/eu.js",
	"./eu.js": "../../../../moment/locale/eu.js",
	"./fa": "../../../../moment/locale/fa.js",
	"./fa.js": "../../../../moment/locale/fa.js",
	"./fi": "../../../../moment/locale/fi.js",
	"./fi.js": "../../../../moment/locale/fi.js",
	"./fo": "../../../../moment/locale/fo.js",
	"./fo.js": "../../../../moment/locale/fo.js",
	"./fr": "../../../../moment/locale/fr.js",
	"./fr-ca": "../../../../moment/locale/fr-ca.js",
	"./fr-ca.js": "../../../../moment/locale/fr-ca.js",
	"./fr-ch": "../../../../moment/locale/fr-ch.js",
	"./fr-ch.js": "../../../../moment/locale/fr-ch.js",
	"./fr.js": "../../../../moment/locale/fr.js",
	"./fy": "../../../../moment/locale/fy.js",
	"./fy.js": "../../../../moment/locale/fy.js",
	"./gd": "../../../../moment/locale/gd.js",
	"./gd.js": "../../../../moment/locale/gd.js",
	"./gl": "../../../../moment/locale/gl.js",
	"./gl.js": "../../../../moment/locale/gl.js",
	"./gom-latn": "../../../../moment/locale/gom-latn.js",
	"./gom-latn.js": "../../../../moment/locale/gom-latn.js",
	"./he": "../../../../moment/locale/he.js",
	"./he.js": "../../../../moment/locale/he.js",
	"./hi": "../../../../moment/locale/hi.js",
	"./hi.js": "../../../../moment/locale/hi.js",
	"./hr": "../../../../moment/locale/hr.js",
	"./hr.js": "../../../../moment/locale/hr.js",
	"./hu": "../../../../moment/locale/hu.js",
	"./hu.js": "../../../../moment/locale/hu.js",
	"./hy-am": "../../../../moment/locale/hy-am.js",
	"./hy-am.js": "../../../../moment/locale/hy-am.js",
	"./id": "../../../../moment/locale/id.js",
	"./id.js": "../../../../moment/locale/id.js",
	"./is": "../../../../moment/locale/is.js",
	"./is.js": "../../../../moment/locale/is.js",
	"./it": "../../../../moment/locale/it.js",
	"./it.js": "../../../../moment/locale/it.js",
	"./ja": "../../../../moment/locale/ja.js",
	"./ja.js": "../../../../moment/locale/ja.js",
	"./jv": "../../../../moment/locale/jv.js",
	"./jv.js": "../../../../moment/locale/jv.js",
	"./ka": "../../../../moment/locale/ka.js",
	"./ka.js": "../../../../moment/locale/ka.js",
	"./kk": "../../../../moment/locale/kk.js",
	"./kk.js": "../../../../moment/locale/kk.js",
	"./km": "../../../../moment/locale/km.js",
	"./km.js": "../../../../moment/locale/km.js",
	"./kn": "../../../../moment/locale/kn.js",
	"./kn.js": "../../../../moment/locale/kn.js",
	"./ko": "../../../../moment/locale/ko.js",
	"./ko.js": "../../../../moment/locale/ko.js",
	"./ky": "../../../../moment/locale/ky.js",
	"./ky.js": "../../../../moment/locale/ky.js",
	"./lb": "../../../../moment/locale/lb.js",
	"./lb.js": "../../../../moment/locale/lb.js",
	"./lo": "../../../../moment/locale/lo.js",
	"./lo.js": "../../../../moment/locale/lo.js",
	"./lt": "../../../../moment/locale/lt.js",
	"./lt.js": "../../../../moment/locale/lt.js",
	"./lv": "../../../../moment/locale/lv.js",
	"./lv.js": "../../../../moment/locale/lv.js",
	"./me": "../../../../moment/locale/me.js",
	"./me.js": "../../../../moment/locale/me.js",
	"./mi": "../../../../moment/locale/mi.js",
	"./mi.js": "../../../../moment/locale/mi.js",
	"./mk": "../../../../moment/locale/mk.js",
	"./mk.js": "../../../../moment/locale/mk.js",
	"./ml": "../../../../moment/locale/ml.js",
	"./ml.js": "../../../../moment/locale/ml.js",
	"./mr": "../../../../moment/locale/mr.js",
	"./mr.js": "../../../../moment/locale/mr.js",
	"./ms": "../../../../moment/locale/ms.js",
	"./ms-my": "../../../../moment/locale/ms-my.js",
	"./ms-my.js": "../../../../moment/locale/ms-my.js",
	"./ms.js": "../../../../moment/locale/ms.js",
	"./my": "../../../../moment/locale/my.js",
	"./my.js": "../../../../moment/locale/my.js",
	"./nb": "../../../../moment/locale/nb.js",
	"./nb.js": "../../../../moment/locale/nb.js",
	"./ne": "../../../../moment/locale/ne.js",
	"./ne.js": "../../../../moment/locale/ne.js",
	"./nl": "../../../../moment/locale/nl.js",
	"./nl-be": "../../../../moment/locale/nl-be.js",
	"./nl-be.js": "../../../../moment/locale/nl-be.js",
	"./nl.js": "../../../../moment/locale/nl.js",
	"./nn": "../../../../moment/locale/nn.js",
	"./nn.js": "../../../../moment/locale/nn.js",
	"./pa-in": "../../../../moment/locale/pa-in.js",
	"./pa-in.js": "../../../../moment/locale/pa-in.js",
	"./pl": "../../../../moment/locale/pl.js",
	"./pl.js": "../../../../moment/locale/pl.js",
	"./pt": "../../../../moment/locale/pt.js",
	"./pt-br": "../../../../moment/locale/pt-br.js",
	"./pt-br.js": "../../../../moment/locale/pt-br.js",
	"./pt.js": "../../../../moment/locale/pt.js",
	"./ro": "../../../../moment/locale/ro.js",
	"./ro.js": "../../../../moment/locale/ro.js",
	"./ru": "../../../../moment/locale/ru.js",
	"./ru.js": "../../../../moment/locale/ru.js",
	"./sd": "../../../../moment/locale/sd.js",
	"./sd.js": "../../../../moment/locale/sd.js",
	"./se": "../../../../moment/locale/se.js",
	"./se.js": "../../../../moment/locale/se.js",
	"./si": "../../../../moment/locale/si.js",
	"./si.js": "../../../../moment/locale/si.js",
	"./sk": "../../../../moment/locale/sk.js",
	"./sk.js": "../../../../moment/locale/sk.js",
	"./sl": "../../../../moment/locale/sl.js",
	"./sl.js": "../../../../moment/locale/sl.js",
	"./sq": "../../../../moment/locale/sq.js",
	"./sq.js": "../../../../moment/locale/sq.js",
	"./sr": "../../../../moment/locale/sr.js",
	"./sr-cyrl": "../../../../moment/locale/sr-cyrl.js",
	"./sr-cyrl.js": "../../../../moment/locale/sr-cyrl.js",
	"./sr.js": "../../../../moment/locale/sr.js",
	"./ss": "../../../../moment/locale/ss.js",
	"./ss.js": "../../../../moment/locale/ss.js",
	"./sv": "../../../../moment/locale/sv.js",
	"./sv.js": "../../../../moment/locale/sv.js",
	"./sw": "../../../../moment/locale/sw.js",
	"./sw.js": "../../../../moment/locale/sw.js",
	"./ta": "../../../../moment/locale/ta.js",
	"./ta.js": "../../../../moment/locale/ta.js",
	"./te": "../../../../moment/locale/te.js",
	"./te.js": "../../../../moment/locale/te.js",
	"./tet": "../../../../moment/locale/tet.js",
	"./tet.js": "../../../../moment/locale/tet.js",
	"./th": "../../../../moment/locale/th.js",
	"./th.js": "../../../../moment/locale/th.js",
	"./tl-ph": "../../../../moment/locale/tl-ph.js",
	"./tl-ph.js": "../../../../moment/locale/tl-ph.js",
	"./tlh": "../../../../moment/locale/tlh.js",
	"./tlh.js": "../../../../moment/locale/tlh.js",
	"./tr": "../../../../moment/locale/tr.js",
	"./tr.js": "../../../../moment/locale/tr.js",
	"./tzl": "../../../../moment/locale/tzl.js",
	"./tzl.js": "../../../../moment/locale/tzl.js",
	"./tzm": "../../../../moment/locale/tzm.js",
	"./tzm-latn": "../../../../moment/locale/tzm-latn.js",
	"./tzm-latn.js": "../../../../moment/locale/tzm-latn.js",
	"./tzm.js": "../../../../moment/locale/tzm.js",
	"./uk": "../../../../moment/locale/uk.js",
	"./uk.js": "../../../../moment/locale/uk.js",
	"./ur": "../../../../moment/locale/ur.js",
	"./ur.js": "../../../../moment/locale/ur.js",
	"./uz": "../../../../moment/locale/uz.js",
	"./uz-latn": "../../../../moment/locale/uz-latn.js",
	"./uz-latn.js": "../../../../moment/locale/uz-latn.js",
	"./uz.js": "../../../../moment/locale/uz.js",
	"./vi": "../../../../moment/locale/vi.js",
	"./vi.js": "../../../../moment/locale/vi.js",
	"./x-pseudo": "../../../../moment/locale/x-pseudo.js",
	"./x-pseudo.js": "../../../../moment/locale/x-pseudo.js",
	"./yo": "../../../../moment/locale/yo.js",
	"./yo.js": "../../../../moment/locale/yo.js",
	"./zh-cn": "../../../../moment/locale/zh-cn.js",
	"./zh-cn.js": "../../../../moment/locale/zh-cn.js",
	"./zh-hk": "../../../../moment/locale/zh-hk.js",
	"./zh-hk.js": "../../../../moment/locale/zh-hk.js",
	"./zh-tw": "../../../../moment/locale/zh-tw.js",
	"./zh-tw.js": "../../../../moment/locale/zh-tw.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "../../../../moment/locale recursive ^\\.\\/.*$";

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);