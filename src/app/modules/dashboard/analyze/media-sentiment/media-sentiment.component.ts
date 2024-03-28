import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { ChartModule } from 'primeng/chart';
import { IconRadioComponent } from '../../../../core/components/icons/radio/radio.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../core/store';
import { AnalyzeState } from '../../../../core/store/analyze/analyze.reducer';
import { selectAnalyzeState } from '../../../../core/store/analyze/analyze.selectors';
import {
  FilterState,
  initialState,
} from '../../../../core/store/filter/filter.reducer';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { getArticlesByTone, getTones } from '../../../../core/store/analyze/analyze.actions';
import { ChartBar, Tones } from '../../../../core/models/tone.model';
import moment from 'moment';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { getRelativePosition } from 'chart.js/helpers';

@Component({
  selector: 'app-media-sentiment',
  standalone: true,
  imports: [
    CardModule,
    IconInfoComponent,
    IconRadioComponent,
    ChartModule,
    SpinnerComponent,
  ],
  templateUrl: './media-sentiment.component.html',
  styleUrl: './media-sentiment.component.scss',
})
export class MediaSentimentComponent {
  analyzeState: Observable<AnalyzeState>;
  filterState: Observable<FilterState>;
  isLoading: boolean = false;
  chartData: any;
  options: any;

  constructor(private store: Store<AppState>) {
    this.analyzeState = this.store.select(selectAnalyzeState);
    this.filterState = this.store.select(selectFilterState);
  }

  ngOnInit() {
    this.initChartOpts();
    this.store.dispatch(
      getTones({ filter: initialState as FilterRequestPayload })
    );
    this.analyzeState.subscribe(({ tones }) => {
      if (tones.data) this.initChartData(tones.data);
      this.isLoading = tones.isLoading;
    });
    this.filterState.subscribe(this.onFilterChange);
  }

  initChartData = (tones: Tones) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const negativeColor = documentStyle.getPropertyValue('--negative-color');
    const positiveColor = documentStyle.getPropertyValue('--positive-color');
    const neutralColor = documentStyle.getPropertyValue('--neutral-color');

    const { labels, negativeValues, neutralValues, positiveValues, dates } =
      this.getChartData(tones.chart_bar ?? []);

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
          borderColor: neutralColor,
          backgroundColor: neutralColor,
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

  initChartOpts = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

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
            color: textColor,
          },
        },
      },
      elements: {
        point: {
          radius: 0,
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
      getArticlesByTone({ filter: {...initialState, tone: currentData.tone, start_date: date, end_date: date} as FilterRequestPayload })
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

  onFilterChange = (filterState: FilterState) => {
    const filter = { ...filterState } as FilterRequestPayload;
    this.store.dispatch(getTones({ filter }));
  };
}
