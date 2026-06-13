import { useEffect, useState } from "react";
/**
 * Trì hoãn cập nhật value cho đến khi user ngừng gõ.
 * Dùng cho search input để tránh gọi API mỗi keystroke.
 *
 * @param {*} value  — giá trị cần debounce (thường là search query)
 * @param {number} delay  — thời gian chờ tính bằng ms (mặc định 500ms)
 * @returns debounced value
 *
 * @example
 * const [query, setQuery] = useState("");
 * const debouncedQuery = useDebounce(query, 500);
 *
 * useEffect(() => {
 *   if (debouncedQuery) fetchProducts(debouncedQuery);
 * }, [debouncedQuery]);
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
