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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCachedFetch<Fetcher extends (...args: any) => Promise<any>>(
  key: string,
  fetcher: Fetcher
) {
  const [cache, setCache] = useState<Record<string, CacheEntry<Awaited<ReturnType<Fetcher>>>>>({});

  useEffect(() => {
    let isActive = true;

    const doFetch = makeDebouncer(300, async () => {
      if (!isActive) {
        return;
      }

      if (cache[key] && cache[key].data) {
        return;
      }

      setCache({
        ...cache,
        [key]: {
          ...cache[key],
          status: "pending",
        }
      });

      const result = await fetcher();
      
      if (!isActive) {
        return;
      }

      setCache({
        ...cache,
        [key]: {
          status: "idle",
          data: result
        }
      });

    });

    doFetch();
    
    return () => {
      isActive = false;
    }
  // Explicitly excluding cache to prevent infinite render loop
  // in consuming component  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, key]);

  if (!cache[key]) {
    return { data: undefined, status: "idle" }
  }

  return cache[key];
}