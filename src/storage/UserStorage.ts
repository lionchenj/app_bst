// // const AccessTokenKey = "User.AccessTokenKey"

// // export class UserStorage {
// //     static  saveAccessToken(token: string) {
// //         window.localStorage.setItem(AccessTokenKey, token)
// //     }
// //     static  getAccessToken(): string | null {
// //         return  window.localStorage.getItem(AccessTokenKey) 
// //     }

// //     static clearAccessToken() {
// //         window.localStorage.removeItem(AccessTokenKey)
// //     }
    
// // }
// // const AccessTokenKey = "User.AccessTokenKey"


const AccessTokenKey = "User.AccessTokenKey";

export class UserStorage {
  static saveAccessToken(token: string) {
      this.setCookie(AccessTokenKey, token)
      console.log(token)
      UserStorage.setCookie(AccessTokenKey, token);
  }
  static getAccessToken(): string | null {
    window;
    return UserStorage.getCookie(AccessTokenKey);
  }

  static clearAccessToken() {
    window.localStorage.removeItem(AccessTokenKey);
  }
  //写cookies
  static setCookie(name:string, value:string) {
    var Days = 36000;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toUTCString();
  }

  //读取cookies
  static getCookie(name:string) {
    var arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
  }

  //删除cookies
  static delCookie(name:string) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString();
  }
}
