import { Component } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { Router } from "@angular/router";


@Component({
    selector: 'app-header',
    template: `
        <header class="row">
            <nav class="col-md-8 col-md-offset-2">
                <ul class="nav nav-pills">
                    <li routerLinkActive="active"><a [routerLink]="['/messages']">Messenger</a></li>
                    <li routerLinkActive="active" *ngIf="!isLoggedIn()"><a [routerLink]="['/auth']">Authentication</a></li>
                    <li routerLinkActive="active" *ngIf="isLoggedIn()"><button class = "btn btn-danger" (click)="onLogTest()" >Signout</button></li>

                </ul>
            </nav>
        </header>
    `
})
export class HeaderComponent {

    constructor(private authService: AuthService, private router: Router) {}

    onLogTest(){
        console.log('onLogTest => activated');
        this.authService.logTest().subscribe(data => {
            console.log(data),
            localStorage.token.clear(),
            this.router.navigate(['/auth']);
        });
    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

}