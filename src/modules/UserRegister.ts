import { VuexModule, Module, Action } from "vuex-module-decorators";
import User from "@ctsy/api-sdk/dist/modules/User";

@Module({})
export default class UserRegister extends VuexModule {
  RegisterInfo: any;
  @Action({ rawError: true })
  async UserRegister(data: any) {
    //注册
    return await User.AuthApi.regist(
      data.Name,
      data.NickName,
      data.Account,
      data.PWD,
      -1,
      1,
      "",
      [],
      data.Avatar
    );
  }
}
