import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Message } from "./message.model";
import { ErrorService } from "../errors/error.service";

import * as io from 'socket.io-client';


@Injectable()
export class MessageService {
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http, private errorService : ErrorService) {
    }

      private url = 'http://localhost:3000';  
      private socket;

      // emitSocket(message : any){
      //    // var socket = io();
      //   // console.log(socket);
      //   this.socket.emit('add-message', message);  
      // }

      
       getSockets() {
            let observable = new Observable(observer => {
              this.socket = io(this.url);
              this.socket.on('message', (data) => {
                  console.log(data);
                  const message = new Message(
                    data.obj.message.content,
                    data.obj.user.email,
                    data.obj.message.id,
                    data.obj.message.userId);
                this.messages.push(message);
                return message;

                // observer.next(data);    
              });
              return () => {
                this.socket.disconnect();
              };  
            })     
            return observable;
         }  



    addMessage(message: Message) {
      
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.post('http://localhost:3000/message' + token, body, {headers: headers})
            .map((response: Response) => {
                console.log(response);
                // const result = response.json();
                // console.log(result);
                // const message = new Message(
                //     result.obj.message.content,
                //     result.obj.user.email,
                //     result.obj.message.id,
                //     result.obj.message.userId);
                // this.messages.push(message);
                // return message;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());

            });
    }

    getMessages() {
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.get('http://localhost:3000/message'+ token)
            .map((response: Response) => {
                const messages = response.json().obj;
                let transformedMessages: Message[] = [];
                for (let message of messages) {
                console.log(message);
                    
                    transformedMessages.push(new Message(
                        message.content,
                        message.user.email,
                        message.id,
                        message.userId)
                    );
                }
                this.messages = transformedMessages;
                return transformedMessages;
            })
             .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());

            });
    }

    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.patch('http://localhost:3000/message/' + message.messageId + token, body, {headers: headers})
            .map((response: Response) => response.json())
             .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());

            });
    }

    deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.delete('http://localhost:3000/message/' + message.messageId + token)
            .map((response: Response) => response.json())
             .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());

            });
    }
}