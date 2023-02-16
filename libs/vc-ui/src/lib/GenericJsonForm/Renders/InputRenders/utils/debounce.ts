/**
 * Based on
 * https://github.com/eclipsesource/jsonforms/blob/6a6af7e7aca7e44c7ba745edb8611f0b7d7acd77/packages/material/src/util/debounce.ts
 */
import debounce from 'lodash/debounce';
import { useState, useCallback, useEffect } from 'react'


const eventToValue = (ev: React.ChangeEvent<HTMLInputElement>): string => ev.target.value;
export const useDebouncedChange = (handleChange: (path: string, value: any) => void, defaultValue: any, data: any, path: string, eventToValueFunction: (ev: any) => string = eventToValue, timeout = 300): [any, React.ChangeEventHandler, () => void] => {
  const [input, setInput] = useState(data ?? defaultValue);
  useEffect(() => {
    setInput(data ?? defaultValue);
  }, [data]);
  const debouncedUpdate = useCallback(debounce((newValue: string) => handleChange(path, newValue), timeout), [handleChange, path, timeout]);
  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = eventToValueFunction(ev);
    const setValue: string = newValue === '' || newValue.trim() === '' ? defaultValue : newValue;
    setInput(setValue);
    debouncedUpdate(setValue);
  }, [debouncedUpdate, eventToValueFunction]);
  const onClear = useCallback(() => { setInput(defaultValue); handleChange(path, undefined) }, [defaultValue, handleChange, path]);
  return [input, onChange, onClear];
};
