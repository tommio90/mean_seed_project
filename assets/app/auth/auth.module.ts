import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SigninComponent } from "./signin.component";
import { SignupComponent } from "./signup.component";
import { authRouting } from "./auth.routing";

@NgModule({
    declarations: [
        SigninComponent,
        SignupComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        authRouting
    ]
})
export class AuthModule {

}