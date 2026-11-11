# MudikHub — Sistem Informasi Eksekutif, Proyeksi Multimoda & SPK Transportasi Nasional Nataru 2026/2027

Pusat Data dan Teknologi Informasi (Pusdatin) &bull; Kementerian Perhubungan Republik Indonesia  
*Sistem Pendukung Keputusan (DSS) Pemantauan Terpadu 5 Moda Transportasi, 1.212 Simpul Pantau, Koridor Tol & Lintas Penyeberangan Nasional*

---

## Tautan Akses Sistem

* 🌐 **Live Demo Portal Modern (Next.js):** [https://deviandinisastro.github.io/proyeksi-nataru-modern/](https://deviandinisastro.github.io/proyeksi-nataru-modern/)
* 📦 **Repositori Kode Sumber:** [https://github.com/deviandinisastro/proyeksi-nataru-modern](https://github.com/deviandinisastro/proyeksi-nataru-modern)
* 📑 **Portal Pemantauan Versi Standar (Arsip):** [https://deviandinisastro.github.io/proyeksi-nataru/](https://deviandinisastro.github.io/proyeksi-nataru/)

---

## 1. Latar Belakang & Ruang Lingkup Analisis

Penyelenggaraan Posko Terpadu Angkutan Natal dan Tahun Baru (Nataru) memiliki dinamika mobilitas yang sangat spesifik dan berbeda dari pola lalu lintas reguler harian. Arus pergerakan terdistribusi dalam jendela waktu libur akhir tahun yang padat, dengan karakteristik dua gelombang mobilitas utama: arus mudik menjelang Hari Raya Natal dan arus balik menjelang awal tahun baru.

Sistem **MudikHub Modern** dirancang sebagai platform analitik komprehensif untuk memodelkan, memantau, dan mendukung pengambilan keputusan taktis selama **18 hari masa posko resmi (H-7 s.d. H+10, 18 Desember 2026 – 4 Januari 2027)** dengan titik jangkar (*anchor point*) pada Hari Raya Natal (25 Desember 2026).

Berbeda dari peramalan linier konvensional, sistem ini mengintegrasikan deret waktu historis 4 tahun masa posko resmi (2022 s.d. 2025) untuk menangkap pola musiman mingguan (*weekly seasonality*), mendeteksi dini hari puncak beban operasional, dan menghitung rekomendasi alokasi cadangan armada berdasarkan batas kapasitas fisik prasarana transportasi nasional.

---

## 2. Ringkasan Proyeksi Multimoda Nasional 2026/2027

Berdasarkan pemodelan deret waktu *Holt-Winters Multiplicative with Damped Trend* ($\phi = 0.98$), total pergerakan penumpang angkutan umum nasional diproyeksikan mencapai **18.462.913 penumpang**, tumbuh **+3,45% (YoY)** dibandingkan realisasi baseline Posko Nataru 2025/2026 sebesar 17.848.066 penumpang.

### Rekapitulasi Proyeksi 5 Moda Transportasi Nasional

| Moda Transportasi | Realisasi 2025 (Baseline) | Proyeksi 2026/2027 | Pertumbuhan (YoY) | Pangsa Pasar (*Modal Share*) | Estimasi Kebutuhan Sarana |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Angkutan Udara** | 4.770.215 | **4.880.174** | +2,31% | 26,43% | 44.332 penerbangan |
| **Kereta Api** | 3.869.519 | **4.062.995** | +5,00% | 22,01% | 70.814 perjalanan KA |
| **Penyeberangan (ASDP)** | 3.792.149 | **3.816.033** | +0,63% | 20,67% | 25.945 trip kapal feri |
| **Angkutan Jalan (AKAP)** | 3.161.450 | **3.434.854** | +8,65% | 18,60% | 247.027 armada bus |
| **Angkutan Laut** | 2.254.733 | **2.268.857** | +0,63% | 12,29% | 33.352 trip kapal laut |
| **TOTAL KESELURUHAN** | **17.848.066** | **18.462.913** | **+3,45%** | **100,00%** | **421.470 unit operasi** |

---

## 3. Temuan Analitik & Titik Kritis Operasional Posko

### 1. Deteksi Gelombang Puncak Ganda (*Twin Peaks*)
* **Puncak Arus Mudik (Peak 1):** Diproyeksikan terjadi pada **H-1 (Kamis, 24 Desember 2026)** dengan estimasi volume harian mencapai **1.149.332 penumpang/hari** (Status: **Siaga Puncak**).
* **Puncak Arus Balik (Peak 2):** Terkonsentrasi pada **H+9 (Minggu, 3 Januari 2027)** dengan estimasi volume harian sebesar **1.127.235 penumpang/hari**.
* **Rasio Lonjakan (*Surge Ratio*):** Rata-rata beban harian nasional berada pada angka **1.025.717 penumpang/hari**, menghasilkan rasio lonjakan hari puncak sebesar **1,12×** di atas rata-rata beban harian normal.

### 2. Dinamika Antarmoda & Pertumbuhan Tertinggi
* **Angkutan Udara** dan **Kereta Api** menyerap pangsa mobilitas terbesar dengan total akumulasi **48,44%** dari total penumpang nasional.
* **Angkutan Jalan** mencatatkan akselerasi pertumbuhan tertinggi (**+8,65% YoY**), didorong oleh tersambungnya konektivitas tol Trans Jawa dan Tol Trans Sumatera serta tren preferensi bus AKAP kelas eksekutif.

### 3. Pemantauan Titik Rawan (*Bottleneck*) Infrastruktur Strategis
* **Gerbang Tol Barrier Utama:** Pemantauan intensif di GT Cikampek Utama (arah Trans Jawa), GT Kalihurip Utama (arah Bandung), GT Cikupa (arah Merak), dan GT Ciawi (arah Puncak/Bogor).
* **Lintas Penyeberangan Utama ASDP:** Lintas Merak–Bakauheni (estimasi 612 ribu penumpang) dan Ketapang–Gilimanuk (estimasi 454 ribu penumpang) dengan kesiagaan penerapan skema TBB (Tiba Bongkar Berangkat) dan buffer zone tiket Ferizy.
* **Jaringan Jalan Arteri:** Pemantauan real-time pada 96 titik sensor penghitungan lalu lintas (*traffic counting*) di jalur Pantura, Pantai Selatan (Pansela), dan jalur penghubung lintas provinsi.

---

## 4. Arsitektur 6 Workspace Interaktif

Aplikasi dibangun menggunakan arsitektur modern berbasis ruang kerja (*workspace-based architecture*):

1. **Ikhtisar Eksekutif Posko (`OverviewWorkspace`)**  
   Menampilkan KPI Makro Nasional, Grafik Tren Multitahun (2024–2026), Donat Pangsa Moda 2026, Tabel Distribusi 5 Moda (lengkap dengan baris `TOTAL KESELURUHAN`), serta Kalender Early Warning 18 Hari dengan indikator status kesiagaan (Hijau/Lancar, Kuning/Waspada, Merah/Siaga Puncak).

2. **Peta Spasial Web GIS 1.212 Simpul (`SpatialMapWorkspace`)**  
   Pemetaan geospasial interaktif berbasis Leaflet.js yang mencakup **1.212 simpul resmi STRATEGI Kemenhub** (257 Bandara, 197 Stasiun KA, 215 Terminal AKAP, 276 Pelabuhan Penyeberangan ASDP, dan 267 Pelabuhan Laut). Dilengkapi filter moda dinamis, layer Heatmap Kepadatan Spasial, dan kartu ringkasan koordinat tervalidasi.

3. **SPK SAW Penugasan Cadangan Armada (`SawDecisionWorkspace`)**  
   Mesin Sistem Pendukung Keputusan berbasis metode *Simple Additive Weighting* (SAW) untuk penentuan prioritas alokasi cadangan armada antarmoda. Memperhitungkan 3 kriteria berbobot: Indeks Lonjakan ($C_1: 35\%$), Rasio Keterisian / *Load Factor* ($C_2: 40\%$), dan Rasio Cadangan Sarana ($C_3: 25\%$), lengkap dengan simulasi sensitivitas skenario operasional.

4. **Koridor Strategis: Tol, Arteri & ASDP (`CorridorWorkspace`)**  
   Dashboard pantauan titik kritis infrastruktur yang menyajikan profil volume kendaraan keluar/masuk Jabodetabek via 4 gerbang tol barrier, indikator 96 titik jalan arteri, serta detail muatan golongan kendaraan kapal feri.

5. **Turnamen 7 Model Peramalan Deret Waktu (`ForecastingWorkspace`)**  
   Dokumentasi pengujian komparatif 7 algoritma peramalan deret waktu (ARIMA/SARIMA, Prophet, Single Exponential Smoothing, Double Exponential Smoothing, Regresi Polinomial, Holt-Winters Additive, dan Holt-Winters Multiplicative Damped) yang menetapkan model Champion dengan akurasi kumulatif **98,04%** dan MAPE agregat nasional **6,93%**.

6. **Star Schema, Data Dictionary & Audit ETL (`ArchitectureWorkspace`)**  
   Transparansi rekayasa data (*data engineering*): representasi Skema Bintang (1 Fact Table + 4 Dimension Tables), Kamus Data interaktif, audit kualitas data 1.212 simpul, dan verifikasi pipeline ETL Python.

---

## 5. Metodologi Pemodelan & Sains Data

### A. Holt-Winters Multiplicative Damped Trend ($\phi = 0.98$)
Peramalan volume mobilitas 18 hari posko menggunakan formulasi deret waktu dengan penahan tren eksponensial:

$$\hat{y}_{t+h|t} = \left[ \ell_t + \sum_{i=1}^{h} \phi^i b_t \right] \times s_{t+h-m}$$

* **$\ell_t$ (Komponen Level):** $\ell_t = \alpha \frac{y_t}{s_{t-m}} + (1 - \alpha)(\ell_{t-1} + \phi b_{t-1})$
* **$b_t$ (Komponen Tren):** $b_t = \beta (\ell_t - \ell_{t-1}) + (1 - \beta)\phi b_{t-1}$
* **$s_t$ (Komponen Musiman Mingguan $m=7$):** $s_t = \gamma \frac{y_t}{\ell_t} + (1 - \gamma)s_{t-m}$
* **$\phi = 0.98$ (Parameter Redaman):** Mencegah *overforecasting* tak realistis dengan memperhitungkan keterbatasan fisik armada dan kapasitas terminal/bandara/stasiun di lapangan.

### B. Algoritma Perangkingan SPK (Metode SAW)
Normalisasi matriks keputusan terbobot untuk penentuan indeks prioritas penguatan armada:

$$R_{ij} = \begin{cases} \frac{x_{ij}}{\max_k x_{kj}} & \text{jika atribut keuntungan (benefit)} \\ \frac{\min_k x_{kj}}{x_{ij}} & \text{jika atribut biaya (cost)} \end{cases} \quad \implies \quad V_i = \sum_{j=1}^{n} w_j R_{ij}$$

---

## 6. Spesifikasi Teknologi (Modern Tech Stack)

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework Aplikasi** | Next.js 14 (App Router) | Arsitektur React Server Components & Static Site Generation (SSG) |
| **Library Antarmuka** | React 18, TypeScript 5 | Komponen termodularisasi dengan type-safety ketat |
| **Design System & UI** | Tailwind CSS 3.4 | Palet resmi INA Digital, soft-elevation, dan dark/light mode adaptif |
| **Engine Visualisasi** | Apache ECharts 6 | Rendering grafik berbasis Canvas berkecepatan tinggi dengan animasi transisi halus |
| **Engine Geospasial** | Leaflet.js v1.9 & Leaflet Heat | Peta interaktif dengan clustering dan layer visualisasi kepadatan spasial |
| **Rendering Matematis** | KaTeX | Format persamaan notasi sains data LaTeX |
| **Ikonografi & Font** | Lucide Icons, Plus Jakarta Sans | Standar tipografi modern desain web instansi pemerintah |
| **Data Engineering** | Python 3 (Pandas, NumPy) | Pipeline pembersihan data mentah STRATEGI Kemenhub dan transformasi JSON |
| **Infrastruktur Deployment**| GitHub Pages / Vercel | Hosting statis terdistribusi dengan kompresi aset otomatis |

---

## 7. Panduan Menjalankan Proyek Secara Lokal

Pastikan komputer Anda telah terinstal **Node.js v18+** dan **npm**:

```bash
# 1. Kloning repositori
git clone https://github.com/deviandinisastro/proyeksi-nataru-modern.git
cd proyeksi-nataru-modern

# 2. Instal seluruh dependensi
npm install

# 3. Jalankan server pengembangan lokal
npm run dev
# Buka http://localhost:3000 pada browser

# 4. Buat build produksi statis (folder ./out)
npm run build
```

---

## 8. Tata Kelola Data & Hak Cipta Institusi

Data historis dan simpul pemantauan yang digunakan dalam sistem ini bersumber dari basis data resmi **Portal STRATEGI Kementerian Perhubungan RI** (`strategi.kemenhub.go.id`) dan pelaporan harian **Posko Terpadu Angkutan Natal dan Tahun Baru**. Seluruh visualisasi dan model analitik dirancang guna mendukung tata kelola data transportasi nasional yang terpadu, presisi, dan akuntabel di lingkungan Pusat Data dan Teknologi Informasi (Pusdatin) Kementerian Perhubungan Republik Indonesia.
