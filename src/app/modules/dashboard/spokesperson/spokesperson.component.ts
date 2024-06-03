import { Component } from '@angular/core';
import { InfluencersComponent } from './influencers/influencers.component';
import { LatestNewsComponent } from './latest-news/latest-news.component';
import { StatementsComponent } from './statements/statements.component';
import { MediaShareComponent } from './media-share/media-share.component';

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
  influencer: any = null;
  media: any = null;

  setInfluencer = (influencer: any) => {
    this.influencer = influencer;
  };

  setMedia = (media: any) => {
    this.media = media;
  };
}
