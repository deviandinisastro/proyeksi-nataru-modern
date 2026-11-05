"use client";

import React, { useState } from "react";
import { MudikHubBundle } from "@/types/mudikhub";
import {
  Database,
  CheckCircle2,
  GitBranch,
  FileCode2,
  ClipboardCheck,
  Table2,
  ShieldCheck,
} from "lucide-react";

interface ArchitectureWorkspaceProps {
  data: MudikHubBundle;
  darkMode: boolean;
}

export default function ArchitectureWorkspace({ data }: ArchitectureWorkspaceProps) {
  const dict = data.star_schema_meta.data_dictionary;
  const etl = data.star_schema_meta.etl_audit_summary;
  const [selectedTable, setSelectedTable] = useState<string>(dict[0]?.nama_tabel || "fact_pergerakan_posko");

  const activeTableObj = dict.find((t) => t.nama_tabel === selectedTable) || dict[0];

  const syllabusActivities = [
    {
      no: "Aktivitas 1",
      judul: "Analisis Kebutuhan Sistem & Perumusan Indikator Data (SRS & KPI)",
      capaian: "Merumuskan 3 KPI utama (Volume Pergerakan Harian, Pertumbuhan YoY +3,44%, dan Load Factor 81,36%), Use Case Diagram, serta SRS.",
      wujud: "Modul Ikhtisar Eksekutif Posko (KPI Cards 1–3 & Navigasi Terpadu MudikHub)",
      status: "100% Terpenuhi",
    },
    {
      no: "Aktivitas 2",
      judul: "Perencanaan Jadwal (WBS) & Perancangan Struktur Basis Data (Star Schema & SDD)",
      capaian: "Memisahkan Tabel Fakta (fact_pergerakan_posko) dan 4 Tabel Dimensi (Waktu, Moda, Event, Wilayah 1.212 Simpul) beserta Kamus Data.",
      wujud: "Direktori /public/data/star_schema/ & Modul Kamus Data Interaktif",
      status: "100% Terpenuhi",
    },
    {
      no: "Aktivitas 3",
      judul: "Pembersihan Data Historis (ETL Python) & Integrasi Basis Data Dinamis",
      capaian: "Ekstraksi dataset Web Portal STRATEGI Kemenhub, penghapusan 2 baris 'nan' Udara (259 -> 257 Bandara), dan validasi 1.212 simpul.",
      wujud: "Script backend_etl/etl_strategi_mudikhub.py & Bundel JSON Sinkronisasi",
      status: "100% Terpenuhi",
    },
    {
      no: "Aktivitas 4",
      judul: "Penerapan Logika Pendukung Keputusan (Metode SAW) & Skenario Armada",
      capaian: "Komputasi normalisasi matriks R dan skor preferensi Vᵢ untuk merangking prioritas moda & estimasi penambahan armada.",
      wujud: "Modul SPK Metode SAW (Opsi B: 3 Skenario Terukur & Opsi A: Tabel Fix)",
      status: "100% Terpenuhi",
    },
    {
      no: "Aktivitas 5",
      judul: "Perancangan Tampilan Dashboard & Elemen Visual Web Multimedia (Web GIS)",
      capaian: "UI/UX responsif Next.js 14, palet siaga Hijau-Kuning-Merah, grafik ECharts interaktif, dan Peta Web GIS 1.212 Simpul.",
      wujud: "Seluruh 6 Workspace Interaktif Portal MudikHub Modern",
      status: "100% Terpenuhi",
    },
    {
      no: "Aktivitas 6",
      judul: "Pengujian Fungsi Aplikasi (Black-Box Testing) & Buku Panduan (User Manual)",
      capaian: "Validasi fungsionalitas seluruh filter, grafik, peta, dan tab skenario SAW tanpa galat (zero bug) serta kesiapan serah terima.",
      wujud: "Matriks Uji Black-Box (Lolos 100%) & Dokumentasi Teknis Operasional",
      status: "100% Terpenuhi",
    },
  ];

  return (
    <div className="space-y-6">
      {/* BANNER ARSITEKTUR STAR SCHEMA & TATA KELOLA DATA */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-[11px] font-bold mb-2">
          <Database className="w-3.5 h-3.5" />
          Arsitektur Data Multidimensi (Star Schema) & Pipeline ETL Python Portal STRATEGI Kemenhub
        </div>
        <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">
          Rancang Bangun Basis Data Star Schema, Kamus Data & Audit Kualitas ETL
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Dokumentasi teknis pemenuhan kompetensi Rekayasa Sistem Informasi (Universitas Gunadarma) pada Tim Pengelolaan Data Pusdatin Kemenhub RI.
        </p>
      </div>

      {/* AUDIT PIPELINE ETL PYTHON (STRATEGI KEMENHUB) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-500">1. Extract (Sumber Resmi)</div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
            Portal STRATEGI Kemenhub
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Ekstraksi log historis & titik pantau dari <b>strategi.kemenhub.go.id</b> ({etl.baris_simpul_mentah} baris awal).
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-rose-600">2. Transform (Cleansing)</div>
          <div className="text-base font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            -{etl.anomali_nan_dihapus} Baris Anomali (&apos;nan&apos;)
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Menghapus 2 baris <code>nama: nan</code> pada Udara sehingga tepat <b>257 Bandara</b> (Sesuai koreksi Mas Septa).
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-amber-600">3. Transform (Geocoding)</div>
          <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            +{etl.koordinat_terimputasi} Titik Koordinat
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Melengkapi koordinat lintang/bujur simpul jalan & ASDP sehingga 100% terpetakan di Web GIS.
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-emerald-600">4. Load (Star Schema)</div>
          <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            1.212 Simpul Resmi (100%)
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Tersimpan ke dalam 1 Tabel Fakta & 4 Tabel Dimensi siap konsumsi secara dinamis.
          </p>
        </div>
      </div>

      {/* VISUALISASI SKEMA BINTANG (STAR SCHEMA) & KAMUS DATA (DATA DICTIONARY) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* KIRI (5 KOLOM): PEMILIH TABEL STAR SCHEMA */}
        <div className="xl:col-span-5 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-sky-500" />
            Struktur Relasi Basis Data Star Schema
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Klik salah satu tabel Fakta / Dimensi di bawah untuk melihat spesifikasi Kamus Data (Data Dictionary):
          </p>

          <div className="space-y-2.5">
            {dict.map((t) => {
              const isFact = t.nama_tabel.startsWith("fact_");
              const active = selectedTable === t.nama_tabel;
              return (
                <button
                  key={t.nama_tabel}
                  onClick={() => setSelectedTable(t.nama_tabel)}
                  className={`w-full p-3.5 rounded-xl border text-left transition ${
                    active
                      ? "bg-gov-navy text-white border-gov-navy dark:bg-sky-600 dark:border-sky-500 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-sky-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold">{t.nama_tabel}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isFact
                          ? "bg-amber-500 text-white"
                          : active
                          ? "bg-white/20 text-white"
                          : "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300"
                      }`}
                    >
                      {isFact ? "FACT TABLE" : "DIMENSION"}
                    </span>
                  </div>
                  <div
                    className={`text-[11px] mt-1 ${
                      active ? "text-slate-200" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {t.deskripsi}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* KANAN (7 KOLOM): KAMUS DATA (DATA DICTIONARY) TABEL TERPILIH */}
        <div className="xl:col-span-7 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Table2 className="w-4 h-4 text-emerald-500" />
                Kamus Data (Data Dictionary): <span className="font-mono text-sky-600 dark:text-sky-400">{activeTableObj.nama_tabel}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{activeTableObj.jenis_tabel}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] uppercase text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3 px-3 font-bold">Nama Kolom / Atribut</th>
                  <th className="py-3 px-3 font-bold">Tipe Data & Kunci</th>
                  <th className="py-3 px-3 font-bold">Deskripsi & Fungsi Kolom</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeTableObj.kolom.map((k) => (
                  <tr key={k.nama} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {k.nama}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-sky-700 dark:text-sky-400 font-semibold whitespace-nowrap">
                      {k.tipe}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                      {k.keterangan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MATRIKS PEMENUHAN 6 AKTIVITAS SILABUS MAGANG S1 SISTEM INFORMASI GUNADARMA */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-emerald-500" />
            Matriks Pemenuhan 6 Aktivitas Silabus Magang S1 Sistem Informasi Universitas Gunadarma
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Verifikasi kesesuaian fitur aplikasi terhadap indikator penilaian konversi SKS & standar operasional Pusdatin Kemenhub RI
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] uppercase text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-3 px-3 font-bold">Tahapan Silabus</th>
                <th className="py-3 px-3 font-bold">Nama Aktivitas Magang</th>
                <th className="py-3 px-3 font-bold">Capaian Pembelajaran yang Dipenuhi</th>
                <th className="py-3 px-3 font-bold">Implementasi pada Web Modern</th>
                <th className="py-3 px-3 text-center font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {syllabusActivities.map((act) => (
                <tr key={act.no} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-extrabold text-sky-700 dark:text-sky-400 whitespace-nowrap">
                    {act.no}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{act.judul}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 leading-relaxed">{act.capaian}</td>
                  <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-200">{act.wujud}</td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {act.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
