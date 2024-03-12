export interface FilterRequestPayload {
  start_date: string;
  date_type: string;
  end_date: string;
  category_id?: string;
  category_set?: number;
  media_id?: string;
  user_media_type_id?: number;
}
 
