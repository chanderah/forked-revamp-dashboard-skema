import { NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonService } from '../../services/common.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Options } from 'highcharts';
import darkTheme from 'highcharts/themes/dark-unica';
import lightTheme from 'highcharts/themes/avocado';
import { skip, Subscription } from 'rxjs';

@Component({
  selector: 'app-highcharts',
  standalone: true,
  imports: [NgIf, HighchartsChartModule, SpinnerComponent],
  template: `
    <spinner [spinning]="isLoading">
      <div class="app-card">
        <div class="h-25rem" *ngIf="!data"></div>
        <ng-container *ngIf="data">
          <highcharts-chart
            [Highcharts]="Highcharts"
            [options]="data"
            class="block w-full h-25rem"
          ></highcharts-chart>
        </ng-container>
      </div>
    </spinner>
  `,
})
export class HighchartsComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;

  @Input() isLoading: boolean = false;
  @Input() data?: Options;

  subscription!: Subscription;

  constructor(public commonService: CommonService) {}

  ngOnInit(): void {
    this.commonService.isDarkMode
      ? darkTheme(Highcharts)
      : lightTheme(Highcharts);

    this.subscription = this.commonService.darkMode$
      .pipe(skip(1))
      .subscribe(() => window.location.reload());
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
