import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') {
        return 'dark';
    }

    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
        return saved;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
}

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    function toggleTheme(): void {
        setTheme((current) => {
            const next: Theme = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', next);
            return next;
        });
    }

    return { theme, toggleTheme };
}
