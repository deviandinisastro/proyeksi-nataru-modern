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
  CheckCircle2,
} from "lucide-react";

interface OverviewWorkspaceProps {
  data: MudikHubBundle;
  darkMode: boolean;
}

const fmt = (n: number) => n.toLocaleString("id-ID");

// Palet Resmi INA Digital untuk 5 Moda Penumpang
const INA_MODA_COLORS: Record<string, string> = {
  "Angkutan Udara": "#0284C7",
  "Kereta Api": "#EA580C",
  "Angkutan SDP": "#7C3AED",
  "Angkutan Penyeberangan": "#7C3AED",
  "Angkutan Jalan": "#059669",
  "Angkutan Laut": "#003882",
};

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
    const xDays = activeDailyRows.map((r) => r.Hari_Operasional);
    const v2024 = activeDailyRows.map((r) => r.Volume_2024);
    const v2025 = activeDailyRows.map((r) => r.Volume_2025);
    const v2026 = activeDailyRows.map((r) => r.Proyeksi_2026_2027);

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: darkMode ? "#0f172a" : "#ffffff",
        borderColor: darkMode ? "#334155" : "#cbd5e1",
        textStyle: {
          color: darkMode ? "#f8fafc" : "#0f172a",
          fontSize: 12,
          fontFamily: "Plus Jakarta Sans, sans-serif",
        },
        formatter: (params: any[]) => {
          if (!params || !params.length) return "";
          const idx = params[0].dataIndex;
          const row = activeDailyRows[idx];
          const unit = metricType === "penumpang" ? "orang" : "unit";
          let html = `<div style="font-weight:700;margin-bottom:6px;">${row.Hari_Operasional} — ${selectedModa}</div>`;
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
        textStyle: {
          color: textColor,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "Plus Jakarta Sans, sans-serif",
        },
      },
      grid: { top: 62, right: 24, bottom: 48, left: 68 },
      xAxis: {
        type: "category",
        data: xDays,
        axisLabel: {
          color: textColor,
          fontSize: 11,
          interval: 0,
          fontFamily: "Plus Jakarta Sans, sans-serif",
        },
        axisLine: { lineStyle: { color: gridColor } },
      },
      yAxis: {
        type: "value",
        max: (val: { max: number }) => Math.ceil(val.max * 1.15),
        axisLabel: {
          color: textColor,
          fontSize: 11,
          fontFamily: "Plus Jakarta Sans, sans-serif",
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
          itemStyle: { color: "#0066CC" },
          lineStyle: { width: 2.5 },
          symbolSize: 6,
          areaStyle: {
            color: echarts_Gradient("#0066CC", 0.14, 0.01),
          },
        },
        {
          name: "Proyeksi 2026/2027 (Damped HW)",
          type: "line",
          smooth: true,
          data: v2026,
          itemStyle: { color: "#D97706" },
          lineStyle: { width: 3.2 },
          symbolSize: 8,
          markPoint: {
            symbol: "roundRect",
            symbolSize: [54, 22],
            symbolOffset: [0, -18],
            itemStyle: {
              color: "#DC2626",
              borderColor: "#ffffff",
              borderWidth: 1.5,
              shadowBlur: 6,
              shadowColor: "rgba(220, 38, 38, 0.35)",
            },
            data: [{ type: "max", name: "Puncak Tertinggi" }],
            label: {
              fontSize: 10,
              fontWeight: "bold",
              color: "#ffffff",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              formatter: "Puncak",
            },
          },
        },
      ],
    };
  }, [activeDailyRows, darkMode, textColor, gridColor, metricType, selectedModa]);

  // 2. ECharts Option: Donut Pangsa Pasar 5 Moda (INA Digital Colors & Enlarged Ring)
  const donutOption = useMemo(() => {
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: darkMode ? "#0f172a" : "#ffffff",
        borderColor: darkMode ? "#334155" : "#cbd5e1",
        textStyle: {
          color: darkMode ? "#f8fafc" : "#0f172a",
          fontSize: 12,
          fontFamily: "Plus Jakarta Sans, sans-serif",
        },
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
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "inside",
            formatter: (params: any) =>
              `${Number(params.percent).toFixed(1).replace(".", ",")}%`,
            fontSize: 11,
            fontWeight: "bold",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            color: "#ffffff",
          },
          data: data.moda_penumpang_summary.map((m) => ({
            name: m.moda,
            value: m.proyeksi_pnp_2026,
            itemStyle: { color: INA_MODA_COLORS[m.moda] || m.warna },
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
      <div className="rounded-2xl bg-gradient-to-r from-[#002554] via-[#003882] to-[#0066CC] p-6 text-white shadow-lg border border-sky-700/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-sky-100 text-xs font-semibold mb-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            Sumber Data Resmi: Portal STRATEGI Kemenhub (https://strategi.kemenhub.go.id/)
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
            Ikhtisar Eksekutif Proyeksi & Kesiagaan Posko Angkutan Nataru 2026/2027
          </h1>
          <p className="text-xs md:text-sm text-sky-100/90 mt-1.5 leading-relaxed">
            Sistem Pendukung Keputusan (DSS) Terpadu Lintas 5 Moda Penumpang, Koridor Tol & Arteri pada{" "}
            <span className="font-bold text-amber-300">1.212 Simpul Pantauan Nasional</span> (Periode H-7 s.d H+10).
          </p>
        </div>
      </div>

      {/* BARIS 1: 4 KARTU INDIKATOR UTAMA POSKO */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KARTU 1: VOLUME PERGERAKAN PENUMPANG & SARANA */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Volume Pergerakan
            </span>
            <div className="p-2 rounded-lg bg-[#EFF6FF] dark:bg-sky-950 text-[#003882] dark:text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white num-tabular">
            {fmt(kpi.total_penumpang_proyeksi_2026)}{" "}
            <span className="text-xs font-semibold text-slate-500">Orang</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 num-tabular">
            <span>Realisasi 2025: {fmt(kpi.total_penumpang_realisasi_2025)}</span>
            <span className="font-semibold text-[#0066CC] dark:text-sky-400">
              Sarana: {fmt(kpi.total_sarana_angkutan_umum_2026)} Unit
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Akumulasi 18 Hari Posko (Rata-rata <b>1,02 Juta</b> penumpang/hari)
          </div>
        </div>

        {/* KARTU 2: PERBANDINGAN PERTUMBUHAN ANTAR-TAHUN (YoY) */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Laju Pertumbuhan YoY
            </span>
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 num-tabular">
              +{kpi.pertumbuhan_penumpang_yoy_pct.toFixed(2).replace(".", ",")}%
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
              Moderasi Terkendali
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 num-tabular">
            <span>Selisih: +{fmt(kpi.total_penumpang_proyeksi_2026 - kpi.total_penumpang_realisasi_2025)} orang</span>
            <span>Tol: +{kpi.pertumbuhan_tol_yoy_pct.toFixed(2).replace(".", ",")}%</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Pertumbuhan tertinggi: <b>Bus (+8,65%)</b> & <b>KA (+5,00%)</b>
          </div>
        </div>

        {/* KARTU 3: RASIO KETERISIAN SARANA (LOAD FACTOR) */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rasio Keterisian (LF)
            </span>
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 num-tabular">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {kpi.rata_rata_load_factor_2026_pct.toFixed(2).replace(".", ",")}%
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              (Puncak H-1: {kpi.puncak_load_factor_h_minus_1_pct.toFixed(1).replace(".", ",")}%)
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#0066CC] via-amber-500 to-rose-500 h-full rounded-full"
              style={{ width: `${kpi.rata_rata_load_factor_2026_pct}%` }}
            />
          </div>
          <div className="mt-2 pt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            Tertinggi: <b>Kereta Api (92,1%)</b> & <b>Udara (83,4%)</b>
          </div>
        </div>

        {/* KARTU 4: TITIK PUNCAK MUDIK & ARUS BALIK */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Indikator Puncak Posko
            </span>
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-rose-600 dark:text-rose-400 num-tabular">
            H-1: {fmt(kpi.puncak_mudik_volume)}{" "}
            <span className="text-xs font-medium text-slate-500">Orang</span>
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300 num-tabular">
            Arus Balik H+9: {fmt(kpi.puncak_balik_volume)} Orang
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Status Kesiagaan: <b>{countMerah} Hari Merah</b>, <b>{countKuning} Hari Kuning</b>, <b>{countHijau} Hari Hijau</b>
          </div>
        </div>
      </div>

      {/* BARIS 2: GRAFIK TREN HARIAN 3 TAHUN (2024, 2025, PROYEKSI 2026/2027) */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Grafik Tren Pergerakan Harian Posko (H-7 s.d H+10) — Komparasi 3 Tahun
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Komparasi kurva mobilitas harian Realisasi 2024, Realisasi 2025, dan Proyeksi 2026/2027
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 self-start xl:self-center">
            {/* Toggle Penumpang vs Sarana */}
            <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setMetricType("penumpang");
                  if (selectedModa === "Jalan Tol" || selectedModa === "Jalan Arteri") {
                    setSelectedModa("TOTAL SELURUH MODA");
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition whitespace-nowrap ${
                  metricType === "penumpang"
                    ? "bg-[#003882] text-white shadow-sm dark:bg-sky-600"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                Penumpang
              </button>
              <button
                onClick={() => setMetricType("sarana")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition whitespace-nowrap ${
                  metricType === "sarana"
                    ? "bg-[#003882] text-white shadow-sm dark:bg-sky-600"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                Sarana / Armada
              </button>
            </div>

            {/* Dropdown Filter Moda */}
            <select
              value={selectedModa}
              onChange={(e) => setSelectedModa(e.target.value)}
              className="h-[32px] px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 shrink-0"
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
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pangsa Moda Proyeksi Penumpang 2026
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Proporsi proyeksi 18,46 juta penumpang dari 5 moda angkutan umum
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#EFF6FF] dark:bg-sky-950 text-[#003882] dark:text-sky-300 border border-blue-200/70 dark:border-sky-800 shrink-0">
              5 Moda Utama
            </span>
          </div>

          <EChartBox option={donutOption} height="285px" />

          <div className="overflow-x-auto mt-3 flex-1 flex flex-col justify-end">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[10px] uppercase text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-2.5 font-bold">Moda Transportasi</th>
                  <th className="py-2.5 px-2.5 text-right font-bold">Realisasi 2025</th>
                  <th className="py-2.5 px-2.5 text-right font-bold">Proyeksi 2026</th>
                  <th className="py-2.5 px-2.5 text-right font-bold">YoY</th>
                  <th className="py-2.5 px-2.5 text-right font-bold">Porsi (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {data.moda_penumpang_summary.map((m) => {
                  const colorDot = INA_MODA_COLORS[m.moda] || m.warna;
                  return (
                    <tr key={m.moda} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="py-2.5 px-2.5 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colorDot }} />
                        <span>{m.moda}</span>
                      </td>
                      <td className="py-2.5 px-2.5 text-right text-slate-600 dark:text-slate-300 font-medium num-tabular">
                        {fmt(m.realisasi_pnp_2025)}
                      </td>
                      <td className="py-2.5 px-2.5 text-right font-bold text-[#003882] dark:text-sky-400 num-tabular">
                        {fmt(m.proyeksi_pnp_2026)}
                      </td>
                      <td className="py-2.5 px-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400 num-tabular">
                        +{m.pertumbuhan_pnp_yoy_pct.toFixed(2).replace(".", ",")}%
                      </td>
                      <td className="py-2.5 px-2.5 text-right font-bold text-[#0066CC] dark:text-sky-300 num-tabular">
                        {m.pangsa_pasar_pct.toFixed(2).replace(".", ",")}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 dark:bg-slate-800/90 border-t-2 border-slate-300 dark:border-slate-700 font-extrabold text-slate-900 dark:text-white">
                  <td className="py-3 px-2.5 rounded-bl-lg">TOTAL KESELURUHAN</td>
                  <td className="py-3 px-2.5 text-right num-tabular">{fmt(kpi.total_penumpang_realisasi_2025)}</td>
                  <td className="py-3 px-2.5 text-right text-[#003882] dark:text-sky-300 num-tabular">
                    {fmt(kpi.total_penumpang_proyeksi_2026)}
                  </td>
                  <td className="py-3 px-2.5 text-right text-emerald-600 dark:text-emerald-400 num-tabular">
                    +{kpi.pertumbuhan_penumpang_yoy_pct.toFixed(2).replace(".", ",")}%
                  </td>
                  <td className="py-3 px-2.5 text-right text-[#0066CC] dark:text-sky-300 rounded-br-lg num-tabular">
                    100,00%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* KANAN (7 KOLOM): KALENDER PROYEKSI BEBAN POSKO 18 HARI (SEJAJAR PENUH DENGAN TOTAL KESELURUHAN) */}
        <div className="xl:col-span-7 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0066CC] dark:text-sky-400 shrink-0" />
                <span className="truncate">Kalender Proyeksi Beban Posko (18 Hari)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                Jadwal kronologis H-7 s.d H+10 estimasi volume proyeksi & status kesiagaan
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
              <button
                onClick={() => setStatusFilter("ALL")}
                title="Tampilkan seluruh 18 hari operasional posko"
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition whitespace-nowrap ${
                  statusFilter === "ALL"
                    ? "bg-[#003882] text-white border-[#003882] dark:bg-sky-600 dark:border-sky-500"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200/70"
                }`}
              >
                Semua (18)
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === "HIJAU" ? "ALL" : "HIJAU")}
                title="Filter Status Lancar / Normal (< 980 Ribu penumpang/hari)"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition whitespace-nowrap ${
                  statusFilter === "HIJAU"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/70 hover:bg-emerald-100/80"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === "HIJAU" ? "bg-white" : "bg-emerald-500"}`} />
                <span>{countHijau} Hari</span>
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === "KUNING" ? "ALL" : "KUNING")}
                title="Filter Status Waspada Antrean (980 Ribu – 1,1 Juta penumpang/hari)"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition whitespace-nowrap ${
                  statusFilter === "KUNING"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/70 hover:bg-amber-100/80"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === "KUNING" ? "bg-white" : "bg-amber-500"}`} />
                <span>{countKuning} Hari</span>
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === "MERAH" ? "ALL" : "MERAH")}
                title="Filter Status Siaga Puncak (≥ 1,1 Juta penumpang/hari)"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition whitespace-nowrap ${
                  statusFilter === "MERAH"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/70 hover:bg-rose-100/80"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      statusFilter === "MERAH" ? "bg-white" : "bg-rose-500"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      statusFilter === "MERAH" ? "bg-white" : "bg-rose-600"
                    }`}
                  />
                </span>
                <span>{countMerah} Hari</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 min-h-[540px]">
            <div className="xl:absolute xl:inset-0 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 text-[10px] uppercase text-slate-500 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 z-10">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Hari Posko</th>
                  <th className="py-2.5 px-3 font-bold">Tanggal / Pekan</th>
                  <th className="py-2.5 px-3 text-right font-bold">Volume Proyeksi (Orang)</th>
                  <th className="py-2.5 px-3 text-center font-bold">Status Kesiagaan</th>
                  <th className="py-2.5 px-3 font-bold">Rekomendasi Aksi Taktis Posko</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredKalender.map((k) => {
                  const isSiaga = k.status_kode === "MERAH";
                  const isWaspada = k.status_kode === "KUNING";
                  const badgeStyle = isSiaga
                    ? "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                    : isWaspada
                    ? "bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                    : "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";

                  return (
                    <tr
                      key={k.hari_posko}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition ${
                        k.is_puncak ? "bg-amber-50/50 dark:bg-amber-950/20" : ""
                      }`}
                    >
                      <td className="py-2.5 px-3 font-extrabold text-slate-900 dark:text-white whitespace-nowrap num-tabular">
                        <span>{k.hari_posko}</span>
                        {k.is_puncak && (
                          <span className="ml-1.5 px-1.5 py-0.5 text-[9px] rounded bg-amber-200 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 font-bold">
                            PUNCAK
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        <div className="font-semibold">{k.hari_pekan}</div>
                        <div className="text-[10px] text-slate-400">{k.tanggal}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-[#003882] dark:text-sky-400 whitespace-nowrap num-tabular">
                        {fmt(k.penumpang_proyeksi_2026)}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${badgeStyle}`}
                        >
                          {isSiaga ? (
                            <span className="relative flex h-2 w-2 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-85" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
                            </span>
                          ) : (
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isWaspada ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                            />
                          )}
                          <span>{k.status_label}</span>
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
