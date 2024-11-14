export interface Tone {
  positive?: number;
  negative?: number;
  neutral?: number;
}

export interface ToneByCategory {
  category_id: string;
  tones: Tone[];
}

export interface ToneByCategoryResponse {
  code: number;
  message: string;
  data: ToneByCategory[];
}
