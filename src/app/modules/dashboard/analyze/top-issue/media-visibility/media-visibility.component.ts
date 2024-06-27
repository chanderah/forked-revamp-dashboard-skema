import { Component } from '@angular/core';
import {
  ActionButtonProps,
  ChartCardComponent,
} from '../../../../../core/components/chart-card/chart-card.component';
import { ChartModule } from 'primeng/chart';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../../core/store';
import { AnalyzeState } from '../../../../../core/store/analyze/analyze.reducer';
import { selectAnalyzeState } from '../../../../../core/store/analyze/analyze.selectors';
import {
  FilterState,
  initialState,
} from '../../../../../core/store/filter/filter.reducer';
import { selectFilterState } from '../../../../../core/store/filter/filter.selectors';
import { getMediaVisibility } from '../../../../../core/store/analyze/analyze.actions';
import { FilterRequestPayload } from '../../../../../core/models/request.model';
import moment from 'moment';
import { MediaVisibility } from '../../../../../core/models/media-visibility.model';
import {
  htmlLegendPlugin,
  barOpacityPlugin,
} from '../../../../../shared/utils/ChartUtils';
import { SpinnerComponent } from '../../../../../core/components/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FilterService } from '../../../../../core/services/filter.service';
import { AnalyzeService } from '../../../../../core/services/analyze.service';

@Component({
  selector: 'app-media-visibility',
  standalone: true,
  imports: [ChartCardComponent, ChartModule, SpinnerComponent, CommonModule],
  templateUrl: './media-visibility.component.html',
  styleUrl: './media-visibility.component.scss',
})
export class MediaVisibilityComponent {
  visibilityChartLineData: any;
  visibilityChartLineOpts: any;

  visibilityChartBarData: any;
  visibilityChartBarOpts: any;
  visibilityChartBarPlugins = [barOpacityPlugin];

  visibilityChartActionButton!: ActionButtonProps;
  visibilityPieActionButton!: ActionButtonProps;

  visibilityPieData: any;
  visibilityPieOpts: any;
  visibilityPiePlugins = [htmlLegendPlugin];

