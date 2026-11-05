"use client";

import React, { useState, useMemo } from "react";
import { EChartsWrapper, echarts_Gradient } from "../charts/EChartsWrapper";
import { MudikHubBundle } from "../../types/mudikhub";
import {
  TrendingUp,
  Users,
  Truck,
  Flame,
  Calendar,
  ArrowUpRight,
  Table2,
  Filter,
} from "lucide-react";

interface Props {
  bundle: MudikHubBundle;
}

const MODA_LABELS: Record<string, string> = {
  ALL: "Semua Moda (Agregat Nasional)",
  Perkeretaapian: "Perkeretaapian (KAI / Commuter / KCIC)",
  "Angkutan Laut": "Angkutan Laut (Pelni / Kapal Laut)",
  "Angkutan Penyeberangan": "Angkutan Penyeberangan (ASDP)",
  "Angkutan Jalan": "Angkutan Jalan (Bus AKAP / Terminal)",
  "Angkutan Udara": "Angkutan Udara (Domestik + Internasional)",
  "Jalan Tol": "Jalan Tol (Kendaraan Golongan I-V)",
  "Jalan Arteri": "Jalan Arteri Nasional (Mobil + Motor + Bus + Barang)",
};

export function DailyTrendWorkspace({ bundle }: Props) {
  const [selectedMetric, setSelectedMetric] = useState<"penumpang" | "sarana">("penumpang");
  const [selectedModa, setSelectedModa] = useState<string>("ALL");

  const dailyRecords = useMemo(() => {
    const filtered = bundle.fact_daily.filter((r) => {
      if (r.indikator !== selectedMetric) return false;
      if (selectedModa === "ALL") {
        if (selectedMetric === "penumpang") {
          return [
            "Angkutan Jalan",
            "Angkutan Laut",
            "Angkutan Penyeberangan",
            "Angkutan Udara",
            "Perkeretaapian",
          ].includes(r.nama_moda);
        } else {
          return true;
        }
      }
      return r.nama_moda === selectedModa;
    });

    return bundle.dim_waktu.map((w) => {
      const rows = filtered.filter((r) => r.kode_hari === w.kode_hari);
      const v24 = rows.reduce((acc, r) => acc + r.realisasi_2024, 0);
      const v25 = rows.reduce((acc, r) => acc + r.realisasi_2025, 0);
      const v26 = rows.reduce((acc, r) => acc + r.proyeksi_2026, 0);
      return {
        ...w,
        v24: Math.round(v24),
        v25: Math.round(v25),
        v26: Math.round(v26),
        growth26: v25 > 0 ? ((v26 - v25) / v25) * 100 : 0,
      };
    });
  }, [bundle, selectedMetric, selectedModa]);

  const totals = useMemo(() => {
    const t24 = dailyRecords.reduce((s, d) => s + d.v24, 0);
    const t25 = dailyRecords.reduce((s, d) => s + d.v25, 0);
    const t26 = dailyRecords.reduce((s, d) => s + d.v26, 0);
    const peak = [...dailyRecords].sort((a, b) => b.v26 - a.v26)[0];
    return {
      t24,
      t25,
      t26,
      growth: t25 > 0 ? ((t26 - t25) / t25) * 100 : 0,
      peak,
    };
  }, [dailyRecords]);

  const trendOption = useMemo(() => {
    const labels = dailyRecords.map((d) => `${d.kode_hari}\n(${d.hari_kalender.slice(0, 3)})`);
    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(10, 22, 40, 0.95)",
        borderColor: "rgba(56, 189, 248, 0.3)",
        textStyle: { color: "#e2e8f0", fontSize: 12 },
        valueFormatter: (value: number) =>
          value?.toLocaleString("id-ID") + (selectedMetric === "penumpang" ? " orang" : " unit"),
      },
      legend: {
        data: [
          "Realisasi 2024/2025",
          "Realisasi 2025/2026 (Baseline)",
          "Proyeksi 2026/2027 (Damped Holt-Winters)",
        ],
        top: 0,
        textStyle: { color: "#94a3b8", fontSize: 12 },
      },
      grid: { left: "3%", right: "3%", bottom: "10%", top: "14%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: labels,
        axisLabel: { color: "#94a3b8", fontSize: 11 },
        axisLine: { lineStyle: { color: "rgba(148,163,184,0.2)" } },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#94a3b8",
          fontSize: 11,
          formatter: (val: number) => {
            if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + " Jt";
            if (val >= 1_000) return (val / 1_000).toFixed(0) + " Rb";
            return String(val);
          },
        },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.08)", type: "dashed" } },
      },
      series: [
        {
          name: "Realisasi 2024/2025",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          data: dailyRecords.map((d) => d.v24),
          lineStyle: { width: 2, type: "dashed", color: "#64748b" },
          itemStyle: { color: "#64748b" },
        },
        {
          name: "Realisasi 2025/2026 (Baseline)",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          data: dailyRecords.map((d) => d.v25),
          lineStyle: { width: 2.5, color: "#0085ca" },
          itemStyle: { color: "#0085ca" },
          areaStyle: {
            color: echarts_Gradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(0, 133, 202, 0.25)" },
              { offset: 1, color: "rgba(0, 133, 202, 0.0)" },
            ]),
          },
        },
        {
          name: "Proyeksi 2026/2027 (Damped Holt-Winters)",
          type: "line",
          smooth: true,
          symbol: "diamond",
          symbolSize: 8,
          data: dailyRecords.map((d) => d.v26),
          lineStyle: { width: 3.5, color: "#ffbd2c" },
          itemStyle: { color: "#ffbd2c" },
          areaStyle: {
            color: echarts_Gradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(255, 189, 44, 0.30)" },
              { offset: 1, color: "rgba(255, 189, 44, 0.01)" },
            ]),
          },
          markPoint: {
            data: [
              {
                type: "max",
                name: "Puncak Tertinggi",
                label: { color: "#030b17", fontWeight: "bold", fontSize: 10 },
                itemStyle: { color: "#f43f5e" },
              },
            ],
          },
        },
      ],
    };
  }, [dailyRecords, selectedMetric]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Filter Panel */}
      <div className="glass-card rounded-2xl p-6 border border-sky-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/25 text-sky-300 text-xs font-medium mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Analisis Deret Waktu 18 Hari Posko Terpadu (H-7 s.d. H+10)
            </div>
            <h2 className="text-xl font-bold text-white">
              Tren Harian Pergerakan Penumpang & Sarana (2024–2027)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Komparasi realisasi historis terhadap proyeksi Nataru 2026/2027 menggunakan model pemenang{" "}
              <span className="text-amber-300 font-semibold">Damped Holt-Winters (\(\phi = 0,98\))</span> dengan sumber data resmi{" "}
              <span className="text-sky-300 font-semibold">Portal STRATEGI Kemenhub</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-900/90 p-1 border border-slate-700/70">
              <button
                onClick={() => {
                  setSelectedMetric("penumpang");
                  if (selectedModa === "Jalan Tol" || selectedModa === "Jalan Arteri") {
                    setSelectedModa("ALL");
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedMetric === "penumpang"
                    ? "bg-sky-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Penumpang (5 Moda)
              </button>
              <button
                onClick={() => setSelectedMetric("sarana")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedMetric === "sarana"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                Sarana / Kendaraan (7 Moda)
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/70 rounded-xl px-3 py-1.5">
              <Filter className="w-3.5 h-3.5 text-sky-400" />
              <select
                value={selectedModa}
                onChange={(e) => setSelectedModa(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL" className="bg-slate-900">
                  {MODA_LABELS["ALL"]}
                </option>
                <option value="Perkeretaapian" className="bg-slate-900">
                  {MODA_LABELS["Perkeretaapian"]}
                </option>
                <option value="Angkutan Laut" className="bg-slate-900">
                  {MODA_LABELS["Angkutan Laut"]}
                </option>
                <option value="Angkutan Penyeberangan" className="bg-slate-900">
                  {MODA_LABELS["Angkutan Penyeberangan"]}
                </option>
                <option value="Angkutan Jalan" className="bg-slate-900">
                  {MODA_LABELS["Angkutan Jalan"]}
                </option>
                <option value="Angkutan Udara" className="bg-slate-900">
                  {MODA_LABELS["Angkutan Udara"]}
                </option>
                {selectedMetric === "sarana" && (
                  <>
                    <option value="Jalan Tol" className="bg-slate-900">
                      {MODA_LABELS["Jalan Tol"]}
                    </option>
                    <option value="Jalan Arteri" className="bg-slate-900">
                      {MODA_LABELS["Jalan Arteri"]}
                    </option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5 pt-5 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Akumulasi Realisasi 2024/2025
            </span>
            <div className="text-lg font-bold text-slate-200 font-mono mt-1">
              {totals.t24.toLocaleString("id-ID")}{" "}
              <span className="text-xs font-normal text-slate-400">
                {selectedMetric === "penumpang" ? "orang" : "unit"}
              </span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-sky-400 font-semibold">
              Akumulasi Baseline 2025/2026
            </span>
            <div className="text-lg font-bold text-white font-mono mt-1">
              {totals.t25.toLocaleString("id-ID")}{" "}
              <span className="text-xs font-normal text-slate-400">
                {selectedMetric === "penumpang" ? "orang" : "unit"}
              </span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                Total Proyeksi 2026/2027
              </span>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />+{totals.growth.toFixed(2).replace(".", ",")}%
              </span>
            </div>
            <div className="text-lg font-bold text-amber-300 font-mono mt-1">
              {totals.t26.toLocaleString("id-ID")}{" "}
              <span className="text-xs font-normal text-amber-200/80">
                {selectedMetric === "penumpang" ? "orang" : "unit"}
              </span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-rose-300 font-semibold">
                Titik Puncak Terpadat
              </span>
              <Flame className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono mt-1">
              {totals.peak?.kode_hari} ({totals.peak?.hari_kalender})
            </div>
            <div className="text-[11px] text-rose-200/90 font-mono">
              {totals.peak?.v26.toLocaleString("id-ID")}{" "}
              {selectedMetric === "penumpang" ? "orang/hari" : "unit/hari"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Line Chart */}
      <div className="glass-card rounded-2xl p-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              Kurva Pergerakan Harian: {MODA_LABELS[selectedModa]}
            </h3>
            <p className="text-xs text-slate-400">
              Garis putus-putus abu-abu (2024/2025), garis biru (Realisasi 2025/2026), dan garis emas tebal (Proyeksi 2026/2027)
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-300 font-mono">
            18 Titik Observasi Posko
          </span>
        </div>
        <EChartsWrapper option={trendOption} height="410px" />
      </div>

      {/* Detailed 18-Day Table */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Table2 className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Tabel Rincian Harian 18 Hari Posko ({MODA_LABELS[selectedModa]})
              </h3>
              <p className="text-xs text-slate-400">
                Perbandingan kuantitatif nilai harian 2024/2025, 2025/2026, Proyeksi 2026/2027, dan status operasional posko
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            18 Desember 2026 – 4 Januari 2027
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800">
                <th className="py-3 px-4 font-semibold">Kode Hari</th>
                <th className="py-3 px-4 font-semibold">Tanggal Proyeksi 2026/2027</th>
                <th className="py-3 px-4 font-semibold">Fase Operasional</th>
                <th className="py-3 px-4 font-semibold text-right">Realisasi 2024/2025</th>
                <th className="py-3 px-4 font-semibold text-right">Realisasi 2025/2026</th>
                <th className="py-3 px-4 font-semibold text-right text-amber-300">
                  Proyeksi 2026/2027
                </th>
                <th className="py-3 px-4 font-semibold text-right">Pertumbuhan YoY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dailyRecords.map((row) => {
                const isPeak = row.kode_hari === "H-1" || row.kode_hari === "H+9";
                return (
                  <tr
                    key={row.kode_hari}
                    className={`transition-colors ${
                      isPeak ? "bg-rose-950/20 hover:bg-rose-950/35" : "hover:bg-slate-800/40"
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono font-bold text-white">
                      {row.kode_hari}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">
                      {row.hari_kalender}, {row.tanggal_2026}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isPeak
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {row.fase_operasional}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                      {row.v24.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-sky-300">
                      {row.v25.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-amber-300">
                      {row.v26.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono">
                      <span
                        className={
                          row.growth26 >= 0 ? "text-emerald-400 font-semibold" : "text-rose-400"
                        }
                      >
                        {row.growth26 >= 0 ? "+" : ""}
                        {row.growth26.toFixed(2).replace(".", ",")}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
