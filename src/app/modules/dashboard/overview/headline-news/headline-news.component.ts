import { Component } from '@angular/core';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { ScrollerModule } from 'primeng/scroller';
import { CommonModule } from '@angular/common';
import { TagComponent } from '../../../../core/components/tag/tag.component';
import { ImgFallbackDirective } from '../../../../core/directive/img-fallback.directive';
import { Article } from '../../../../core/models/article.model';
import { MediaSOVService } from '../../../../core/services/media-sov.service';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { FilterService } from '../../../../core/services/filter.service';
import { TONE_MAP } from '../../../../shared/utils/Constants';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../core/store';
import { MediaSOVState } from '../../../../core/store/media-sov/media-sov.reducer';
import { selectMediaSOVState } from '../../../../core/store/media-sov/media-sov.selectors';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../../../core/services/article.service';

@Component({
  selector: 'app-headline-news',
  standalone: true,
  imports: [
    IconNewspaperComponent,
    IconInfoComponent,
    ScrollerModule,
    CommonModule,
    TagComponent,
    ImgFallbackDirective,
    SpinnerComponent,
    RouterLink,
  ],
  templateUrl: './headline-news.component.html',
  styleUrl: './headline-news.component.scss',
})
export class HeadlineNewsComponent {
  filter: any;
  ngOnDestroy() {
    this.filter?.unsubscribe?.();
  }
  articles: Article[] = [];
  isLoading: boolean = false;

  mediaSOVState: Observable<MediaSOVState>;

  constructor(
    private mediaSOVService: MediaSOVService,
    private articleService: ArticleService,
    private filterService: FilterService,
    private store: Store<AppState>
  ) {
    this.mediaSOVState = this.store.select(selectMediaSOVState);
  }

  fetchData = (filter: FilterRequestPayload) => {
    this.isLoading = true;
    this.articleService
      .getArticlesHeadlines(filter)
      .subscribe(({ data }) => {
        this.articles = data.map((article) => {
          return { ...article, toneLabel: TONE_MAP[article?.tone ?? ''] };
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  };

  ngOnInit() {
    this.filter = this.filterService.subscribe((filter) => {
      this.fetchData({
        ...filter,
        // order_by: 'advalue_bw',
        max_size: '20',
      } as FilterRequestPayload);
    });
    // this.mediaSOVState.subscribe((data) => {
    //   this.fetchData({
    //     ...this.filterService.filter,
    //     order_by: 'advalue_bw',
    //     max_size: '20',
    //     media_id: data.media?.media_id,
    //   } as FilterRequestPayload);
    // });
  }
}
