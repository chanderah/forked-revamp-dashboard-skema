import { Bucket } from './tone.model';

export interface MediaVisibility {
  category_id_per_day: {
    buckets: Bucket[];
  };
  doc_count: number;
  key: string;
}

export interface MediaVisibilityResponse {
  code: number;
  message: string;
  data: MediaVisibility[];
}
