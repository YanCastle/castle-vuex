"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ApiConfig.AppID = "dev";
// ApiConfig.Secret = "dev2930sf9fwopfwe9";
// ApiConfig.Key = "dev";
// ApiConfig.Debug = true;
// ApiConfig.Host = '';
var VuexHooks;
(function (VuexHooks) {
    /**
     * 登录成功
     */
    VuexHooks["LoginSuccess"] = "vuex/LoginSuccess";
    /**
     * 退出登录
     */
    VuexHooks["Logout"] = "vuex/logout";
})(VuexHooks = exports.VuexHooks || (exports.VuexHooks = {}));
/**
 *
 */
var VuexAuthAction;
(function (VuexAuthAction) {
    /**
     * 登录
     */
    VuexAuthAction["login"] = "login";
    /**
     * 重新读取登录信息
     */
    VuexAuthAction["relogin"] = "relogin";
    /**
     * 退出登录
     */
    VuexAuthAction["logout"] = "logout";
})(VuexAuthAction = exports.VuexAuthAction || (exports.VuexAuthAction = {}));
var VuexAuthMutation;
(function (VuexAuthMutation) {
    VuexAuthMutation["set_user"] = "";
})(VuexAuthMutation = exports.VuexAuthMutation || (exports.VuexAuthMutation = {}));
//# sourceMappingURL=index.js.map