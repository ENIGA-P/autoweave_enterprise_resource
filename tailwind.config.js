/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Pastel Primary Colors
                pastel: {
                    mint: {
                        50: '#F0FAF7',
                        100: '#E1F5EF',
                        200: '#C3EBE0',
                        300: '#A5E1D0',
                        400: '#87D7C1',
                        500: '#B8E6D5', // Main soft mint
                        600: '#93D1BA',
                        700: '#6EBC9F',
                    },
                    lavender: {
                        50: '#F9F7FC',
                        100: '#F3EFF9',
                        200: '#E7DFF3',
                        300: '#DBCFED',
                        400: '#CFBFE7',
                        500: '#E6D5F5', // Main pale lavender
                        600: '#C9B3E8',
                        700: '#AC91DB',
                    },
                    blue: {
                        50: '#F7FBFE',
                        100: '#EFF7FD',
                        200: '#DFEFFB',
                        300: '#CFE7F9',
                        400: '#BFDFF7',
                        500: '#D5E6F5', // Main powder blue
                        600: '#B3D1E8',
                        700: '#91BCDB',
                    },
                    coral: {
                        50: '#FEF9F9',
                        100: '#FDF3F3',
                        200: '#FBE7E7',
                        300: '#F9DBDB',
                        400: '#F7CFCF',
                        500: '#F5D5D5', // Main muted coral
                        600: '#E8B3B3',
                        700: '#DB9191',
                    },
                },
                // Soft Status Colors
                status: {
                    running: {
                        light: '#E8F5E9',
                        main: '#C8E6C9', // Gentle sage green
                        dark: '#A5D6A7',
                        text: '#2E7D32',
                    },
                    faulty: {
                        light: '#FFEBEE',
                        main: '#F5C6CB', // Dusty rose
                        dark: '#EF9A9A',
                        text: '#C62828',
                    },
                    warning: {
                        light: '#FFFBF0',
                        main: '#FFF4C6', // Pale gold
                        dark: '#FFE082',
                        text: '#F57C00',
                    },
                    idle: {
                        light: '#F3E5F5',
                        main: '#E1D5E7', // Soft lavender
                        dark: '#CE93D8',
                        text: '#6A1B9A',
                    },
                },
                // Text Colors
                text: {
                    primary: '#2C3E50', // Charcoal gray
                    secondary: '#546E7A',
                    muted: '#78909C',
                    navy: '#1A2332', // Deep navy
                },
                // Background Colors
                bg: {
                    primary: '#FFFFFF',
                    secondary: '#F8F9FA',
                    tertiary: '#F5F6F7',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
                'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.08)',
                'pastel': '0 2px 12px rgba(184, 230, 213, 0.15)',
            },
        },
    },
    plugins: [],
}
