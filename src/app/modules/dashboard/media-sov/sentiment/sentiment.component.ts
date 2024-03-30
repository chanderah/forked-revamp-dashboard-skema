import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { htmlLegendPlugin } from '../../../../shared/utils/ChartUtils';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { AppState } from '../../../../core/store';
import {
  getArticlesByTone,
  getMediaVisibility,
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
import { MediaVisibility } from '../../../../core/models/media-visibility.model';

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
    this.store.dispatch(
      getMediaVisibility({ filter: initialState as FilterRequestPayload })
    );

    this.analyzeState.subscribe(({ mediaVisibility }) => {
      this.isLoading = mediaVisibility.isLoading;
      this.initChartData(mediaVisibility.data);
    });
    this.filterState.subscribe(this.onFilterChange);
  }

  getChartData = (mediaVisibility: MediaVisibility[]) => {
    const lineDatasets: any[] = [];
    const pieDatasets: any = [{ data: [], percentages: [] }];
    const pieLabels: string[] = [];
    const totalTones = mediaVisibility.reduce((prev, chart) => {
      return prev + chart.doc_count;
    }, 0);

    mediaVisibility.forEach((media) => {
      pieLabels.push(media.key);
      const tmpData: { label: string; data: number[]; tension: number } = {
        label: media.key,
        data: [],
        tension: 0.4,
      };
      media.category_id_per_day.buckets.forEach((bucket) => {
        tmpData.data.push(bucket.doc_count);
      });
      pieDatasets[0].percentages.push(
        ((media.doc_count / totalTones) * 100).toFixed(0)
      );
      pieDatasets[0].data.push(media.doc_count);
      lineDatasets.push(tmpData);
    });

    const visibilityBarDatasets = mediaVisibility.map((visibility) => {
      const data = visibility.category_id_per_day.buckets.map(
        (val) => val.doc_count
      );
      return {
        type: 'bar',
        data,
        label: visibility.key,
      };
    });

    const lineLabels = mediaVisibility[0].category_id_per_day.buckets.map(
      (bucket) => moment(bucket.key_as_string).format('DD MMM')
    );
    return {
      lineLabels,
      lineDatasets,
      pieLabels,
      pieDatasets,
      barLabels: lineLabels,
      visibilityBarDatasets,
    };
  };

  initChartData = (mediaVisibility: MediaVisibility[]) => {
    if (mediaVisibility.length) {
      const { pieLabels, pieDatasets } = this.getChartData(mediaVisibility);
      this.chartData = { labels: pieLabels, datasets: pieDatasets };
    }
  };

  initChartOpts = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.options = {
      maintainAspectRatio: false,
      plugins: {
        htmlLegend: {
          containerID: 'sentiment-legend-container',
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

  onFilterChange = (filterState: FilterState) => {
    const filter = { ...filterState } as FilterRequestPayload;
    this.store.dispatch(getMediaVisibility({ filter }));
  };
}
