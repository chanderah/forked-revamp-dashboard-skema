import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconMoonComponent } from '../../../../core/components/icons/moon/moon.component';
import { IconSunComponent } from '../../../../core/components/icons/sun/sun.component';
import { CommonService } from '../../../../core/services/common.service';

@Component({
  selector: 'toggle-darkmode',
  standalone: true,
  imports: [IconSunComponent, IconMoonComponent, FormsModule, CommonModule],
  templateUrl: './toggle-darkmode.component.html',
  styleUrl: './toggle-darkmode.component.scss',
})
export class ToggleDarkmodeComponent {
  checked: boolean = false;

  constructor(public commonService: CommonService) {
    this.checked = commonService.isDarkMode;
  }
}
