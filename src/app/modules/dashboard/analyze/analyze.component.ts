import { Component } from '@angular/core';
import { LatestNewsComponent } from './latest-news/latest-news.component';
import { MediaSentimentComponent } from './media-sentiment/media-sentiment.component';
import { FeaturedNewsComponent } from './featured-news/featured-news.component';
import { TopIssueComponent } from './top-issue/top-issue.component';

@Component({
  selector: 'app-analyze',
  standalone: true,
  imports: [LatestNewsComponent, MediaSentimentComponent, FeaturedNewsComponent, TopIssueComponent],
  templateUrl: './analyze.component.html',
  styleUrl: './analyze.component.scss',
})
export class AnalyzeComponent {
  filter: any;
  ngOnDestroy() {
    this.filter?.unsubscribe?.();
  }
}
