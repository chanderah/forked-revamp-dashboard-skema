import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { htmlLegendPlugin } from '../../../../shared/utils/ChartUtils';
import { Store } from '@ngrx/store';
import { Observable, map, pluck } from 'rxjs';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { AppState } from '../../../../core/store';
import { MediaSOVService } from '../../../../core/services/media-sov.service';
import { MediaTone } from '../../../../core/models/media.model';
import { FilterService } from '../../../../core/services/filter.service';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { MediaSOVState } from '../../../../core/store/media-sov/media-sov.reducer';
import { selectMediaSOVState } from '../../../../core/store/media-sov/media-sov.selectors';
import {
  NEGATIVE_TONE,
  NEUTRAL_TONE,
  POSITIVE_TONE,
} from '../../../../shared/utils/Constants';
import { setTone } from '../../../../core/store/media-sov/media-sov.actions';

@Component({
  selector: 'app-sentiment',
  standalone: true,
  imports: [ChartModule, SpinnerComponent],
  templateUrl: './sentiment.component.html',
  styleUrl: './sentiment.component.scss',
})
export class SentimentComponent {
  isLoading: boolean = false;
  chartData: any;
  options: any;
  plugins = [htmlLegendPlugin];
  mediaSOVState: Observable<MediaSOVState>;

  constructor(
    private mediaSOVService: MediaSOVService,
    private filterService: FilterService,
    private store: Store<AppState>
  ) {
    this.mediaSOVState = this.store.select(selectMediaSOVState);
  }

  fetchData = async (filter: FilterRequestPayload) => {
    this.isLoading = true;
    this.mediaSOVService
      .getMediaTones(filter)
      .subscribe((data) => {
        this.initChartData(data.data);
      })
      .add(() => {
        this.isLoading = false;
      });
  };

  ngOnInit() {
    this.initChartOpts();
    this.filterService.subscribe((filter) => {
      this.fetchData(filter);
    });
    this.mediaSOVState.pipe(pluck('media')).subscribe((data) => {
      this.fetchData({
        ...this.filterService.filter,
        media_id: data?.media_id,
      });
    });
  }

  getChartData = (mediaTone: MediaTone) => {
    const totalTones = mediaTone.total_articles;
    const getPercentage = (toneVal: number) =>
      ((toneVal / totalTones) * 100).toFixed(0);

    const documentStyle = getComputedStyle(document.documentElement);
    const positiveColor = documentStyle.getPropertyValue('--positive-color');
    const negativeColor = documentStyle.getPropertyValue('--negative-color');
    const neutralColor = documentStyle.getPropertyValue('--neutral-color');

    const positive = mediaTone.tone_articles.positive;
    const negative = mediaTone.tone_articles.negative;
    const neutral = mediaTone.tone_articles.neutral;

    const pieDatasets: any = [
      {
        data: [
          mediaTone.tone_articles.positive,
          mediaTone.tone_articles.negative,
          mediaTone.tone_articles.neutral,
        ],
        tones: [POSITIVE_TONE, NEGATIVE_TONE, NEUTRAL_TONE],
        percentages: [
          getPercentage(positive),
          getPercentage(negative),
          getPercentage(neutral),
        ],
        backgroundColor: [positiveColor, negativeColor, 'gray'],
      },
    ];
    const pieLabels: string[] = ['Positive', 'Negative', 'Neutral'];

    return { pieLabels, pieDatasets };
  };

  initChartData = (media: MediaTone) => {
    if (media) {
      const { pieDatasets, pieLabels } = this.getChartData(media);
      this.chartData = { labels: pieLabels, datasets: pieDatasets };
    }
  };

  onDataSelect = (value: any) => {
    const currentData = this.chartData.datasets[value.element.datasetIndex];
    const tone = currentData.tones[value.element.index];
    this.store.dispatch(setTone({ tone }));
  };

  initChartOpts = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.options = {
      maintainAspectRatio: false,
      plugins: {
        htmlLegend: {
          containerID: 'sentiment-legend-container',
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
  };
}
