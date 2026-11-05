"use client";

import React, { useState, useMemo } from "react";
import { MudikHubBundle } from "@/types/mudikhub";
import EChartBox from "@/components/charts/EChartBox";
import KatexFormula from "@/components/charts/KatexFormula";
import {
  Award,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  TrendingUp,
  Layers,
  Calculator,
} from "lucide-react";

interface SawDecisionWorkspaceProps {
  data: MudikHubBundle;
  darkMode: boolean;
}

const fmt = (n: number) => n.toLocaleString("id-ID");

export default function SawDecisionWorkspace({ data, darkMode }: SawDecisionWorkspaceProps) {
  // Opsi B (Tab Skenario Preset Fix) sebagai default, Opsi A (Tabel Tunggal Baseline Fix) disimpan & bisa di-switch
  const [viewMode, setViewMode] = useState<"OPSI_B" | "OPSI_A">("OPSI_B");
  const [activeScenarioKey, setActiveScenarioKey] = useState<"baseline" | "puncak" | "kontinjensi">("baseline");

  const currentKey = viewMode === "OPSI_A" ? "baseline" : activeScenarioKey;
  const activeScenario = data.spk_saw.skenario[currentKey];
  const criteria = data.spk_saw.kriteria;

  const textColor = darkMode ? "#cbd5e1" : "#334155";
  const gridColor = darkMode ? "rgba(148, 163, 184, 0.14)" : "rgba(148, 163, 184, 0.22)";

  // ECharts Option: Grafik Skor Preferensi SAW (Vi)
  const sawChartOption = useMemo(() => {
    const rows = [...activeScenario.hasil_saw].reverse();
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: darkMode ? "#0f172a" : "#ffffff",
        borderColor: darkMode ? "#334155" : "#cbd5e1",
        textStyle: { color: darkMode ? "#f8fafc" : "#0f172a", fontSize: 12 },
        formatter: (params: any[]) => {
          if (!params || !params.length) return "";
          const idx = params[0].dataIndex;
          const r = rows[idx];
          return `
            <div style="font-weight:800;margin-bottom:4px;">#${r.peringkat_prioritas} ${r.moda}</div>
            <div>Skor Preferensi SAW (Vᵢ): <b>${r.skor_preferensi_v.toFixed(4)} (${r.skor_saw_100}%)</b></div>
            <div>Rekomendasi Armada: <b>+${fmt(r.armada_tambahan_unit)} ${r.satuan_unit}</b></div>
          `;
        },
      },
      grid: { top: 20, right: 45, bottom: 24, left: 135 },
      xAxis: {
        type: "value",
        max: 1.0,
        axisLabel: { color: textColor, fontSize: 11 },
        splitLine: { lineStyle: { color: gridColor, type: "dashed" } },
      },
      yAxis: {
        type: "category",
        data: rows.map((r) => `#${r.peringkat_prioritas} ${r.moda}`),
        axisLabel: { color: textColor, fontSize: 11, fontWeight: 700 },
      },
      series: [
        {
          name: "Skor Preferensi SAW (Vᵢ)",
          type: "bar",
          data: rows.map((r) => ({
            value: r.skor_preferensi_v,
            itemStyle: {
              color:
                r.peringkat_prioritas === 1
                  ? "#e11d48"
                  : r.peringkat_prioritas === 2
                  ? "#f59e0b"
                  : "#0284c7",
              borderRadius: [0, 6, 6, 0],
            },
          })),
          label: {
            show: true,
            position: "right",
            formatter: (p: any) => Number(p.value).toFixed(4),
            color: textColor,
            fontWeight: "bold",
            fontSize: 11,
          },
        },
      ],
    };
  }, [activeScenario, darkMode, textColor, gridColor]);

  return (
    <div className="space-y-6">
      {/* HEADER MODUL SPK METODE SAW (AKTIVITAS 4 SILABUS GUNADARMA) */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold mb-2">
              <Award className="w-3.5 h-3.5" />
              Sistem Penunjang Keputusan (SPK) • Metode Simple Additive Weighting (SAW)
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">
              Perankingan Prioritas Moda & Rekomendasi Kebutuhan Armada Siaga Posko
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-3xl">
              Seluruh angka merupakan <b>data olahan fix</b> hasil komputasi algoritma SAW di sisi backend Python berdasarkan dataset Web Portal STRATEGI Kemenhub.
            </p>
          </div>

          {/* SWITCH OPSI B vs OPSI A */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 shrink-0 self-start lg:self-center">
            <button
              onClick={() => setViewMode("OPSI_B")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "OPSI_B"
                  ? "bg-gov-navy text-white shadow-sm dark:bg-sky-600"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Opsi B: Tab Skenario Terukur
            </button>
            <button
              onClick={() => setViewMode("OPSI_A")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "OPSI_A"
                  ? "bg-gov-navy text-white shadow-sm dark:bg-sky-600"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Opsi A: Tabel Tunggal Fix
            </button>
          </div>
        </div>

        {/* PILIHAN 3 SKENARIO PRESET FIX (AKTIF PADA OPSI B) */}
        {viewMode === "OPSI_B" && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                key: "baseline",
                title: "Skenario 1: Baseline / Moderasi (Acuan Utama)",
                sub: "Pertumbuhan +3,44% YoY (18,46 Juta Penumpang)",
                badge: "Acuan Resmi Posko",
              },
              {
                key: "puncak",
                title: "Skenario 2: Puncak Beban Arus (H-2 / H-1 & H+9)",
                sub: "Tekanan kapasitas maksimum (>1,14 Juta Orang/Hari)",
                badge: "Stress-Test Puncak",
              },
              {
                key: "kontinjensi",
                title: "Skenario 3: Kontinjensi Cuaca Ekstrem BMKG",
                sub: "Mitigasi gelombang tinggi laut/ASDP & pengalihan koridor",
                badge: "Mitigasi Cuaca",
              },
            ].map((sc) => {
              const active = activeScenarioKey === sc.key;
              return (
                <button
                  key={sc.key}
                  onClick={() => setActiveScenarioKey(sc.key as any)}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    active
                      ? "bg-sky-50 dark:bg-sky-950/60 border-sky-500 ring-1 ring-sky-500"
                      : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                      {sc.badge}
                    </span>
                    {active && <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">
                    {sc.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {sc.sub}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* KRITERIA PEMBOBOTAN SAW (C1, C2, C3) & RUMUS MATEMATIKA KATEX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {criteria.map((c) => (
          <div
            key={c.kode}
            className="rounded-xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-900 dark:bg-sky-600 text-white text-xs font-extrabold">
                Kriteria {c.kode} • Bobot {(c.bobot * 100).toFixed(0)}%
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  c.atribut === "Benefit"
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                    : "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                }`}
              >
                Atribut {c.atribut}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{c.nama}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {c.penjelasan}
            </p>
          </div>
        ))}
      </div>

      {/* BARIS TENGAH: GRAFIK RANKING SAW & MATRIKS NORMALISASI R_ij */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Skor Preferensi Akhir SAW (Vᵢ) per Moda
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              {activeScenario.nama_skenario}
            </p>
            <EChartBox option={sawChartOption} height="250px" />
          </div>

          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
              Persamaan Matematis Metode SAW:
            </div>
            <div className="overflow-x-auto py-1">
              <KatexFormula
                tex="V_i = \sum_{j=1}^{3} w_j \cdot r_{ij} = (0,35 \cdot r_{i1}) + (0,40 \cdot r_{i2}) + (0,25 \cdot r_{i3})"
                block={false}
              />
            </div>
          </div>
        </div>

        {/* KANAN (7 KOLOM): MATRIKS KEPUTUSAN (X) & NORMALISASI (R) */}
        <div className="xl:col-span-7 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Matriks Keputusan Awal (Xᵢⱼ) & Matriks Normalisasi Terbobot (Rᵢⱼ)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Pembagi Normalisasi Skenario Aktif: Max(C₁) = <b>{activeScenario.pembagi_normalisasi.max_c1}</b> • Max(C₂) = <b>{activeScenario.pembagi_normalisasi.max_c2}%</b> • Min(C₃) = <b>{activeScenario.pembagi_normalisasi.min_c3}%</b>
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] uppercase text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Peringkat & Moda</th>
                  <th className="py-2.5 px-3 text-right font-bold">C₁ (Indeks)</th>
                  <th className="py-2.5 px-3 text-right font-bold">C₂ (LF %)</th>
                  <th className="py-2.5 px-3 text-right font-bold">C₃ (Cadangan)</th>
                  <th className="py-2.5 px-3 text-right font-bold">Normalisasi (r₁, r₂, r₃)</th>
                  <th className="py-2.5 px-3 text-right font-bold">Skor Vᵢ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeScenario.hasil_saw.map((r) => (
                  <tr key={r.moda} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-3 font-extrabold text-slate-900 dark:text-white">
                      #{r.peringkat_prioritas} {r.moda}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-600 dark:text-slate-300">
                      {r.c1_lonjakan.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                      {r.c2_load_factor.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-600 dark:text-slate-300">
                      {r.c3_cadangan_pct.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      ({r.r1_norm.toFixed(3)}, {r.r2_norm.toFixed(3)}, {r.r3_norm.toFixed(3)})
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-sky-700 dark:text-sky-400">
                      {r.skor_preferensi_v.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TABEL UTAMA: REKOMENDASI KEBUTUHAN ARMADA SIAGA & AKSI TAKTIS POSKO (DATA OLAHAN FIX) */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Tabel Keputusan Final: Estimasi Kebutuhan Penambahan Armada & Rekomendasi Operasional Posko
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Data hasil olahan matang untuk pedoman alokasi sarana Direktorat Jenderal teknis di lingkungan Kementerian Perhubungan RI
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] uppercase text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-3 px-3 font-bold">Prioritas SAW</th>
                <th className="py-3 px-3 font-bold">Moda Transportasi</th>
                <th className="py-3 px-3 text-right font-bold">Proyeksi Penumpang</th>
                <th className="py-3 px-3 text-right font-bold">Load Factor</th>
                <th className="py-3 px-3 text-right font-bold">Rekomendasi Armada Tambahan</th>
                <th className="py-3 px-3 font-bold">Status Urgensi</th>
                <th className="py-3 px-3 font-bold">Rekomendasi Kebijakan & Penempatan Lapangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {activeScenario.hasil_saw.map((r) => (
                <tr key={r.moda} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs mr-1.5 ${
                        r.peringkat_prioritas === 1
                          ? "bg-rose-600"
                          : r.peringkat_prioritas === 2
                          ? "bg-amber-500"
                          : "bg-sky-600"
                      }`}
                    >
                      {r.peringkat_prioritas}
                    </span>
                    Skor {r.skor_saw_100}%
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {r.moda}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-sky-700 dark:text-sky-400 whitespace-nowrap">
                    {fmt(r.vol_pnp)} org
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                    {r.c2_load_factor.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      +{fmt(r.armada_tambahan_unit)}
                    </div>
                    <div className="text-[10px] text-slate-500">{r.satuan_unit}</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        r.peringkat_prioritas <= 2
                          ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300"
                          : "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {r.status_urgensi}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed min-w-[260px]">
                    {r.aksi_taktis}
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
