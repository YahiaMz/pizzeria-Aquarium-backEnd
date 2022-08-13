import { Logger } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket , Namespace, Server } from "socket.io";
import { ResponseStatus } from "src/Utils/ResponseStatus";
import { OrdersService } from "./orders.service";


@WebSocketGateway({
    port : 9999
})
export class OrdersGateWay implements OnGatewayConnection , OnGatewayDisconnect {
    @WebSocketServer() public mServer : Server;
    public constructor() {}
    handleDisconnect(client: any) {
        console.log(client.id + " disconnected ");
    }
    handleConnection(client: Socket) {
    console.log(client.id + " connected ");
    }
    
    @SubscribeMessage("new-order")
    async notifyNewOrder( @ConnectedSocket() cs : Socket ) {
        return ResponseStatus.success_response("")
    }

    



   
    



}