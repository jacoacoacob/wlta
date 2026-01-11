import { useEffect, useState } from "react";
import { isNumber } from "~/utils";

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

export interface CacheEntry<Data> {
  status: "idle" | "pending";
  data: Data | undefined;
}

const DEFAULT_DEBOUNCE = 200;
const DEFAULT_EXPIRY = 30_000;

interface UseCachedFetcherOptions {
  /**
   * How long (in milliseconds) to after the last change to `url` before initiating fetch. Defaults to {@link DEFAULT_DEBOUNCE} (0.2 seconds)
   */
  debounce?: number;
  /**
   * How long (in milliseconds) a cached response will remain fresh in cache. Defaults to {@link DEFAULT_EXPIRY} (30 seconds)
   */
  expiry?: number;
}

export function useCachedFetcher<Data>(
  url: string,
  options?: UseCachedFetcherOptions
) {
  const {
    debounce = DEFAULT_DEBOUNCE,
    expiry = DEFAULT_EXPIRY,
  } = options ?? {};

  const [cache, setCache] = useState<Record<string, CacheEntry<Data>>>({});
  const [visitedQueries, setVisitedQueries] = useState<Record<string, number>>({});

  useEffect(() => {
    let isActive = true;

    const doFetch = makeDebouncer(debounce, async () => {
      if (!isActive) {
        return;
      }

      if (
        isNumber(visitedQueries[url]) &&
        visitedQueries[url] + expiry > Date.now()
      ) {
        return;
      }

      setCache({
        ...cache,
        [url]: {
          ...cache[url],
          status: "pending",
        }
      });
      
      const response = await fetch(url);

      const data = await response.json();
      
      if (!isActive) {
        return;
      }

      setCache({
        ...cache,
        [url]: {
          status: "idle",
          data: data as CacheEntry<Data>["data"]
        }
      });

      setVisitedQueries({ ...visitedQueries, [url]: Date.now() });

    });

    doFetch();
    
    return () => {
      isActive = false;
    }
  // Explicitly excluding cache to prevent infinite render loop
  // in consuming component  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, visitedQueries]);

  if (!cache[url]) {
    return { data: undefined, status: "idle" }
  }

  return cache[url];
}
