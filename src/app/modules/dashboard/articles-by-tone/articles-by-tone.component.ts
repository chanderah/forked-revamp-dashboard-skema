import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { FilterState } from '../../../core/store/filter/filter.reducer';
import { FilterRequestPayload } from '../../../core/models/request.model';
import { FilterService } from '../../../core/services/filter.service';
import { Article } from '../../../core/models/article.model';
import { TitleCasePipe } from '../../../core/pipes/titlecase.pipe';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';
import { ArticleListComponent } from '../../../core/components/article-list/article-list.component';
import { TONE_MAP } from '../../../shared/utils/Constants';

@Component({
  selector: 'app-articles-by-tone',
  standalone: true,
  imports: [SpinnerComponent, ArticleListComponent],
  templateUrl: './articles-by-tone.component.html',
  styleUrl: './articles-by-tone.component.scss',
})
export class ArticlesByToneComponent {
  mediaId: number | null = null;
  mediaName: string | null = null;
  tone: number | null = null;
  toneLabel: string | null = null;

  articles: Article[] = [];
  page: number = 0;
  first: number = 0;
  rows: number = 16;
  totalRecords: number = 0;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private filterService: FilterService
  ) {
    const mediaId = this.route.snapshot.queryParamMap.get('mediaId')!;
    const mediaName = this.route.snapshot.queryParamMap.get('mediaName')!;
    const tone = this.route.snapshot.queryParamMap.get('tone');

    if (mediaId && tone) {
      this.mediaId = +mediaId;
      this.mediaName = mediaName;
      this.tone = +tone;
      this.toneLabel = TONE_MAP[tone];
      this.filterService.subscribe((filter) => {
        this.fetchArticlesByTone(filter);
      });
    } else {
      this.router.navigateByUrl('/dashboard/overview');
    }
  }

  fetchArticlesByTone = (filter: FilterState) => {
    const req = { ...filter, media_id: this.mediaId, tone: this.tone };
    this.isLoading = true;
    this.articleService
      .getArticlesByTone(req as FilterRequestPayload)
      .subscribe((data) => {
        this.isLoading = false;
        this.articles = data.data;
        this.totalRecords = data.recordsTotal;
      });
  };

  onPageChange = (event: any) => {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
    this.fetchArticlesByTone(this.filterService.filter);
  };
}
