"use client";

import React, { useState, useMemo } from "react";
import { MudikHubBundle } from "@/types/mudikhub";
import EChartBox from "@/components/charts/EChartBox";
import {
  Users,
  TrendingUp,
  Gauge,
  AlertTriangle,
  Calendar,
  Plane,
  Train,
  Ship,
  Bus,
  Anchor,
  CheckCircle2,
  ShieldAlert,
  Clock,
} from "lucide-react";

interface OverviewWorkspaceProps {
  data: MudikHubBundle;
  darkMode: boolean;
}

const fmt = (n: number) => n.toLocaleString("id-ID");

export default function OverviewWorkspace({ data, darkMode }: OverviewWorkspaceProps) {
  const [selectedModa, setSelectedModa] = useState<string>("TOTAL SELURUH MODA");
  const [metricType, setMetricType] = useState<"penumpang" | "sarana">("penumpang");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "HIJAU" | "KUNING" | "MERAH">("ALL");

  const kpi = data.kpi_utama;
  const modaList = useMemo(() => {
    if (metricType === "penumpang") {
      return [
        "TOTAL SELURUH MODA",
        "Angkutan Udara",
        "Kereta Api",
        "Angkutan SDP",
        "Angkutan Jalan",
        "Angkutan Laut",
      ];
    }
    return [
      "TOTAL SELURUH MODA",
      "Angkutan Udara",
      "Kereta Api",
      "Angkutan SDP",
      "Angkutan Jalan",
      "Angkutan Laut",
      "Jalan Tol",
      "Jalan Arteri",
    ];
  }, [metricType]);

  const activeDailyRows = useMemo(() => {
    const src = metricType === "penumpang" ? data.harian_penumpang_per_moda : data.harian_sarana_per_moda;
    const modTarget = modaList.includes(selectedModa) ? selectedModa : "TOTAL SELURUH MODA";
    return src.filter((r) => r.Moda === modTarget);
  }, [data, metricType, selectedModa, modaList]);

  const textColor = darkMode ? "#cbd5e1" : "#334155";
  const gridColor = darkMode ? "rgba(148, 163, 184, 0.14)" : "rgba(148, 163, 184, 0.22)";

  // 1. ECharts Option: Tren Harian 3 Tahun (2024, 2025, Proyeksi 2026/2027)
  const dailyTrendOption = useMemo(() => {
    const xDays = activeDailyRows.map((r) => `${r.Hari_Operasional}\n(${r.Hari_Pekan_2026.slice(0, 3)})`);
    const v2024 = activeDailyRows.map((r) => r.Volume_2024);
    const v2025 = activeDailyRows.map((r) => r.Volume_2025);
    const v2026 = activeDailyRows.map((r) => r.Proyeksi_2026_2027);

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: darkMode ? "#0f172a" : "#ffffff",
        borderColor: darkMode ? "#334155" : "#cbd5e1",
        textStyle: { color: darkMode ? "#f8fafc" : "#0f172a", fontSize: 12 },
        formatter: (params: any[]) => {
          if (!params || !params.length) return "";
          const idx = params[0].dataIndex;
          const row = activeDailyRows[idx];
          const unit = metricType === "penumpang" ? "orang" : "unit";
          let html = `<div style="font-weight:700;margin-bottom:6px;">${row.Hari_Operasional} (${row.Hari_Pekan_2026}) — ${selectedModa}</div>`;
          params.forEach((p) => {
            html += `<div style="display:flex;justify-content:space-between;gap:16px;margin:2px 0;">
              <span>${p.marker} ${p.seriesName}</span>
              <span style="font-weight:700;">${Number(p.value).toLocaleString("id-ID")} ${unit}</span>
            </div>`;
          });
          return html;
        },
      },
      legend: {
        top: 0,
        textStyle: { color: textColor, fontSize: 12, fontWeight: 600 },
      },
      grid: { top: 42, right: 20, bottom: 48, left: 68 },
      xAxis: {
        type: "category",
        data: xDays,
        axisLabel: { color: textColor, fontSize: 11, interval: 0 },
        axisLine: { lineStyle: { color: gridColor } },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: textColor,
          fontSize: 11,
          formatter: (val: number) => {
            if (val >= 1000000) return `${(val / 1000000).toFixed(1)} Jt`;
            if (val >= 1000) return `${(val / 1000).toFixed(0)} Rb`;
            return `${val}`;
          },
        },
        splitLine: { lineStyle: { color: gridColor, type: "dashed" } },
      },
      series: [
        {
          name: "Realisasi 2024/2025",
          type: "line",
          smooth: true,
          data: v2024,
          itemStyle: { color: "#94a3b8" },
          lineStyle: { width: 2, type: "dotted" },
          symbolSize: 5,
        },
        {
          name: "Realisasi 2025/2026 (Baseline)",
          type: "line",
          smooth: true,
          data: v2025,
          itemStyle: { color: "#0284c7" },
          lineStyle: { width: 2.5 },
          symbolSize: 6,
          areaStyle: {
            color: echarts_Gradient("#0284c7", 0.14, 0.01),
          },
        },
        {
          name: "Proyeksi 2026/2027 (Damped HW)",
          type: "line",
          smooth: true,
          data: v2026,
          itemStyle: { color: "#f59e0b" },
          lineStyle: { width: 3.2 },
          symbolSize: 8,
          markPoint: {
            data: [
              { type: "max", name: "Puncak Tertinggi" },
            ],
            label: { fontSize: 10, fontWeight: "bold", formatter: "Puncak" },
          },
        },
      ],
    };
  }, [activeDailyRows, darkMode, textColor, gridColor, metricType, selectedModa]);

  // 2. ECharts Option: Donut Pangsa Pasar 5 Moda
  const donutOption = useMemo(() => {
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: darkMode ? "#0f172a" : "#ffffff",
        borderColor: darkMode ? "#334155" : "#cbd5e1",
        textStyle: { color: darkMode ? "#f8fafc" : "#0f172a", fontSize: 12 },
        formatter: (p: any) =>
          `<b>${p.name}</b><br/>Proyeksi 2026: <b>${fmt(p.value)} orang</b><br/>Pangsa Pasar: <b>${p.percent}%</b>`,
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
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "inside",
            formatter: (params: any) => `${Number(params.percent).toFixed(1).replace(".", ",")}%`,
            fontSize: 11,
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
      {/* BANNER IDENTITAS EKSEKUTIF */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-gov-navy to-sky-900 p-6 text-white shadow-lg border border-sky-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Sumber Data Resmi: Portal STRATEGI Kemenhub (https://strategi.kemenhub.go.id/)
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Ikhtisar Eksekutif Proyeksi & Kesiagaan Posko Angkutan Nataru 2026/2027
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl">
              Sistem Pendukung Keputusan (DSS) Terpadu Lintas 5 Moda Penumpang, Koridor Tol & Arteri pada{" "}
              <span className="font-bold text-amber-300">1.212 Simpul Pantauan Nasional</span> (Periode H-7 s.d H+10).
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/15 text-right">
              <div className="text-[10px] uppercase tracking-wider text-sky-200">Model Champion</div>
              <div className="text-xs font-bold text-white">Damped Holt-Winters (φ=0,98)</div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 backdrop-blur border border-emerald-400/30 text-right">
              <div className="text-[10px] uppercase tracking-wider text-emerald-200">MAPE Agregat Nasional</div>
              <div className="text-sm font-extrabold text-emerald-300">6,93% (Akurasi 98,04%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* BARIS 1: 3 KPI UTAMA SILABUS GUNADARMA (AKTIVITAS 1) + 1 KPI PUNCAK ARUS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: VOLUME PERGERAKAN PENUMPANG & SARANA */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              KPI 1 • Volume Pergerakan
            </span>
            <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {fmt(kpi.total_penumpang_proyeksi_2026)} <span className="text-xs font-semibold text-slate-500">Orang</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Realisasi 2025: {fmt(kpi.total_penumpang_realisasi_2025)}</span>
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              Sarana: {fmt(kpi.total_sarana_angkutan_umum_2026)} Unit
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Akumulasi 18 Hari Posko (Rata-rata <b>1,02 Juta</b> penumpang/hari)
          </div>
        </div>

        {/* KPI 2: PERBANDINGAN PERTUMBUHAN ANTAR-TAHUN (YoY) */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              KPI 2 • Laju Pertumbuhan YoY
            </span>
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              +{kpi.pertumbuhan_penumpang_yoy_pct.toFixed(2).replace(".", ",")}%
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
              Moderasi Terkendali
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Selisih: +{fmt(kpi.total_penumpang_proyeksi_2026 - kpi.total_penumpang_realisasi_2025)} orang</span>
            <span>Tol: +{kpi.pertumbuhan_tol_yoy_pct.toFixed(2).replace(".", ",")}%</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Pertumbuhan tertinggi: <b>Bus (+8,65%)</b> & <b>KA (+5,00%)</b>
          </div>
        </div>

        {/* KPI 3: RASIO KETERISIAN SARANA (LOAD FACTOR) */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              KPI 3 • Rasio Keterisian (LF)
            </span>
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {kpi.rata_rata_load_factor_2026_pct.toFixed(2).replace(".", ",")}%
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              (Puncak H-1: {kpi.puncak_load_factor_h_minus_1_pct.toFixed(1).replace(".", ",")}%)
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 via-amber-500 to-rose-500 h-full rounded-full"
              style={{ width: `${kpi.rata_rata_load_factor_2026_pct}%` }}
            />
          </div>
          <div className="mt-2 pt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
             Tertinggi: <b>Kereta Api (92,1%)</b> & <b>Udara (83,4%)</b>
          </div>
        </div>

        {/* KPI 4: TITIK PUNCAK MUDIK & ARUS BALIK */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Indikator Puncak Posko (Bimodal)
            </span>
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-rose-600 dark:text-rose-400">
            H-1: {fmt(kpi.puncak_mudik_volume)} <span className="text-xs font-medium text-slate-500">Orang</span>
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Arus Balik H+9: {fmt(kpi.puncak_balik_volume)} Orang
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Status Kesiagaan: <b>3 Hari Merah</b>, <b>9 Hari Kuning</b>, <b>6 Hari Hijau</b>
          </div>
        </div>
      </div>

      {/* BARIS 2: GRAFIK TREN HARIAN 3 TAHUN (2024, 2025, PROYEKSI 2026/2027) */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
              Grafik Tren Pergerakan Harian Posko (H-7 s.d H+10) — Komparasi 3 Tahun
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perbandingan kurva harian Realisasi 2024, Realisasi 2025, dan Proyeksi 2026/2027 berbasis Damped Holt-Winters
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Penumpang vs Sarana */}
            <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
              <button
                onClick={() => {
                  setMetricType("penumpang");
                  if (selectedModa === "Jalan Tol" || selectedModa === "Jalan Arteri") {
                    setSelectedModa("TOTAL SELURUH MODA");
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                  metricType === "penumpang"
                    ? "bg-gov-navy text-white shadow-sm dark:bg-sky-600"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                Pergerakan Penumpang
              </button>
              <button
                onClick={() => setMetricType("sarana")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                  metricType === "sarana"
                    ? "bg-gov-navy text-white shadow-sm dark:bg-sky-600"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                Pergerakan Sarana / Armada
              </button>
            </div>

            {/* Dropdown Filter Moda */}
            <select
              value={selectedModa}
              onChange={(e) => setSelectedModa(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {modaList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <EChartBox option={dailyTrendOption} height="360px" />
      </div>

      {/* BARIS 3: PANGSA MODA (DONUT + TABEL BREAKDOWN TOTAL) & KALENDER BEBAN POSKO 18 HARI */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* KIRI (5 KOLOM): PANGSA MODA + TABEL RINCIAN + BARIS TOTAL KESELURUHAN */}
        <div className="xl:col-span-5 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pangsa Moda Proyeksi Penumpang 2026
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Proporsi proyeksi 18,46 juta penumpang dari 5 moda angkutan umum
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              5 Moda Utama
            </span>
          </div>

          <EChartBox option={donutOption} height="285px" />

          <div className="overflow-x-auto mt-2 flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase text-slate-500 dark:text-slate-400">
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
                      <span>{m.moda}</span>
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
                    <td className="py-2.5 px-2 text-right font-bold text-slate-800 dark:text-slate-200">
                      {m.pangsa_pasar_pct.toFixed(2).replace(".", ",")}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 dark:bg-slate-800/90 border-t-2 border-slate-300 dark:border-slate-700 font-extrabold text-slate-900 dark:text-white">
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

        {/* KANAN (7 KOLOM): KALENDER PROYEKSI BEBAN POSKO 18 HARI */}
        <div className="xl:col-span-7 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500" />
                Kalender Proyeksi Beban Posko (18 Hari Operasional)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Jadwal kronologis H-7 s.d H+10 estimasi volume proyeksi, status kesiagaan & rekomendasi aksi taktis
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                  statusFilter === "ALL"
                    ? "bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent"
                }`}
              >
                Semua (18)
              </button>
              <button
                onClick={() => setStatusFilter("HIJAU")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                  statusFilter === "HIJAU"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300/50"
                }`}
              >
                ● {countHijau} Hari Normal (&lt;980 Rb)
              </button>
              <button
                onClick={() => setStatusFilter("KUNING")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                  statusFilter === "KUNING"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300/50"
                }`}
              >
                ● {countKuning} Hari Waspada (980 Rb–1,1 Jt)
              </button>
              <button
                onClick={() => setStatusFilter("MERAH")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                  statusFilter === "MERAH"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300/50"
                }`}
              >
                ● {countMerah} Hari Puncak (&ge;1,1 Jt)
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[470px] rounded-xl border border-slate-200 dark:border-slate-800 flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-[11px] uppercase text-slate-600 dark:text-slate-300 z-10">
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
                          <span className="ml-1.5 px-1.5 py-0.5 text-[9px] rounded bg-rose-600 text-white font-bold">
                            PUNCAK
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <div className="font-semibold">{k.hari_pekan}</div>
                        <div className="text-[10px] text-slate-400">{k.tanggal}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-sky-700 dark:text-sky-400 whitespace-nowrap">
                        {fmt(k.penumpang_proyeksi_2026)}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeStyle}`}>
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
    </div>
  );
}

function echarts_Gradient(hexColor: string, alphaTop: number, alphaBottom: number) {
  return {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: hexToRgba(hexColor, alphaTop) },
      { offset: 1, color: hexToRgba(hexColor, alphaBottom) },
    ],
  };
}

function hexToRgba(hex: string, alpha: number) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
