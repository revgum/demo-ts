/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // all directories and extensions will correspond to your Nuxt config
    'src/components/**/*.{vue,js,jsx,mjs,ts,tsx}',
    'src/layouts/**/*.{vue,js,jsx,mjs,ts,tsx}',
    'src/pages/**/*.{vue,js,jsx,mjs,ts,tsx}',
    'src/plugins/**/*.{js,ts,mjs}',
    'src/composables/**/*.{js,ts,mjs}',
    'src/utils/**/*.{js,ts,mjs}',
    'src/{A,a}pp.{vue,js,jsx,mjs,ts,tsx}',
    'src/{E,e}rror.{vue,js,jsx,mjs,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
