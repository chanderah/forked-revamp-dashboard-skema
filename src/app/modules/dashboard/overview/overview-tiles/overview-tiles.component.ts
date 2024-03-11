import { Component } from '@angular/core';
import { TileComponent } from '../../../../core/components/tile/tile.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/store';
import { selectOverviewState } from '../../../../core/store/overview/overview.selectors';
import { OverviewState } from '../../../../core/store/overview/overview.reducer';
import { Observable } from 'rxjs';
import { getMediaCount } from '../../../../core/store/overview/overview.actions';
import { CommonModule } from '@angular/common';
import {
  FilterState,
  initialState,
} from '../../../../core/store/filter/filter.reducer';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';
import { FilterRequestPayload } from '../../../../core/models/request.model';

interface MediaCountTiles {
  print: number;
  online: number;
  tv: number;
  total: number;
}
@Component({
  selector: 'app-overview-tiles',
  standalone: true,
  imports: [CommonModule, TileComponent],
  templateUrl: './overview-tiles.component.html',
  styleUrl: './overview-tiles.component.scss',
})
export class OverviewTilesComponent {
  overviewState: Observable<OverviewState>;
  filterState: Observable<FilterState>;
  mediaCount: MediaCountTiles = {
    online: 0,
    print: 0,
    total: 0,
    tv: 0,
  };

  constructor(private store: Store<AppState>) {
    this.overviewState = this.store.select(selectOverviewState);
    this.filterState = this.store.select(selectFilterState);
  }

  ngOnInit() {
    this.store.dispatch(
      getMediaCount({ filter: initialState as FilterRequestPayload })
    );
    this.filterState.subscribe(this.onFilterStateChanges);
    this.overviewState.subscribe(this.onOverviewStateChanges);
  }

  onFilterStateChanges = (filterState: FilterState) => {
    const filter = { ...filterState } as FilterRequestPayload;
    this.store.dispatch(getMediaCount({ filter }));
  };

  onOverviewStateChanges = ({ mediaCount }: OverviewState) => {
    const mediaCountTmp = { ...this.mediaCount };
    mediaCount.data.forEach((media) => {
      if (media.label === 'Print') mediaCountTmp.print = media.total ?? 0;
      if (media.label === 'Online') mediaCountTmp.online = media.total ?? 0;
      if (media.label === 'TV') mediaCountTmp.tv = media.total ?? 0;
    });
    mediaCountTmp.total =
      mediaCountTmp.print + mediaCountTmp.online + mediaCountTmp.tv;

    this.mediaCount = mediaCountTmp;
  };
}
