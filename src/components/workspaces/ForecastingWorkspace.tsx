"use client";

import React, { useMemo } from "react";
import { MudikHubBundle } from "@/types/mudikhub";
import EChartBox from "@/components/charts/EChartBox";
import KatexFormula from "@/components/charts/KatexFormula";
import { Trophy, CheckCircle2, Sigma, TrendingUp } from "lucide-react";

interface ForecastingWorkspaceProps {
  data: MudikHubBundle;
  darkMode: boolean;
}

const fmt = (n: number) => n.toLocaleString("id-ID");

export default function ForecastingWorkspace({ data, darkMode }: ForecastingWorkspaceProps) {
  const models = data.tournament_7_models;
  const textColor = darkMode ? "#cbd5e1" : "#334155";
  const gridColor = darkMode ? "rgba(148, 163, 184, 0.14)" : "rgba(148, 163, 184, 0.22)";

  // 1. ECharts Option: Perbandingan MAPE 7 Metode
  const mapeChartOption = useMemo(() => {
    const rev = [...models].reverse();
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: darkMode ? "#0f172a" : "#ffffff",
        borderColor: darkMode ? "#334155" : "#cbd5e1",
        textStyle: { color: darkMode ? "#f8fafc" : "#0f172a", fontSize: 12 },
      },
      grid: { top: 20, right: 50, bottom: 28, left: 210 },
      xAxis: {
        type: "value",
        name: "MAPE (%)",
        axisLabel: { color: textColor, fontSize: 11, formatter: "{value}%" },
        splitLine: { lineStyle: { color: gridColor, type: "dashed" } },
      },
      yAxis: {
        type: "category",
        data: rev.map((m) => `#${m.peringkat} ${m.nama_model.split(" (")[0]}`),
        axisLabel: { color: textColor, fontSize: 11, fontWeight: 600 },
      },
      series: [
        {
          name: "MAPE Agregat Nasional (%)",
          type: "bar",
          data: rev.map((m) => ({
            value: m.mape_agregat_nasional_pct,
            itemStyle: {
              color:
                m.peringkat === 1
                  ? "#10b981"
                  : m.mape_agregat_nasional_pct < 10
                  ? "#0284c7"
                  : "#f59e0b",
              borderRadius: [0, 6, 6, 0],
            },
          })),
          label: {
            show: true,
            position: "right",
            formatter: "{c}%",
            color: textColor,
            fontWeight: "bold",
            fontSize: 11,
          },
        },
      ],
    };
  }, [models, darkMode, textColor, gridColor]);

  // 2. ECharts Option: Tren Multi-Tahun per Moda (2022 - 2026)
  const multiYearOption = useMemo(() => {
    const years = ["2022", "2023", "2024", "2025 (Baseline)", "2026 (Proyeksi)"];
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: darkMode ? "#0f172a" : "#ffffff",
        borderColor: darkMode ? "#334155" : "#cbd5e1",
        textStyle: { color: darkMode ? "#f8fafc" : "#0f172a", fontSize: 12 },
      },
      legend: {
        top: 0,
        textStyle: { color: textColor, fontSize: 11, fontWeight: 600 },
      },
      grid: { top: 42, right: 20, bottom: 32, left: 65 },
      xAxis: {
        type: "category",
        data: years,
        axisLabel: { color: textColor, fontSize: 11, fontWeight: 600 },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: textColor,
          fontSize: 11,
          formatter: (v: number) => `${(v / 1000000).toFixed(1)} Jt`,
        },
        splitLine: { lineStyle: { color: gridColor, type: "dashed" } },
      },
      series: data.moda_penumpang_summary.map((m) => ({
        name: m.moda,
        type: "line",
        smooth: true,
        symbolSize: 7,
        lineStyle: { width: 2.5 },
        itemStyle: { color: m.warna },
        data: [
          m.realisasi_pnp_2022,
          m.realisasi_pnp_2023,
          m.realisasi_pnp_2024,
          m.realisasi_pnp_2025,
          m.proyeksi_pnp_2026,
        ],
      })),
    };
  }, [data.moda_penumpang_summary, darkMode, textColor, gridColor]);

  return (
    <div className="space-y-6">
      {/* BANNER METODOLOGI & TURNAMEN */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold mb-2">
              <Trophy className="w-3.5 h-3.5" />
              Validasi Statistik Deret Waktu • Kriteria Lewis (1982) MAPE &lt; 10% (Sangat Akurat)
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">
              Turnamen Komparasi 7 Metode Peramalan & Formulasi Matematis
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Evaluasi akurasi <i>holdout</i> deret waktu posko nasional yang menetapkan <b>Holt-Winters Multiplicative Damped (φ = 0,98)</b> sebagai Champion Model.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-right">
              <div className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">
                MAPE Champion Model
              </div>
              <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">6,93%</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-right">
              <div className="text-[10px] font-bold uppercase text-sky-700 dark:text-sky-300">
                Akurasi Kumulatif
              </div>
              <div className="text-lg font-extrabold text-sky-600 dark:text-sky-400">98,04%</div>
            </div>
          </div>
        </div>
      </div>

      {/* GRAFIK KOMPARASI MAPE & TREN HISTORIS 2022-2026 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-6 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Peringkat Akurasi MAPE 7 Metode Peramalan (%)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Semakin kecil nilai MAPE (&lt;10%), semakin tinggi presisi model terhadap realisasi posko
          </p>
          <EChartBox option={mapeChartOption} height="300px" />
        </div>

        <div className="xl:col-span-6 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Lintasan Historis & Proyeksi 5 Moda (2022 – 2026)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Transisi pemulihan pasca-pandemi menuju ekuilibrium pertumbuhan moderat 2026/2027
          </p>
          <EChartBox option={multiYearOption} height="300px" />
        </div>
      </div>

      {/* TABEL TURNAMEN 7 MODEL PERAMALAN */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Tabel Hasil Uji Turnamen 7 Metode Peramalan Deret Waktu
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Pengujian dilakukan terhadap kurva pergerakan harian posko nasional (18 hari operasional H-7 s.d H+10)
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] uppercase text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-3 px-3 font-bold">Peringkat</th>
                <th className="py-3 px-3 font-bold">Metode / Algoritma Peramalan</th>
                <th className="py-3 px-3 font-bold">Keluarga Model</th>
                <th className="py-3 px-3 text-right font-bold">MAPE (%)</th>
                <th className="py-3 px-3 text-right font-bold">Akurasi (%)</th>
                <th className="py-3 px-3 text-right font-bold">Estimasi Proyeksi 2026</th>
                <th className="py-3 px-3 font-bold">Evaluasi & Karakteristik Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {models.map((m) => (
                <tr
                  key={m.peringkat}
                  className={
                    m.peringkat === 1
                      ? "bg-emerald-50/70 dark:bg-emerald-950/30 font-semibold"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }
                >
                  <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                    #{m.peringkat}
                    {m.peringkat === 1 && (
                      <span className="ml-1.5 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                        CHAMPION
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{m.nama_model}</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{m.kategori}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                    {m.mape_agregat_nasional_pct.toFixed(2).replace(".", ",")}%
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-sky-700 dark:text-sky-400">
                    {m.akurasi_total_pct.toFixed(2).replace(".", ",")}%
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                    {fmt(m.proyeksi_total_pnp)}
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-600 dark:text-slate-300 max-w-md">
                    {m.keunggulan_teknis}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SPESIFIKASI RUMUS MATEMATIKA KATEX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
            <Sigma className="w-4 h-4 text-sky-500" />
            <span>Persamaan Champion Model: Damped Holt-Winters</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Mengombinasikan komponen Level (ℓₜ), Damped Trend (bₜ dengan parameter peredam φ = 0,98), dan Faktor Musiman Posko (sₜ):
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 overflow-x-auto text-sm">
            <KatexFormula
              tex="\hat{Y}_{t+h|t} = \left[ \ell_t + \left(\sum_{j=1}^{h} \phi^j \right) b_t \right] \times s_{t+h-m(k+1)}"
              block={true}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
            <Sigma className="w-4 h-4 text-emerald-500" />
            <span>Metrik Evaluasi Galat: Mean Absolute Percentage Error (MAPE)</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Mengukur rata-rata persentase simpangan absolut antara volume aktual posko (Yₜ) dan hasil ramalan model (Ŷₜ) selama N = 18 hari:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 overflow-x-auto text-sm">
            <KatexFormula
              tex="\text{MAPE} = \frac{1}{18} \sum_{t=1}^{18} \left| \frac{Y_t - \hat{Y}_t}{Y_t} \right| \times 100\% = 6,93\%"
              block={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
