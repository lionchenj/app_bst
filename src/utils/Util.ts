export class Util {
    public static trim(origin: string): string {
        return origin.replace(/\s+/g,"");
    }

    public static validPhone(phone: string): boolean {
        return phone.length == 11
    }
    public static validPassword(password: string): boolean {
        return password.length >= 6
    }
    public static formatNumber = (n:any) => {
        n = n.toString()
        return n[1] ? n : '0' + n
    }
    public static formatDate(data:string, n:number) :string {
        var newDate = new Date(data.replace(/-/g, "/"));
        var newYear = new Date().getFullYear();
        const year = newDate.getFullYear();
        const month = newDate.getMonth() + 1;
        const day = newDate.getDate();
        const hour = newDate.getHours();
        const minute = newDate.getMinutes();
        const second = newDate.getSeconds();
        switch (n) {
          case 1:
            return year + '年' + month + '月' + day + '日';
            break;
          case 2:
            return [year, month, day].map(Util.formatNumber).join('/') + ' ' + [hour, minute, second].map(Util.formatNumber).join(':');
            break;
          case 3:
            return [newYear, month, day].map(Util.formatNumber).join('-');
            break;
          case 5:
            return [month, day].map(Util.formatNumber).join('.');
            break;
          default:
            return [year, month, day].map(Util.formatNumber).join('.') + ' ' + [hour, minute].map(Util.formatNumber).join(':');
            break;
        }
      }

}