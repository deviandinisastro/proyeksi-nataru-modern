"use client";

import React, { useState, useEffect } from "react";
import { MudikHubBundle } from "@/types/mudikhub";
import OverviewWorkspace from "@/components/workspaces/OverviewWorkspace";
import SpatialMapWorkspace from "@/components/workspaces/SpatialMapWorkspace";
import SawDecisionWorkspace from "@/components/workspaces/SawDecisionWorkspace";
import CorridorWorkspace from "@/components/workspaces/CorridorWorkspace";
import ForecastingWorkspace from "@/components/workspaces/ForecastingWorkspace";
import ArchitectureWorkspace from "@/components/workspaces/ArchitectureWorkspace";
import {
  LayoutDashboard,
  MapPin,
  Award,
  Car,
  Trophy,
  Database,
  Sun,
  Moon,
  ShieldCheck,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  ExternalLink,
  Clock,
} from "lucide-react";

type WorkspaceTab =
  | "overview"
  | "spatial"
  | "saw"
  | "corridor"
  | "forecasting"
  | "architecture";

// Logo Vektor Eksklusif Terinspirasi Portal STRATEGI Kemenhub
// Menggabungkan 4 busur moda transportasi (Udara, Laut, Darat, KA) dan Bintang Kompas Navigasi
function StrategiEmblem({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="stratBg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#001F3F" />
          <stop offset="0.6" stopColor="#003882" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="goldStar" x1="16" y1="16" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      {/* Dasar Emblem */}
      <rect width="48" height="48" rx="12" fill="url(#stratBg)" />
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="11.25" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />

      {/* 4 Busur Sirkulasi Konvergensi Multimoda STRATEGI */}
      {/* Udara (Sky Blue) */}
      <path d="M12 18 C18 10, 30 10, 36 18" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
      {/* Laut (Azure) */}
      <path d="M12 30 C18 38, 30 38, 36 30" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
      {/* Kereta Api (Orange) */}
      <path d="M18 12 C10 18, 10 30, 18 36" stroke="#FB923C" strokeWidth="2.5" strokeLinecap="round" />
      {/* Jalan / Darat (Emerald) */}
      <path d="M30 12 C38 18, 38 30, 30 36" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />

      {/* Bintang Kompas Navigasi Pusat (Kemenhub Gold) */}
      <polygon
        points="24,14 26.8,21.2 34,24 26.8,26.8 24,34 21.2,26.8 14,24 21.2,21.2"
        fill="url(#goldStar)"
      />
      <circle cx="24" cy="24" r="2.8" fill="#FFFFFF" />
    </svg>
  );
}

