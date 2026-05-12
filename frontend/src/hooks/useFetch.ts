import { useState, useEffect } from 'react';
import client from '../api/client';
import { getStaticData } from '../api/staticData';

export function useFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) { setLoading(false); return; }
    setLoading(true);

    client.get(url)
      .then((res) => { setData(res.data); setError(null); })
      .catch(async () => {
        // Fall back to static data when API unavailable (GitHub Pages)
        try {
          const staticData = await getStaticData(url);
          if (staticData !== null) {
            setData(staticData as T);
            setError(null);
          } else {
            setError('Data not available');
          }
        } catch {
          setError('Failed to load data');
        }
      })
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
