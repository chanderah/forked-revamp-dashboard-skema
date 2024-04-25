export interface InfluencerResponse extends InfluencerResponseMetadata {
  data: Influencer[];
}

export interface InfluencerCountResponse extends InfluencerResponseMetadata {
  data: InfluencerCount[];
}

export interface Influencer {
  article_id: number;
  category_id: string[];
  date: string;
  influencer_name: string;
  media: string;
  media_id: number;
  pc_name: string;
  quotes: string;
  tone: number;
}

export interface InfluencerCount {
  doc_count: number;
  image_url: string;
  spokesperson_name: string;
}

export interface Count {
  all: number;
  negative: number;
  netral: number;
  positive: number;
}

export interface InfluencerResponseMetadata {
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  result: string;
}

export interface SpokepersonAlias {
  aliases: string[];
  image: string;
  influencer: string;
}

export interface MediaShare {
  doc_count: number;
  media_id: number;
  media_name: string;
}

export interface InfluencerQuotes {
  article_id: number;
  spokesperson_name: string;
  quotes: string;
  date_time: string;
  media_name: string;
  tone: number;
  image_url: string;
}
