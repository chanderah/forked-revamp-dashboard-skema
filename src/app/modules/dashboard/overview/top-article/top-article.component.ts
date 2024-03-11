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
import { getHighlights } from '../../../../core/store/overview/overview.actions';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { FilterState, initialState } from '../../../../core/store/filter/filter.reducer';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';

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
  ],
  templateUrl: './top-article.component.html',
  styleUrl: './top-article.component.scss',
})
export class TopArticleComponent {
  overviewState: Observable<OverviewState>;
  filterState: Observable<FilterState>;
  articles: Article[] = [];

  constructor(private store: Store<AppState>) {
    this.overviewState = this.store.select(selectOverviewState);
    this.filterState = this.store.select(selectFilterState);
  }

  ngOnInit() {
    this.store.dispatch(getHighlights({filter: initialState as FilterRequestPayload}));
    this.overviewState.subscribe(({ highlights }) => {
      this.articles = highlights.data;
    });
    this.filterState.subscribe(this.onFilterChange);
  }

  onFilterChange = (filterState: FilterState) => {
    const filter = { ...filterState } as FilterRequestPayload;
    this.store.dispatch(getHighlights({ filter }));
  };
}