  analyzeState: Observable<AnalyzeState>;
  filterState: Observable<FilterState>;
  isLoading: boolean = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private filterService: FilterService,
    private analyzeService: AnalyzeService
  ) {
    this.analyzeState = this.store.select(selectAnalyzeState);
    this.filterState = this.store.select(selectFilterState);

    this.visibilityChartActionButton = {
      icon: 'pi-ellipsis-h',
      type: 'toggle',
      toggle: {
        value: false,
        offIcon: 'pi-ellipsis-h',
        onIcon: 'pi-ellipsis-h',
      },
    };

    this.visibilityPieActionButton = {
      icon: 'pi-ellipsis-h',
      type: 'toggle',
      toggle: {
        value: false,
        offIcon: 'pi-ellipsis-h',
        onIcon: 'pi-ellipsis-h',
      },
    };
  }

  ngOnInit() {
    this.initChartOpts();
    this.filterService.subscribe((filter) => {
      this.isLoading = true;
      this.analyzeService.getMediaVisibility(filter).subscribe((data) => {
        this.isLoading = false;
        this.initChartData(data.data);
      });
    });
  }

  initChartData = (mediaVisibility: MediaVisibility[]) => {
    if (mediaVisibility.length) {
      const {
        lineDatasets,
        lineLabels,
        pieLabels,
        pieDatasets,
        visibilityBarDatasets,
        barLabels,
      } = this.getChartData(mediaVisibility);
      this.visibilityChartLineData = {
        labels: lineLabels,
        datasets: lineDatasets,
      };
      this.visibilityPieData = { labels: pieLabels, datasets: pieDatasets };

      this.visibilityChartBarData = {
        labels: barLabels,
        datasets: visibilityBarDatasets,
      };
    }
  };

  onVisibilityPieSelect = (value: any, type: string) => {
    let mediaLabel = null;
    let date = null;
    if (type === 'pie') {
      const currentData =
        this.visibilityPieData.datasets[value.element.datasetIndex];
      mediaLabel = currentData.mediaIds[value.element.index];
    } else if (type === 'bar') {
      const currentData =
        this.visibilityChartBarData.datasets[value.element.datasetIndex];
      mediaLabel = currentData.label;
      date = currentData.date[value.element.index];
    } else if (type === 'line') {
      const currentData =
        this.visibilityChartLineData.datasets[value.element.datasetIndex];
      mediaLabel = currentData.label;
      date = currentData.date[value.element.index];
    }

    this.router.navigate(['/dashboard/articles-by-media'], {
      queryParams: { mediaName: mediaLabel, date },
    });
  };

  initChartOpts = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const isDarkModeStorage = window.localStorage.getItem('useDarkMode');
    const isDarkMode = isDarkModeStorage
      ? JSON.parse(isDarkModeStorage)
      : false;

    this.visibilityPieOpts = {
      plugins: {
        legend: {
          display: false,
        },
        htmlLegend: {
          containerID: 'legend-container',
          flexDirection: 'row',
        },
      },
    };

    this.visibilityChartBarOpts = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: { mode: 'index', intersect: false },
        barOpacityPlugin: {
          opacity: 1,
        },
        legend: {
          position: 'bottom',
          align: 'start',
          labels: {
            padding: 32,
            boxWidth: 14,
            boxHeight: 5,
            color: isDarkMode
              ? 'white'
              : documentStyle.getPropertyValue('--text-color'),
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

    this.visibilityChartLineOpts = {
      maintainAspectRatio: false,
      aspectRatio: 0.93,
      plugins: {
        legend: {
          position: 'bottom',
          align: 'center',
          labels: {
            font: { size: 10 },
            color: isDarkMode
              ? 'white'
              : documentStyle.getPropertyValue('--text-color'),
            boxWidth: 10,
            boxHeight: 5,
            filter: function (legendItem: any, chartData: any) {
              const datasetIndex = legendItem.datasetIndex;
              const dataset = chartData.datasets[datasetIndex];
              const color = dataset.borderColor; // Get the border color of the dataset
              legendItem.fillStyle = color; // Set legend item background color
              return true;
            },
          },
        },
      },
      elements: {
        point: { radius: 0, hitRadius: 20 },
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false },
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false },
        },
      },
    };
  };

  getChartData = (mediaVisibility: MediaVisibility[]) => {
    const lineDatasets: any[] = [];
    const pieDatasets: any = [{ data: [], percentages: [], mediaIds: [] }];
    const pieLabels: string[] = [];
    const totalTones = mediaVisibility.reduce((prev, chart) => {
      return prev + chart.doc_count;
    }, 0);

    mediaVisibility.forEach((media) => {
      pieLabels.push(media.key);
      const tmpData: {
        label: string;
        data: number[];
        tension: number;
        date: string[];
      } = {
        label: media.key,
        data: [],
        date: [],
        tension: 0.4,
      };
      media.category_id_per_day.buckets.forEach((bucket) => {
        tmpData.data.push(bucket.doc_count);
      });
      media.category_id_per_day.buckets.forEach((bucket) => {
        tmpData.date.push(bucket.key_as_string);
      });
      pieDatasets[0].percentages.push(
        ((media.doc_count / totalTones) * 100).toFixed(0)
      );
      pieDatasets[0].data.push(media.doc_count);
      pieDatasets[0].mediaIds.push(media.key);

      lineDatasets.push(tmpData);
    });

    const visibilityBarDatasets = mediaVisibility.map((visibility) => {
      const data = visibility.category_id_per_day.buckets.map(
        (val) => val.doc_count
      );
      const date = visibility.category_id_per_day.buckets.map(
        (val) => val.key_as_string
      );
      return {
        type: 'bar',
        data,
        date,
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

}
