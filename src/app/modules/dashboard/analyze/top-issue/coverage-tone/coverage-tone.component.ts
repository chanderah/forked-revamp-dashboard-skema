import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ChartCardComponent } from '../../../../../core/components/chart-card/chart-card.component';
import { htmlLegendPlugin } from '../../../../../shared/utils/ChartUtils';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../core/store';
import { selectAnalyzeState } from '../../../../../core/store/analyze/analyze.selectors';
import { selectFilterState } from '../../../../../core/store/filter/filter.selectors';
import { Observable } from 'rxjs';
import { AnalyzeState } from '../../../../../core/store/analyze/analyze.reducer';
import {
  FilterState,
  initialState,
} from '../../../../../core/store/filter/filter.reducer';
import { FilterRequestPayload } from '../../../../../core/models/request.model';
import {
  getToneByCategory,
  getTones,
} from '../../../../../core/store/analyze/analyze.actions';
import { Tones } from '../../../../../core/models/tone.model';
import moment from 'moment';
import { ToneByCategory } from '../../../../../core/models/tone-by-category.model';
import { getToneByMedia } from '../../../../../core/store/analyze/analyze.actions';
import { ToneByMedia } from '../../../../../core/models/tone-by-media.model';
import {
  NEGATIVE_TONE,
  NEUTRAL_TONE,
  POSITIVE_TONE,
  TONE_MAP,
} from '../../../../../shared/utils/Constants';
import { Router } from '@angular/router';

const documentStyle = getComputedStyle(document.documentElement);
@Component({
  selector: 'app-coverage-tone',
  standalone: true,
  imports: [ChartModule, ChartCardComponent],
  templateUrl: './coverage-tone.component.html',
  styleUrl: './coverage-tone.component.scss',
})
export class CoverageToneComponent {
  analyzeState: Observable<AnalyzeState>;
  filterState: Observable<FilterState>;
  isLoading: boolean = false;

  coverageChartData: any;
  coverageChartOpts: any;
  coveragePieData: any;
  coveragePieOpts = {
    plugins: {
      legend: {
        display: false,
      },
      htmlLegend: {
        containerID: 'coverage-legend-container',
      },
    },
  };
  toneByCategChartData: any;
  toneByCategChartOpts: any;
  toneByMediaChartData: any;
  toneByMediaChartOpts: any;
  coveragePiePlugins = [htmlLegendPlugin];

  constructor(private store: Store<AppState>, private router: Router) {
    this.analyzeState = this.store.select(selectAnalyzeState);
    this.filterState = this.store.select(selectFilterState);
  }

  ngOnInit() {
    this.store.dispatch(
      getTones({ filter: initialState as FilterRequestPayload })
    );
    this.store.dispatch(
      getToneByCategory({ filter: initialState as FilterRequestPayload })
    );
    this.store.dispatch(
      getToneByMedia({ filter: initialState as FilterRequestPayload })
    );
    this.analyzeState.subscribe(({ tones, toneByCategory, toneByMedia }) => {
      if (tones.data) {
        this.initCoveragePie(tones.data);
        this.initCoverageChart(tones.data);
      }
      this.initToneByCategoryChart(toneByCategory.data);
      this.initToneByMediaChart(toneByMedia.data);
    });
    this.filterState.subscribe(this.onFilterChange);
  }

