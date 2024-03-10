import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { IconGlobeComponent } from '../../../../core/components/icons/globe/globe.component';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MediaChartComponent } from '../../components/media-chart/media-chart.component';
import { OverviewState } from '../../../../core/store/overview/overview.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../core/store';
import { selectOverviewState } from '../../../../core/store/overview/overview.selectors';
import { getToneByMedia } from '../../../../core/store/overview/overview.actions';
import { Tone, ToneByMedia } from '../../../../core/models/tone-by-media.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-media',
  standalone: true,
  imports: [
    ChartModule,
    CardModule,
    ButtonModule,
    IconGlobeComponent,
    IconInfoComponent,
    MediaChartComponent,
    CommonModule,
  ],
  templateUrl: './top-media.component.html',
  styleUrl: './top-media.component.scss',
})
export class TopMediaComponent implements OnInit {
  plugins = [ChartDataLabels];

  overviewState: Observable<OverviewState>;
  chartsData: any[] = [];

  constructor(private store: Store<AppState>) {
    this.overviewState = this.store.select(selectOverviewState);
  }

  ngOnInit() {
    this.store.dispatch(getToneByMedia());
    this.overviewState.subscribe(({ toneByMedia }) => {
      this.chartsData = this.parseToChartData(toneByMedia.data);
    });
  }

  parseToChartData = (toneByMedia: ToneByMedia[]) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const positiveColor = documentStyle.getPropertyValue('--positive-color');
    const negativeColor = documentStyle.getPropertyValue('--negative-color');
    const neutralColor = documentStyle.getPropertyValue('--neutral-color');

    return toneByMedia.map((t) => {
      const simplifiedTones: any[] = [];
      const combinedTones: any = {};
      const totalTones = t.tones.reduce((prev, tone) => {
        if (Object.keys(tone)[0] === 'media favorability index') return prev;
        return prev + Object.values(tone)[0];
      }, 0);

      t.tones.forEach((tone) => {
        const key = Object.keys(tone)[0];
        if (key === 'media favorability index') return;
        const toneVal = Object.values(tone)[0];
        const percentageVal = (toneVal / totalTones) * 100;
        simplifiedTones.push(percentageVal.toFixed(0));
        combinedTones[key] = toneVal;
      });
      return {
        ...t,
        totalTones,
        combinedTones,
        datasets: [
          {
            data: simplifiedTones,
            datalabels: { anchor: 'end' },
            backgroundColor: [positiveColor, negativeColor, neutralColor],
          },
        ],
      };
    });
  };
}
