import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToggleButtonModule } from 'primeng/togglebutton';

export interface ActionButtonProps {
  icon: string;
  type: 'toggle' | 'action';
  toggle: {
    value: boolean;
    onIcon: string;
    offIcon: string;
  };
  onClick?: () => void;
}

@Component({
  selector: 'chart-card',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    ToggleButtonModule,
    FormsModule,
  ],
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.scss',
})
export class ChartCardComponent {
  @Input() title!: string;
  @Input() actionButton: ActionButtonProps | undefined;
}
