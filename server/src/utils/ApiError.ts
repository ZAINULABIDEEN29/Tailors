export class ApiError extends Error{
    statusCode:number;
    user?:any;

    constructor(statusCode:number,message:string,user?:any ){
        super(message);
        this.statusCode= statusCode;
        this.user = user;
    }
}