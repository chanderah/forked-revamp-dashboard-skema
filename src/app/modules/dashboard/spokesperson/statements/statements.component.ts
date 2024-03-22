import { Component } from '@angular/core';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Influencer } from '../../../../core/models/influencer.model';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { AppState } from '../../../../core/store';
import {
  FilterState,
  initialState,
} from '../../../../core/store/filter/filter.reducer';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';
import { getInfluencer } from '../../../../core/store/spokesperson/spokesperson.actions';
import { SpokespersonState } from '../../../../core/store/spokesperson/spokesperson.reducer';
import { selectSpokespersonState } from '../../../../core/store/spokesperson/spokesperson.selectors';
import { ScrollerModule } from 'primeng/scroller';
import { CommonModule } from '@angular/common';
import { ImgFallbackDirective } from '../../../../core/directive/img-fallback.directive';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';

@Component({
  selector: 'app-statements',
  standalone: true,
  imports: [
    IconNewspaperComponent,
    IconInfoComponent,
    ScrollerModule,
    CommonModule,
    ImgFallbackDirective,
    SpinnerComponent,
  ],
  templateUrl: './statements.component.html',
  styleUrl: './statements.component.scss',
})
export class StatementsComponent {
  spokespersonState: Observable<SpokespersonState>;
  filterState: Observable<FilterState>;
  influencer: Influencer[] = [];
  isLoading: boolean = false;

  constructor(private store: Store<AppState>) {
    this.spokespersonState = this.store.select(selectSpokespersonState);
    this.filterState = this.store.select(selectFilterState);
  }

  ngOnInit() {
    this.store.dispatch(
      getInfluencer({ filter: initialState as FilterRequestPayload })
    );
    this.spokespersonState.subscribe(({ influencer }) => {
      this.isLoading = influencer.isLoading;
      this.influencer = influencer.data;
    });
    this.filterState.subscribe(this.onFilterChange);
  }

  onFilterChange = (filterState: FilterState) => {
    const filter = { ...filterState } as FilterRequestPayload;
    this.store.dispatch(getInfluencer({ filter }));
  };
}
