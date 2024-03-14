import { Component } from '@angular/core';
import { ChartCardComponent } from '../../../../../core/components/chart-card/chart-card.component';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-media-visibility',
  standalone: true,
  imports: [ChartCardComponent, ChartModule],
  templateUrl: './media-visibility.component.html',
  styleUrl: './media-visibility.component.scss',
})
export class MediaVisibilityComponent {
  visibilityChartData: any;
  visibilityChartOpts: any;
  visibilityPieData: any;
  visibilityPieOpts: any;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.visibilityChartData = {
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
        },
      ],
    };

    this.visibilityChartOpts = {
      maintainAspectRatio: false,
      aspectRatio: 0.93,
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

    this.visibilityPieData = {
      labels: ['A', 'B', 'C', 'D'],
      datasets: [
        {
          data: [540, 325, 702, 82],
          backgroundColor: [
            '#1B81E2',
            '#C9E806',
            '#FB3B52',
            '#05B9BF',
          ],
        },
      ],
    };

    this.visibilityPieOpts = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }
}
