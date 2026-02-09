import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#C4161C",
                    light: "#E52521",
                    dark: "#A01217",
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#E52521",
                    foreground: "#ffffff",
                },
                accent: {
                    DEFAULT: "#F2A23A",
                    foreground: "#000000",
                },
                organic: "#2E6B3F",
                neutral: "#C89A6A",
                surface: "#F9F9F9",
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                heading: ['"Playfair Display"', 'serif'],
                body: ['Poppins', 'sans-serif'],
                sans: ['Poppins', 'sans-serif'],
            },
            boxShadow: {
                card: "0 4px 12px rgba(0, 0, 0, 0.08)",
            },
        },
    },
    plugins: [tailwindcssAnimate],
}
