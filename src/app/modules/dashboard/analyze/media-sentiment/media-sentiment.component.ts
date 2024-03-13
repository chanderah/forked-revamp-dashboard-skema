import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-media-sentiment',
  standalone: true,
  imports: [CardModule, IconInfoComponent, IconNewspaperComponent, ChartModule],
  templateUrl: './media-sentiment.component.html',
  styleUrl: './media-sentiment.component.scss',
})
export class MediaSentimentComponent {
  data: any;

  options: any;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Negative',
          data: [65, 59, 80, 81, 56, 55, 40],
          tension: 0.4,
        },
        {
          label: 'Neutral',
          data: [28, 48, 40, 19, 86, 27, 90],
          tension: 0.4,
        },
        {
          label: 'Positive',
          data: [22, 45, 23, 55, 18, 2, 12],
          tension: 0.4,
          color: 'red'
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          position: 'bottom',
          align: 'start',
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
}
