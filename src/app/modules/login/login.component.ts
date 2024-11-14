import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import * as AuthActions from '../../core/store/auth/auth.actions';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../core/store/auth/auth.reducer';
import { selectAuthState } from '../../core/store/auth/auth.selectors';
import { getUserFromLocalStorage } from '../../shared/utils/AuthUtils';
import { setFilter } from '../../core/store/filter/filter.actions';
import { initialState } from '../../core/store/filter/filter.reducer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, CardModule, ButtonModule, InputTextModule, PasswordModule, CheckboxModule, ReactiveFormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });
  isLoading: boolean = false;

  authState: Observable<AuthState>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private messageService: MessageService
  ) {
    this.authState = this.store.select(selectAuthState);
    const data = window.localStorage.getItem('useDarkMode');
    if (data) {
      const checked = JSON.parse(data);
      if (checked) window.document.body.classList.add('dark');
      else window.document.body.classList.remove('dark');
    }
  }

  ngOnInit(): void {
    this.authState.subscribe((state) => {
      this.isLoading = state.isLoading;
      if (state.user || getUserFromLocalStorage()) {
        this.router.navigateByUrl('/');
      }

      if (state.error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: state.error,
        });
      }
    });
  }

  login() {
    const { username, password } = this.loginForm.value;
    this.store.dispatch(setFilter({ filter: initialState }));
    this.store.dispatch(AuthActions.login({ username: username!, password: password! }));
  }
}
