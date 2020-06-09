/*
 *
 *公共正则
 */

namespace PublicReg {
  class defaultReg {
    Name: RegExp = /^[\u4E00-\u9FA5]{2,15}$/;
    Nick: RegExp = /^[\u4E00-\u9FA5]{2,10}$/;
    Account: RegExp = /^([^$@$!%*#?&])([A-Za-z0-9$@$!%*#?&]){6,13}$/;
    Phone: RegExp = /^[+86]{0,}1\d{10}$/;
    MessageCode: RegExp = /^\w{4,}$/;
    Email: RegExp = /^\w+@[a-z0-9]+(\.[a-z]+){1,3}/;
    EmailCode: RegExp = /^\w{4,}$/;
    PWD: RegExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
  }
  /**
   * 传入自定义正则
   */
  export class CustomReg {
    /**
     * 姓名
     */
    Name?: RegExp;
    /**
     * 昵称
     */
    Nick?: RegExp;
    /**
     * 账号
     */
    Account?: RegExp;
    /**
     * 电话号码
     */
    Phone?: RegExp;
    /**
     * 短信验证码
     */
    MessageCode?: RegExp;
    /**
     * 邮箱
     */
    Email?: RegExp;
    /**
     * 邮箱验证码
     */
    EmailCode?: RegExp;
    /**
     * 密码，重复密码与密码共用
     *      */
    PWD?: RegExp;
  }
  export const Reg = new CustomReg();
  const DefaultRegExp = new defaultReg();
  export class Regs {
    /**
     * 中文姓名  根据资料查询，中国人最长的中文名称为15
     */
    Name = DefaultRegExp.Name || Reg.Name;
    /**
     * 中文昵称
     */
    Nick = DefaultRegExp.Nick || Reg.Nick;
    /**
     * 账号 不能以特殊字符开头，可以输入特殊字符
     */
    Account = DefaultRegExp.Account || Reg.Account;
    /**
     * 电话号码
     */
    Phone = DefaultRegExp.Phone || Reg.Phone;
    /**
     * 短信验证码
     */
    MessageCode = DefaultRegExp.MessageCode || Reg.MessageCode;
    /**
     * 邮箱
     */
    Email = DefaultRegExp.Email || Reg.Email;
    /**
     * 邮箱验证码
     */
    EmailCode = DefaultRegExp.EmailCode || Reg.EmailCode;
    /**
     * 密码必须包含数字字母
     */
    PWD = DefaultRegExp.PWD || Reg.PWD;
  }
}

export default PublicReg;
