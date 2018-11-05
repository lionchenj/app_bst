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

    public async register(mobile: string, code: string, shareMobile: string, password: string): Promise<void> {
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
    public async banner(): Promise<any> {
        return await this.httpPost("banner")
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
    //提现
    public async assets(coin_id:string,number: string,verification_code:string,service:number,address:string): Promise<void> {
        const params = {
            coin_id:coin_id,
            number:number,
            verification_code:verification_code,
            service:service,
            address:address
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

    // 兑换激活卡
    public async exchangeCard(num: number): Promise<void> {
        const params = {
            number: num
        }
        return await this.httpPost("exchangeCard", params)
        
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
    
    public async pageAssets(): Promise<model.PageAssetsData> {
        const resp = await this.httpPost("pageAssets")
        return resp.data as model.PageAssetsData
    }

    public async getUsableCoin(): Promise<model.UsableCoin> {
        const resp = await this.httpPost("getUsableCoin")
        return resp.data as model.UsableCoin
    }
    
    public async give(coinId: string, giveNumber: string, mobile: string, code: string): Promise<void> {
        const params = {
            coin_id: coinId,
            number: giveNumber,
            mobile:mobile,
            verification_code: code
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
    public async rechange(coinId: string, giveNumber: string, voucher:string, code: string, random:string): Promise<void> {
        const params = {
            coin_id: coinId,
            number: giveNumber,
            voucher,
            verification_code: code,
            random
        }
        return await this.httpPost("rechange", params)
    }
    //充币log
    public async rechangeRecord( page: number): Promise<any>{
        const params = {
            page,
            limit:10
        }
        const resp = await this.httpPost("rechangeRecord", params)
        return resp.data as model.PageData<model.exreChangeRecordItem>
    }
    //兑换log
    public async exchangeRecord(coin_id?: string, page?: number, limit?: number): Promise<model.PageData<model.exChangeRecordItem>> {
        const params = {
            coin_id,
            page,
            limit:10
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
    // public async withdraw(coinId: string, withdrawNumber: string, code: string): Promise<void> {
    //     const params = {
    //         coin_id: coinId,
    //         number: withdrawNumber,
    //         verification_code: code
    //     }
    //     return await this.httpPost("assets", params)
    // }

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

    //矿工费
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