"use client";

import React, { useMemo } from "react";
import { MudikHubBundle } from "@/types/mudikhub";
import EChartBox from "@/components/charts/EChartBox";
import { Car, Ship, Compass, ArrowUpRight, ArrowDownLeft, ShieldCheck } from "lucide-react";

interface CorridorWorkspaceProps {
  data: MudikHubBundle;
  darkMode: boolean;
}

const fmt = (n: number) => n.toLocaleString("id-ID");

export default function CorridorWorkspace({ data, darkMode }: CorridorWorkspaceProps) {
  const kpi = data.kpi_utama;
  const textColor = darkMode ? "#cbd5e1" : "#334155";
  const gridColor = darkMode ? "rgba(148, 163, 184, 0.14)" : "rgba(148, 163, 184, 0.22)";

  // 1. ECharts Option: 4 Gerbang Tol Utama Barrier Jabodetabek (Keluar vs Masuk)
  const tolChartOption = useMemo(() => {
    const labels = data.gerbang_tol_jakarta.map((g) => g.gerbang_tol.split(" (")[0]);
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: darkMode ? "#0f172a" : "#ffffff",
        borderColor: darkMode ? "#334155" : "#cbd5e1",
        textStyle: { color: darkMode ? "#f8fafc" : "#0f172a", fontSize: 12 },
      },
      legend: {
        top: 0,
        textStyle: { color: textColor, fontSize: 12, fontWeight: 600 },
      },
      grid: { top: 40, right: 20, bottom: 36, left: 68 },
      xAxis: {
        type: "category",
        data: labels,
        axisLabel: { color: textColor, fontSize: 11, fontWeight: 700 },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: textColor,
          fontSize: 11,
          formatter: (v: number) => `${(v / 1000).toFixed(0)} Rb`,
        },
        splitLine: { lineStyle: { color: gridColor, type: "dashed" } },
      },
      series: [
        {
          name: "Keluar Jakarta (Proyeksi 2026)",
          type: "bar",
          data: data.gerbang_tol_jakarta.map((g) => g.keluar_proyeksi_2026),
          itemStyle: { color: "#0284c7", borderRadius: [6, 6, 0, 0] },
        },
        {
          name: "Masuk Jakarta (Proyeksi 2026)",
          type: "bar",
          data: data.gerbang_tol_jakarta.map((g) => g.masuk_proyeksi_2026),
          itemStyle: { color: "#f59e0b", borderRadius: [6, 6, 0, 0] },
        },
      ],
    };
  }, [data.gerbang_tol_jakarta, darkMode, textColor, gridColor]);

  // 2. ECharts Option: Komposisi Kendaraan ASDP (Roda 2, Roda 4, Truk Logistik)
  const asdpChartOption = useMemo(() => {
    const labels = data.asdp_kendaraan.map((a) => a.lintas.split(" (")[0]);
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: darkMode ? "#0f172a" : "#ffffff",
        borderColor: darkMode ? "#334155" : "#cbd5e1",
        textStyle: { color: darkMode ? "#f8fafc" : "#0f172a", fontSize: 12 },
      },
      legend: {
        top: 0,
        textStyle: { color: textColor, fontSize: 11, fontWeight: 600 },
      },
      grid: { top: 40, right: 20, bottom: 36, left: 68 },
      xAxis: {
        type: "category",
        data: labels,
        axisLabel: { color: textColor, fontSize: 11, fontWeight: 600 },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: textColor,
          fontSize: 11,
          formatter: (v: number) => `${(v / 1000).toFixed(0)} Rb`,
        },
        splitLine: { lineStyle: { color: gridColor, type: "dashed" } },
      },
      series: [
        {
          name: "Roda 4 Pribadi (Mobil)",
          type: "bar",
          barGap: "20%",
          data: data.asdp_kendaraan.map((a) => a.proyeksi_roda_4),
          itemStyle: { color: "#0284c7", borderRadius: [4, 4, 0, 0] },
        },
        {
          name: "Roda 2 (Sepeda Motor)",
          type: "bar",
          data: data.asdp_kendaraan.map((a) => a.proyeksi_roda_2),
          itemStyle: { color: "#10b981", borderRadius: [4, 4, 0, 0] },
        },
        {
          name: "Truk Logistik Sumbu 3+",
          type: "bar",
          data: data.asdp_kendaraan.map((a) => a.proyeksi_truk_logistik),
          itemStyle: { color: "#f59e0b", borderRadius: [4, 4, 0, 0] },
        },
      ],
    };
  }, [data.asdp_kendaraan, darkMode, textColor, gridColor]);

  const totalKeluar4GT = data.gerbang_tol_jakarta.reduce((s, g) => s + g.keluar_proyeksi_2026, 0);
  const totalMasuk4GT = data.gerbang_tol_jakarta.reduce((s, g) => s + g.masuk_proyeksi_2026, 0);

  return (
    <div className="space-y-6">
      {/* RINGKASAN KORIDOR JALAN TOL, ARTERI & LINTAS UTAMA ASDP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500">Total LHR Jalan Tol Nasional</span>
            <Car className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {fmt(kpi.total_lhr_tol_2026)} <span className="text-xs font-medium text-slate-500">Kendaraan</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            +{kpi.pertumbuhan_tol_yoy_pct.toFixed(2).replace(".", ",")}% YoY vs Realisasi 2025 ({fmt(kpi.total_lhr_tol_2025)})
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500">Total Pergerakan Jalan Arteri (96 Titik)</span>
            <Compass className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {fmt(kpi.total_arteri_2026)} <span className="text-xs font-medium text-slate-500">Kendaraan</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            Jalur Non-Tol Pantura, Pansela, Lintas Sumatera ({kpi.pertumbuhan_arteri_yoy_pct.toFixed(2).replace(".", ",")}% YoY)
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500">4 Gerbang Tol Barrier Jabodetabek</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-sky-700 dark:text-sky-400">
            {fmt(totalKeluar4GT + totalMasuk4GT)} <span className="text-xs font-medium text-slate-500">Kendaraan</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            Keluar: <b>{fmt(totalKeluar4GT)}</b> • Masuk: <b>{fmt(totalMasuk4GT)}</b>
          </div>
        </div>
      </div>

      {/* GRAFIK & TABEL 4 GERBANG TOL BARRIER JABODETABEK */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-6 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Proyeksi Beban 4 Gerbang Tol Utama Barrier Jabodetabek
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            4 Gerbang Tol batas utama jaringan tol keluar-masuk aglomerasi Jabodetabek (Trans-Jawa, Bandung, Merak, Puncak)
          </p>
          <EChartBox option={tolChartOption} height="310px" />

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase text-slate-500">
                  <th className="py-2 px-2 font-bold">Gerbang Tol Barrier</th>
                  <th className="py-2 px-2 text-right font-bold">Keluar 2026</th>
                  <th className="py-2 px-2 text-right font-bold">Masuk 2026</th>
                  <th className="py-2 px-2 text-right font-bold">Total 2 Arah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.gerbang_tol_jakarta.map((g) => (
                  <tr key={g.gerbang_tol}>
                    <td className="py-2.5 px-2 font-bold text-slate-800 dark:text-slate-200">{g.gerbang_tol}</td>
                    <td className="py-2.5 px-2 text-right font-semibold text-sky-600 dark:text-sky-400">
                      {fmt(g.keluar_proyeksi_2026)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-semibold text-amber-600 dark:text-amber-400">
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

        {/* KANAN: KOMPOSISI KENDARAAN PENYEBERANGAN ASDP */}
        <div className="xl:col-span-6 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Proyeksi Kendaraan Lintas Utama Penyeberangan ASDP
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Segmentasi beban Roda 4 Pribadi, Roda 2 Motor, dan Truk Logistik pada Selat Sunda & Selat Bali
          </p>
          <EChartBox option={asdpChartOption} height="310px" />

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase text-slate-500">
                  <th className="py-2 px-2 font-bold">Lintas Utama ASDP</th>
                  <th className="py-2 px-2 text-right font-bold">Roda 4</th>
                  <th className="py-2 px-2 text-right font-bold">Roda 2</th>
                  <th className="py-2 px-2 text-right font-bold">Truk Logistik</th>
                  <th className="py-2 px-2 text-right font-bold">Total 2026</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.asdp_kendaraan.map((a) => (
                  <tr key={a.lintas}>
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
