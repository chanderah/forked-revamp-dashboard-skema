export interface Location {
  key: string;
  value: number;
  percentage?: number;
}

export interface TopLocation {
  location: Location[];
  total_article: 351;
  total_top_location_article: 213;
}

export interface AllCount {
  top_location: TopLocation;
  data: Location[];
}
