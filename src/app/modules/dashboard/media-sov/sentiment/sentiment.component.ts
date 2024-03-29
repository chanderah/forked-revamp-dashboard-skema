import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { htmlLegendPlugin } from '../../../../shared/utils/ChartUtils';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { AppState } from '../../../../core/store';
import {
  getArticlesByTone,
  getTones,
} from '../../../../core/store/analyze/analyze.actions';
import { AnalyzeState } from '../../../../core/store/analyze/analyze.reducer';
import { selectAnalyzeState } from '../../../../core/store/analyze/analyze.selectors';
import {
  FilterState,
  initialState,
} from '../../../../core/store/filter/filter.reducer';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';
import { ChartBar, Tones } from '../../../../core/models/tone.model';
import moment from 'moment';

@Component({
  selector: 'app-sentiment',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './sentiment.component.html',
  styleUrl: './sentiment.component.scss',
})
export class SentimentComponent {
  analyzeState: Observable<AnalyzeState>;
  filterState: Observable<FilterState>;
  isLoading: boolean = false;
  chartData: any;
  options: any;
  plugins = [htmlLegendPlugin];

  constructor(private store: Store<AppState>) {
    this.analyzeState = this.store.select(selectAnalyzeState);
    this.filterState = this.store.select(selectFilterState);
  }

  ngOnInit() {
    this.initChartOpts();
    this.initChartData();
    // this.store.dispatch(
    //   getArticlesByTone({
    //     filter: { ...initialState, tone: 0 } as FilterRequestPayload,
    //   })
    // );
    // this.analyzeState.subscribe(({ tones }) => {
    //   if (tones.data) this.initChartData(tones.data);
    //   this.isLoading = tones.isLoading;
    // });
    // this.filterState.subscribe(this.onFilterChange);
  }

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

  initChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    // const negativeColor = documentStyle.getPropertyValue('--negative-color');
    // const positiveColor = documentStyle.getPropertyValue('--positive-color');
    // const neutralColor = documentStyle.getPropertyValue('--neutral-color');

    // const { labels, negativeValues, neutralValues, positiveValues, dates } =
    //   this.getChartData(tones.chart_bar ?? []);

    this.chartData = {
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
  };

  initChartOpts = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

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
  };

  // onFilterChange = (filterState: FilterState) => {
  //   const filter = { ...filterState, tone: 0, maxSize: } as FilterRequestPayload;
  //   this.store.dispatch(getArticlesByTone({ filter }));
  // };
}
