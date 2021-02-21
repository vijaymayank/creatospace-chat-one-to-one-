import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';


@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  userList=[]

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload:{name:string,text:string, senderID:string,receiverId:string}): void {
    this.server.to(payload.receiverId).emit('msgToClient', payload);
    client.emit('msgToClient',payload)

  }

  @SubscribeMessage('senderName')
  async handleClientName1(client: Socket, senderName: string) {
   let user=await this.userList.find(user=>user.id===client.id)
   user.name=senderName
  //  console.log(senderName)
  //  console.log(this.userList)
    this.server.emit('updatedList', this.userList);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }
  
  handleConnection(client: Socket, ...args: any[]) {
    this.userList.push({id:client.id,name:null})
    this.logger.log(`Client connected: ${client.id}`);
  }

 async handleDisconnect(client: Socket) {
    let index=await this.userList.findIndex(user=>user.id===client.id)
    this.userList.splice(index,1)
    //console.log(this.userList)
    this.server.emit('updatedList', this.userList);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  
}
