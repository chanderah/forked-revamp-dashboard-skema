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
    IconChartComponent,
    CommonModule,
    MediaVisibilityComponent,
    CoverageToneComponent
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

  constructor() {
    this.tabItems = [
      { label: 'Media Visibility', key: 'media' },
      { label: 'Coverage Tone', key: 'coverage' },
    ];
    this.activeTab = this.tabItems[0];
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
    new Chart(ctx as CanvasRenderingContext2D, {
      type: 'treemap',
      data: {
        datasets: [
          // @ts-ignore
          {
            tree: [100, 80, 60, 40, 20, 10, 5, 3, 1],
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
            },
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  onActiveItemChange(event: MenuItem) {
    this.activeTab = event;
  }
}
