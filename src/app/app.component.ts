import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthState } from './store/auth/auth.reducer';
import { Store,select } from '@ngrx/store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  auth$: Observable<AuthState>;

  constructor(private store: Store<AuthState>) {
    console.log(store)
    this.auth$ = store.pipe(select((state) => state))
  }

  ngOnInit(): void {
    console.log(this.auth$)
  }
}
