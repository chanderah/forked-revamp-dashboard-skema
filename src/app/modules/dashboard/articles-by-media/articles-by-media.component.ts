import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { FilterState } from '../../../core/store/filter/filter.reducer';
import { FilterRequestPayload } from '../../../core/models/request.model';
import { FilterService } from '../../../core/services/filter.service';
import { Article } from '../../../core/models/article.model';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';
import { ArticleListComponent } from '../../../core/components/article-list/article-list.component';
import { TONE_MAP } from '../../../shared/utils/Constants';

@Component({
  selector: 'app-articles-by-media',
  standalone: true,
  imports: [SpinnerComponent, ArticleListComponent],
  templateUrl: './articles-by-media.component.html',
  styleUrl: './articles-by-media.component.scss',
})
export class ArticlesByMediaComponent {
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
    const mediaName = this.route.snapshot.queryParamMap.get('mediaName')!;

    if (mediaName) {
      this.mediaName = mediaName;
      this.filterService.subscribe((filter) => {
        this.fetchArticles(filter);
      });
    } else {
      this.router.navigateByUrl('/dashboard/analyze');
    }
  }

  fetchArticles = (filter: FilterRequestPayload) => {
    const req = {
      ...filter,
      category_id: this.mediaName,
    };
    this.isLoading = true;
    this.articleService
      .getUserEditingPlus(req as FilterRequestPayload)
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
    this.fetchArticles({
      ...this.filterService.filter,
      page: event.page,
      size: event.rows,
    });
  };
}
