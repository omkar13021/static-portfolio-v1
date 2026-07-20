import type { Config } from 'tailwindcss';

/**
 * Warm-paper design system (REQUIREMENTS §3, §5A per-world palettes, §13 illustration
 * style guide). Colorful worlds are achieved through illustration, not chrome — the UI
 * palette stays editorial and warm.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './three/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm-paper base palette
        cream: '#F5EEDF',
        offwhite: '#FBF7EF',
        beige: '#E7D9BE',
        // Accent — used sparingly in UI, liberally in illustration
        muted: '#E4B95B', // muted yellow
        terracotta: '#C86A4A',
        forest: '#3C5A46',
        deepblue: '#22384F',
        ink: '#2B2420', // warm black
        // Character (extracted from the reference illustration)
        skin: '#C0855A',
        skinShade: '#A66C44',
        hair: '#241C17',
        shirt: '#211E1B',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        hand: ['var(--font-hand)', 'cursive'],
      },
      fontSize: {
        // Fluid editorial scale — clamps so nothing forces scroll on short viewports (§7, §8)
        'display': 'clamp(2.75rem, 7vw, 6rem)',
        'title': 'clamp(2rem, 4.5vw, 3.5rem)',
        'lede': 'clamp(1.05rem, 1.6vw, 1.35rem)',
        'caption': 'clamp(0.72rem, 1vw, 0.85rem)',
      },
      transitionTimingFunction: {
        // Motion tokens (§6, §7.2)
        'exit': 'cubic-bezier(0.4, 0.0, 1, 1)',
        'enter': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'stage': 'cubic-bezier(0.65, 0.05, 0.36, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(6px, -10px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        drift: 'drift 11s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
