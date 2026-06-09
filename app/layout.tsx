import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

// Modern, technical geometric sans for headings (replaces the old serif).
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PersonaOn - Command",
  description:
    "Walk in prepared. Leave with a persona. A new interface direction for PersonaOn.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply saved theme/contrast/scale before paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=document.documentElement;var t=localStorage.getItem('personaon:theme')||'system';var dark=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);r.setAttribute('data-theme',dark?'dark':'light');r.setAttribute('data-dark',localStorage.getItem('personaon:darkstyle')==='black'?'black':'slate');r.setAttribute('data-contrast',localStorage.getItem('personaon:contrast')||'normal');var s=localStorage.getItem('personaon:scale')||'comfortable';var m={comfortable:1,large:1.1,larger:1.22}[s]||1;r.style.setProperty('--ui-scale',String(m));}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
