import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ImgFallbackDirective } from '../../../core/directive/img-fallback.directive';
import { PaginatorModule } from 'primeng/paginator';
import { DividerModule } from 'primeng/divider';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TitleCasePipe } from '../../../core/pipes/titlecase.pipe';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/store';
import { selectOverviewState } from '../../../core/store/overview/overview.selectors';
import { take } from 'rxjs';
import { Article } from '../../../core/models/article.model';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';
import { MediaCount } from '../../../core/models/media-count.model';
import { OverviewService } from '../../../core/services/overview.service';
import { initialState } from '../../../core/store/filter/filter.reducer';
import { FilterRequestPayload } from '../../../core/models/request.model';
import { getMediaCountArticles } from '../../../core/store/articles/articles.actions';
import { selectArticlesState } from '../../../core/store/articles/articles.selectors';
import { ArticleListComponent } from '../../../core/components/article-list/article-list.component';

@Component({
  selector: 'app-overview-articles',
  standalone: true,
  imports: [
    AvatarModule,
    CommonModule,
    ImgFallbackDirective,
    PaginatorModule,
    DividerModule,
    TitleCasePipe,
    SpinnerComponent,
    RouterModule,
    ArticleListComponent
  ],
  templateUrl: './overview-articles.component.html',
  styleUrl: './overview-articles.component.scss',
})
export class OverviewArticlesComponent {
  type: string | null = null;
  index: string = '0';
  articles: Article[] = [];
  currentMedia: MediaCount | null = null;
  page: number = 0;
  first: number = 0;
  rows: number = 16;
  totalRecords: number = 0;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private overviewService: OverviewService
  ) {}

  fetchArticles = (mediaCount: MediaCount, page: number, size: number) => {
    this.isLoading = true;
    this.store.dispatch(
      getMediaCountArticles({
        filter: {
          article_ids: mediaCount.article_ids,
          page,
          size,
        },
      })
    );
  };

  async ngOnInit() {
    this.type = this.route.snapshot.queryParamMap.get('type');
    this.index = this.route.snapshot.queryParamMap.get('index') ?? '0';
    const store = await this.store
      .pipe(select(selectOverviewState), take(1))
      .toPromise();

    if (!store) return;

    const currentMedia = store.mediaCount.data[+this.index];
    if (currentMedia) {
      this.currentMedia = currentMedia;
      this.fetchArticles(currentMedia, 0, 16);
    } else {
      this.overviewService
        .getMediaCount(initialState as FilterRequestPayload)
        .subscribe((resp) => {
          const currentMedia = resp.data[+this.index];
          this.currentMedia = currentMedia
          this.fetchArticles(currentMedia, 0, 16);
        });
    }

    this.store
      .select(selectArticlesState)
      .subscribe(({ mediaCountArticles }) => {
        this.isLoading = mediaCountArticles.isLoading;
        if (mediaCountArticles.data) {
          this.articles = mediaCountArticles.data.data;
          this.totalRecords = mediaCountArticles.data.recordsTotal;
        }
      });
  }

  onPageChange = (event: any) => {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
    this.fetchArticles(this.currentMedia!, event.page, event.rows);
  }
}
