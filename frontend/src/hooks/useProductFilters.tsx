import { useMemo } from "react";
import { useSearchParams } from "react-router";

type ProductFilters = {
  search: string;
  categoryId: string;
  setSearch: (value: string) => void;
  setCategoryId: (value: string | number | null | undefined) => void;
};

export function useProductFilters(): ProductFilters {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("category") ?? "";

  const setSearch = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value) next.delete("search");
      else next.set("search", value);
      return next;
    });
  };

  const setCategoryId = (value: string | number | null | undefined) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value) next.delete("category");
      else next.set("category", String(value));
      return next;
    });
  };

  return useMemo(
    () => ({ search, categoryId, setSearch, setCategoryId }),
    [search, categoryId],
  );
}
