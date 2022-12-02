import { useState } from 'react';
import { IPaginationFilter } from '../interfaces';
import { defaultPaginationFilter } from '../utils';

const usePagination = (initPaginationFilter?: IPaginationFilter) => {
  const [paginationFilter, setPaginationFilter] = useState<IPaginationFilter>(
    initPaginationFilter ?? defaultPaginationFilter
  );

  const onPageChange = (page: number, pageSize: number) => {
    setPaginationFilter({
      ...paginationFilter,
      pageIndex: page - 1,
      pageSize,
    });
  };

  const onSearch = (value: string) => {
    setPaginationFilter({
      ...paginationFilter,
      search: value.trim(),
    });
  };

  return {
    paginationFilter,
    onPageChange,
    onSearch,
  };
};

export default usePagination;
