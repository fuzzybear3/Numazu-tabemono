import type { Metadata } from "next";
import { Newsreader, Noto_Serif, Manrope } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Tamemono 食べ物 — Numazu",
  description: "The ultimate restaurant leaderboard for Numazu, Japan.",
};

const newsreader = Newsreader({
  variable: "--font-newsreader",
  display: "swap",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${notoSerif.variable} ${manrope.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
