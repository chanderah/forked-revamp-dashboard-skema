import { Component } from '@angular/core';
import { IconSunComponent } from '../../../../core/components/icons/sun/sun.component';
import { IconMoonComponent } from '../../../../core/components/icons/moon/moon.component';

@Component({
  selector: 'toggle-darkmode',
  standalone: true,
  imports: [IconSunComponent, IconMoonComponent],
  templateUrl: './toggle-darkmode.component.html',
  styleUrl: './toggle-darkmode.component.scss',
})
export class ToggleDarkmodeComponent {}
