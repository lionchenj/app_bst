
export class ApiError extends Error {
    errorCode: number

    constructor(errorCode: number, ...params: any[]) {
        super(...params)
        this.errorCode = errorCode
    }
}