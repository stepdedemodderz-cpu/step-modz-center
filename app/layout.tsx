import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Step Mod!Z',
  description: 'DayZ generators, tools, and Discord integration for Step Mod!Z',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
