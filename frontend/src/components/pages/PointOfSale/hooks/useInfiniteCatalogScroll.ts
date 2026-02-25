import { useEffect, useRef } from "react";

type UseInfiniteCatalogScrollParams = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
  itemCount: number;
};

export function useInfiniteCatalogScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  itemCount,
}: UseInfiniteCatalogScrollParams) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const hasUserScrolledRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      hasUserScrolledRef.current = true;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting || isFetchingNextPage) return;
        if (!hasUserScrolledRef.current) return;
        void fetchNextPage();
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, itemCount]);

  return { loadMoreRef };
}
