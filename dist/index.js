"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_sdk_1 = require("@ctsy/api-sdk");
api_sdk_1.ApiConfig.AppID = 'dev';
api_sdk_1.ApiConfig.Secret = 'dev2930sf9fwopfwe9';
api_sdk_1.ApiConfig.Key = 'dev';
var VuexHooks;
(function (VuexHooks) {
    VuexHooks["LoginSuccess"] = "vuex/LoginSuccess";
    VuexHooks["Logout"] = "vuex/logout";
})(VuexHooks = exports.VuexHooks || (exports.VuexHooks = {}));
var VuexAuthAction;
(function (VuexAuthAction) {
    VuexAuthAction["login"] = "login";
    VuexAuthAction["relogin"] = "relogin";
    VuexAuthAction["logout"] = "logout";
})(VuexAuthAction = exports.VuexAuthAction || (exports.VuexAuthAction = {}));
var VuexAuthMutation;
(function (VuexAuthMutation) {
    VuexAuthMutation["set_user"] = "";
})(VuexAuthMutation = exports.VuexAuthMutation || (exports.VuexAuthMutation = {}));
//# sourceMappingURL=index.js.map