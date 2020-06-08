import { VuexModule, Module, Action, Mutation } from "vuex-module-decorators";
import User from "@ctsy/api-sdk/dist/modules/User";

@Module
export default class UserLogin extends VuexModule {
  UserInfo: User.LoginResult = new User.LoginResult();
  @Mutation
  SetUserInfo(d) {
    this.UserInfo = d;
  }

  get info() {
    return this.UserInfo;
  }

  @Action({ rawError: true })
  async UserLogin(data: any) {
    let rs = await User.AuthApi.login(data.Account, data.PWD);
    this.context.commit("SetUserInfo", rs);
    return rs;
  }
}
