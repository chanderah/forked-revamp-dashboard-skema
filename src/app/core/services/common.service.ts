import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    this.loadPreferences();
  }

  get isDarkMode() {
    return this.darkMode.getValue();
  }

  toggleDarkMode(useDarkMode: boolean) {
    if (useDarkMode) window.document.body.classList.add('dark');
    else window.document.body.classList.remove('dark');
    localStorage.setItem('useDarkMode', JSON.stringify(useDarkMode));
    this.darkMode.next(useDarkMode);
  }

  loadPreferences() {
    const data = localStorage.getItem('useDarkMode');
    if (data) {
      const useDarkMode = JSON.parse(data);
      this.toggleDarkMode(useDarkMode);
    }
  }
}
