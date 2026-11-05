"use client";

import React, { useEffect, useState } from "react";
import { MudikHubBundle } from "../types/mudikhub";
import { OverviewWorkspace } from "../components/workspaces/OverviewWorkspace";
import { DailyTrendWorkspace } from "../components/workspaces/DailyTrendWorkspace";
import { SimpulDirectoryWorkspace } from "../components/workspaces/SimpulDirectoryWorkspace";
import { SpatialMapWorkspace } from "../components/workspaces/SpatialMapWorkspace";
import { CorridorWorkspace } from "../components/workspaces/CorridorWorkspace";
import { SawDecisionWorkspace } from "../components/workspaces/SawDecisionWorkspace";
import { ForecastingWorkspace } from "../components/workspaces/ForecastingWorkspace";
import { ArchitectureWorkspace } from "../components/workspaces/ArchitectureWorkspace";
import {
  LayoutDashboard,
  TrendingUp,
  Building2,
  MapPin,
  Car,
  Award,
  Sigma,
  ShieldCheck,
  Calendar,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Database,
} from "lucide-react";

type TabKey =
  | "overview"
  | "trend"
  | "directory"
  | "spatial"
  | "corridor"
  | "saw"
  | "methodology";

const NAV_TABS: {
  id: TabKey;
  label: string;
  subtitle: string;
  section: "OPERASIONAL & KEBIJAKAN" | "SPK & METODOLOGI";
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "overview",
    label: "Ikhtisar Proyeksi Posko",
    subtitle: "4 KPI Eksekutif, Pangsa Moda & Kalender 18 Hari",
    section: "OPERASIONAL & KEBIJAKAN",
    icon: LayoutDashboard,
  },
  {
    id: "trend",
    label: "Tren Harian Proyeksi",
    subtitle: "Kurva 3 Tahun (2024–2027) Penumpang & Sarana",
    section: "OPERASIONAL & KEBIJAKAN",
    icon: TrendingUp,
  },
  {
    id: "directory",
    label: "Direktori Simpul Multimoda",
    subtitle: "Peringkat & Tabel Lengkap 1.212 Simpul Resmi",
    section: "OPERASIONAL & KEBIJAKAN",
    icon: Building2,
  },
  {
    id: "spatial",
    label: "Peta Spasial Proyeksi",
    subtitle: "Web GIS Interaktif 1.212 Simpul Nasional",
    section: "OPERASIONAL & KEBIJAKAN",
    icon: MapPin,
  },
  {
    id: "corridor",
    label: "Titik Kritis Tol & ASDP",
    subtitle: "4 Gerbang Tol Utama & Pelabuhan Penyeberangan",
    section: "OPERASIONAL & KEBIJAKAN",
    icon: Car,
  },
  {
    id: "saw",
    label: "SPK Metode SAW & Armada",
    subtitle: "Prioritas Simpul Padat & Rekomendasi Taktis",
    section: "SPK & METODOLOGI",
    icon: Award,
  },
  {
    id: "methodology",
    label: "Matriks & Metodologi",
    subtitle: "Turnamen 7 Model (MAPE 6,93%) & Star Schema",
    section: "SPK & METODOLOGI",
    icon: Sigma,
  },
];

