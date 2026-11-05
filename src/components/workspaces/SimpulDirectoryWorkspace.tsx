"use client";

import React, { useState, useMemo } from "react";
import { MudikHubBundle } from "../../types/mudikhub";
import { EChartsWrapper } from "../EChartsWrapper";
import {
  Search,
  Filter,
  Building2,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Props {
  bundle: MudikHubBundle;
}

const MODA_META: Record<
  string,
  { color: string; badgeBg: string; label: string; count: number }
> = {
  Udara: {
    color: "#1e40af",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    label: "Udara",
    count: 257,
  },
  Perkeretaapian: {
    color: "#ea580c",
    badgeBg: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    label: "Perkeretaapian",
    count: 197,
  },
  Jalan: {
    color: "#16a34a",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    label: "Jalan",
    count: 215,
  },
  Penyeberangan: {
    color: "#9333ea",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    label: "Penyeberangan",
    count: 276,
  },
  Laut: {
    color: "#0891b2",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    label: "Laut",
    count: 267,
  },
};

export function SimpulDirectoryWorkspace({ bundle }: Props) {
  const [selectedModa, setSelectedModa] = useState<string>("ALL");
  const [selectedProvinsi, setSelectedProvinsi] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;

  const provinces = useMemo(() => {
    const set = new Set<string>();
    bundle.dim_simpul_1212.forEach((s) => {
      if (s.provinsi && s.provinsi !== "-") set.add(s.provinsi);
    });
    return Array.from(set).sort();
  }, [bundle.dim_simpul_1212]);

  const filteredSimpul = useMemo(() => {
    return bundle.dim_simpul_1212.filter((s) => {
      if (selectedModa !== "ALL" && s.kategori_moda !== selectedModa) return false;
      if (selectedProvinsi !== "ALL" && s.provinsi !== selectedProvinsi) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = s.nama_simpul.toLowerCase().includes(q);
        const matchCode = s.kode_simpul.toLowerCase().includes(q);
        const matchProv = s.provinsi.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchProv) return false;
      }
      return true;
    });
  }, [bundle.dim_simpul_1212, selectedModa, selectedProvinsi, searchQuery]);

  const top12NodesOption = useMemo(() => {
    const top12 = [...filteredSimpul]
      .sort((a, b) => b.proyeksi_2026 - a.proyeksi_2026)
      .slice(0, 12)
      .reverse();

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(10, 22, 40, 0.95)",
        borderColor: "rgba(56, 189, 248, 0.3)",
        textStyle: { color: "#e2e8f0", fontSize: 11 },
      },
      legend: {
        data: ["Realisasi 2025/2026", "Proyeksi 2026/2027"],
        top: 0,
        textStyle: { color: "#94a3b8", fontSize: 11 },
      },
      grid: { left: "2%", right: "5%", bottom: "4%", top: "12%", containLabel: true },
      xAxis: {
        type: "value",
        axisLabel: {
          color: "#94a3b8",
          fontSize: 10,
          formatter: (v: number) =>
            v >= 1_000_000
              ? (v / 1_000_000).toFixed(1) + "Jt"
              : (v / 1_000).toFixed(0) + "Rb",
        },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.08)", type: "dashed" } },
      },
      yAxis: {
        type: "category",
        data: top12.map((n) =>
          n.nama_simpul.length > 28 ? n.nama_simpul.slice(0, 28) + "…" : n.nama_simpul
        ),
        axisLabel: { color: "#cbd5e1", fontSize: 11 },
      },
      series: [
        {
          name: "Realisasi 2025/2026",
          type: "bar",
          data: top12.map((n) => n.realisasi_2025),
          itemStyle: { color: "#0085ca", borderRadius: [0, 4, 4, 0] },
        },
        {
          name: "Proyeksi 2026/2027",
          type: "bar",
          data: top12.map((n) => n.proyeksi_2026),
          itemStyle: { color: "#ffbd2c", borderRadius: [0, 4, 4, 0] },
        },
      ],
    };
  }, [filteredSimpul]);

  const totalPages = Math.max(1, Math.ceil(filteredSimpul.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSimpul.slice(start, start + pageSize);
  }, [filteredSimpul, currentPage]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & 5 Moda Summary Cards */}
      <div className="glass-card rounded-2xl p-6 border border-sky-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/25 text-emerald-300 text-xs font-medium mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Direktori Master 1.212 Simpul Pantauan Nasional Terverifikasi
            </div>
            <h2 className="text-xl font-bold text-white">
              Direktori Simpul Transportasi Multimoda (1.212 Simpul Resmi)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Basis data lengkap seluruh simpul pantauan nasional dari{" "}
              <span className="text-sky-300 font-semibold">Portal STRATEGI Kemenhub</span>{" "}
              meliputi Bandara, Stasiun Kereta Api, Terminal Bus Tipe A, Pelabuhan Penyeberangan ASDP, dan Pelabuhan Laut.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedModa("ALL");
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedModa === "ALL"
                  ? "bg-sky-600 text-white border-sky-400 shadow-lg"
                  : "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500"
              }`}
            >
              Semua Simpul (1.212)
            </button>
            {Object.entries(MODA_META).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedModa(key);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                  selectedModa === key
                    ? "bg-slate-800 text-white border-amber-400 shadow-lg"
                    : "bg-slate-900/70 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                <span>{meta.label}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-950/90 text-[11px] font-mono text-slate-200">
                  {meta.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 12 Horizontal Bar Chart */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Peringkat 12 Simpul Terpadat ({selectedModa === "ALL" ? "Lintas Moda Nasional" : `Moda ${selectedModa}`})
              </h3>
              <p className="text-xs text-slate-400">
                Komparasi volume keberangkatan penumpang Realisasi 2025/2026 vs Proyeksi 2026/2027
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-sky-300 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-lg">
            Menampilkan {filteredSimpul.length.toLocaleString("id-ID")} dari 1.212 Simpul
          </span>
        </div>
        <EChartsWrapper option={top12NodesOption} height="390px" />
      </div>

      {/* Searchable & Paginated Table of All 1,212 Simpul */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Tabel Direktori Lengkap 1.212 Simpul Pantauan Nasional
              </h3>
              <p className="text-xs text-slate-400">
                Cari nama bandara, stasiun, terminal, atau pelabuhan beserta proyeksi beban puncak harian (H-1)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari simpul / kode / provinsi..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 w-60"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 rounded-xl px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-sky-400" />
              <select
                value={selectedProvinsi}
                onChange={(e) => {
                  setSelectedProvinsi(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs text-slate-200 focus:outline-none max-w-[180px]"
              >
                <option value="ALL" className="bg-slate-900">
                  Semua Provinsi ({provinces.length})
                </option>
                {provinces.map((p) => (
                  <option key={p} value={p} className="bg-slate-900">
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800">
                <th className="py-3 px-3 font-semibold">Rank</th>
                <th className="py-3 px-3 font-semibold">Kode</th>
                <th className="py-3 px-3 font-semibold">Nama Simpul Transportasi</th>
                <th className="py-3 px-3 font-semibold">Moda</th>
                <th className="py-3 px-3 font-semibold">Provinsi</th>
                <th className="py-3 px-3 font-semibold text-right">Realisasi 2025</th>
                <th className="py-3 px-3 font-semibold text-right text-amber-300">
                  Proyeksi 2026/2027
                </th>
                <th className="py-3 px-3 font-semibold text-right">Pertumbuhan</th>
                <th className="py-3 px-3 font-semibold text-right">Est. Puncak H-1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedRows.map((s) => (
                <tr
                  key={`${s.kategori_moda}-${s.kode_simpul}-${s.rank_nasional}`}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono text-slate-400">#{s.rank_nasional}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-sky-300">
                    {s.kode_simpul}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-white">{s.nama_simpul}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        MODA_META[s.kategori_moda]?.badgeBg || ""
                      }`}
                    >
                      {s.kategori_moda}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{s.provinsi}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                    {s.realisasi_2025.toLocaleString("id-ID")}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-300">
                    {s.proyeksi_2026.toLocaleString("id-ID")}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <span
                      className={
                        s.growth_pct >= 0 ? "text-emerald-400" : "text-rose-400"
                      }
                    >
                      {s.growth_pct >= 0 ? "+" : ""}
                      {s.growth_pct.toFixed(2).replace(".", ",")}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-sky-300">
                    {s.puncak_harian_estimasi.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
          <div>
            Menampilkan{" "}
            <span className="text-white font-semibold">{paginatedRows.length}</span> dari{" "}
            <span className="text-sky-300 font-semibold">
              {filteredSimpul.length.toLocaleString("id-ID")}
            </span>{" "}
            simpul terfilter (Total Resmi: 1.212 Simpul)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-200 px-2">
              Halaman {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
