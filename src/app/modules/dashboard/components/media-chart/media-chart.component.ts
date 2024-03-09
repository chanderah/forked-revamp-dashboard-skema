import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-media-chart',
  standalone: true,
  imports: [ButtonModule, ChartModule, CardModule],
  templateUrl: './media-chart.component.html',
  styleUrl: './media-chart.component.scss',
})
export class MediaChartComponent {
  @Input() data!: any[];
  @Input() title!: string;

  options: any;
  plugins = [ChartDataLabels];

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.options = {
      cutout: '75%',
      plugins: {
        tooltip: { enabled: false },
        datalabels: {
          font: { size: '14px', color: textColor },
          borderColor: '#E0E0E0',
          borderRadius: 100,
          borderWidth: 1,
          color: textColor,
          backgroundColor: 'white',
          formatter: (value: number) => value + '%',
          padding: 8,
        },
      },
      layout: {
        padding: {
          top: 0,
          bottom: 0,
          left: 24,
          right: 24,
        },
      },
    };
  }
}
