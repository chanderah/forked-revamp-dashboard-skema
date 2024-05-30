import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { htmlLegendPlugin } from '../../../../shared/utils/ChartUtils';
import { InfluencerService } from '../../../../core/services/influencer.service';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { FilterService } from '../../../../core/services/filter.service';
import { AppState } from '../../../../core/store';
import { Store } from '@ngrx/store';
import { SpokespersonState } from '../../../../core/store/spokesperson/spokesperson.reducer';
import { Observable, pluck } from 'rxjs';
import { selectSpokespersonState } from '../../../../core/store/spokesperson/spokesperson.selectors';
import { MediaShare } from '../../../../core/models/influencer.model';
import { CommonModule } from '@angular/common';
import { setMedia } from '../../../../core/store/spokesperson/spokesperson.actions';
import _ from 'lodash';

@Component({
  selector: 'app-media-share',
  standalone: true,
  imports: [ChartModule, CommonModule],
  templateUrl: './media-share.component.html',
  styleUrl: './media-share.component.scss',
})
export class MediaShareComponent {
  data: any;
  options: any;
  plugins = [htmlLegendPlugin];
  isLoading = false;
  spokepersonState: Observable<SpokespersonState>;
  selectedInfluencer: string | null = null;
  selectedMedia: number | null = null;

  constructor(
    private influencerService: InfluencerService,
    private filterService: FilterService,
    private store: Store<AppState>
  ) {
    this.spokepersonState = this.store.select(selectSpokespersonState);
  }

  fetchData = async (
    filter: FilterRequestPayload & { spokeperson_name?: string }
  ) => {
    if (!filter.spokeperson_name) return;
    this.isLoading = true;
    this.influencerService
      .getSpokepersonMediaShares(filter)
      .subscribe((data) => {
        this.initChartData(data.data.media_shares, data.data.total_doc_count);
        if (this.selectedMedia !== data.data.media_shares[0].media_id) {
          this.selectedMedia = data.data.media_shares[0].media_id
          this.store.dispatch(
            setMedia({ media: data.data.media_shares[0].media_id })
          );
        }
      })
      .add(() => {
        this.isLoading = false;
      });
  };

  ngOnInit() {
    this.filterService.subscribe((filter) => {
      this.fetchData(filter);
    });
    this.spokepersonState
      .pipe(pluck('selectedInfluencer'))
      .subscribe((data) => {
        if (!_.isEqual(data, this.selectedInfluencer)) {
          this.selectedInfluencer = data;
          this.fetchData({
            ...this.filterService.filter,
            spokeperson_name: data!!,
          });
        }
      });

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.options = {
      maintainAspectRatio: false,
      plugins: {
        htmlLegend: {
          containerID: 'mediashare-legend-container',
          flexDirection: 'row',
          fontWeight: 'bold',
          percentagesValueFontSize: '14px',
        },
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }

  initChartData = (mediaShares: MediaShare[], totalDocCount: number) => {
    const pieDatasets: any = [{ data: [], percentages: [], mediaIds: [] }];
    const pieLabels: string[] = [];

    mediaShares.forEach((media) => {
      pieLabels.push(media.media_name);
      pieDatasets[0].percentages.push(
        ((media.doc_count / totalDocCount) * 100).toFixed(0)
      );
      pieDatasets[0].data.push(media.doc_count);
      pieDatasets[0].mediaIds.push(media.media_id);
    });

    this.data = {
      labels: pieLabels,
      datasets: pieDatasets,
    };

    return {
      pieLabels,
      pieDatasets,
    };
  };

  onDataSelect = (value: any) => {
    const currentData = this.data.datasets[value.element.datasetIndex];
    const mediaId = currentData.mediaIds[value.element.index];
    this.store.dispatch(setMedia({ media: mediaId }));
  };
}
