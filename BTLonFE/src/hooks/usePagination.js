import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Quản lý pagination state + fetch data tự động.
 *
 * @param {function} fetchFn   — async function nhận params, trả về { items, pagination }
 * @param {object}   options
 * @param {object}   options.initialParams  — params mặc định (filter, search, sort...)
 * @param {number}   options.initialPage    — trang bắt đầu (mặc định 1)
 * @param {boolean}  options.immediate      — fetch ngay khi mount (mặc định true)
 *
 * @example
 * const { data, pagination, loading, error, page, setPage, setParams, refetch }
 *   = usePagination(productService.list);
 */
export function usePagination(
  fetchFn,
  { initialParams = {}, initialPage = 1, immediate = true } = {},
) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [params, setParams] = useState(initialParams);

  const isMounted = useRef(false);

  const fetchData = useCallback(
    async (fetchPage, fetchParams) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchFn({ page: fetchPage, ...fetchParams });
        // API shape: { data: { items, pagination } }
        setData(res.data.items ?? []);
        setPagination(res.data.pagination ?? null);
      } catch (err) {
        setError(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn],
  );

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      if (!immediate) return;
    }
    fetchData(page, params);
  }, [page, params, fetchData]); // eslint-disable-line react-hooks/exhaustive-deps

  const setParamsAndReset = useCallback((newParams) => {
    setPage(1);
    setParams((prev) =>
      typeof newParams === "function"
        ? newParams(prev)
        : { ...prev, ...newParams },
    );
  }, []);

  const refetch = useCallback(() => {
    fetchData(page, params);
  }, [fetchData, page, params]);

  return {
    data, // items[]
    pagination, // { total, per_page, current_page, last_page, firstItem, lastItem }
    loading,
    error,
    page,
    setPage,
    params,
    setParams: setParamsAndReset,
    refetch,
  };
}
