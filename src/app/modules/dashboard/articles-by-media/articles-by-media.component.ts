import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { ArticleListComponent } from '../../../core/components/article-list/article-list.component';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';
import { Article } from '../../../core/models/article.model';
import { FilterRequestPayload } from '../../../core/models/request.model';
import { ArticleService } from '../../../core/services/article.service';
import { FilterService } from '../../../core/services/filter.service';

@Component({
  selector: 'app-articles-by-media',
  standalone: true,
  imports: [SpinnerComponent, ArticleListComponent],
  templateUrl: './articles-by-media.component.html',
  styleUrl: './articles-by-media.component.scss',
})
export class ArticlesByMediaComponent {
  filter!: Subscription;

  mediaId!: number;
  mediaName!: string;
  date: string | null;
  topic!: string;
  tone!: number;
  toneLabel!: string;
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
    const { mediaName, topic, date } = route.snapshot.queryParams;
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
    this.isLoading = true;

    let startDate;
    let endDate;

    const isHourly = this.date?.includes('T');
    if (isHourly) {
      startDate = moment(this.date).utc().format('YYYY-MM-DD HH:mm:ss');
      endDate = moment(startDate).endOf('hour').subtract(1, 'millisecond').format('YYYY-MM-DD HH:mm:ss');
    } else {
      startDate = this.date ? moment(this.date).format('YYYY-MM-DD') : filter.start_date;
      endDate = this.date ? moment(this.date).format('YYYY-MM-DD') : filter.end_date;
    }

    this.articleService
      .getUserEditingPlus({
        ...filter,
        category_id: this.mediaName,
        start_date: startDate,
        end_date: endDate,
      })
      .subscribe((data) => {
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

  ngOnDestroy() {
    this.filter?.unsubscribe();
  }
}
