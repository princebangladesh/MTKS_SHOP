/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
  'hs-overlay',
  'hs-overlay-open:mt-7',
  'hs-overlay-open:opacity-100',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors:{
        primary:  "#F7374F",
        secondary: "#F7374F",
        brandYellow:"#DCA06D",
        brandBlue: "#09122C",
        brandGreen: "#06202B",
        brandWhite: "#FFEDF3",
      }
    },
    fontFamily:{
      'sans': ['ui-sans-serif', 'system-ui', ],
      'serif': ['ui-serif', 'Georgia', ],
      'mono': ['ui-monospace', 'SFMono-Regular', ],
      'display': ['Oswald', ],
      'body': ["Open Sans", ],
    },
    container: {
      center: true,
      padding: {
        default: '1rem',
        sm: '3rem',
      },
    },
  },
  plugins: [],
}

