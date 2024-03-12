import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-screen',
  standalone: true,
  imports: [],
  template: `
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.4 2.25C2.07 2.25 1.8 2.5875 1.8 3V16.5C1.8 16.9125 2.07 17.25 2.4 17.25H21.6C21.93 17.25 22.2 16.9125 22.2 16.5V3C22.2 2.5875 21.93 2.25 21.6 2.25H2.4ZM0 3C0 1.34531 1.07625 0 2.4 0H21.6C22.9238 0 24 1.34531 24 3V16.5C24 18.1547 22.9238 19.5 21.6 19.5H2.4C1.07625 19.5 0 18.1547 0 16.5V3ZM4.5 21.75H19.5C19.9988 21.75 20.4 22.2516 20.4 22.875C20.4 23.4984 19.9988 24 19.5 24H4.5C4.00125 24 3.6 23.4984 3.6 22.875C3.6 22.2516 4.00125 21.75 4.5 21.75Z"
        [attr.fill]="fill"
        [attr.class]="class"
      />
    </svg>
  `,
  styles: `:host {line-height:0;}`,
})
export class IconScreenComponent {
  @Input() class = '';
  @Input() fill = '#8A90AB';
}
