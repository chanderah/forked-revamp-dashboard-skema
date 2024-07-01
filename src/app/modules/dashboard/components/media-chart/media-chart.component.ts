import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartCardComponent } from '../../../../core/components/chart-card/chart-card.component';

@Component({
  selector: 'app-media-chart',
  standalone: true,
  imports: [ButtonModule, ChartModule, CardModule, ChartCardComponent],
  templateUrl: './media-chart.component.html',
  styleUrl: './media-chart.component.scss',
})
export class MediaChartComponent{ filter: any; ngOnDestroy(){this.filter?.unsubscribe?.()}
  @Input() data!: any;
  @Input() title!: string;
  @Input() onSelectTone!: (media_id: number, media_name: string, tone: number) => void;

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

  onDataSelect = (value: any) => {
    const mediaId = this.data.media_id
    const mediaName = this.data.media_name
    const tone = this.data.toneValues[value.element.index]
    this.onSelectTone(mediaId, mediaName, tone)
  };
}
