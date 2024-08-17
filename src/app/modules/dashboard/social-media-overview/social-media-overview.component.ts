import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { from, mergeMap } from 'rxjs';
import { HighchartsComponent } from '../../../core/components/highcharts/highcharts.component';
import { ChartType } from '../../../core/models/social-media';
import { SocialMediaService } from '../../../core/services/social-media.service';
import { WordCloudComponent } from '../components/word-cloud/word-cloud.component';
import { IconNewspaperComponent } from '../../../core/components/icons/newspaper/newspaper.component';
import { IconInfoComponent } from '../../../core/components/icons/info/info.component';

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
export class SocialMediaOverviewComponent {
  listCharts: {
    isLoading: boolean;
    type: ChartType;
    title: string;
    data?: any;
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
    { type: 'share-of-platform', title: 'Share of Platform', isLoading: true },
    { type: 'engaging-authors', title: 'Engaging Authors', isLoading: true },
    { type: 'tagcloud', title: 'Word Cloud', isLoading: true },
  ];

  constructor(private service: SocialMediaService) {}

  ngOnInit(): void {
    from(this.listCharts)
      .pipe(
        mergeMap((chart) =>
          this.service
            .getChart({ type: chart.type })
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
        console.log(this.listCharts[i].data);
      });
  }
}
