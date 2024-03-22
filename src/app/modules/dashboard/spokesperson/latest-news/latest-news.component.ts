import { Component } from '@angular/core';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { CommonModule } from '@angular/common';
import { ImgFallbackDirective } from '../../../../core/directive/img-fallback.directive';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { AppState } from '../../../../core/store';
import {
  FilterState,
  initialState,
} from '../../../../core/store/filter/filter.reducer';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';
import { getLatestNews } from '../../../../core/store/spokesperson/spokesperson.actions';
import { SpokespersonState } from '../../../../core/store/spokesperson/spokesperson.reducer';
import { selectSpokespersonState } from '../../../../core/store/spokesperson/spokesperson.selectors';
import { Article } from '../../../../core/models/article.model';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';

@Component({
  selector: 'app-latest-news',
  standalone: true,
  imports: [
    IconNewspaperComponent,
    IconInfoComponent,
    CommonModule,
    ImgFallbackDirective,
    SpinnerComponent
  ],
  templateUrl: './latest-news.component.html',
  styleUrl: './latest-news.component.scss',
})
export class LatestNewsComponent {
  spokespersonState: Observable<SpokespersonState>;
  filterState: Observable<FilterState>;
  articles: Article[] = [];
  isLoading: boolean = false;

  constructor(private store: Store<AppState>) {
    this.spokespersonState = this.store.select(selectSpokespersonState);
    this.filterState = this.store.select(selectFilterState);
  }

  ngOnInit() {
    this.store.dispatch(
      getLatestNews({ filter: initialState as FilterRequestPayload })
    );
    this.spokespersonState.subscribe(({ latestNews }) => {
      this.isLoading = latestNews.isLoading;
      this.articles = latestNews.data.slice(0, 6);
    });
    this.filterState.subscribe(this.onFilterChange);
  }

  onFilterChange = (filterState: FilterState) => {
    const filter = { ...filterState } as FilterRequestPayload;
    this.store.dispatch(getLatestNews({ filter }));
  };
}
