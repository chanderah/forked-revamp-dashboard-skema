import { Component } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [DropdownModule, ButtonModule, FloatLabelModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  options: any[] | undefined;
  selectedCity: any | undefined;

  ngOnInit() {
    this.options = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
  }
}
