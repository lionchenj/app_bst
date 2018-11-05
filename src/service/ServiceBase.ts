
import axios from "axios";
import { ApiBaseUrl } from "../utils/Constants";
import qs from "qs";
import { ApiError } from "../utils/ApiError";


export abstract class ServiceBase {
   
    protected static accessToken: string

    protected async httpGet(path: string, params: any = {}, needToken = true): Promise<any> {
        return await this.http("get", path, params, needToken) 
    }

    protected async httpPost(path: string, params: any = {}, needToken = true): Promise<any> {
        return await this.http("post", path, params, needToken) 
    }

    protected async httpUpload(file: File): Promise<any> {
        let url: string = `${ApiBaseUrl}/api?url=uploadImages`
        const formData = new FormData()
        formData.append("imageFile", file)
   
        return await axios.post(url, formData, {
            headers: {
                'content-type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent: ProgressEvent) => {
                console.log("httpUpload", progressEvent.loaded, progressEvent.total)
            }
        })
        // const parmas = {
        //     "imageFile": file
        // }
        // return await this.httpPost("uploadImages", parmas, false)
    }

    private async http(method: "get"|"post", path: string, params: any, needToken: boolean): Promise<any> {
        let url: string = `/api?url=${path}`

        const config = {
            url: url,
            method: method,
            baseURL: ApiBaseUrl,
            params: {},
            data: {}
        }

        if (method === "get") {
            config.params = params
        } else if (method === "post") {
            if (needToken) {
                params.access_token = ServiceBase.accessToken
            }
            config.data = qs.stringify(params)
        }
                
        const resp = await axios.request(config)
        if (resp.status < 200 || resp.status > 299) {
            
            throw new Error(`服务器错误。(status:${resp.status},statusText:${resp.statusText})`)
        }
        const errCode: number = parseInt(resp.data.errno)
        if (errCode !== 0) {
            const errMsg = resp.data.errmsg
            throw new ApiError(errCode, errMsg)
            // throw new Error(`(${errCode})${errMsg}`)
        }
        return resp.data
    }
}