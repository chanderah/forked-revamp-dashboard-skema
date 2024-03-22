import { Component } from '@angular/core';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { selectSpokespersonState } from '../../../../core/store/spokesperson/spokesperson.selectors';
import { AppState } from '../../../../core/store';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  FilterState,
  initialState,
} from '../../../../core/store/filter/filter.reducer';
import { SpokespersonState } from '../../../../core/store/spokesperson/spokesperson.reducer';
import { getInfluencerCount } from '../../../../core/store/spokesperson/spokesperson.actions';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { InfluencerCount } from '../../../../core/models/influencer.model';
import { ScrollerModule } from 'primeng/scroller';
import { CommonModule } from '@angular/common';
import { ImgFallbackDirective } from '../../../../core/directive/img-fallback.directive';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { IconMicComponent } from '../../../../core/components/icons/mic/mic.component';

@Component({
  selector: 'app-influencers',
  standalone: true,
  imports: [
    IconMicComponent,
    IconInfoComponent,
    ScrollerModule,
    CommonModule,
    ImgFallbackDirective,
    SpinnerComponent,
  ],
  templateUrl: './influencers.component.html',
  styleUrl: './influencers.component.scss',
})
export class InfluencersComponent {
  spokespersonState: Observable<SpokespersonState>;
  filterState: Observable<FilterState>;
  influencerCount: InfluencerCount[] = [];
  isLoading: boolean = false;

  constructor(private store: Store<AppState>) {
    this.spokespersonState = this.store.select(selectSpokespersonState);
    this.filterState = this.store.select(selectFilterState);
  }

  ngOnInit() {
    this.store.dispatch(
      getInfluencerCount({ filter: initialState as FilterRequestPayload })
    );
    this.spokespersonState.subscribe(({ influencerCount }) => {
      this.isLoading = influencerCount.isLoading;
      this.influencerCount = influencerCount.data;
    });
    this.filterState.subscribe(this.onFilterChange);
  }

  onFilterChange = (filterState: FilterState) => {
    const filter = { ...filterState } as FilterRequestPayload;
    this.store.dispatch(getInfluencerCount({ filter }));
  };
}
