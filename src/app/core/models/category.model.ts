export interface Category {
  category_set: number;
  category_id: string;
  client_id: string;
  descriptionz: string;
  input_data_date: string;
  pc_name: string;
  usere: string;
}

export interface CategoryResponse {
  count: number;
  next: string;
  previous: string;
  results: Category[];
}

export interface CategoryChosen {
  category_id: string;
  chosen: boolean;
}
