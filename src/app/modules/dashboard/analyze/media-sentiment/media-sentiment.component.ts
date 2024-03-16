import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { ChartModule } from 'primeng/chart';
import { IconRadioComponent } from '../../../../core/components/icons/radio/radio.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Article } from '../../../../core/models/article.model';
import { AppState } from '../../../../core/store';
import { AnalyzeState } from '../../../../core/store/analyze/analyze.reducer';
import { selectAnalyzeState } from '../../../../core/store/analyze/analyze.selectors';
import {
  FilterState,
  initialState,
} from '../../../../core/store/filter/filter.reducer';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { getTones } from '../../../../core/store/analyze/analyze.actions';
import { ChartBar } from '../../../../core/models/tone.model';
import moment from 'moment';

@Component({
  selector: 'app-media-sentiment',
  standalone: true,
  imports: [CardModule, IconInfoComponent, IconRadioComponent, ChartModule],
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
    const documentStyle = getComputedStyle(document.documentElement);

    this.store.dispatch(
      getTones({ filter: initialState as FilterRequestPayload })
    );
    this.analyzeState.subscribe(({ tones }) => {
      const { labels, negativeValues, neutralValues, positiveValues } =
        this.getChartData(tones.data?.chart_bar ?? []);

      this.chartData = {
        labels,
        datasets: [
          {
            label: 'Negative',
            data: negativeValues,
            tension: 0.4,
            borderColor: '#FB3B52',
            backgroundColor: '#FB3B52',
          },
          {
            label: 'Neutral',
            data: neutralValues,
            tension: 0.4,
            borderColor: '#05B9BF',
            backgroundColor: '#05B9BF',
          },
          {
            label: 'Positive',
            data: positiveValues,
            tension: 0.4,
            borderColor: '#1B81E2',
            backgroundColor: '#1B81E2',
          },
        ],
      };

      this.isLoading = tones.isLoading;
    });
    this.filterState.subscribe(this.onFilterChange);

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
  }

  getChartData = (chartBar: ChartBar[]) => {
    const negativeValues: number[] = [];
    const positiveValues: number[] = [];
    const neutralValues: number[] = [];

    chartBar.forEach((chart) => {
      chart.tone_per_day.buckets.forEach((bucket) => {
        if (chart.key === -1) negativeValues.push(bucket.doc_count);
        if (chart.key === 0) neutralValues.push(bucket.doc_count);
        if (chart.key === 1) positiveValues.push(bucket.doc_count);
      });
    });

    const labels = chartBar[0].tone_per_day.buckets.map((bucket) =>
      moment(bucket.key_as_string).format('DD MMM')
    );
    return { labels, negativeValues, positiveValues, neutralValues };
  };

  onFilterChange = (filterState: FilterState) => {
    const filter = { ...filterState } as FilterRequestPayload;
    this.store.dispatch(getTones({ filter }));
  };
}
