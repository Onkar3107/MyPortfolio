export class ExpressError extends Error {
    constructor(statusCode, msg) {
        super();
        this.statusCode = statusCode;
        this.msg = msg;
    }
}