import { ServiceBase } from "./ServiceBase";
import { UserStorage } from "../storage/UserStorage";
import { model } from "../model/model";

export class UserService extends ServiceBase {

    private static  _instance: UserService
    public static get Instance(): UserService {
        return this._instance || (this._instance = new this())
    }

    private constructor() {
        super()
    }

    public isLogined(): boolean {
        if (ServiceBase.length > 0) {
            return true
        }
        const accessToken = UserStorage.getAccessToken()
        if (accessToken) {
            ServiceBase.accessToken = accessToken
            return true
        }
        return false
    }

    public async getMobileMassges(mobile: string): Promise<void> {
        const params = {
            mobile: mobile
        }
        return await this.httpPost("get_mobile_massges", params, false)
        
    }

    //实名认证
    public async Identify(name:string, identity_card:string, identity_imgurl:string): Promise<void> {
        const params = {
            name: name,
            identity_card:identity_card,
            identity_imgurl:identity_imgurl
        }
        return await this.httpPost("Identify", params)
    }
    
    //检测是否实名认证
    public async checkIdentify(): Promise<any> {
      const params = {
      };
      const resp = await this.httpPost("checkIdentify", params);
      return resp;
    }

    public async register(mobile: string, code: string, shareMobile?: string, password?: string): Promise<void> {
        const params = {
            mobile: mobile,
            password: password,
            verification_code: code,
            referee: shareMobile,
        }
        return await this.httpPost("register", params, false)
    }

    public async login(mobile: string, password: string): Promise<void> {
        const params = {
            mobile: mobile,
            password: password
        }
        const resp = await this.httpPost("login", params, false)
        const accessToken = resp.data.access_token
        ServiceBase.accessToken = accessToken
        UserStorage.saveAccessToken(accessToken)
    }

    public logout() {
        ServiceBase.accessToken = ""
        UserStorage.clearAccessToken()
    }

    public async getUserInfo(): Promise<model.User> {
        const resp = await this.httpPost("getUserInfo")
        return resp.data as model.User
    }

    public async updatePassword(mobile: string, code: string, password: string): Promise<void> {
        const params = {
            mobile: mobile,
            password: password,
            verification_code: code
        }
        return await this.httpPost("retrievePassword", params, false)
    }

    //轮播
    public async banner(bannerType:number): Promise<any> {
        const params = {
            type: bannerType
        }
        return await this.httpPost("banner",params)
    }
    
    //解约记录
    public async quicken_list(): Promise<any> {
        
        return await this.httpPost("quicken_list")
    }


    public async feedback(content: string, imagesList: Array<File>): Promise<void> {
        const imagePathList = new Array<string>()
        for (const imageFile of imagesList) {
            const path = await this.uploadFile(imageFile)
            imagePathList.push(path)
        }

        const params = {
            content: content,
            imagesList: imagePathList.join(",")
        }
        return await this.httpPost("feedback", params)
    }

    public async uploadFile(file: File): Promise<string> {
        const resp = await this.httpUpload(file)
        console.log("uploadFile", resp)
        return resp.data.data.path as string
    }

    public async getPurseAddress(): Promise<model.PurseAddress> {
        const resp = await this.httpPost("getPurseAddress")
        return resp.data as model.PurseAddress
    }

    public async signIn(): Promise<void> {
        return await this.httpPost("signIn")
    }

    public async isSignIn(): Promise<boolean> {

        const resp = await this.httpPost("isSignIn")
        return resp.data.status as boolean
    }

    public async pageIndex(): Promise<model.PageIndexData> {

        const resp = await this.httpPost("pageIndex")
        return resp.data as model.PageIndexData
    }

    public async isActivate(): Promise<boolean> {

        const resp = await this.httpPost("isActivate")
        return resp.data.status as boolean
    }

    //复投
    public async activate(number: string,verification_code:string,service:number): Promise<void> {
        const params = {
            number:number,
            verification_code:verification_code,
            service:service
        }
        return await this.httpPost("activate", params)

    }

    //银行卡
    public async listPayment(): Promise<void> {
        return await this.httpPost("listPayment")
    }
    //新增银行卡
    public async addPayment(bank_name: string, account:string, name:string, phone:any): Promise<void> {
        const params = {
            bank_name:bank_name,
            account:account,
            name:name,
            phone:phone
        }
        return await this.httpPost("addPayment", params, true)
    }
    //删除银行卡
    public async deletePayment(account:string): Promise<void> {
        const params = {
            account:account
        }
        return await this.httpPost("deletePayment", params, true)
    }
    //设置设置默认卡
    public async defaultPayment(account:string): Promise<void> {
        const params = {
            account:account
        }
        return await this.httpPost("defaultPayment ", params, true)
    }
    //提现
    public async assets(coin_id:string,number: string,verification_code:string,service:number,address:string,bankinfo:string): Promise<void> {
        const params = {
            coin_id:coin_id,
            number:number,
            verification_code:verification_code,
            service:service,
            address:address,
            bankinfo:bankinfo
        }
        return await this.httpPost("assets", params, true)

    }