  initToneByMediaChart = (toneByMedia: ToneByMedia[]) => {
    const labels = toneByMedia.map((tone) => tone.media_name);
    const negativeValues: number[] = [];
    const neutralValues: number[] = [];
    const positiveValues: number[] = [];
    const mediaIds: number[] = [];
    toneByMedia.forEach((media) => {
      media.tones.forEach((tone) => {
        const key = Object.keys(tone)[0];
        const toneVal = Object.values(tone)[0];
        if (key === 'negative') negativeValues.push(toneVal);
        if (key === 'neutral') neutralValues.push(toneVal);
        if (key === 'positive') positiveValues.push(toneVal);
      });
      mediaIds.push(media.media_id);
    });
    this.toneByMediaChartData = {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Negative',
          backgroundColor: documentStyle.getPropertyValue('--negative-color'),
          data: negativeValues,
          tone: NEGATIVE_TONE,
          mediaIds,
        },
        {
          type: 'bar',
          label: 'Neutral',
          backgroundColor: 'gray',
          data: neutralValues,
          tone: NEUTRAL_TONE,
          mediaIds,
        },
        {
          type: 'bar',
          label: 'Positive',
          backgroundColor: documentStyle.getPropertyValue('--positive-color'),
          data: positiveValues,
          tone: POSITIVE_TONE,
          mediaIds,
        },
      ],
    };

    this.toneByMediaChartOpts = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: { mode: 'index', intersect: false },
        legend: {
          position: 'bottom',
          align: 'center',
          labels: {
            padding: 32,
            boxWidth: 14,
            boxHeight: 5,
            color: documentStyle.getPropertyValue('--text-color'),
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: documentStyle.getPropertyValue('--text-color-secondary'),
          },
          grid: {
            color: documentStyle.getPropertyValue('--surface-border'),
            drawBorder: false,
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: documentStyle.getPropertyValue('--text-color-secondary'),
          },
          grid: {
            color: documentStyle.getPropertyValue('--surface-border'),
            drawBorder: false,
          },
        },
      },
    };
  };

  initToneByCategoryChart = (toneByCategory: ToneByCategory[]) => {
    const labels = toneByCategory.map((tone) => tone.category_id);
    const negativeValues: number[] = [];
    const neutralValues: number[] = [];
    const positiveValues: number[] = [];
    toneByCategory.forEach((category) => {
      category.tones.forEach((tone) => {
        const key = Object.keys(tone)[0];
        const toneVal = Object.values(tone)[0];
        if (key === 'negative') negativeValues.push(toneVal);
        if (key === 'neutral') neutralValues.push(toneVal);
        if (key === 'positive') positiveValues.push(toneVal);
      });
    });
    this.toneByCategChartData = {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Negative',
          backgroundColor: documentStyle.getPropertyValue('--negative-color'),
          data: negativeValues,
          tone: NEGATIVE_TONE,
        },
        {
          type: 'bar',
          label: 'Neutral',
          backgroundColor: 'gray',
          data: neutralValues,
          tone: NEUTRAL_TONE,
        },
        {
          type: 'bar',
          label: 'Positive',
          backgroundColor: documentStyle.getPropertyValue('--positive-color'),
          data: positiveValues,
          tone: POSITIVE_TONE,
        },
      ],
    };

    this.toneByCategChartOpts = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: { mode: 'index', intersect: false },
        legend: {
          position: 'bottom',
          align: 'center',
          labels: {
            padding: 32,
            boxWidth: 14,
            boxHeight: 5,
            color: documentStyle.getPropertyValue('--text-color'),
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: documentStyle.getPropertyValue('--text-color-secondary'),
          },
          grid: {
            color: documentStyle.getPropertyValue('--surface-border'),
            drawBorder: false,
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: documentStyle.getPropertyValue('--text-color-secondary'),
          },
          grid: {
            color: documentStyle.getPropertyValue('--surface-border'),
            drawBorder: false,
          },
        },
      },
    };
  };

  initCoveragePie = (tonesRes: Tones) => {
    const { datasets, labels, tones } = this.getCoveragePieData(tonesRes);
    this.coveragePieData = { labels, datasets, tones };
  };

  initCoverageChart = (tones: Tones) => {
    const {
      negativeValues,
      neutralValues,
      positiveValues,
      labels: chartLabels,
    } = this.getCoverageChartData(tones);

    this.coverageChartData = {
      labels: chartLabels,
      datasets: [
        {
          type: 'bar',
          label: 'Negative',
          backgroundColor: documentStyle.getPropertyValue('--negative-color'),
          tone: NEGATIVE_TONE,
          data: negativeValues,
          date: chartLabels,
        },
        {
          type: 'bar',
          label: 'Neutral',
          backgroundColor: 'gray',
          tone: NEUTRAL_TONE,
          data: neutralValues,
          date: chartLabels,
        },
        {
          type: 'bar',
          label: 'Positive',
          backgroundColor: documentStyle.getPropertyValue('--positive-color'),
          tone: POSITIVE_TONE,
          data: positiveValues,
          date: chartLabels,
        },
      ],
    };

    this.coverageChartOpts = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: { mode: 'index', intersect: false },
        legend: {
          position: 'bottom',
          align: 'start',
          labels: {
            padding: 32,
            boxWidth: 14,
            boxHeight: 5,
            color: documentStyle.getPropertyValue('--text-color'),
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: documentStyle.getPropertyValue('--text-color-secondary'),
          },
          grid: {
            color: documentStyle.getPropertyValue('--surface-border'),
            drawBorder: false,
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: documentStyle.getPropertyValue('--text-color-secondary'),
          },
          grid: {
            color: documentStyle.getPropertyValue('--surface-border'),
            drawBorder: false,
          },
        },
      },
    };
  };

  getCoveragePieData = (tones: Tones) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const positiveColor = documentStyle.getPropertyValue('--positive-color');
    const negativeColor = documentStyle.getPropertyValue('--negative-color');
    const neutralColor = 'gray';

    const datasets: any = [
      {
        data: [],
        percentages: [],
        backgroundColor: [positiveColor, negativeColor, neutralColor],
      },
    ];
    const labels: string[] = ['Positive', 'Negative', 'Neutral'];
    const toneValues: number[] = [POSITIVE_TONE, NEGATIVE_TONE, NEUTRAL_TONE];

    const totalTones = tones.chart_bar.reduce((prev, chart) => {
      return prev + chart.doc_count;
    }, 0);

    tones.chart_bar.forEach((chart) => {
      datasets[0].data.push(chart.doc_count);
      datasets[0].percentages.push(
        ((chart.doc_count / totalTones) * 100).toFixed(0)
      );
    });

    return { labels, datasets, tones: toneValues };
  };

  getCoverageChartData = (tones: Tones) => {
    const negativeValues: number[] = [];
    const positiveValues: number[] = [];
    const neutralValues: number[] = [];

    tones.chart_bar.forEach((chart) => {
      chart.tone_per_day.buckets.forEach((bucket) => {
        if (chart.key === -1) negativeValues.push(bucket.doc_count);
        if (chart.key === 0) neutralValues.push(bucket.doc_count);
        if (chart.key === 1) positiveValues.push(bucket.doc_count);
      });
    });

    const labels = tones.chart_bar[0].tone_per_day.buckets.map((bucket) =>
      moment(bucket.key_as_string).format('MM-DD-YYYY')
    );
    return { labels, negativeValues, positiveValues, neutralValues };
  };

  onDataSelect = (value: any, type: string) => {
    let tone = null;
    let mediaId = null;
    let mediaName = null;
    let categoryName = null;
    let date = null;

    if (type === 'chart') {
      const currentData =
        this.coverageChartData.datasets[value.element.datasetIndex];
      tone = currentData.tone;
      date = currentData.date[value.element.index];
    } else if (type === 'pie_category') {
      const toneMap: any = {
        0: 1,
        1: -1,
        2: 0,
      };
      tone = toneMap[value.element.index];
    } else if (type === 'media') {
      const currentData =
        this.toneByMediaChartData.datasets[value.element.datasetIndex];
      const cMediaName = this.toneByMediaChartData.labels[value.element.index];
      const cMediaId = currentData.mediaIds[value.element.index];
      tone = currentData.tone;
      mediaName = cMediaName;
      mediaId = cMediaId;
    } else if (type === 'bar_category') {
      const currentData =
        this.toneByCategChartData.datasets[value.element.datasetIndex];
      categoryName =
        this.toneByCategChartData.labels[value.element.datasetIndex];
      tone = currentData.tone;
    }

    this.router.navigate(['/dashboard/articles-by-tone'], {
      queryParams: {
        tone,
        mediaId,
        mediaName,
        categoryName,
        date
      },
    });
  };

  onFilterChange = (filterState: FilterState) => {
    const filter = { ...filterState } as FilterRequestPayload;
    this.store.dispatch(getTones({ filter }));
    this.store.dispatch(getToneByCategory({ filter }));
    this.store.dispatch(getToneByMedia({ filter }));
  };
}
