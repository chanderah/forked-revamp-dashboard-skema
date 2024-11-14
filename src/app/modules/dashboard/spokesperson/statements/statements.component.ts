import { Component, Input } from '@angular/core';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Influencer, InfluencerQuotes } from '../../../../core/models/influencer.model';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { AppState } from '../../../../core/store';
import { FilterState, initialState } from '../../../../core/store/filter/filter.reducer';
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
import _ from 'lodash';

@Component({
  selector: 'app-statements',
  standalone: true,
  imports: [IconDialogueComponent, IconInfoComponent, ScrollerModule, CommonModule, ImgFallbackDirective, SpinnerComponent, RouterLink],
  templateUrl: './statements.component.html',
  styleUrl: './statements.component.scss',
})
export class StatementsComponent {
  filter: any;
  ngOnDestroy() {
    this.filter?.unsubscribe?.();
  }
  spokespersonState: Observable<SpokespersonState>;
  influencers: InfluencerQuotes[] = [];
  isLoading: boolean = false;
  selectedMedia: number | null = null;
  selectedInfluencer: string | null = null;
  total: number = 0;

  @Input() influencer: any;
  @Input() media: any;

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
    this.isLoading = true;
    this.influencerService
      .getSpokepersonQuotes({ ...filter, max_size: '20' })
      // @ts-ignore
      .subscribe(({ data, meta }) => {
        this.influencers = data;
        this.total = meta.total_data;
      })
      .add(() => {
        this.isLoading = false;
      });
  };

  ngOnInit() {
    this.filter = this.filterService.subscribe((filter) => {
      if (this.selectedInfluencer && this.selectedMedia) {
        this.fetchData({
          ...filter,
          media_id: this.selectedMedia!,
          spokeperson_name: this.selectedInfluencer!,
        });
      }
    });
  }

  ngOnChanges(changes: any) {
    const { influencer, media } = changes;
    if (media && !media.firstChange && !_.isEqual(media.currentValue, media.previousValue)) {
      this.selectedMedia = media.currentValue;
      this.fetchData({
        ...this.filterService.filter,
        media_id: media?.currentValue,
        spokeperson_name: this.selectedInfluencer ?? undefined,
      });
    }

    if (influencer && !influencer.firstChange && !_.isEqual(influencer.currentValue, influencer.previousValue)) {
      this.selectedInfluencer = influencer.currentValue;
      this.fetchData({
        ...this.filterService.filter,
        spokeperson_name: influencer?.currentValue,
        media_id: this.selectedMedia ?? undefined,
      });
    }
  }

  // onLazyLoad(event: any) {
  //   const h =
  //     event.target.scrollHeight -
  //     event.target.scrollTop -
  //     event.target.clientHeight;

  //   if (h === 0) {
  //     if (this.influencers.length >= this.total) return;
  //     this.fetchData({ ...this.filterService.filter, page: this.page });
  //   }
  // }
}
