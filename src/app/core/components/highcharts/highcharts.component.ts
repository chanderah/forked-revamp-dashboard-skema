import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonService } from '../../services/common.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Options } from 'highcharts';

import darkTheme from 'highcharts/themes/dark-unica';
import lightTheme from 'highcharts/themes/avocado';

@Component({
  selector: 'app-highcharts',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule, SpinnerComponent],
  templateUrl: './highcharts.component.html',
  styleUrl: './highcharts.component.scss',
})
export class HighchartsComponent {
  @Input() isLoading: boolean = false;
  @Input() data!: Options;

  Highcharts: typeof Highcharts = Highcharts;

  constructor(public commonService: CommonService) {
    commonService.darkMode$.subscribe((isDarkMode) => {
      if (isDarkMode) darkTheme(Highcharts);
      else lightTheme(Highcharts);
    });
  }
}
