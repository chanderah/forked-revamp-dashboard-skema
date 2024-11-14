import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
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
import { lastValueFrom, Observable } from 'rxjs';
import { AppState } from '../../../../core/store';
import { AnalyzeState } from '../../../../core/store/analyze/analyze.reducer';
import { selectAnalyzeState } from '../../../../core/store/analyze/analyze.selectors';
import { FilterState, initialState } from '../../../../core/store/filter/filter.reducer';
import { getTopIssue } from '../../../../core/store/analyze/analyze.actions';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { TabViewModule } from 'primeng/tabview';
import html2canvas from 'html2canvas';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AnalyzeService } from '../../../../core/services/analyze.service';
import { PreferenceService } from '../../../../core/services/preference.service';
import { ListboxModule } from 'primeng/listbox';
import { FilterService } from '../../../../core/services/filter.service';
import { Router } from '@angular/router';

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
    DialogModule,
    ButtonModule,
    FormsModule,
    ListboxModule,
  ],
  templateUrl: './top-issue.component.html',
  styleUrl: './top-issue.component.scss',
})
export class TopIssueComponent {
  @ViewChild('chartArea') private chartArea!: ElementRef<HTMLCanvasElement>;

  filter: any;

  tabItems: MenuItem[] | undefined;
  activeTab: MenuItem | undefined;
  downloadItems: MenuItem[] | undefined;
  downloadActive: boolean = false;

  analyzeState: Observable<AnalyzeState>;
  isLoading: boolean = false;
  isDataExist: boolean = false;

  downloadConfirmModalOpen = false;
  isConvertingImages = false;
  isDownloading = false;
  images: any[] = [];

  downloadExcelConfirmModalOpen = false;
  isDownloadingExcel = false;
  selectedColumns: any[] = [];
  selectedCategories: any[] = [];
  columnsOptions: { label: string; value: string }[] = [];
  categoriesOptions: { label: string; value: number }[] = [];

  isCheckedAllColumn = false;
  isCheckedAllCategory = false;

  chart: any;

  constructor(
    private store: Store<AppState>,
    private analyzeService: AnalyzeService,
    private preferenceService: PreferenceService,
    private filterService: FilterService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.analyzeState = this.store.select(selectAnalyzeState);
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
        command: () => this.getImagesFromCharts(),
      },
      {
        label: 'Excel',
        command: () => this.openDownloadExcelModal(),
      },
    ];
  }

  colorFromRaw(ctx: any, border: boolean) {
    this.cdr.detectChanges();
    if (ctx.type !== 'data') return 'transparent';

    const dataIndex = ctx.dataIndex;
    const maxDataIndex = ctx.chart.data.datasets[ctx.datasetIndex].data.length - 1;

    const isDarkModeStorage = window.localStorage.getItem('useDarkMode');
    let isDarkMode = false;
    if (isDarkModeStorage) {
      const checked = JSON.parse(isDarkModeStorage);
      isDarkMode = checked;
    }

    const maxAlpha = isDarkMode ? 0.8 : 1.0;
    const minAlpha = 0.25;
    let alpha = maxAlpha - (maxAlpha - minAlpha) * (dataIndex / maxDataIndex);

    const bgColor = '#8ccced';
    if (border) return 'white';

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
        onClick: (_, elements) => {
          const datasetIndex = elements[0].datasetIndex;
          const index = elements[0].index;
          const value = this.chart.data.datasets[datasetIndex].data[index];
          this.router.navigateByUrl(`/dashboard/articles-by-media?topic=${value._data.key}`);
        },
      },
    });
    this.chart = chart;

    this.store.dispatch(getTopIssue({ filter: initialState as FilterRequestPayload }));

    const isDarkModeStorage = window.localStorage.getItem('useDarkMode');
    let isDarkMode = false;
    if (isDarkModeStorage) {
      const checked = JSON.parse(isDarkModeStorage);
      isDarkMode = checked;
    }

    this.analyzeState.subscribe(({ topIssue }) => {
      this.isLoading = topIssue.isLoading;
      this.isDataExist = Object.keys(topIssue.data ?? {}).length > 0;

      const dataArray = Object.entries(topIssue.data ?? {}).map(([key, value]) => ({
        key,
        value,
      }));
      dataArray.sort((a, b) => (b?.value ?? 0) - (a?.value ?? 0));

      chart.data = {
        datasets: [
          // @ts-ignore
          {
            // @ts-ignore
            tree: dataArray,
            key: 'value',
            borderWidth: 0.5,
            spacing: 0.4,
            borderColor: (ctx) => this.colorFromRaw(ctx, true),
            backgroundColor: (ctx) => {
              this.cdr.detectChanges();
              return this.colorFromRaw(ctx, false);
            },
            labels: {
              align: 'left',
              display: true,
              color: isDarkMode ? 'white' : '#464255',
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

      this.cdr.detectChanges();
      chart.update();
    });
    this.cdr.detectChanges();
    this.filterService.subscribe(this.onFilterChange);
  }

  onActiveItemChange(event: MenuItem) {
    this.activeTab = event;
  }

  onFilterChange = (filterState: FilterState) => {
    const filter = { ...filterState } as FilterRequestPayload;
    this.store.dispatch(getTopIssue({ filter }));
  };

  getImage = async (element: HTMLElement) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const canvas = await html2canvas(element!);
    const imageData = canvas.toDataURL('image/png');
    return imageData;
  };

  getImagesFromCharts = async () => {
    this.isConvertingImages = true;
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
      const captureElement: HTMLElement = document.getElementById(chart.key) as HTMLElement;

      const image = await this.getImage(captureElement);
      images.push({ label: chart.label, image });
    }

    this.isConvertingImages = false;
    this.images = images;
    this.downloadConfirmModalOpen = true;
  };

  downloadPpt = () => {
    this.isDownloading = true;
    this.analyzeService
      .downloadPPT(this.images.map((image) => image.image))
      .subscribe(({ data }) => {
        window.open(data, '_blank')?.focus();
      })
      .add(() => (this.isDownloading = false));
  };

  onCheckedAllColumn = (isChecked: boolean) => {
    this.selectedColumns = isChecked ? [...this.columnsOptions] : [];
  };

  onCheckedAllCategory = (isChecked: boolean) => {
    this.selectedCategories = isChecked ? [...this.categoriesOptions] : [];
  };

  openDownloadExcelModal = async () => {
    const columns = await lastValueFrom(this.preferenceService.getColumns());
    const categories = await lastValueFrom(this.preferenceService.getCategories()); // prettier-ignore

    this.columnsOptions = columns?.data.map((col) => ({
      label: col.name,
      value: col.name,
    }));

    this.categoriesOptions = this.selectedCategories = categories?.results.map((category) => ({
      label: category.descriptionz,
      value: category.category_set,
    }));
    this.downloadExcelConfirmModalOpen = true;
  };

  downloadExcel = () => {
    this.isDownloadingExcel = true;
    const columns = this.selectedColumns.map(({ value }) => value);
    const categories = this.selectedCategories.map(({ value }) => value).join(',');

    const { category_id, date_type, end_date, start_date, user_media_type_id } = this.filterService.filter; // prettier-ignore
    this.analyzeService
      .downloadExcel({
        url: false,
        category_set: categories,
        category_id,
        columns,
        date_type,
        end_date,
        start_date,
        user_media_type_id,
      })
      .subscribe(({ data }) => window.open(data, '_blank')?.focus())
      .add(() => (this.isDownloadingExcel = false));
  };

  ngOnDestroy() {
    this.filter?.unsubscribe?.();
  }
}
