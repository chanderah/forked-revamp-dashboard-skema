import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HighchartsComponent } from '../../../core/components/highcharts/highcharts.component';
import { ChartType } from '../../../core/models/social-media';
import { SocialMediaService } from '../../../core/services/social-media.service';
import { WordCloudComponent } from '../components/word-cloud/word-cloud.component';

@Component({
  selector: 'app-social-media-index',
  standalone: true,
  imports: [CommonModule, WordCloudComponent, HighchartsComponent],
  templateUrl: './social-media-index.component.html',
  styleUrl: './social-media-index.component.scss',
})
export class SocialMediaIndexComponent {
  listCharts: { type: ChartType; data?: any }[] = [
    { type: 'emotion-map' },
    { type: 'social-network-analysis' },
    { type: 'authors' },
    { type: 'key-hashtags' },
  ];

  constructor(private service: SocialMediaService) {}

  ngOnInit(): void {
    // from(this.listCharts)
    //   .pipe(
    //     mergeMap((chart) =>
    //       this.service
    //         .getChart({ type: chart.type,  })
    //         .pipe(
    //           mergeMap((res: any) => [{ type: chart.type, data: res?.data }])
    //         )
    //     )
    //   )
    //   .subscribe((res) => {
    //     const i = this.listCharts.findIndex((v) => v.type === res.type);
    //     if (i > -1) this.listCharts[i].data = res.data;
    //   });
  }
}
