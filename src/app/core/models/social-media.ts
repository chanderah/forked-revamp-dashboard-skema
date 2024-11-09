export interface RequestGetChart {
  type: ChartType;
  startDate: string;
  endDate: string;
}
export interface RequestGetChartMentions {
  start_date: string;
  end_date: string;
  page: number;
  size: number;
  keyword: string;
  platform?: string;
  author?: string;
  tag?: string;
  sources?: string;
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
  | 'reach-by-platform'
  | 'mention-graph'
  | 'pages';
