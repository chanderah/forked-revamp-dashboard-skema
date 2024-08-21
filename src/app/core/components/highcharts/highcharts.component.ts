import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonService } from '../../services/common.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Options } from 'highcharts';
import darkTheme from 'highcharts/themes/high-contrast-dark';
import lightTheme from 'highcharts/themes/avocado';
import HC_networkgraph from 'highcharts/modules/networkgraph';
HC_networkgraph(Highcharts);

@Component({
  selector: 'app-highcharts',
  standalone: true,
  imports: [NgIf, HighchartsChartModule, SpinnerComponent],
  template: `
    <spinner [spinning]="isLoading">
      <div class="app-card">
        <div [style]="{ height: height + '!important' }" *ngIf="!data"></div>
        <ng-container *ngIf="data">
          <highcharts-chart
            [Highcharts]="Highcharts"
            [options]="data"
            [style]="{ height: height + '!important' }"
            class="block w-full"
          ></highcharts-chart>
        </ng-container>
      </div>
    </spinner>
  `,
  styles: [
    `
      div > span > table > tbody > tr > td {
        display: none !important;
      }
    `,
  ],
})
export class HighchartsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  @Input() isLoading: boolean = false;
  @Input() data!: Options;
  @Input() height?: string;

  constructor(public commonService: CommonService) {}

  ngOnInit(): void {
    if (!this.height) this.height = '400px';
    this.commonService.isDarkMode
      ? darkTheme(Highcharts)
      : lightTheme(Highcharts);
  }
}
