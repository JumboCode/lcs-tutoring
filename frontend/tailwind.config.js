/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        spinMove: {
          '0%': { transform: 'rotate(0deg) translate(0, 0)' },
          '25%': { transform: 'rotate(90deg) translate(100px, 100px)' },
          '50%': { transform: 'rotate(180deg) translate(-60px, -60px)' },
          '75%': { transform: 'rotate(270deg) translate(40px, -40px)' },
          '100%': { transform: 'rotate(360deg) translate(0, 0)' },
        },
      },
      animation: {
        'spin-move': 'spinMove 2s infinite linear',
      },
      fontFamily: {
        interBlack:['interBlack', 'sans-serif'],
        interBlackItalic:['interBlackItalic'],
        interBold:['interBold'],
        interBoldItalic:['interBoldItalic'],
        interExtraBold:['interExtraBold'],
        interExtraBoldItalic:['interExtraBoldItalic'],
        interExtraLight:['interExtraLight'],
        interExtraLightItalic:['interExtraLightItalic'],
        interItalic:['interItalic'],
        interLight:['interLight'],
        interLightItalic:['interLightItalic'],
        interMedium:['interMedium'],
        interMediumItalic:['interMediumItalic'],
        interRegular:['interRegular'],
        interSemiBold:['interSemiBold'],
        interSemiBoldItalic:['interSemiBoldItalic'],
        interThin:['interThin'],
        interThinItalic:['interThinItalic'],
      },
    },
  },
  plugins: [],
}

