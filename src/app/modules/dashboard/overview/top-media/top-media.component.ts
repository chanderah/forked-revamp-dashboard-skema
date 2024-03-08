import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-top-media',
  standalone: true,
  imports: [ChartModule, CardModule, ButtonModule],
  templateUrl: './top-media.component.html',
  styleUrl: './top-media.component.scss',
})
export class TopMediaComponent implements OnInit {
  data: any;
  options: any;

  ngOnInit() {
    // const documentStyle = getComputedStyle(document.documentElement);
    // const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ['#fb3b52', '#05B9BF', '#1B81E2'],
          hoverBackgroundColor: ['#fb3b52', '#05B9BF', '#1B81E2'],
        },
      ],
    };

    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: '#fb3b52',
          },
        },
      },
    };
  }
}
