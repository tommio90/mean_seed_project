import { Component } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { Router } from "@angular/router";


@Component({
    selector: 'app-header',
     templateUrl: './header.component.html',
})
export class HeaderComponent {

    constructor(private authService: AuthService, private router: Router) {}

    onLogTest(){
        this.authService.logTest().subscribe(data => {
          
        });
    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

}