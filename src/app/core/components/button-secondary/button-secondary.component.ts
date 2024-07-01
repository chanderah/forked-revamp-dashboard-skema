import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'button-secondary',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './button-secondary.component.html',
  styleUrl: './button-secondary.component.scss',
})
export class ButtonSecondaryComponent{ filter: any; ngOnDestroy(){this.filter?.unsubscribe?.()}
  @Input() label: string = '';
  @Input() icon: string | undefined;
}
