export interface WordCloudResponse {
  data: WordCloud[];
  message: string;
  code: number;
}

export interface WordCloud {
  name: string;
  weight: number;
}
