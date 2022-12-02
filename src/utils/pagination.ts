import { IPaginationFilter } from '../interfaces';

export const DEFAULT_PAGE_SIZE = [10, 20, 50, 100, 200];

export const defaultPaginationFilter: IPaginationFilter = {
  pageIndex: 0,
  pageSize: DEFAULT_PAGE_SIZE[0],
  search: '',
};

export const generatePaginationFilterQuery = (
  paginationFilter: IPaginationFilter
) => {
  let query = `pageIndex=${paginationFilter.pageIndex}`;
  if (paginationFilter.pageSize) {
    query = `${query}&pageSize=${paginationFilter.pageSize}`;
  }

  if (paginationFilter.search) {
    query = `${query}&search=${paginationFilter.search}`;
  }
  return query;
};
