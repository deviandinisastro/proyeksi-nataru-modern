import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MudikHub — Portal Pemantauan, Proyeksi & SPK Transportasi Nasional | Pusdatin Kemenhub RI",
  description:
    "Sistem Informasi Terpadu Pemantauan Pergerakan Harian, Proyeksi Lonjakan Mobilitas (Damped Holt-Winters), Peta Web GIS 1.212 Simpul Strategi Kemenhub, dan SPK Metode SAW Penambahan Armada pada Pusdatin Kementerian Perhubungan RI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
