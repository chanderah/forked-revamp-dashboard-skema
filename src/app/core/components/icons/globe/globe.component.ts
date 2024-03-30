import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-globe',
  standalone: true,
  imports: [],
  template: `
    <svg
      [attr.width]="width"
      [attr.height]="height"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22.5C6.20156 22.5 1.5 17.7984 1.5 12C1.5 11.4469 1.54219 10.9078 1.62656 10.3781L1.76719 10.6922C2.20312 11.6766 3.04688 12.4266 4.07344 12.75L7.02656 13.6734C7.75312 13.9031 8.25 14.5734 8.25 15.3375V16.0406C8.25 16.8375 8.7 17.5688 9.4125 17.925C9.61875 18.0281 9.75 18.2391 9.75 18.4688V19.5328C9.75 20.7609 10.7437 21.7547 11.9719 21.7547C12.9937 21.7547 13.8797 21.0609 14.1281 20.0719L14.3344 19.2469C14.4562 18.7688 14.7656 18.3562 15.1922 18.1125L15.7359 17.8031C16.6688 17.2687 17.2453 16.275 17.2453 15.1969V14.8078C17.2453 14.0109 16.9313 13.2469 16.3688 12.6844L16.1859 12.5016C15.6234 11.9391 14.8594 11.625 14.0625 11.625H11.7797C11.5453 11.625 11.3156 11.5688 11.1094 11.4656L8.95781 10.3922C8.85938 10.3453 8.77969 10.2656 8.73281 10.1672L8.7 10.1016C8.59219 9.88594 8.68125 9.62344 8.89688 9.51562C9 9.46406 9.12187 9.45469 9.22969 9.49219L10.3641 9.87188C11.0672 10.1063 11.8406 9.83906 12.2531 9.225C12.6562 8.62031 12.6141 7.81875 12.15 7.26094L11.3109 6.25312C11.1938 6.1125 11.1937 5.90625 11.3156 5.77031L12.2578 4.66875C12.8766 3.94687 12.975 2.91563 12.5016 2.08594L12.1688 1.5C15.8016 1.55625 18.9844 3.45938 20.8266 6.30938L19.0359 7.02656C17.9297 7.46719 17.3625 8.69531 17.7375 9.825L18.5297 12.2016C18.7734 12.9328 19.3734 13.4859 20.1188 13.6734L22.2656 14.2125C21.2484 18.9516 17.0391 22.5 12 22.5ZM2.25 8.09531C3.62344 4.67344 6.74063 2.14219 10.5 1.60781L11.1984 2.83125C11.3578 3.10781 11.325 3.45 11.1187 3.69375L10.1766 4.79531C9.58125 5.48906 9.57187 6.51094 10.1578 7.21406L10.9969 8.22187C11.0391 8.27344 11.0437 8.34375 11.0063 8.39531C10.9688 8.45156 10.9031 8.475 10.8375 8.45156L9.70312 8.06719C9.21562 7.90313 8.68594 7.94063 8.22656 8.17031C7.27031 8.64844 6.88125 9.81094 7.35938 10.7672L7.39219 10.8328C7.58437 11.2219 7.90312 11.5359 8.29219 11.7328L10.4438 12.8063C10.8609 13.0125 11.3203 13.125 11.7844 13.125H14.0719C14.4703 13.125 14.85 13.2844 15.1312 13.5656L15.3141 13.7484C15.5953 14.0297 15.7547 14.4094 15.7547 14.8078V15.1969C15.7547 15.7359 15.4641 16.2328 15 16.5L14.4562 16.8094C13.6734 17.2594 13.1062 18.0047 12.8859 18.8812L12.6797 19.7062C12.6 20.0297 12.3094 20.2547 11.9766 20.2547C11.5781 20.2547 11.2547 19.9313 11.2547 19.5328V18.4641C11.2547 17.6672 10.8047 16.9359 10.0922 16.5797C9.88594 16.4766 9.75469 16.2656 9.75469 16.0359V15.3328C9.75469 13.9125 8.83125 12.6609 7.47656 12.2344L4.52344 11.3109C3.90469 11.1188 3.40313 10.6687 3.14062 10.0781L2.25 8.09531ZM22.5 12C22.5 12.2437 22.4906 12.4828 22.4766 12.7219L20.4797 12.225C20.2312 12.1641 20.0297 11.9766 19.95 11.7328L19.1578 9.35625C19.0312 8.98125 19.2234 8.56875 19.5891 8.42344L21.5484 7.64062C22.1578 8.96719 22.4953 10.4484 22.4953 12.0047L22.5 12ZM12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24Z"
        [attr.fill]="fill"
        [attr.class]="class"
      />
    </svg>
  `,
  styles: `:host {line-height:0;}`,
})
export class IconGlobeComponent {
  @Input() class = '';
  @Input() fill = '#8A90AB';
  @Input() width = 24;
  @Input() height = 24;
}
