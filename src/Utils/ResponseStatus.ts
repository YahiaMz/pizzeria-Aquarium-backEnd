export class ResponseStatus {

    public static success_response ( message ) {
        return {
            "success" : true , 
            "message" : message , 
        }
    }

    public static failed_response ( message : string , error : string = "something wrong") {
        return {
            "success" : false , 
            "message" : message , 
            "error" : error
        }
    }

}