import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AngularD3CloudModule } from 'angular-d3-cloud';
import { IconCarComponent } from '../../../../core/components/icons/car/car.component';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';

@Component({
  selector: 'app-top-city',
  standalone: true,
  imports: [TableModule, AngularD3CloudModule, IconCarComponent, IconInfoComponent],
  templateUrl: './top-city.component.html',
  styleUrl: './top-city.component.scss',
})
export class TopCityComponent {
  cities: any[] = [
    { name: 'Kota jakarta', count: 1 },
    { name: 'Kota jakarta', count: 2 },
    { name: 'Kota jakarta', count: 3 },
    { name: 'Kota jakarta', count: 4 },
    { name: 'Kota jakarta', count: 5 },
    { name: 'Kota jakarta', count: 6 },
    { name: 'Kota jakarta', count: 6 },
    { name: 'Kota jakarta', count: 6 },
    { name: 'Kota jakarta', count: 6 },
    { name: 'Kota jakarta', count: 6 },
    { name: 'Kota jakarta', count: 6 },
    { name: 'Kota jakarta', count: 6 },
  ];

  data = [
    'Hello',
    'world',
    'normally',
    'you',
    'want',
    'more',
    'words',
    'than',
    'this',
  ].map(function (d) {
    return { text: d, value: 10 + Math.random() * 90 };
  });
}
