import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import _ from 'lodash';
import moment from 'moment';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Observable } from 'rxjs';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { IconRadioComponent } from '../../../../core/components/icons/radio/radio.component';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { ChartBar, Tones } from '../../../../core/models/tone.model';
import { FilterService } from '../../../../core/services/filter.service';
import { ToneService } from '../../../../core/services/tone.service';
import { AppState } from '../../../../core/store';
import { getArticlesByTone, getTones } from '../../../../core/store/analyze/analyze.actions';
import { AnalyzeState } from '../../../../core/store/analyze/analyze.reducer';
import { selectAnalyzeState } from '../../../../core/store/analyze/analyze.selectors';
import { initialState } from '../../../../core/store/filter/filter.reducer';

@Component({
  selector: 'app-media-sentiment',
  standalone: true,
  imports: [CardModule, IconInfoComponent, IconRadioComponent, ChartModule, SpinnerComponent],
  templateUrl: './media-sentiment.component.html',
  styleUrl: './media-sentiment.component.scss',
})
export class MediaSentimentComponent {
  analyzeState: Observable<AnalyzeState>;
  isLoading: boolean = false;
  chartData: any;
  tones: Tones | null = null;
  options: any;

  constructor(
    private store: Store<AppState>,
    private filterService: FilterService,
    private toneService: ToneService
  ) {
    this.analyzeState = this.store.select(selectAnalyzeState);
  }

  ngOnInit() {
    this.analyzeState.subscribe(({ tones }) => {
      if (tones.data && !_.isEqual(this.tones, tones.data)) {
        this.tones = tones.data;
        this.initChartOpts(tones.data);
        this.initChartData(tones.data);
      }
      this.isLoading = tones.isLoading;
    });
    this.filterService.subscribe((v) => {
      const filter = { ...v };
      this.store.dispatch(getTones({ filter }));
    });
  }

  initChartData = (tones: Tones) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const negativeColor = documentStyle.getPropertyValue('--negative-color');
    const positiveColor = documentStyle.getPropertyValue('--positive-color');
    // const neutralColor = documentStyle.getPropertyValue('--neutral-color');

    const { labels, negativeValues, neutralValues, positiveValues, dates } = this.getChartData(tones.chart_bar ?? []);

    this.chartData = {
      labels,
      dates,
      datasets: [
        {
          label: 'Negative',
          data: negativeValues,
          tension: 0.4,
          borderColor: negativeColor,
          backgroundColor: negativeColor,
          tone: -1,
        },
        {
          label: 'Neutral',
          data: neutralValues,
          tension: 0.4,
          borderColor: 'gray',
          backgroundColor: 'gray',
          tone: 0,
        },
        {
          label: 'Positive',
          data: positiveValues,
          tension: 0.4,
          borderColor: positiveColor,
          backgroundColor: positiveColor,
          tone: 1,
        },
      ],
    };
  };

  initChartOpts = (tones: Tones) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const isDarkModeStorage = window.localStorage.getItem('useDarkMode');
    const isDarkMode = isDarkModeStorage ? JSON.parse(isDarkModeStorage) : false;

    const { labels } = this.getChartData(tones.chart_bar ?? []);
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          position: 'bottom',
          align: 'start',
          labels: {
            padding: 32,
            boxWidth: 14,
            boxHeight: 5,
            color: isDarkMode ? 'white' : textColor,
          },
        },
      },
      elements: {
        point: {
          radius: labels.length === 1 ? 8 : 1,
          hitRadius: 20,
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
  };

  onDataSelect = (value: any) => {
    const currentData = this.chartData.datasets[value.element.datasetIndex];
    const date = this.chartData.dates[value.element.index];
    this.store.dispatch(
      getArticlesByTone({
        filter: {
          ...initialState,
          tone: currentData.tone,
          start_date: date,
          end_date: date,
        } as FilterRequestPayload,
      })
    );
  };

  getChartData = (chartBar: ChartBar[]) => {
    const negativeValues: number[] = [];
    const positiveValues: number[] = [];
    const neutralValues: number[] = [];
    const dates: string[] = [];
    const labels: string[] = [];

    chartBar.forEach((chart) => {
      chart.tone_per_day.buckets.forEach((bucket) => {
        if (chart.key === -1) negativeValues.push(bucket.doc_count);
        if (chart.key === 0) neutralValues.push(bucket.doc_count);
        if (chart.key === 1) positiveValues.push(bucket.doc_count);
      });
    });

    chartBar[0].tone_per_day.buckets.forEach((bucket) => {
      labels.push(moment(bucket.key_as_string).format('DD MMM'));
      dates.push(bucket.key_as_string);
    });
    return { labels, dates, negativeValues, positiveValues, neutralValues };
  };
}
