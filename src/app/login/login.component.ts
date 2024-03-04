import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { Store } from '@ngrx/store';
import { login } from '../store/auth/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string | undefined;
  password: string | undefined;
  constructor(private store: Store) {}

  login(username: string | undefined, password: string | undefined) {}
}
