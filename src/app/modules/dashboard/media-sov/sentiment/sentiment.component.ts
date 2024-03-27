import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { htmlLegendPlugin } from '../../../../shared/utils/ChartUtils';

@Component({
  selector: 'app-sentiment',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './sentiment.component.html',
  styleUrl: './sentiment.component.scss',
})
export class SentimentComponent {
  data: any;
  options: any;
  plugins = [htmlLegendPlugin];

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: [
        'Faskes Kesehatan',
        'Faskes Kesehatan',
        'Faskes Kesehatan',
        'Faskes Kesehatan',
        'Faskes Kesehatan',
        'Faskes Kesehatan',
        'Faskes Kesehatan',
      ],
      datasets: [
        {
          data: [540, 325, 702, 702, 702, 702, 702],
          percentages: [20, 20, 20, 20, 20, 20, 20],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
          ],
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      plugins: {
        htmlLegend: {
          containerID: 'mediashare-legend-container',
          flexDirection: 'row',
          fontWeight: 'bold',
          percentagesValueFontSize: '14px',
        },
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }
}
