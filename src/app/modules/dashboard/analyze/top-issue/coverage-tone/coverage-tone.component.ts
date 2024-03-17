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
import { getTones } from '../../../../../core/store/analyze/analyze.actions';
import { Tones } from '../../../../../core/models/tone.model';

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

  visibilityChartData: any;
  visibilityChartOpts: any;
  coveragePieData: any;
  coveragePieOpts: any;
  coveragePiePlugins = [htmlLegendPlugin];

  constructor(private store: Store<AppState>) {
    this.analyzeState = this.store.select(selectAnalyzeState);
    this.filterState = this.store.select(selectFilterState);
  }

  ngOnInit() {
    this.store.dispatch(
      getTones({ filter: initialState as FilterRequestPayload })
    );
    this.analyzeState.subscribe(({ tones }) => {
      if (tones.data) {
        const { datasets, labels } = this.getPieData(tones.data);
        this.coveragePieData = {
          labels,
          datasets,
        };
      }
    });
    this.filterState.subscribe(this.onFilterChange);

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.visibilityChartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Negative',
          data: [65, 59, 80, 81, 56, 55, 40],
          tension: 0.4,
        },
        {
          label: 'Neutral',
          data: [28, 48, 40, 19, 86, 27, 90],
          tension: 0.4,
        },
        {
          label: 'Positive',
          data: [22, 45, 23, 55, 18, 2, 12],
          tension: 0.4,
        },
      ],
    };

    this.visibilityChartOpts = {
      maintainAspectRatio: false,
      aspectRatio: 0.93,
      plugins: {
        legend: {
          position: 'bottom',
          align: 'start',
          labels: {
            color: textColor,
          },
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

    this.coveragePieOpts = {
      plugins: {
        legend: {
          display: false,
        },
        htmlLegend: {
          containerID: 'coverage-legend-container',
        },
      },
    };
  }

  getPieData = (tones: Tones) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const positiveColor = documentStyle.getPropertyValue('--positive-color');
    const negativeColor = documentStyle.getPropertyValue('--negative-color');
    const neutralColor = documentStyle.getPropertyValue('--neutral-color');

    const datasets: any = [
      {
        data: [],
        percentages: [],
        backgroundColor: [positiveColor, negativeColor, neutralColor],
      },
    ];
    const labels: string[] = ['Posivie', 'Negative', 'Neutral'];

    const totalTones = tones.chart_bar.reduce((prev, chart) => {
      return prev + chart.doc_count;
    }, 0);

    tones.chart_bar.forEach((chart) => {
      datasets[0].data.push(chart.doc_count);
      datasets[0].percentages.push(((chart.doc_count / totalTones) * 100).toFixed(0));
    });

    return { labels, datasets };
  };

  onFilterChange = (filterState: FilterState) => {
    const filter = { ...filterState } as FilterRequestPayload;
    this.store.dispatch(getTones({ filter }));
  };
}
