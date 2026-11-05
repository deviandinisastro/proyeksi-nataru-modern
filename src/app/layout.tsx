import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MudikHub — Portal Pemantauan, Proyeksi & SPK Transportasi Nasional | Pusdatin Kemenhub RI",
  description:
    "Sistem Informasi Terpadu Pemantauan Pergerakan Harian, Proyeksi Lonjakan Mobilitas (Damped Holt-Winters), Peta Web GIS 1.212 Simpul Strategi Kemenhub, dan SPK Metode SAW Penambahan Armada pada Pusdatin Kementerian Perhubungan RI.",
  icons: {
    icon: [
      {
        url: "./favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23003882'/><path d='M16 4L5 9.5L16 15L27 9.5L16 4Z' fill='%2338BDF8'/><path d='M5 16L16 21.5L27 16' stroke='%23FBBF24' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/><path d='M5 21.5L16 27L27 21.5' stroke='%23FFFFFF' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
