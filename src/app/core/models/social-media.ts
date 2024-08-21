export interface RequestGetChart {
  type: ChartType;
  startDate: string;
  endDate: string;
}

export interface ResponseGetChart {
  [x: string]: any;
}

export type ChartType =
  | 'number-of-mentions'
  | 'share-of-sentiment'
  | 'share-of-platform'
  | 'tagcloud'
  | 'engaging-authors'
  | 'hashtag-cloud'
  | 'key-hashtags'
  | 'engaging-posts'
  | 'emotion-map'
  | 'social-network-analysis'
  | 'authors'
  | 'daily-facebook-reactions'
  | 'web-opinion-index-and-number-of-mentions'
  | 'reach-frequency'
  | 'pages';
