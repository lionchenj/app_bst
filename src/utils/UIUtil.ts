import { Toast} from "antd-mobile";
import { ApiError } from "./ApiError";

export class UIUtil {
    static showError(err: Error): void {
        UIUtil.hideLoading()
        if (err instanceof ApiError) {
            const message = `(${err.errorCode})${err.message}`
            Toast.fail(message)
            return
        }
        Toast.fail(err.message)
    }
    static showInfo(info: string): void {
        UIUtil.hideLoading()
        Toast.info(info)
    }

    static showLoading(info: string): void {
        Toast.loading(info, 0)
    }

    static hideLoading(): void {
        Toast.hide()
    }
}