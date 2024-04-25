import { Component } from '@angular/core';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  Influencer,
  InfluencerQuotes,
} from '../../../../core/models/influencer.model';
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
import { IconDialogueComponent } from '../../../../core/components/icons/dialogue/dialogue.component';
import { FilterService } from '../../../../core/services/filter.service';
import { InfluencerService } from '../../../../core/services/influencer.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-statements',
  standalone: true,
  imports: [
    IconDialogueComponent,
    IconInfoComponent,
    ScrollerModule,
    CommonModule,
    ImgFallbackDirective,
    SpinnerComponent,
    RouterLink
  ],
  templateUrl: './statements.component.html',
  styleUrl: './statements.component.scss',
})
export class StatementsComponent {
  spokespersonState: Observable<SpokespersonState>;
  influencer: InfluencerQuotes[] = [];
  isLoading: boolean = false;
  selectedMedia: number | null = null;
  selectedInfluencer: string | null = null;

  constructor(
    private store: Store<AppState>,
    private filterService: FilterService,
    private influencerService: InfluencerService
  ) {
    this.spokespersonState = this.store.select(selectSpokespersonState);
  }

  fetchData = (
    filter: FilterRequestPayload & {
      media_id?: number;
      spokeperson_name?: string;
    }
  ) => {
    if (!filter.media_id || !filter.spokeperson_name) return;
    this.isLoading = true;
    this.influencerService
      .getSpokepersonQuotes({ ...filter, max_size: '20' })
      .subscribe(({ data }) => {
        this.influencer = data;
      })
      .add(() => {
        this.isLoading = false;
      });
  };

  ngOnInit() {
    this.filterService.subscribe((filter) => {
      this.fetchData({
        ...filter,
        media_id: this.selectedMedia!,
        spokeperson_name: this.selectedInfluencer!,
      });
    });
    this.spokespersonState.subscribe((data) => {
      this.selectedInfluencer = data.selectedInfluencer
      this.selectedMedia = data.selectedMedia
      this.fetchData({
        ...this.filterService.filter,
        media_id: data.selectedMedia!,
        spokeperson_name: data.selectedInfluencer!,
      });
    });
  }
}
