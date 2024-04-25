import { Component } from '@angular/core';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { CommonModule } from '@angular/common';
import { ImgFallbackDirective } from '../../../../core/directive/img-fallback.directive';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { AppState } from '../../../../core/store';
import {
  FilterState,
  initialState,
} from '../../../../core/store/filter/filter.reducer';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';
import { getLatestNews } from '../../../../core/store/spokesperson/spokesperson.actions';
import { SpokespersonState } from '../../../../core/store/spokesperson/spokesperson.reducer';
import { selectSpokespersonState } from '../../../../core/store/spokesperson/spokesperson.selectors';
import { Article } from '../../../../core/models/article.model';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { RouterLink } from '@angular/router';
import { InfluencerService } from '../../../../core/services/influencer.service';
import { ArticleService } from '../../../../core/services/article.service';
import { MediaSOVService } from '../../../../core/services/media-sov.service';
import { FilterService } from '../../../../core/services/filter.service';
import _ from 'lodash';

@Component({
  selector: 'app-latest-news',
  standalone: true,
  imports: [
    IconNewspaperComponent,
    IconInfoComponent,
    CommonModule,
    ImgFallbackDirective,
    SpinnerComponent,
    RouterLink,
  ],
  templateUrl: './latest-news.component.html',
  styleUrl: './latest-news.component.scss',
})
export class LatestNewsComponent {
  spokespersonState: Observable<SpokespersonState>;
  articles: Article[] = [];
  isLoading: boolean = false;
  prevMedia: number | null = null;

  constructor(
    private store: Store<AppState>,
    private mediaSOVService: MediaSOVService,
    private filterService: FilterService
  ) {
    this.spokespersonState = this.store.select(selectSpokespersonState);
  }

  fetchData = (filter: FilterRequestPayload) => {
    this.isLoading = true;
    this.mediaSOVService
      .getLatestArticles(filter)
      .subscribe(({ data }) => {
        this.articles = data.data;
      })
      .add(() => {
        this.isLoading = false;
      });
  };

  ngOnInit() {
    this.store.dispatch(
      getLatestNews({ filter: initialState as FilterRequestPayload })
    );
    this.spokespersonState.subscribe(({ selectedMedia }) => {
      if (!_.isEqual(selectedMedia, this.prevMedia)) {
        this.prevMedia = selectedMedia;
        this.fetchData({
          ...this.filterService.filter,
          media_id: selectedMedia,
        });
      }
    });
  }
}
