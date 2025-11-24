export class ApiResponse{
     statusCode:number;
     success:boolean;
     message:string;
     tailor?:any;

    constructor(statusCode:number,success:boolean,message:string,tailor?:any){
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.tailor = tailor;
    }

}




