import { Component } from '@angular/core';
import { IconSunComponent } from '../../../../core/components/icons/sun/sun.component';
import { IconMoonComponent } from '../../../../core/components/icons/moon/moon.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'toggle-darkmode',
  standalone: true,
  imports: [IconSunComponent, IconMoonComponent, FormsModule, CommonModule],
  templateUrl: './toggle-darkmode.component.html',
  styleUrl: './toggle-darkmode.component.scss',
})
export class ToggleDarkmodeComponent {
  checked: boolean = false;

  constructor() {
    const data = window.localStorage.getItem('useDarkMode');
    if (data) {
      const checked = JSON.parse(data);
      this.checked = checked
      if (checked) window.document.body.classList.toggle('dark');
    }
  }

  onChange = (val: any) => {
    window.document.body.classList.toggle('dark');
    window.localStorage.setItem('useDarkMode', val);
  };
}
