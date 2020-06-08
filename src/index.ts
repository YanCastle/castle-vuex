import { ApiConfig } from "@ctsy/api-sdk";

ApiConfig.AppID = "dev";
ApiConfig.Secret = "dev2930sf9fwopfwe9";
ApiConfig.Key = "dev";
ApiConfig.Debug = true;

// ApiConfig.Host = '';
export enum VuexHooks {
  /**
   * 登录成功
   */
  LoginSuccess = "vuex/LoginSuccess",
  /**
   * 退出登录
   */
  Logout = "vuex/logout",
}
/**
 *
 */
export enum VuexAuthAction {
  /**
   * 登录
   */
  login = "login",
  /**
   * 重新读取登录信息
   */
  relogin = "relogin",
  /**
   * 退出登录
   */
  logout = "logout",
}

export enum VuexAuthMutation {
  set_user = "",
}
