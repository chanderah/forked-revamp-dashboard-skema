import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, mergeMap, skip, Subscription } from 'rxjs';
import { HighchartsComponent } from '../../../core/components/highcharts/highcharts.component';
import { ChartType } from '../../../core/models/social-media';
import { SocialMediaService } from '../../../core/services/social-media.service';
import { WordCloudComponent } from '../components/word-cloud/word-cloud.component';
import { IconNewspaperComponent } from '../../../core/components/icons/newspaper/newspaper.component';
import { IconInfoComponent } from '../../../core/components/icons/info/info.component';
import { FilterService } from '../../../core/services/filter.service';
import { CommonService } from '../../../core/services/common.service';
import { FilterState } from '../../../core/store/filter/filter.reducer';

@Component({
  selector: 'app-social-media-overview',
  standalone: true,
  imports: [
    CommonModule,
    WordCloudComponent,
    HighchartsComponent,
    IconNewspaperComponent,
    IconInfoComponent,
  ],
  templateUrl: './social-media-overview.component.html',
  styleUrl: './social-media-overview.component.scss',
})
export class SocialMediaOverviewComponent implements OnInit, OnDestroy {
  subscription!: Subscription;

  listCharts: {
    isLoading: boolean;
    type: ChartType;
    title: string;
    data?: any;
    height?: string;
    largestValue?: number;
  }[] = [
    {
      type: 'number-of-mentions',
      title: 'Number of Mentions',
      isLoading: true,
    },
    {
      type: 'share-of-sentiment',
      title: 'Share of Sentiment',
      isLoading: true,
    },
    {
      type: 'share-of-platform',
      title: 'Share of Platform',
      height: '520px',
      isLoading: true,
    },
    {
      type: 'engaging-authors',
      title: 'Engaging Authors',
      height: '520px',
      isLoading: true,
    },
    { type: 'tagcloud', title: 'Word Cloud', isLoading: true },
  ];

  constructor(
    private service: SocialMediaService,
    private filterService: FilterService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.filterService.subscribe(({ start_date, end_date }: FilterState) => {
      this.getData(start_date, end_date);
    });

    this.subscription = this.commonService.darkMode$
      .pipe(skip(1))
      .subscribe(() => window.location.reload());
  }

  getData(startDate: string, endDate: string) {
    this.listCharts.forEach((v) => {
      // v.data = undefined;
      v.isLoading = true;
    });

    from(this.listCharts)
      .pipe(
        mergeMap((chart) =>
          this.service
            .getChart({ type: chart.type, startDate, endDate })
            .pipe(
              mergeMap((res: any) => [{ type: chart.type, data: res?.data }])
            )
        )
      )
      .subscribe((res) => {
        const i = this.listCharts.findIndex((v) => v.type === res.type);
        if (i > -1 && res.data) {
          if (res.type === 'tagcloud') {
            const wordCloudData = res.data.series[0].data;
            if (wordCloudData && wordCloudData.length) {
              this.listCharts[i].data = wordCloudData.map((v: any) => {
                return {
                  text: v.name,
                  value: v.weight,
                };
              });
              this.listCharts[i].largestValue = Math.max(
                ...wordCloudData.map((v: any) => v.weight)
              );
            }
          } else this.listCharts[i].data = res.data;
        }
        this.listCharts[i].isLoading = false;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
