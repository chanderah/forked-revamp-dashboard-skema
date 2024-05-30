import { Component } from '@angular/core';
import { InfluencersComponent } from './influencers/influencers.component';
import { LatestNewsComponent } from './latest-news/latest-news.component';
import { StatementsComponent } from './statements/statements.component';
import { MediaShareComponent } from './media-share/media-share.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store';
import {
  clearInfluencer,
  clearMedia,
  setMedia,
} from '../../../core/store/spokesperson/spokesperson.actions';

@Component({
  selector: 'app-spokesperson',
  standalone: true,
  imports: [
    InfluencersComponent,
    LatestNewsComponent,
    StatementsComponent,
    MediaShareComponent,
  ],
  templateUrl: './spokesperson.component.html',
  styleUrl: './spokesperson.component.scss',
})
export class SpokespersonComponent {
  constructor(private store: Store<AppState>) {}
  ngOnDestroy(): void {
    this.store.dispatch(clearInfluencer());
    this.store.dispatch(clearMedia());
  }
}
