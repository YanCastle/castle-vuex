import { VuexModule, Module, Action } from "vuex-module-decorators";
import User from "@ctsy/api-sdk/dist/modules/User";

@Module
export default class UserLogin extends VuexModule {
  @Action({ rawError: true })
  async UserLogin(data: any) {
    return await User.AuthApi.login(data.Account, data.PWD);
  }
}