    public async pageMyFans(): Promise<model.FansData> {
        const resp = await this.httpPost("pageMyFans")
        return resp.data as model.FansData
    }

    public async activateRecord(): Promise<Array<model.ActivateRecordItem>> {
        const resp = await this.httpPost("activateRecord")
        return resp.data.list as Array<model.ActivateRecordItem>
    }

    public async transaction(transactionType: string, coinId?: "1"|"2", page?: number, limit?: number): Promise<model.PageData<model.TransactionItem>> {
        const params = {
            type: transactionType,
            coin_id: coinId,
            page: page,
            limit: limit
        }
        const resp = await this.httpPost("transaction", params)
        return resp.data as model.PageData<model.TransactionItem>
    }
    
    public async give(coinId: string, giveNumber: string, mobile: string, code: string, remarkinfo:string): Promise<void> {
        const params = {
            coin_id: coinId,
            number: giveNumber,
            mobile:mobile,
            verification_code: code,
            remarkinfo: remarkinfo
        }
        return await this.httpPost("give", params)
    }
    public async exchange(coinId: string, giveNumber: string, code: string): Promise<void> {
        const params = {
            coin_id: coinId,
            number: giveNumber,
            verification_code: code
        }
        return await this.httpPost("exchange", params)
    }
    public async rechange(coinId: string, giveNumber: string, code: string, random:string): Promise<void> {
        const params = {
            coin_id: coinId,
            number: giveNumber,
            verification_code: code,
            random
        }
        return await this.httpPost("rechange", params)
    }
    //充币log
    public async rechangeRecord( page?: number,limit?:number): Promise<any>{
        const params = {
            page,
            limit
        }
        const resp = await this.httpPost("rechangeRecord", params)
        return resp.data as model.PageData<model.exreChangeRecordItem>
    }
    //兑换log
    public async exchangeRecord(coin_id?: string, page?: number, limit?: number): Promise<model.PageData<model.exChangeRecordItem>> {
        const params = {
            coin_id,
            page,
            limit
        }
        const resp = await this.httpPost("exchangeRecord", params)
        return resp.data as model.PageData<model.exChangeRecordItem>
    }
    //加速返回
    public async quicken(code: string): Promise<void> {
        const params = {
            verification_code: code
        }
        return await this.httpPost("quicken", params)
    }
    //社区申请状态
    public async community_status(): Promise<any> {
        const params ={}
        return await this.httpPost("community_status",params,true)
    }
    //社区申请
    public async community(name: string,identity_card:string, mobile:string): Promise<void> {
        const params = {
            name: name,
            identity_card:identity_card,
            mobile:mobile
        }
        return await this.httpPost("community", params)
    }
    //社区会员记录
    public async CommunityFan(downlineid: string): Promise<any> {
        const params = {
            downlineid:downlineid
        }
        return await this.httpPost("CommunityFan", params)
    }
   
    public async systemBulletin(): Promise<Array<model.SystemBulletinItem>> {
        const resp = await this.httpPost("systemBulletin")
        return resp.data.list as Array<model.SystemBulletinItem>
    } 

    // 站内信
    public async mail(): Promise<Array<model.SystemBulletinItem>> {
        const resp = await this.httpPost("mail")
        if (resp.data.list) {
            return resp.data.list as Array<model.SystemBulletinItem>
        }
        return []
    }
    // 关于我们
        public async aboutus(): Promise<any> {
            const params ={}
            return await this.httpPost("aboutus", params,true)
        }

    //矿工费(优先服务费)
    public async getService(): Promise<model.ServiceData>{
        const resp = await this.httpPost("getService")
        return resp.data as model.ServiceData
    }

    //币种信息
    public async getCoin(): Promise<model.CoinData<model.CoinInfo>>{
        const resp = await this.httpPost("getCoin")
        return resp.data as model.CoinData<model.CoinInfo>
    }
    
    //充币
    public async deposit(code: string, number: string, photo: File): Promise<void>{
        const photoPath = await this.uploadFile(photo)

        const params = {
            verification_code: code,
            number: number,
            voucher: photoPath
        }
        return await this.httpPost("rechange", params, true)
    }
    
    
    // 收益记录
    public async profit(style?: string, page?: number, limit?: number): Promise<model.PageData<model.ProfitItem>> {
        const params = {
            page,
            limit,
            style
        }
        const resp = await this.httpPost("profit", params)
        return resp.data as model.PageData<model.ProfitItem>

    }

    // 转币记录
    public async transfer(coinId?:"1"|"2", page?: number, limit?: number): Promise<model.PageData<model.TransferItem>> {
        const params = {
            coin_id: coinId,
            page,
            limit
        }
        const resp = await this.httpPost("transfer", params)
        return resp.data as model.PageData<model.TransferItem>
    }

    // 修改头像
    public async updateHead(avatar: File): Promise<string> {
        const headImgUrl = await this.uploadFile(avatar)
        const params = {
            head_imgurl: headImgUrl
        }
        await this.httpPost("updateHead", params)
        return headImgUrl
    }



}