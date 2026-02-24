import { useCallback } from "react";
import { useSearchParams } from "react-router";

/**
 * Allowed values for query params
 */
type QueryValue = string | number | boolean | null | undefined;

/**
 * Object shape for updates
 */
export type QueryUpdates = Record<string, QueryValue>;

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = useCallback(
    (updates: QueryUpdates) => {
      const next = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        // remove param if empty
        if (value === null || value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value)); // always stored as string in URL
        }
      });

      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  /**
   * Helper getter (typed)
   */
  const getParam = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams],
  );

  return {
    searchParams,
    setParams,
    getParam,
  };
}
