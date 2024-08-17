import { NgIf } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonService } from '../../services/common.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-highcharts',
  standalone: true,
  imports: [NgIf, HighchartsChartModule, SpinnerComponent],
  templateUrl: './highcharts.component.html',
  styleUrl: './highcharts.component.scss',
})
export class HighchartsComponent {
  @ViewChild('container') container!: ElementRef;
  @Input() isLoading: boolean = false;
  @Input() data!: any;

  protected HIGHCHARTS = Highcharts;

  constructor(public commonService: CommonService) {}

  getContainerWidth() {
    const boundingRect = this.container.nativeElement.getBoundingClientRect();
    return boundingRect.width + 'px';
  }
}
