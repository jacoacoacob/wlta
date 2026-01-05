import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeDebouncer<Callback extends (...args: any) => any>(
  delay: number,
  callback: Callback
) {
  let handle: number;

  return () => {
    clearTimeout(handle);
    handle = setTimeout(callback, delay);
  }
}

interface CacheEntry<Data> {
  status: "idle" | "pending";
  data: Data | undefined;
}

export function useCachedFetcher<Data>(query: string) {
  const [cache, setCache] = useState<Record<string, CacheEntry<Data>>>({});
  const [visitedQueries, setVisitedQueries] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isActive = true;

    const doFetch = makeDebouncer(300, async () => {
      if (!isActive) {
        return;
      }

      if (visitedQueries[query]) {
        return;
      }

      setCache({
        ...cache,
        [query]: {
          ...cache[query],
          status: "pending",
        }
      });
      
      const response = await fetch(query);

      const data = await response.json();
      
      if (!isActive) {
        return;
      }
      
      await new Promise((resolve) => setTimeout(resolve, 100));

      setCache({
        ...cache,
        [query]: {
          status: "idle",
          data: data as CacheEntry<Data>["data"]
        }
      });

      setVisitedQueries({
        ...visitedQueries,
        [query]: true,
      });

    });

    doFetch();
    
    return () => {
      isActive = false;
    }
  // Explicitly excluding cache to prevent infinite render loop
  // in consuming component  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, visitedQueries]);

  if (!cache[query]) {
    return { data: undefined, status: "idle" }
  }

  return cache[query];
}