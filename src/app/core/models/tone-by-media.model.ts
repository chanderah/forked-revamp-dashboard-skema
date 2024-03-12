export interface Tone {
  positive?: number;
  negative?: number;
  neutral?: number;
  'media favorability index'?: number;
}

export interface ToneByMedia {
  media_id: number;
  media_name: string;
  tones: Tone[];
}

export interface ToneByMediaResponse {
  code: number;
  message: string;
  data: ToneByMedia[];
}
