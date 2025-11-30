import { useEffect, useState } from "react";

/**
 * Custome Hook for Debouncing
 * @param {any} Value - Value to be debounce.
 * @param {number} Delay - Delay in milliseconds.
 * @returns {any} Debounced Value.
 */

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    let debounce = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 1000);
    return () => {
      clearTimeout(debounce);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
