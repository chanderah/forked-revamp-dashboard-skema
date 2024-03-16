export interface Bucket {
  key_as_string: string;
  key: number;
  doc_count: number;
}

export interface TonePerDay {
  buckets: Bucket[];
}

export interface ChartBar {
  key: number;
  doc_count: number;
  tone_per_day: TonePerDay;
}

export interface Tones {
  chart_bar: ChartBar[];
}

export interface TonesResponse {
  code: number;
  message: string;
  data: Tones;
}
