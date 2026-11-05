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
} from "lucide-react";

type WorkspaceTab =
  | "overview"
  | "spatial"
  | "saw"
  | "corridor"
  | "forecasting"
  | "architecture";

export default function MudikHubPage() {
  const [bundle, setBundle] = useState<MudikHubBundle | null>(null);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

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

  const navItems: { id: WorkspaceTab; label: string; badge?: string; icon: any }[] = [
    { id: "overview", label: "Ikhtisar Eksekutif Posko", badge: "3 KPI", icon: LayoutDashboard },
    { id: "spatial", label: "Peta Web GIS 1.212 Simpul", badge: "1.212", icon: MapPin },
    { id: "saw", label: "SPK Metode SAW & Armada", badge: "SAW", icon: Award },
    { id: "corridor", label: "Koridor Tol, Arteri & ASDP", badge: "4 GT", icon: Car },
    { id: "forecasting", label: "Turnamen 7 Model & Rumus", badge: "6,93%", icon: Trophy },
    { id: "architecture", label: "Star Schema & ETL Strategi", badge: "DB", icon: Database },
  ];

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white">
        <div className="max-w-md p-6 rounded-2xl bg-slate-900 border border-rose-800 text-center">
          <div className="text-lg font-bold text-rose-400 mb-2">Gagal Memuat Data</div>
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
          Memuat Ekosistem Data Portal STRATEGI Kemenhub (1.212 Simpul Nasional)...
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Pusat Data dan Teknologi Informasi Kementerian Perhubungan RI
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* TOP NAVBAR KEMENHUB RI */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 gap-4">
            {/* IDENTITAS PORTAL MUDIKHUB PUSDATIN */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gov-navy via-sky-700 to-amber-500 flex items-center justify-center text-white font-black text-base shadow-md shrink-0">
                MH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                    MudikHub Modern
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-extrabold uppercase">
                    <ShieldCheck className="w-3 h-3" />
                    STRATEGI Kemenhub
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md sm:max-w-xl">
                  Pusat Data dan Teknologi Informasi (Pusdatin) Kementerian Perhubungan RI • Posko Angkutan Nasional
                </p>
              </div>
            </div>

            {/* KANAN: BADGE RINGKAS & TOGGLE DARK/LIGHT MODE */}
            <div className="flex items-center gap-2.5">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Cakupan:</span>
                <span className="font-extrabold text-sky-600 dark:text-sky-400">1.212 Simpul Resmi</span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">MAPE 6,93%</span>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-sky-500 transition"
                title="Ubah Mode Tampilan Terang / Gelap"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Mode Terang</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-700" />
                    <span className="hidden sm:inline">Mode Gelap</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* BARIS TAB WORKSPACE NAVIGASI */}
          <nav className="flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800/80 no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    active
                      ? "bg-gov-navy text-white shadow-sm dark:bg-sky-600"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* KONTEN UTAMA WORKSPACE */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === "overview" && <OverviewWorkspace data={bundle} darkMode={darkMode} />}
        {activeTab === "spatial" && <SpatialMapWorkspace data={bundle} darkMode={darkMode} />}
        {activeTab === "saw" && <SawDecisionWorkspace data={bundle} darkMode={darkMode} />}
        {activeTab === "corridor" && <CorridorWorkspace data={bundle} darkMode={darkMode} />}
        {activeTab === "forecasting" && <ForecastingWorkspace data={bundle} darkMode={darkMode} />}
        {activeTab === "architecture" && <ArchitectureWorkspace data={bundle} darkMode={darkMode} />}
      </main>

      {/* FOOTER RESMI PUSDATIN KEMENHUB & UNIVERSITAS GUNADARMA */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-500" />
              <span>Pusat Data dan Teknologi Informasi (Pusdatin) Kementerian Perhubungan RI</span>
            </div>
            <p className="mt-1">
              Sumber Data Resmi: <b>Web Portal STRATEGI Kemenhub (strategi.kemenhub.go.id)</b> & Platform BI Metabase Pusdatin • Tim Pengelolaan Data
            </p>
          </div>
          <div className="md:text-right">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Dikembangkan oleh: <b>Devi Andini Sastro (NPM: 10123320)</b> — S1 Sistem Informasi Universitas Gunadarma
            </div>
            <div className="mt-0.5">
              Mentor Pembimbing: <b>Hendry Setiadi</b> (Ketua Tim Pengelolaan Data Pusdatin Kemenhub RI)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
