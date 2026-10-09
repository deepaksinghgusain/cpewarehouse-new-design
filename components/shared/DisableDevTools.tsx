'use client';

import { useEffect } from 'react';

export default function DisableDevTools() {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // F12
            if (event.key === 'F12') {
                event.preventDefault();
            }

            // Ctrl + Shift + I / J / C
            if (
                event.ctrlKey &&
                event.shiftKey &&
                ['I', 'J', 'C'].includes(event.key.toUpperCase())
            ) {
                event.preventDefault();
            }

            // Disable Ctrl + C, X, V, P, U
            if (
                event.ctrlKey &&
                ['c', 'x', 'v', 'p', 'u'].includes(event.key.toLowerCase())
            ) {
                event.preventDefault();
            }

            // Ctrl + U (View Page Source)
            if (event.ctrlKey && event.key.toLowerCase() === 'u') {
                event.preventDefault();
            }
        };

        const handleContextMenu = (event: MouseEvent) => {
            event.preventDefault();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    return null;
}

