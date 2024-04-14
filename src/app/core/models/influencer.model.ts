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
  count: Count;
  image: string;
  influencer_name: string;
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
