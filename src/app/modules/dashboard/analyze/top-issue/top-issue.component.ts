import { Component, ElementRef, ViewChild } from '@angular/core';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import Chart from 'chart.js/auto';
import { color } from 'chart.js/helpers';
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';
import { ChartModule } from 'primeng/chart';
import { TabMenuModule } from 'primeng/tabmenu';
import { IconHomeComponent } from '../../../../core/components/icons/home/home.component';
import { IconChartComponent } from '../../../../core/components/icons/chart/chart.component';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MediaVisibilityComponent } from './media-visibility/media-visibility.component';
import { CoverageToneComponent } from './coverage-tone/coverage-tone.component';
import { IconPencilComponent } from '../../../../core/components/icons/pencil/pencil.component';
import { ButtonSecondaryComponent } from '../../../../core/components/button-secondary/button-secondary.component';
import { TieredMenuModule } from 'primeng/tieredmenu';
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
import { getTopIssue } from '../../../../core/store/analyze/analyze.actions';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { TabViewModule } from 'primeng/tabview';
import html2canvas from 'html2canvas';

Chart.register(TreemapController, TreemapElement);

@Component({
  selector: 'app-top-issue',
  standalone: true,
  imports: [
    IconNewspaperComponent,
    IconInfoComponent,
    ChartModule,
    TabMenuModule,
    IconHomeComponent,
    IconPencilComponent,
    CommonModule,
    MediaVisibilityComponent,
    CoverageToneComponent,
    ButtonSecondaryComponent,
    TieredMenuModule,
    SpinnerComponent,
    TabViewModule,
  ],
  templateUrl: './top-issue.component.html',
  styleUrl: './top-issue.component.scss',
})
export class TopIssueComponent {
  // @ts-ignore
  @ViewChild('chartArea') private chartArea: ElementRef<HTMLCanvasElement> =
    null;

  tabItems: MenuItem[] | undefined;
  activeTab: MenuItem | undefined;
  downloadItems: MenuItem[] | undefined;
  downloadActive: boolean = false;

  analyzeState: Observable<AnalyzeState>;
  filterState: Observable<FilterState>;
  isLoading: boolean = false;
  isDataExist: boolean = false;

  downloading = false

  constructor(private store: Store<AppState>) {
    this.analyzeState = this.store.select(selectAnalyzeState);
    this.filterState = this.store.select(selectFilterState);
    this.tabItems = [
      {
        label: 'Media Visibility',
        key: 'media',
        customIcon: IconNewspaperComponent,
      },
      {
        label: 'Coverage Tone',
        key: 'coverage',
        customIcon: IconChartComponent,
      },
    ];
    this.activeTab = this.tabItems[0];
    this.downloadItems = [
      {
        label: 'Powerpoint',
        command: () => this.downloadPpt(),
      },
      {
        label: 'Excel',
        command: () => {
          this.downloadActive = false;
        },
      },
    ];
  }

  colorFromRaw(ctx: any, border: boolean) {
    if (ctx.type !== 'data') return 'transparent';
    const value = ctx.raw.v;
    let alpha = (1 + Math.log(value)) / 5;
    const bgColor = '#8ccced';
    if (border) alpha += 0.5;
    return color(bgColor).alpha(alpha).rgbString();
  }

  ngAfterViewInit() {
    const ctx = this.chartArea?.nativeElement.getContext('2d');
    const chart = new Chart(ctx as CanvasRenderingContext2D, {
      type: 'treemap',
      data: { datasets: [] },
      options: {
        plugins: {
          legend: { display: false },
        },
      },
    });

    this.store.dispatch(
      getTopIssue({ filter: initialState as FilterRequestPayload })
    );

    this.analyzeState.subscribe(({ topIssue }) => {
      this.isLoading = topIssue.isLoading;
      this.isDataExist = Object.keys(topIssue.data?.top_issue ?? {}).length > 0;
      const transformedData =
        Object.entries(topIssue.data?.top_issue ?? {})
          .sort((a, b) => b[1] - a[1])
          .map(([key, value]) => ({ key, value })) ?? [];

      chart.data = {
        datasets: [
          // @ts-ignore
          {
            tree: transformedData,
            key: 'value',
            borderWidth: 1,
            spacing: 0.4,
            borderColor: (ctx) => this.colorFromRaw(ctx, true),
            backgroundColor: (ctx) => this.colorFromRaw(ctx, false),
            labels: {
              align: 'left',
              display: true,
              color: '#464255',
              padding: 5,
              font: { size: 16 },
              hoverFont: { size: 16, weight: 'bold' },
              formatter(ctx) {
                // @ts-ignore
                return `${ctx.raw._data.key}`;
              },
            },
          },
        ],
      };
      chart.update();
    });
    this.filterState.subscribe(this.onFilterChange);
  }

  onActiveItemChange(event: MenuItem) {
    this.activeTab = event;
  }

  onFilterChange = (filterState: FilterState) => {
    const filter = { ...filterState } as FilterRequestPayload;
    this.store.dispatch(getTopIssue({ filter }));
  };

  getImage = async (element: HTMLElement) => {
    const canvas = await html2canvas(element!);
    const imageData = canvas.toDataURL('image/png');
    console.log('imageData', imageData);
    return imageData;
  };

  downloadPpt = async () => {
    this.downloading = true
    const charts = [
      { key: 'visibilityChart', label: 'Visibility Chart' },
      { key: 'visibilityPie', label: 'Visibility Pie' },
      { key: 'coverageTone', label: 'Coverage Tone' },
      { key: 'coveragePie', label: 'Coverage Pie' },
      { key: 'toneByMedia', label: 'Tone by Media Selection' },
      { key: 'toneByCategory', label: 'Tone by Category' },
    ];
    const images = [];

    for (const chart of charts) {
      const captureElement: HTMLElement = document.getElementById(
        chart.key
      ) as HTMLElement;

      const image = await this.getImage(captureElement);
      images.push({ label: chart.label, image });
    }

    this.downloading = false
    console.log('images', images);
  };
}
