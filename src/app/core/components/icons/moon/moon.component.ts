import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-moon',
  standalone: true,
  imports: [],
  template: `
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.98438 0C3.125 0 0 3.13438 0 7C0 10.8656 3.125 14 6.98438 14C8.87813 14 10.5938 13.2438 11.8531 12.0188C12.0094 11.8656 12.05 11.6281 11.95 11.4344C11.85 11.2406 11.6344 11.1312 11.4188 11.1687C11.1125 11.2219 10.8 11.25 10.4781 11.25C7.45 11.25 4.99375 8.7875 4.99375 5.75C4.99375 3.69375 6.11875 1.90313 7.78438 0.959375C7.975 0.85 8.07188 0.63125 8.025 0.41875C7.97813 0.20625 7.79688 0.046875 7.57813 0.028125C7.38125 0.0125 7.18438 0.00312495 6.98438 0.00312495V0Z"
        [attr.fill]="fill"
        [attr.class]="class" />
    </svg>
  `,
  styles: `
    :host {
      line-height: 0;
    }
  `,
})
export class IconMoonComponent {
  filter: any;
  ngOnDestroy() {
    this.filter?.unsubscribe?.();
  }
  @Input() class = '';
  @Input() fill = '#8A90AB';
}
