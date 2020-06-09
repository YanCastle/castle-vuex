import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";

import User from "@ctsy/api-sdk/dist/modules/User";
import { SearchResult, SearchWhere } from "@ctsy/api-sdk/dist/lib";
import hook, { HookWhen } from "@ctsy/hook";
import { delay_cb, array_tree } from "castle-function";
import { uniq } from "lodash";

import CRegs from "../../dist/RegExp/index";
const Regs = new CRegs.Regs();

var WaitingUIDs: number[] = [];
@Module({})
export default class users extends VuexModule {
  Result: SearchResult<any> = new SearchResult();
  Where: SearchWhere = new SearchWhere();
  /**
   * UID Map
   */
  Map: { [index: string]: any } = {};
  @Mutation
  set_users_where(data: any) {
    this.Where = data;
  }

  @Mutation
  set_users_map(rs: SearchResult<any>) {
    for (let x of rs.L) {
      this.Map[x.UID] = x;
    }
  }
  @Mutation
  set_users_result(data: any) {
    this.Result = data;
  }
  get users_result() {
    return this.Result;
  }
  @Action({ rawError: true })
  async get_users_list(where: SearchWhere) {
    let w = where || this.Where;
    delay_cb("users", 200, async () => {
      this.context.commit(
        "set_users_result",
        await User.UsersApi.search(w.W, w)
      );
      return this.Result;
    });
  }
  /**
   * 获取用户数据，通过循环dispatch来完成堆积后延时20ms后开始读取数据
   * @param UID
   */
  @Action({ rawError: true })
  async get_users_map(UID: number | number[]) {
    if (UID instanceof Array) {
      WaitingUIDs.push(...UID);
    } else {
      WaitingUIDs.push(UID);
    }
    delay_cb("update_get_user_map", 20, async () => {
      if (WaitingUIDs.length > 0) {
        let UIDs = uniq(WaitingUIDs);
        WaitingUIDs.length = 0;
        try {
          this.context.commit(
            "set_users_map",
            await User.UsersApi.search(
              { UID: { in: UIDs } },
              { P: 1, N: UIDs.length }
            )
          );
        } catch (error) {}
      }
    });
    return true;
  }

  /**
   * 找回密码
   *
   */
  @Action({ rawError: true })
  async user_forget(data: any) {
    if (!Regs.account.test(data.Account)) {
      throw "账号格式错误";
    }
    if (!Regs.pwd.test(data.PWD)) {
      throw "密码格式错误";
    }
    return await User.AuthApi.forget(data.Accout, data.PWD, data.VCode);
  }

  //用户登录
  UserInfo: User.LoginResult = new User.LoginResult();
  /**
   * 设置用户信息
   *
   */
  @Mutation
  set_user_info(d) {
    this.UserInfo = d;
  }
  /**
   *  获取到用户基础信息
   */
  get User_Info() {
    return this.UserInfo;
  }
  /*  用户登录
   *
   * @param data
   */
  @Action({ rawError: true })
  async get_user_login(data: any) {
    if (!Regs.account.test(data.Account)) {
      throw "账号格式错误";
    }
    if (!Regs.pwd.test(data.PWD)) {
      throw "密码格式错误";
    }

    let rs = await User.AuthApi.login(data.Account, data.PWD);
    this.context.commit("set_user_info", rs);
    return rs;
  }

  //用户注册
  /**
   * 用户注册
   * @param data
   */
  async get_user_register(data: any) {
    //注册
    if (!Regs.name.test(data.Name)) {
      throw "不合法的姓名";
    }
    if (!Regs.nick.test(data.NickName)) {
      throw "不合法的昵称";
    }
    if (!Regs.account.test(data.Account)) {
      throw "账号格式错误";
    }
    if (!Regs.pwd.test(data.PWD)) {
      throw "密码格式错误";
    }

    return await User.AuthApi.regist(
      data.Name,
      data.NickName,
      data.Account,
      data.PWD,
      data.Sex || -1,
      data.PUID || 1,
      "",
      data.Contacts || [],
      data.Avatar
    );
  }
}
