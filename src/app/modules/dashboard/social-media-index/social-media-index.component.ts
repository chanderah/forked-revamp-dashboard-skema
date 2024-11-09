import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { TooltipModule } from 'primeng/tooltip';
import { from, mergeMap, skip, Subscription, tap } from 'rxjs';
import { HighchartsComponent } from '../../../core/components/highcharts/highcharts.component';
import { IconInfoComponent } from '../../../core/components/icons/info/info.component';
import { IconNewspaperComponent } from '../../../core/components/icons/newspaper/newspaper.component';
import { ChartType } from '../../../core/models/social-media';
import { CommonService } from '../../../core/services/common.service';
import { FilterService } from '../../../core/services/filter.service';
import { SocialMediaService } from '../../../core/services/social-media.service';
import { FilterState } from '../../../core/store/filter/filter.reducer';
import { isDarkMode } from '../../../shared/utils/CommonUtils';
import { WordCloudComponent } from '../components/word-cloud/word-cloud.component';

@Component({
  selector: 'app-social-media-index',
  standalone: true,
  imports: [
    CommonModule,
    WordCloudComponent,
    HighchartsComponent,
    IconNewspaperComponent,
    IconInfoComponent,
    SvgIconComponent,
    TooltipModule,
  ],
  templateUrl: './social-media-index.component.html',
  styleUrl: './social-media-index.component.scss',
})
export class SocialMediaIndexComponent implements OnInit, OnDestroy {
  subscription!: Subscription;

  listCharts: {
    isLoading: boolean;
    type: ChartType;
    title: string;
    description?: string;
    data?: any;
    height?: string;
    largestValue?: number;
  }[] = [
    {
      type: 'social-network-analysis',
      title: 'SNA',
      isLoading: true,
    },
    {
      type: 'emotion-map',
      title: 'Emotion',
      isLoading: true,
    },
    {
      type: 'authors',
      title: 'Most Active Account',
      isLoading: true,
    },
    {
      type: 'key-hashtags',
      title: 'Top Hashtag',
      isLoading: true,
    },
    {
      type: 'engaging-posts',
      title: 'Most Engaging Post',
      isLoading: true,
    },
    {
      type: 'daily-facebook-reactions',
      title: 'Facebook Reaction',
      isLoading: true,
    },
    {
      type: 'reach-frequency',
      title: 'Reach per Day',
      isLoading: true,
    },
  ];

  constructor(private service: SocialMediaService, private filterService: FilterService, private commonService: CommonService) {}

  ngOnInit(): void {
    this.filterService.subscribe(({ start_date, end_date }: FilterState) => {
      this.getData(start_date, end_date);
    });

    this.subscription = this.commonService.darkMode$.pipe(skip(1)).subscribe(() => window.location.reload());
  }

  getData(startDate: string, endDate: string) {
    from(this.listCharts)
      .pipe(
        tap((v) => {
          v.isLoading = true;
          v.data = undefined;
        }),
        mergeMap((v, i) =>
          this.service
            .getChart({ type: v.type, startDate, endDate })
            .pipe(mergeMap((res: any) => [{ type: v.type, data: res?.data, index: i }]))
        )
      )
      .subscribe((res) => {
        const i = res.index;
        if (res.data) {
          this.listCharts[i].description = res.data.caption.text;
          res.data.title.text = this.listCharts[i].title;
          delete res.data['caption'];

          if (res.type === 'emotion-map') {
            const { pointFormat } = res.data.tooltip;
            res.data.tooltip.pointFormat = pointFormat.replace('<td style="color: #222">', '<td>');
          }

          if (isDarkMode()) {
            if (res.data?.xAxis?.labels?.style?.color) {
              res.data.xAxis.labels.style.color = 'white';
            }
            if (res.data?.yAxis?.labels?.style?.color) {
              res.data.yAxis.labels.style.color = 'white';
            }
          }
          this.listCharts[i].data = res.data;
        }
        this.listCharts[i].isLoading = false;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
