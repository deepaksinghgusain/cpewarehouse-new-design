import type { Config } from 'tailwindcss';

const config: Config = {
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                // sm: "640px",
                // md: "768px",
                // lg: "1024px",
                // xl: "1200px",
            },
        },
        extend: {
            colors: {
                // Ensure colors don't use unsupported lab() syntax
                // Using standard CSS color formats
            },
        },
    },
};

export default config;