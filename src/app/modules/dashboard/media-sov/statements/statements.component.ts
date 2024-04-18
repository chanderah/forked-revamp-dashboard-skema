import { Component } from '@angular/core';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { Store, select } from '@ngrx/store';
import { Observable, map, pluck } from 'rxjs';
import { Influencer } from '../../../../core/models/influencer.model';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { AppState } from '../../../../core/store';
import {
  FilterState,
  initialState,
} from '../../../../core/store/filter/filter.reducer';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';
import { getInfluencer } from '../../../../core/store/spokesperson/spokesperson.actions';
import { SpokespersonState } from '../../../../core/store/spokesperson/spokesperson.reducer';
import { selectSpokespersonState } from '../../../../core/store/spokesperson/spokesperson.selectors';
import { ScrollerModule } from 'primeng/scroller';
import { CommonModule } from '@angular/common';
import { ImgFallbackDirective } from '../../../../core/directive/img-fallback.directive';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { IconDialogueComponent } from '../../../../core/components/icons/dialogue/dialogue.component';
import { MediaSOVService } from '../../../../core/services/media-sov.service';
import { FilterService } from '../../../../core/services/filter.service';
import { Article } from '../../../../core/models/article.model';
import { TONE_MAP } from '../../../../shared/utils/Constants';
import { MediaSOVState } from '../../../../core/store/media-sov/media-sov.reducer';
import { selectMediaSOVState } from '../../../../core/store/media-sov/media-sov.selectors';

@Component({
  selector: 'app-statements',
  standalone: true,
  imports: [
    IconDialogueComponent,
    IconInfoComponent,
    ScrollerModule,
    CommonModule,
    ImgFallbackDirective,
    SpinnerComponent,
  ],
  templateUrl: './statements.component.html',
  styleUrl: './statements.component.scss',
})
export class StatementsComponent {
  articles: Article[] = [];
  isLoading: boolean = false;
  mediaSOVState: Observable<MediaSOVState>;

  constructor(
    private mediaSOVService: MediaSOVService,
    private filterService: FilterService,
    private store: Store<AppState>
  ) {
    this.mediaSOVState = this.store.select(selectMediaSOVState);
  }

  fetchData = (filter: FilterRequestPayload) => {
    this.isLoading = true;
    this.mediaSOVService
      .getLatestArticles({ ...filter, max_size: '20' })
      .subscribe(({ data }) => {
        this.articles = data.data.map((article) => {
          return { ...article, toneLabel: TONE_MAP[article?.tone ?? ''] };
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  };

  ngOnInit() {
    this.filterService.subscribe((filter) => {
      this.fetchData({ ...filter } as FilterRequestPayload);
    });
    this.mediaSOVState.subscribe((data) => {
      this.fetchData({
        ...this.filterService.filter,
        tone: data.tone,
        media_id: data.media?.media_id,
      } as FilterRequestPayload);
    });
  }
}
