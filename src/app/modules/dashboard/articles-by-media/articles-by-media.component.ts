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
import moment from 'moment';

@Component({
  selector: 'app-articles-by-media',
  standalone: true,
  imports: [SpinnerComponent, ArticleListComponent],
  templateUrl: './articles-by-media.component.html',
  styleUrl: './articles-by-media.component.scss',
})
export class ArticlesByMediaComponent {
  filter: any;
  ngOnDestroy() {
    this.filter?.unsubscribe?.();
  }
  mediaId: number | null = null;
  mediaName: string | null = null;
  date: string | null = null;
  topic: string | null = null;
  tone: number | null = null;
  toneLabel: string | null = null;
  isTopic: boolean = false;

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
    const topic = this.route.snapshot.queryParamMap.get('topic')!;
    const date = this.route.snapshot.queryParamMap.get('date')!;
    this.date = date;

    if (mediaName) {
      this.mediaName = mediaName;
      this.filter = this.filterService.subscribe((filter) => {
        this.fetchArticlesPlus(filter);
      });
    } else if (topic) {
      this.topic = topic;
      this.isTopic = true;
      this.filter = this.filterService.subscribe((filter) => {
        this.fetchArticles(filter);
      });
    } else {
      this.router.navigateByUrl('/dashboard/analyze');
    }
  }

  fetchArticlesPlus = (filter: FilterRequestPayload) => {
    const req = {
      ...filter,
      category_id: this.mediaName,
      start_date: this.date ? moment(this.date).format('YYYY-MM-DD') : filter.start_date,
      end_date: this.date ? moment(this.date).format('YYYY-MM-DD') : filter.end_date,
    };
    this.isLoading = true;
    this.articleService.getUserEditingPlus(req as FilterRequestPayload).subscribe((data) => {
      this.isLoading = false;
      this.articles = data.data;
      this.totalRecords = data.recordsTotal;
    });
  };

  fetchArticles = (filter: FilterRequestPayload) => {
    const req = {
      ...filter,
      topic: this.topic ?? undefined,
      start_date: this.date ? moment(this.date).format('YYYY-MM-DD') : filter.start_date,
      end_date: this.date ? moment(this.date).format('YYYY-MM-DD') : filter.end_date,
    };
    this.isLoading = true;
    this.articleService.getUserEditing(req as FilterRequestPayload).subscribe((data) => {
      this.isLoading = false;
      this.articles = data.data;
      this.totalRecords = data.recordsTotal;
    });
  };

  onPageChange = (event: any) => {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
    if (this.isTopic) {
      this.fetchArticles({
        ...this.filterService.filter,
        page: event.page,
        size: event.rows,
      });
    } else {
      this.fetchArticlesPlus({
        ...this.filterService.filter,
        page: event.page,
        size: event.rows,
      });
    }
  };
}