export default function MudikHubPage() {
  const [bundle, setBundle] = useState<MudikHubBundle | null>(null);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [clockText, setClockText] = useState<string>("");

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Jam Realtime (WIB)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const timeStr = now
        .toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(/\./g, ":");
      setClockText(`${dateStr} • ${timeStr} WIB`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("./data/mudikhub_master_bundle.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: MudikHubBundle) => {
        setBundle(json);
      })
      .catch((err) => {
        setErrorMsg(err.message || "Gagal memuat bundel data.");
      });
  }, []);

  const navGroups: {
    groupTitle: string;
    items: {
      id: WorkspaceTab;
      label: string;
      badge?: string;
      icon: any;
    }[];
  }[] = [
    {
      groupTitle: "Pemantauan & Spasial Posko",
      items: [
        {
          id: "overview",
          label: "Ikhtisar Eksekutif",
          icon: LayoutDashboard,
        },
        {
          id: "spatial",
          label: "Peta Web GIS",
          badge: "1.212",
          icon: MapPin,
        },
        {
          id: "corridor",
          label: "Koridor Tol & ASDP",
          icon: Car,
        },
      ],
    },
    {
      groupTitle: "Keputusan & Metodologi Data",
      items: [
        {
          id: "saw",
          label: "SPK Prioritas Simpul",
          badge: "SAW",
          icon: Award,
        },
        {
          id: "forecasting",
          label: "Turnamen 7 Model",
          icon: Trophy,
        },
        {
          id: "architecture",
          label: "Arsitektur Data",
          icon: Database,
        },
      ],
    },
  ];

  const allItems = navGroups.flatMap((g) => g.items);
  const currentNav = allItems.find((i) => i.id === activeTab) || allItems[0];

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white">
        <div className="max-w-md p-6 rounded-2xl bg-slate-900 border border-rose-800 text-center">
          <div className="text-lg font-bold text-rose-400 mb-2">
            Gagal Memuat Data
          </div>
          <p className="text-xs text-slate-300">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-white">
        <div className="w-10 h-10 rounded-full border-4 border-sky-500 border-t-transparent animate-spin mb-4" />
        <div className="text-sm font-bold tracking-wide">
          Memuat Data Portal STRATEGI Kemenhub (1.212 Simpul Nasional)...
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Pusat Data dan Teknologi Informasi Kementerian Perhubungan RI
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* OVERLAY DRAWER MOBILE */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR KIRI MODERN: KLIK AREA SIDEBAR UNTUK MEMBUKA SAAT TERTUTUP */}
      <aside
        onClick={() => {
          if (sidebarCollapsed) {
            setSidebarCollapsed(false);
          }
        }}
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-200 shrink-0 ${
          sidebarCollapsed ? "lg:w-20 cursor-pointer" : "lg:w-72"
        } ${
          mobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* BAGIAN ATAS SIDEBAR: LOGO & JUDUL (KLIK UNTUK KE MENU UTAMA) + DAFTAR MENU */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* HEADER BRAND SIDEBAR (TANPA TOMBOL COLLAPSE DI SAMPING JUDUL) */}
          <div
            className={`h-16 flex items-center border-b border-slate-200 dark:border-slate-800 shrink-0 ${
              sidebarCollapsed ? "px-2 justify-center" : "px-4 justify-between"
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("overview");
                setMobileMenuOpen(false);
              }}
              title="Kembali ke Menu Utama (Ikhtisar Eksekutif)"
              className={`flex items-center gap-3 overflow-hidden text-left group hover:opacity-95 transition ${
                sidebarCollapsed ? "justify-center" : "min-w-0 flex-1"
              }`}
            >
              <StrategiEmblem className="w-10 h-10 shrink-0 group-hover:scale-105 transition-transform" />
              {!sidebarCollapsed && (
                <div className="truncate">
                  <div className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider truncate">
                    Pusdatin Kemenhub RI
                  </div>
                  <div className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                    MudikHub Nataru
                  </div>
                </div>
              )}
            </button>

            {/* Tombol Tutup Khusus Layar Mobile */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(false);
              }}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* DAFTAR MENU WORKSPACE (CLEAN 1-LINE DENGAN SPACING LEGA) */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
            {navGroups.map((group) => (
              <div key={group.groupTitle}>
                {!sidebarCollapsed && (
                  <div className="px-2.5 mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
                    {group.groupTitle}
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        title={item.label}
                        className={`flex items-center rounded-xl text-left transition-all ${
                          sidebarCollapsed
                            ? "w-11 h-11 mx-auto justify-center px-0"
                            : "w-full gap-3 px-3 py-2.5"
                        } ${
                          active
                            ? "bg-gov-navy text-white shadow-xs dark:bg-sky-600"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            active
                              ? "text-white"
                              : "text-sky-600 dark:text-sky-400"
                          }`}
                        />
                        {!sidebarCollapsed && (
                          <span className="flex-1 text-xs font-bold truncate">
                            {item.label}
                          </span>
                        )}
                        {!sidebarCollapsed && item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BAGIAN BAWAH SIDEBAR: TOMBOL CIUTKAN / BUKA MENU & KARTU STRATEGI KEMENHUB */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
          {/* Tombol Ciutkan / Buka Sidebar */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarCollapsed(!sidebarCollapsed);
            }}
            title={sidebarCollapsed ? "Buka Sidebar" : "Ciutkan Menu Sidebar"}
            className={`hidden lg:flex items-center rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-800/90 hover:bg-sky-600 hover:text-white hover:border-sky-500 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all ${
              sidebarCollapsed
                ? "w-11 h-11 mx-auto justify-center"
                : "w-full px-3 py-2 justify-center gap-2"
            }`}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-sky-500 group-hover:text-white" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-sky-500" />
                <span>Ciutkan Menu</span>
              </>
            )}
          </button>

          {/* Kartu Sumber Data Resmi (Ringkas & Elegan) */}
          {!sidebarCollapsed && (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div className="truncate">
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                    Portal STRATEGI
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Pusdatin Kemenhub RI
                  </div>
                </div>
              </div>
              <a
                href="https://strategi.kemenhub.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-md text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-700 shrink-0"
                title="Buka Portal STRATEGI Kemenhub"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </aside>

      {/* KOLOM KANAN: HEADER RAPI + KONTEN UTAMA + FOOTER RINGKAS */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR (RAPI, SIMPLE & DILENGKAPI JAM REALTIME) */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                {currentNav.label}
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Posko Terpadu Angkutan Nataru 2026/2027 • Pusdatin Kemenhub RI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Jam Realtime WIB */}
            {clockText && (
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200">
                <Clock className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
                <span>{clockText}</span>
              </div>
            )}

            {/* Toggle Mode Terang / Gelap */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-sky-500 transition"
              title={darkMode ? "Ubah ke Mode Terang" : "Ubah ke Mode Gelap"}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </header>

        {/* AREA KONTEN UTAMA WORKSPACE */}
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6">
          {activeTab === "overview" && (
            <OverviewWorkspace data={bundle} darkMode={darkMode} />
          )}
          {activeTab === "spatial" && (
            <SpatialMapWorkspace data={bundle} darkMode={darkMode} />
          )}
          {activeTab === "saw" && (
            <SawDecisionWorkspace data={bundle} darkMode={darkMode} />
          )}
          {activeTab === "corridor" && (
            <CorridorWorkspace data={bundle} darkMode={darkMode} />
          )}
          {activeTab === "forecasting" && (
            <ForecastingWorkspace data={bundle} darkMode={darkMode} />
          )}
          {activeTab === "architecture" && (
            <ArchitectureWorkspace data={bundle} darkMode={darkMode} />
          )}
        </main>

        {/* FOOTER RESMI PUSDATIN KEMENHUB RI (RINGKAS & BERSIH SESUAI INSTRUKSI) */}
        <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-500 shrink-0" />
              <span>
                Pusat Data dan Teknologi Informasi (Pusdatin) — Kementerian Perhubungan Republik Indonesia
              </span>
            </div>
            <div className="sm:text-right">
              Sumber Data Resmi:{" "}
              <a
                href="https://strategi.kemenhub.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Portal STRATEGI Kemenhub (https://strategi.kemenhub.go.id/)
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
