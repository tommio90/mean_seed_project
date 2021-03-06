import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { MessageService } from "./message.service";
import { Message } from "./message.model";
import { AuthService } from "../auth/auth.service";

@Component({
    selector: 'app-message-input',
    templateUrl: './message-input.component.html',
        styles: [`
         body { padding-top: 70px; }

         .footer{
             display: block;
             background-color : white;
         }
    `]
})
export class MessageInputComponent implements OnInit {
    message: Message;
    messages = [];
    connection;

    constructor(private messageService: MessageService, private authService: AuthService) {}

    
   

  isLoggedIn() {
        return this.authService.isLoggedIn();
  }
    onSubmit(form: NgForm) {
        if (this.message) {
            // Edit
            this.message.content = form.value.content;
            this.messageService.updateMessage(this.message)
                .subscribe(
                    result => console.log(result)
                );
            this.message = null;
        } else {
            // Create
            const message = new Message(form.value.content, 'Max');
            this.messageService.addMessage(message)
                .subscribe(
                    data => console.log(data),
                    error => console.error(error)
                );
        }
        form.resetForm();
    }

    onClear(form: NgForm) {
        this.message = null;
        form.resetForm();
    }

    ngOnInit() {
        this.connection = this.messageService.messageIsEdit.subscribe(
            (message: Message) => this.message = message
        );
        this.connection = this.messageService.getSockets().subscribe(message => {
          this.messages.push(message);
        });
    }


    ngOnDestroy(){
        this.connection.unsubscribe();
    }




}