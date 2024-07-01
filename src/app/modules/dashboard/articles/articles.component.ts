import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ImgFallbackDirective } from '../../../core/directive/img-fallback.directive';
import { PaginatorModule } from 'primeng/paginator';
import { DividerModule } from 'primeng/divider';
import { RouterModule } from '@angular/router';
import { TitleCasePipe } from '../../../core/pipes/titlecase.pipe';
import { Article } from '../../../core/models/article.model';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';
import { MediaCount } from '../../../core/models/media-count.model';
import { FilterRequestPayload } from '../../../core/models/request.model';
import { ArticleListComponent } from '../../../core/components/article-list/article-list.component';
import { ArticleService } from '../../../core/services/article.service';
import { FilterService } from '../../../core/services/filter.service';

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
    ArticleListComponent,
  ],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
})
export class ArticlesComponent{ filter: any; ngOnDestroy(){this.filter?.unsubscribe?.()}
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
    private articleService: ArticleService,
    private filterService: FilterService
  ) {}

  fetchArticles = (filter: FilterRequestPayload) => {
    this.isLoading = true;
    this.articleService
      .getUserEditingPlus(filter)
      .subscribe((data) => {
        this.articles = data.data;
        this.totalRecords = data.recordsTotal;
      })
      .add(() => {
        this.isLoading = false;
      });
  };

  async ngOnInit() {
    this.filter = this.filterService.subscribe((filter) => {
      this.fetchArticles(filter);
    });
  }

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
