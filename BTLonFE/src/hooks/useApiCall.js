import { useCallback, useState } from "react";

export function useApiCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiFn) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFn();
      return res;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { execute, loading, error, reset };
}
