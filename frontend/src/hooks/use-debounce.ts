import { useEffect, useState } from 'react'

function useDebounce<T>(value: T, delay: number = 1000): T {
    const [debounceValue, setDebounceValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log(value)
            setDebounceValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        }
    }, [value, delay]);

    return debounceValue;
}

export default useDebounce