import { useMemo, useState } from "react";

type UsePaginationOptions = {
  initialPage?: number;
};

export function usePagination<T>(
  items: T[],
  pageSize: number,
  options?: UsePaginationOptions,
) {
  const [page, setPage] = useState(options?.initialPage ?? 1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginatedItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, pageSize, safePage],
  );

  const resetPage = () => setPage(1);
  const prevPage = () => setPage((current) => Math.max(1, current - 1));
  const nextPage = () => setPage((current) => Math.min(totalPages, current + 1));

  return {
    page,
    setPage,
    safePage,
    totalPages,
    paginatedItems,
    resetPage,
    prevPage,
    nextPage,
  };
}
