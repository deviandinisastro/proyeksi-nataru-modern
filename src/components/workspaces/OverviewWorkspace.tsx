"use client";

import React, { useState, useMemo } from "react";
import { MudikHubBundle } from "@/types/mudikhub";
import EChartBox from "@/components/charts/EChartBox";
import {
  Calendar,
  PieChart,
  Car,
  Ship,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface OverviewWorkspaceProps {
  data: MudikHubBundle;
  darkMode: boolean;
}

const fmt = (n: number) => n.toLocaleString("id-ID");

export default function OverviewWorkspace({ data, darkMode }: OverviewWorkspaceProps) {
  const [statusFilter, setStatusFilter] = useState<"ALL" | "HIJAU" | "KUNING" | "MERAH">("ALL");

  const kpi = data.kpi_utama;
  const totalSarana7Moda =
    kpi.total_sarana_angkutan_umum_2026 + kpi.total_lhr_tol_2026 + kpi.total_arteri_2026;

  // Donut Chart Pangsa Moda Proyeksi Penumpang 2026 (Diperbesar & Label Presisi di Dalam)
  const donutOption = useMemo(() => {
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: darkMode ? "#0f172a" : "#ffffff",
        borderColor: darkMode ? "#334155" : "#cbd5e1",
        textStyle: { color: darkMode ? "#f8fafc" : "#0f172a", fontSize: 12 },
        formatter: (p: any) =>
          `<b>${p.name}</b><br/>Proyeksi 2026: <b>${fmt(p.value)} orang</b><br/>Pangsa Pasar: <b>${Number(p.percent).toFixed(2).replace(".", ",")}%</b>`,
      },
      series: [
        {
          name: "Pangsa Moda 2026",
          type: "pie",
          radius: ["40%", "86%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: darkMode ? "#0f172a" : "#ffffff",
            borderWidth: 2.5,
          },
          label: {
            show: true,
            position: "inside",
            formatter: (p: any) => `${Number(p.percent).toFixed(1).replace(".", ",")}%`,
            fontSize: 12,
            fontWeight: "bold",
            color: "#ffffff",
          },
          data: data.moda_penumpang_summary.map((m) => ({
            name: m.moda,
            value: m.proyeksi_pnp_2026,
            itemStyle: { color: m.warna },
          })),
        },
      ],
    };
  }, [data.moda_penumpang_summary, darkMode]);

  const filteredKalender = useMemo(() => {
    if (statusFilter === "ALL") return data.kalender_18_hari;
    return data.kalender_18_hari.filter((k) => k.status_kode === statusFilter);
  }, [data.kalender_18_hari, statusFilter]);

  const countHijau = data.kalender_18_hari.filter((k) => k.status_kode === "HIJAU").length;
  const countKuning = data.kalender_18_hari.filter((k) => k.status_kode === "KUNING").length;
  const countMerah = data.kalender_18_hari.filter((k) => k.status_kode === "MERAH").length;

  return (
    <div className="space-y-6">
      {/* HEADER HALAMAN 1: IKHTISAR PROYEKSI POSKO */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ikhtisar Proyeksi Operasional & Hari Puncak Nataru 2026/2027
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rangkuman angka proyeksi operasional angkutan multimoda periode 18 hari (H-7 s.d H+10) hasil pemodelan Damped Holt-Winters dibandingkan realisasi baseline 2025 dari Portal STRATEGI Kemenhub.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center gap-1.5 uppercase tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          Model Damped Holt-Winters (MAPE 6,93%)
        </span>
      </div>

      {/* BARIS 1: 4 KARTU KPI EKSEKUTIF UTAMA (SAMA PERSIS DENGAN STRUKTUR ACUAN) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Proyeksi Penumpang */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight">
                Total Proyeksi
                <br />
                Penumpang
              </span>
              <span className="whitespace-nowrap shrink-0 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                +{kpi.pertumbuhan_penumpang_yoy_pct.toFixed(2).replace(".", ",")}% YoY
              </span>
            </div>
            <div className="text-2xl font-extrabold text-gov-navy dark:text-white mb-1">
              {fmt(kpi.total_penumpang_proyeksi_2026)}{" "}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">orang</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Realisasi Baseline 2025:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {fmt(kpi.total_penumpang_realisasi_2025)} orang
            </span>
          </div>
        </div>

        {/* KPI 2: Proyeksi Puncak Mudik */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight">
                Proyeksi Puncak
                <br />
                Mudik
              </span>
              <span className="whitespace-nowrap shrink-0 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Siaga Puncak 1
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
              H-1 (Kamis)
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Beban Puncak Proyeksi:</span>
            <span className="font-bold text-gov-navy dark:text-sky-400">
              {fmt(kpi.puncak_mudik_volume)} orang/hari
            </span>
          </div>
        </div>

        {/* KPI 3: Proyeksi Puncak Balik */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight">
                Proyeksi Puncak
                <br />
                Balik
              </span>
              <span className="whitespace-nowrap shrink-0 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Siaga Puncak 2
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
              H+9 (Minggu)
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Beban Puncak Proyeksi:</span>
            <span className="font-bold text-gov-navy dark:text-sky-400">
              {fmt(kpi.puncak_balik_volume)} orang/hari
            </span>
          </div>
        </div>

        {/* KPI 4: Proyeksi Laju Tertinggi & Load Factor / Total Sarana */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight">
                Proyeksi Laju
                <br />
                Tertinggi
              </span>
              <span className="whitespace-nowrap shrink-0 px-2 py-0.5 rounded text-[11px] font-bold bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                +8,65% YoY
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white truncate mb-1">
              Angkutan Jalan
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Rasio Keterisian (LF) / Sarana:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {kpi.rata_rata_load_factor_2026_pct.toFixed(1).replace(".", ",")}% ({fmt(totalSarana7Moda)} unit)
            </span>
          </div>
        </div>
      </div>

      {/* BARIS 2: PANGSA MODA (DONUT BESAR + TABEL BREAKDOWN TOTAL) & KALENDER BEBAN POSKO 18 HARI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* KIRI (5 KOLOM): PANGSA MODA + TABEL RINCIAN + BARIS TOTAL KESELURUHAN */}
        <div className="lg:col-span-5 rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-sky-500" />
                Pangsa Moda Proyeksi Penumpang 2026
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Proporsi proyeksi 18,46 juta penumpang dari 5 moda transportasi
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              5 Moda
            </span>
          </div>

          {/* DONUT CHART DIPERBESAR AGAR PERSENTASE PRESISI DI TENGAH IRISAN */}
          <div className="my-1">
            <EChartBox option={donutOption} height="285px" />
          </div>

          <div className="overflow-x-auto mt-2 flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-2 font-bold">Moda Transportasi</th>
                  <th className="py-2.5 px-2 text-right font-bold">Realisasi 2025</th>
                  <th className="py-2.5 px-2 text-right font-bold">Proyeksi 2026</th>
                  <th className="py-2.5 px-2 text-right font-bold">YoY</th>
                  <th className="py-2.5 px-2 text-right font-bold">Porsi (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {data.moda_penumpang_summary.map((m) => (
                  <tr key={m.moda} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-2.5 px-2 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: m.warna }} />
                      <span>{m.moda === "Angkutan SDP" ? "Angkutan Penyeberangan (SDP)" : m.moda}</span>
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-600 dark:text-slate-300 font-medium">
                      {fmt(m.realisasi_pnp_2025)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-sky-700 dark:text-sky-400">
                      {fmt(m.proyeksi_pnp_2026)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      +{m.pertumbuhan_pnp_yoy_pct.toFixed(2).replace(".", ",")}%
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-sky-600 dark:text-sky-400">
                      {m.pangsa_pasar_pct.toFixed(2).replace(".", ",")}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 dark:bg-slate-800/95 border-t-2 border-slate-300 dark:border-slate-700 font-extrabold text-slate-900 dark:text-white">
                  <td className="py-3 px-2 rounded-bl-lg">TOTAL KESELURUHAN</td>
                  <td className="py-3 px-2 text-right">{fmt(kpi.total_penumpang_realisasi_2025)}</td>
                  <td className="py-3 px-2 text-right text-sky-700 dark:text-sky-300">
                    {fmt(kpi.total_penumpang_proyeksi_2026)}
                  </td>
                  <td className="py-3 px-2 text-right text-emerald-600 dark:text-emerald-400">
                    +{kpi.pertumbuhan_penumpang_yoy_pct.toFixed(2).replace(".", ",")}%
                  </td>
                  <td className="py-3 px-2 text-right rounded-br-lg">100,00%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* KANAN (7 KOLOM): KALENDER PROYEKSI BEBAN POSKO (18 HARI) */}
        <div className="lg:col-span-7 rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500" />
                Kalender Proyeksi Beban Posko (18 Hari)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Jadwal kronologis H-7 s/d H+10 estimasi volume proyeksi & status kesiagaan
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setStatusFilter(statusFilter === "HIJAU" ? "ALL" : "HIJAU")}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition ${
                  statusFilter === "HIJAU"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300/60"
                }`}
              >
                ● {countHijau} Hari
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === "KUNING" ? "ALL" : "KUNING")}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition ${
                  statusFilter === "KUNING"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300/60"
                }`}
              >
                ● {countKuning} Hari
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === "MERAH" ? "ALL" : "MERAH")}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition ${
                  statusFilter === "MERAH"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300/60"
                }`}
              >
                ● {countMerah} Hari
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 min-h-0 max-h-[540px] rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-[10px] uppercase text-slate-600 dark:text-slate-300 z-10">
                <tr>
                  <th className="py-3 px-3 font-bold">Hari Posko</th>
                  <th className="py-3 px-3 font-bold">Tanggal / Pekan</th>
                  <th className="py-3 px-3 text-right font-bold">Volume Proyeksi (Orang)</th>
                  <th className="py-3 px-3 text-center font-bold">Status Kesiagaan</th>
                  <th className="py-3 px-3 font-bold">Rekomendasi Aksi Taktis Posko</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredKalender.map((k) => {
                  const badgeStyle =
                    k.status_kode === "MERAH"
                      ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                      : k.status_kode === "KUNING"
                      ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                      : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";

                  return (
                    <tr
                      key={k.hari_posko}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition ${
                        k.is_puncak ? "bg-amber-50/50 dark:bg-amber-950/20" : ""
                      }`}
                    >
                      <td className="py-2.5 px-3 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                        <span>{k.hari_posko}</span>
                        {k.is_puncak && (
                          <span className="ml-1.5 px-1.5 py-0.5 text-[9px] rounded bg-amber-500 text-slate-950 font-extrabold">
                            PUNCAK
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {k.hari_pekan}
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-sky-700 dark:text-sky-400 whitespace-nowrap">
                        {fmt(k.penumpang_proyeksi_2026)}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeStyle}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {k.status_label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                        {k.rekomendasi_taktis}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BARIS 3: RINGKASAN INFRASTRUKTUR KRITIS (4 GERBANG TOL JAKARTA & 3 LINTAS UTAMA ASDP) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KIRI: 4 Gerbang Tol Utama Barrier Jakarta */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-sky-500" />
                Proyeksi 4 Gerbang Tol Utama Barrier Jabodetabek
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Volume kendaraan keluar-masuk jaringan tol utama Jakarta (+{kpi.pertumbuhan_tol_yoy_pct.toFixed(2).replace(".", ",")}% YoY)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              4 Gerbang Tol
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase text-slate-500">
                  <th className="py-2 px-2 font-bold">Gerbang Tol Utama</th>
                  <th className="py-2 px-2 text-right font-bold">Keluar 2026</th>
                  <th className="py-2 px-2 text-right font-bold">Masuk 2026</th>
                  <th className="py-2 px-2 text-right font-bold">Total Proyeksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.gerbang_tol_jakarta.map((g) => (
                  <tr key={g.gerbang_tol} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-2 font-bold text-slate-800 dark:text-slate-200">{g.gerbang_tol}</td>
                    <td className="py-2.5 px-2 text-right text-sky-600 dark:text-sky-400 font-semibold">
                      {fmt(g.keluar_proyeksi_2026)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-amber-600 dark:text-amber-400 font-semibold">
                      {fmt(g.masuk_proyeksi_2026)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-extrabold text-slate-900 dark:text-white">
                      {fmt(g.total_proyeksi_2026)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* KANAN: 3 Lintas Utama Penyeberangan ASDP */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Ship className="w-4 h-4 text-purple-500" />
                Proyeksi Kendaraan Lintas Utama Penyeberangan ASDP
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Distribusi proyeksi kendaraan Roda 2, Roda 4 Pribadi & Truk Logistik
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Lintas Kritis
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase text-slate-500">
                  <th className="py-2 px-2 font-bold">Lintas Penyeberangan</th>
                  <th className="py-2 px-2 text-right font-bold">Roda 4</th>
                  <th className="py-2 px-2 text-right font-bold">Roda 2</th>
                  <th className="py-2 px-2 text-right font-bold">Truk</th>
                  <th className="py-2 px-2 text-right font-bold">Total 2026</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.asdp_kendaraan.map((a) => (
                  <tr key={a.lintas} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-2 font-bold text-slate-800 dark:text-slate-200">{a.lintas}</td>
                    <td className="py-2.5 px-2 text-right text-sky-600 dark:text-sky-400 font-semibold">
                      {fmt(a.proyeksi_roda_4)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                      {fmt(a.proyeksi_roda_2)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-amber-600 dark:text-amber-400 font-semibold">
                      {fmt(a.proyeksi_truk_logistik)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-extrabold text-slate-900 dark:text-white">
                      {fmt(a.proyeksi_total_2026)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
