import { useQueryParams } from "@/hooks/useQueryParams";
import { useRef } from "react";
import { useParams } from "react-router";

function isElementFocused(el: HTMLElement | null): boolean {
  if (!el) return false;
  return document.activeElement === el;
}

export function useProductSelectionFilters() {
  const { branchId: branchIdParam } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchParams, getParam, setParams } = useQueryParams();

  const search = getParam("search") ?? "";
  const branchId =
    branchIdParam && !Number.isNaN(Number(branchIdParam))
      ? Number(branchIdParam)
      : null;

  const rawCategoryId = getParam("categoryId");
  const categoryId =
    rawCategoryId && !Number.isNaN(Number(rawCategoryId))
      ? Number(rawCategoryId)
      : null;

  const handleSearch = (value: string) => {
    const nextSearch = value.trim();
    if (
      !nextSearch &&
      isElementFocused(inputRef.current) &&
      searchParams.has("search")
    ) {
      setParams({ search: null });
      return;
    }

    setParams({ search: nextSearch || null });
  };

  return {
    inputRef,
    search,
    branchId,
    categoryId,
    handleSearch,
  };
}
