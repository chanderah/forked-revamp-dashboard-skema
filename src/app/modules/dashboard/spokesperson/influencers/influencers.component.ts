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
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { InfluencerCount } from '../../../../core/models/influencer.model';
import { ScrollerModule } from 'primeng/scroller';
import { CommonModule } from '@angular/common';
import { ImgFallbackDirective } from '../../../../core/directive/img-fallback.directive';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { IconMicComponent } from '../../../../core/components/icons/mic/mic.component';
import { FilterService } from '../../../../core/services/filter.service';
import { InfluencerService } from '../../../../core/services/influencer.service';
import { setInfluencer } from '../../../../core/store/spokesperson/spokesperson.actions';

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

  selectedInfluencer: InfluencerCount | null = null;

  constructor(
    private store: Store<AppState>,
    private filterService: FilterService,
    private influencerService: InfluencerService
  ) {
    this.spokespersonState = this.store.select(selectSpokespersonState);
    this.filterState = this.store.select(selectFilterState);
  }

  fetchData = (filter: FilterRequestPayload) => {
    this.isLoading = true;
    this.influencerService
      .getSpokepersons(filter)
      .subscribe(({ data }) => {
        this.influencerCount = data;
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

  onClick(selectedInfluencer: InfluencerCount) {
    this.selectedInfluencer = selectedInfluencer;
    this.store.dispatch(
      setInfluencer({ influencer: selectedInfluencer.spokesperson_name })
    );
  }
}
