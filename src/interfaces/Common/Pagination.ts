export interface IPagination<T> {
  totalPages: number;
  pageSize: number;
  pageIndex: number;
  totalRows: number;
  hasNext: boolean;
  hasPrevious: boolean;
  data: T[];
}
