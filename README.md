# MudikHub Modern — Portal Pemantauan, Proyeksi & SPK Transportasi Nasional

**Pusat Data dan Teknologi Informasi (Pusdatin) Kementerian Perhubungan RI**  
*Tim Pengelolaan Data — Subbidang Pengelolaan Data*

---

## Identitas Pengembang & Proyek Magang
* **Judul Proyek:** Rancang Bangun Portal 'MudikHub' untuk Pemantauan dan Proyeksi Transportasi Nasional pada Pusdatin Kemenhub
* **Nama Mahasiswa:** Devi Andini Sastro (NPM: 10123320)
* **Program Studi:** S1 Sistem Informasi — Fakultas Ilmu Komputer dan Teknologi Informasi, Universitas Gunadarma
* **Mentor Pembimbing:** Hendry Setiadi (Ketua Tim Pengelolaan Data Pusdatin Kemenhub RI)
* **Sumber Data Resmi:** Web Portal **STRATEGI Kemenhub** (`strategi.kemenhub.go.id`) & Platform Business Intelligence **Metabase Pusdatin Kemenhub RI**

---

## Arsitektur Teknologi Modern (Tech Stack)
1. **Frontend Framework:** Next.js 14 (App Router, Static Export) + React 18 + TypeScript 5
2. **Styling & UI Design System:** Tailwind CSS 3.4 (Mendukung Mode Gelap / Terang) + Lucide Icons
3. **Visualisasi Analitik:** Apache ECharts 6 (Canvas Engine) + KaTeX Mathematical Rendering
4. **Pemetaan Geospasial (Web GIS):** Leaflet Interactive Map (`1.212 Simpul Resmi Tervalidasi`)
5. **Backend Data Engineering & SPK:** Python 3.12 (`backend_etl/etl_strategi_mudikhub.py`) — Pipeline ETL, Star Schema Generator, Damped Holt-Winters Forecasting, dan Mesin SPK Metode Simple Additive Weighting (SAW).

---

## Cakupan 6 Workspace Utama (Sesuai Silabus Magang S1 Sistem Informasi)
1. **Ikhtisar Eksekutif Posko (`OverviewWorkspace`):** Menampilkan 3 KPI Utama (Volume Pergerakan, Pertumbuhan YoY +3,44%, dan Rasio Keterisian / *Load Factor* 81,36%), Grafik Tren 3 Tahun (2024–2026), Distribusi Pangsa 5 Moda (lengkap dengan baris `TOTAL KESELURUHAN`), dan Kalender Beban Posko 18 Hari (H-7 s.d H+10).
2. **Peta Spasial Web GIS 1.212 Simpul (`SpatialMapWorkspace`):** Pemetaan interaktif 1.212 titik simpul resmi Portal STRATEGI Kemenhub (**257 Bandara Udara**, **197 Stasiun KA**, **215 Terminal Jalan**, **276 Pelabuhan Penyeberangan ASDP**, dan **267 Pelabuhan Laut**) yang telah dibersihkan dari anomali baris `nan`.
3. **SPK Metode SAW & Rekomendasi Armada (`SawDecisionWorkspace`):** Perankingan prioritas moda transportasi menggunakan algoritma *Simple Additive Weighting* (SAW) berdasarkan 3 kriteria terbobot ($C_1$ Indeks Lonjakan $35\%$, $C_2$ *Load Factor* $40\%$, $C_3$ Rasio Cadangan Sarana $25\%$) dengan pilihan **Opsi B (3 Tab Skenario Terukur)** maupun **Opsi A (Tabel Tunggal Fix)**.
4. **Koridor Tol, Arteri & ASDP (`CorridorWorkspace`):** Analisis beban 4 Gerbang Tol Barrier Jabodetabek (Cikatama, Kalitama, Cikupa, Ciawi), 96 Titik Jalan Arteri Nasional, dan komposisi kendaraan penyeberangan ASDP.
5. **Turnamen 7 Model & Rumus (`ForecastingWorkspace`):** Hasil turnamen komparasi 7 metode peramalan deret waktu yang menetapkan **Holt-Winters Multiplicative Damped ($\phi = 0,98$)** sebagai Champion Model (**MAPE Agregat Nasional 6,93%**, Akurasi Kumulatif **98,04%**).
6. **Star Schema & ETL Strategi (`ArchitectureWorkspace`):** Dokumentasi skema basis data bintang (*Star Schema*: 1 Tabel Fakta + 4 Tabel Dimensi), Kamus Data (*Data Dictionary*) interaktif, audit pipeline ETL Python, dan matriks pemenuhan 6 aktivitas Silabus Magang Universitas Gunadarma.

---

## Cara Menjalankan Proyek Secara Lokal

```bash
# 1. Jalankan ulang pipeline ETL Python (opsional jika ingin memperbarui data JSON)
npm run etl

# 2. Jalankan server pengembangan lokal (http://localhost:3000)
npm run dev

# 3. Build static production ke folder ./out
npm run build
```
