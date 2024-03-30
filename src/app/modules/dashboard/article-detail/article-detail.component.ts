import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ImgFallbackDirective } from '../../../core/directive/img-fallback.directive';
import { TagComponent } from '../../../core/components/tag/tag.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store';
import { ArticlesState } from '../../../core/store/articles/articles.reducer';
import { Observable } from 'rxjs';
import { selectArticlesState } from '../../../core/store/articles/articles.selectors';
import { Article } from '../../../core/models/article.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TONE_MAP } from '../../../shared/utils/Constants';
import { FormatAmountPipe } from '../../../core/pipes/format-amount.pipe';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [DividerModule, ImgFallbackDirective, TagComponent, FormatAmountPipe],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
})
export class ArticleDetailComponent {
  articlesState: Observable<ArticlesState>;
  article: (Article & { toneLabel: string }) | undefined;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.articlesState = this.store.select(selectArticlesState);
    this.articlesState.subscribe(({ mediaCountArticles }) => {
      if (!mediaCountArticles.data) {
        this.router.navigateByUrl(
          '/dashboard/overview-articles?type=online&index=1'
        );
        return;
      }

      const id = this.activatedRoute.snapshot.params['id'];
      const current = mediaCountArticles.data.data.find((article) => {
        return article.article_id === id;
      });

      this.article = {
        ...current,
        toneLabel: TONE_MAP[current?.tone ?? 0] ?? '',
      } as Article & { toneLabel: string };
    });
  }

  ngOnInit() {
    console.log('this.article', this.article);
  }
}
