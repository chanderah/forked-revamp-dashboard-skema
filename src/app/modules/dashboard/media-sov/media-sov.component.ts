import { Component } from '@angular/core';
import { MediaNameComponent } from './media-name/media-name.component';
import { LatestNewsComponent } from './latest-news/latest-news.component';
import { StatementsComponent } from './statements/statements.component';
import { SentimentComponent } from './sentiment/sentiment.component';

@Component({
  selector: 'app-media-sov',
  standalone: true,
  imports: [
    MediaNameComponent,
    LatestNewsComponent,
    StatementsComponent,
    SentimentComponent,
  ],
  templateUrl: './media-sov.component.html',
  styleUrl: './media-sov.component.scss',
})
export class MediaSOVComponent {}
