import { HttpException } from "@nestjs/common";

export class MyExceptions {
    public static throwException ( message : String , error : string ) {
        throw new HttpException({
          "success" : false , 
          "message" : message , 
          "error" : error
        } , 
        201);
    }
}