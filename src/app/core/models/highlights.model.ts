import { Article } from './article.model';

export interface HighlightsResponse {
  code: number;
  message: string;
  data: Article[];
}
