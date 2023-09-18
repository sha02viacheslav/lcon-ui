export interface Filter {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: string;
  archived?: boolean;
  start?: string;
  end?: string;
  rawWhere?: string;
}
