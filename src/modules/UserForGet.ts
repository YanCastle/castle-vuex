import { VuexModule, Module, Action } from "vuex-module-decorators";
import User from "@ctsy/api-sdk/dist/modules/User";

@Module({})
export default class UserForGet extends VuexModule {
  @Action({ rawError: true })
  async ForGet(data: any) {
    return await User.AuthApi.forget(data.Accout, data.PWD, data.VCode);
  }
}
