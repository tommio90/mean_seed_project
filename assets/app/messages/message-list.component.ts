import { Component, OnInit} from "@angular/core";

import { Message } from "./message.model";
import { MessageService } from "./message.service";
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'app-message-list',
    template: `
    <div #list class="list" [scrollTop]="list.scrollHeight">
        <div class="col-md-8 col-md-offset-2">
         
            <app-message
                   [message]="message"
                    *ngFor="let message of messages"></app-message>
           </div>
        </div>
    `
})
export class MessageListComponent implements OnInit{
    messages: Message[];

    constructor(private messageService: MessageService) {}

    ngOnInit() {
       this.MessagesGetter();
    }

    MessagesGetter(){
            this.messageService.getMessages()
            .subscribe(
                (messages: Message[]) => {
                    this.messages = messages;
                }
            );

    }

  
}