export default function HomePage() {
  const [bundle, setBundle] = useState<MudikHubBundle | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [methodSubTab, setMethodSubTab] = useState<"forecast" | "architecture">("forecast");
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch("./data/mudikhub_master_bundle.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: MudikHubBundle) => setBundle(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="glass-card rounded-2xl p-8 max-w-md border border-rose-500/40">
          <h2 className="text-lg font-bold text-rose-400 mb-2">Gagal Memuat Bundle Data</h2>
          <p className="text-xs text-slate-300 font-mono">{error}</p>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-full border-4 border-sky-500/30 border-t-amber-400 animate-spin mb-4" />
        <h2 className="text-base font-bold text-white">
          Memuat Basis Data Portal STRATEGI Kemenhub (1.212 Simpul Nasional)...
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Pusat Data dan Teknologi Informasi — Kementerian Perhubungan RI
        </p>
      </div>
    );
  }

  const activeNavObj = NAV_TABS.find((t) => t.id === activeTab) || NAV_TABS[0];

  return (
    <div className="min-h-screen flex bg-[#030b17] text-slate-100">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Collapsible Sidebar (Matched to proyeksi-nataru-dss Layout) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col bg-[#061326]/95 backdrop-blur-xl border-r border-sky-500/20 transition-all duration-300 ${
          sidebarCollapsed ? "lg:w-20" : "lg:w-72"
        } ${
          mobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Sidebar Brand Header (Centered when collapsed, no clipping!) */}
        <div
          className={`h-20 flex items-center border-b border-slate-800/80 shrink-0 ${
            sidebarCollapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              onClick={() => sidebarCollapsed && setSidebarCollapsed(false)}
              title={sidebarCollapsed ? "Klik untuk melebarkan sidebar" : "MudikHub Pusdatin Kemenhub"}
              className={`w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 via-blue-700 to-amber-400 p-[1.5px] shadow-lg shadow-sky-500/20 shrink-0 ${
                sidebarCollapsed ? "cursor-pointer hover:scale-105 transition-transform" : ""
              }`}
            >
              <div className="w-full h-full bg-[#041022] rounded-[10px] flex items-center justify-center font-black text-sm tracking-tighter text-white">
                MH
              </div>
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold tracking-tight text-white">
                    MUDIK<span className="text-amber-400">HUB</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-400/30 text-[9px] font-mono text-sky-300 uppercase">
                    DSS 2026
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  Pusdatin Kemenhub RI
                </p>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Menu List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {(["OPERASIONAL & KEBIJAKAN", "SPK & METODOLOGI"] as const).map((sec) => {
            const items = NAV_TABS.filter((t) => t.section === sec);
            return (
              <div key={sec}>
                {!sidebarCollapsed && (
                  <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {sec}
                  </div>
                )}
                <div className="space-y-1.5">
                  {items.map((t) => {
                    const Icon = t.icon;
                    const active = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveTab(t.id);
                          setMobileMenuOpen(false);
                        }}
                        title={sidebarCollapsed ? `${t.label} — ${t.subtitle}` : undefined}
                        className={`flex items-center rounded-xl text-left transition-all ${
                          sidebarCollapsed
                            ? "w-12 h-12 mx-auto justify-center px-0"
                            : "w-full gap-3 px-3 py-2.5"
                        } ${
                          active
                            ? "bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-lg shadow-sky-600/25 border border-sky-400/40"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 shrink-0 ${
                            active ? "text-amber-300" : "text-sky-400/80"
                          }`}
                        />
                        {!sidebarCollapsed && (
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold truncate">{t.label}</div>
                            <div
                              className={`text-[10px] truncate ${
                                active ? "text-sky-100/90" : "text-slate-500"
                              }`}
                            >
                              {t.subtitle}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Sidebar Collapse Toggle & Data Status Box (Matches proyeksi-nataru-dss) */}
        <div className="p-3 border-t border-slate-800/80 shrink-0 space-y-2.5">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Lebarkan Menu Sidebar" : "Ciutkan Menu Sidebar"}
            className={`hidden lg:flex items-center rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white transition-all text-xs font-medium ${
              sidebarCollapsed
                ? "w-12 h-10 mx-auto justify-center"
                : "w-full px-3 py-2 justify-between"
            }`}
          >
            {!sidebarCollapsed && <span>Ciutkan Menu</span>}
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-sky-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-sky-400" />
            )}
          </button>

          {!sidebarCollapsed ? (
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Data Terverifikasi
                </span>
                <span className="font-mono text-amber-300 font-bold">98,04%</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800/80 text-center">
                <div className="bg-slate-950/70 rounded-lg py-1 px-1">
                  <div className="text-[9px] text-slate-400">Simpul</div>
                  <div className="text-[11px] font-bold text-white font-mono">1.212</div>
                </div>
                <div className="bg-slate-950/70 rounded-lg py-1 px-1">
                  <div className="text-[9px] text-slate-400">Posko</div>
                  <div className="text-[11px] font-bold text-sky-300 font-mono">18 Hari</div>
                </div>
                <div className="bg-slate-950/70 rounded-lg py-1 px-1">
                  <div className="text-[9px] text-slate-400">Moda</div>
                  <div className="text-[11px] font-bold text-amber-300 font-mono">5 Moda</div>
                </div>
              </div>
              <a
                href="https://strategi.kemenhub.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-[10px] text-sky-400 hover:text-sky-300 pt-1"
              >
                <span>Sumber: strategi.kemenhub.go.id</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-1 py-1"
              title="Data Terverifikasi: 1.212 Simpul Resmi Portal STRATEGI Kemenhub"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono text-slate-400">1.212</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 h-20 bg-[#040f21]/85 backdrop-blur-xl border-b border-sky-500/20 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-white truncate">
                  {activeNavObj.label}
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-[10px] font-semibold text-sky-300">
                  Posko Nataru 2026/2027
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{activeNavObj.subtitle}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              18 Des 2026 – 4 Jan 2027 (H-7 s.d. H+10)
            </span>
            <span className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              1.212 Simpul Pantauan Nasional
            </span>
          </div>
        </header>

        {/* Active Workspace Container */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6">
          {activeTab === "overview" && <OverviewWorkspace bundle={bundle} />}
          {activeTab === "trend" && <DailyTrendWorkspace bundle={bundle} />}
          {activeTab === "directory" && <SimpulDirectoryWorkspace bundle={bundle} />}
          {activeTab === "spatial" && <SpatialMapWorkspace bundle={bundle} />}
          {activeTab === "corridor" && <CorridorWorkspace bundle={bundle} />}
          {activeTab === "saw" && <SawDecisionWorkspace bundle={bundle} />}
          {activeTab === "methodology" && (
            <div className="space-y-6">
              {/* Sub-tab selector inside Matriks & Metodologi */}
              <div className="glass-card rounded-2xl p-4 border border-sky-500/20 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    Dokumentasi Metodologi Peramalan, Matriks 12 Indikator & Basis Data Star Schema
                  </h2>
                  <p className="text-xs text-slate-400">
                    Pilih tampilan evaluasi model deret waktu (MAPE 6,93%) atau arsitektur data Star Schema & kamus data
                  </p>
                </div>
                <div className="inline-flex rounded-xl bg-slate-900/90 p-1 border border-slate-700/80">
                  <button
                    onClick={() => setMethodSubTab("forecast")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      methodSubTab === "forecast"
                        ? "bg-sky-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Sigma className="w-3.5 h-3.5" />
                    Turnamen 7 Model & Matriks 12 Indikator
                  </button>
                  <button
                    onClick={() => setMethodSubTab("architecture")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      methodSubTab === "architecture"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    Star Schema, Kamus Data & Audit ETL
                  </button>
                </div>
              </div>

              {methodSubTab === "forecast" ? (
                <ForecastingWorkspace bundle={bundle} />
              ) : (
                <ArchitectureWorkspace bundle={bundle} />
              )}
            </div>
          )}
        </main>

        {/* Official Kemenhub Footer (No student/mentor/campus/BI Metabase/SIASATI) */}
        <footer className="border-t border-slate-800/80 bg-[#020813] py-6 px-4 sm:px-6 mt-auto">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <div className="font-bold text-slate-200">
                MudikHub — Sistem Pendukung Keputusan & Proyeksi Angkutan Nataru 2026/2027
              </div>
              <div className="mt-1">
                Pusat Data dan Teknologi Informasi (Pusdatin) — Kementerian Perhubungan Republik Indonesia
              </div>
            </div>
            <div className="sm:text-right">
              <div className="text-slate-300 font-medium">
                Sumber Data Resmi:{" "}
                <a
                  href="https://strategi.kemenhub.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline font-semibold"
                >
                  Portal STRATEGI Kemenhub (https://strategi.kemenhub.go.id/)
                </a>
              </div>
              <div className="mt-1 text-slate-500">
                Cakupan Terverifikasi: 1.212 Simpul Pantauan Nasional (257 Udara • 197 Perkeretaapian • 215 Jalan • 276 Penyeberangan • 267 Laut)
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
