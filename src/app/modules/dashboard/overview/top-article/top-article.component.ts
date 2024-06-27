import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { ScrollerModule } from 'primeng/scroller';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../core/store';
import { OverviewState } from '../../../../core/store/overview/overview.reducer';
import { selectOverviewState } from '../../../../core/store/overview/overview.selectors';
import { Article } from '../../../../core/models/article.model';
import { getUserEditingPlus } from '../../../../core/store/overview/overview.actions';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import {
  FilterState,
  initialState,
} from '../../../../core/store/filter/filter.reducer';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { ImgFallbackDirective } from '../../../../core/directive/img-fallback.directive';
import { ArticleService } from '../../../../core/services/article.service';
import { FilterService } from '../../../../core/services/filter.service';

@Component({
  selector: 'app-top-article',
  standalone: true,
  imports: [
    DataViewModule,
    CommonModule,
    ScrollerModule,
    IconInfoComponent,
    IconNewspaperComponent,
    RouterLink,
    SpinnerComponent,
    ImgFallbackDirective,
  ],
  templateUrl: './top-article.component.html',
  styleUrl: './top-article.component.scss',
})
export class TopArticleComponent {
  overviewState: Observable<OverviewState>;
  filterState: Observable<FilterState>;
  articles: Article[] = [];
  isLoading: boolean = false;

  constructor(
    private store: Store<AppState>,
    private articleService: ArticleService,
    private filterService: FilterService
  ) {
    this.overviewState = this.store.select(selectOverviewState);
    this.filterState = this.store.select(selectFilterState);
  }

  fetchData = (filter: FilterRequestPayload) => {
    this.isLoading = true;
    this.articleService
      .getTopArticles(filter)
      .subscribe(({ data }) => {
        // @ts-ignore
        this.articles = data?.data ?? [];
      })
      .add(() => {
        this.isLoading = false;
      });
  };

  ngOnInit() {
    this.filterService.subscribe((filter) => {
      this.fetchData(filter);
    });
  }

  // ngOnInit() {

  // this.store.dispatch(
  //   getUserEditingPlus({ filter: initialState as FilterRequestPayload })
  // );
  // this.overviewState.subscribe(({ topArticles }) => {
  //   this.isLoading = topArticles.isLoading;
  //   this.articles = topArticles.data;
  // });
  // this.filterState.subscribe(this.onFilterChange);
  // }

  // onFilterChange = (filterState: FilterState) => {
  //   const filter = { ...filterState } as FilterRequestPayload;
  //   this.store.dispatch(getUserEditingPlus({ filter }));
  // };
}
