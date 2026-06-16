import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Quản lý cursor pagination state + fetch data tự động.
 *
 * @param {function} fetchFn   — async function nhận params, trả về { items, pagination }
 * @param {object}   options
 * @param {object}   options.initialParams — params mặc định (filter, search, sort...)
 * @param {boolean}  options.immediate     — fetch ngay khi mount (mặc định true)
 *
 * @example
 * const { data, pagination, loading, error, params, setParams, goNext, goPrevious, refetch }
 *   = usePagination(orderService.getOrders);
 */
export function usePagination(
  fetchFn,
  { initialParams = {}, immediate = true } = {},
) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  // cursor hiện tại + stack lịch sử để Previous
  const [cursor, setCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([null]);

  const isMounted = useRef(false);
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const fetchData = useCallback(async (fetchCursor, fetchParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFnRef.current({
        cursor: fetchCursor ?? undefined,
        ...fetchParams,
      });

      // API shape: { data: { items, pagination: { next_cursor, prev_cursor, has_more, per_page } } }
      setData(res.data.items ?? []);
      setPagination(res.data.pagination ?? null);
    } catch (err) {
      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch khi cursor hoặc params thay đổi
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      if (!immediate) return;
    }
    fetchData(cursor, params);
  }, [cursor, params, fetchData]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Navigation ────────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    if (!pagination?.next_cursor) return;
    setCursorHistory((prev) => [...prev, pagination.next_cursor]);
    setCursor(pagination.next_cursor);
  }, [pagination]);

  const goPrevious = useCallback(() => {
    setCursorHistory((prev) => {
      if (prev.length <= 1) return prev; // đã ở trang đầu
      const next = prev.slice(0, -1);
      setCursor(next[next.length - 1]);
      return next;
    });
  }, []);

  const canGoPrevious = cursorHistory.length > 1;
  const canGoNext = !!pagination?.has_more;

  // ── Params ────────────────────────────────────────────────────────────────

  // Đổi filter/search → reset về trang đầu (cursor = null)
  const setParamsAndReset = useCallback((newParams) => {
    setCursor(null);
    setCursorHistory([null]);
    setParams((prev) =>
      typeof newParams === "function"
        ? newParams(prev)
        : { ...prev, ...newParams },
    );
  }, []);

  const refetch = useCallback(() => {
    fetchData(cursor, params);
  }, [fetchData, cursor, params]);

  return {
    data, // items[]
    pagination, // { per_page, has_more, next_cursor, prev_cursor }
    loading,
    error,
    params,
    setParams: setParamsAndReset,
    goNext,
    goPrevious,
    canGoNext,
    canGoPrevious,
    refetch,
  };
}
