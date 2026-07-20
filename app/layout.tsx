import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, Caveat } from 'next/font/google';
import './globals.css';

// Elegant serif for editorial headings (§3 typography)
const serif = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

// Modern sans for body / captions
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Handwritten for notes / margin annotations
const hand = Caveat({
  subsets: ['latin'],
  variable: '--font-hand',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Omkar — An Interactive Story',
  description:
    "Not a portfolio. A single-screen, chapter-driven story about who Omkar is — the person behind the engineer.",
  openGraph: {
    title: 'Omkar — An Interactive Story',
    description:
      'A cinematic, single-viewport storybook. Eleven chapters, one continuous world.',
    type: 'website',
  },
};

// Lock the layout to the visual viewport; the app never scrolls (§2).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#22384F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
