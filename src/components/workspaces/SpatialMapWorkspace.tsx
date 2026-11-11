"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { MudikHubBundle, SimpulNode } from "@/types/mudikhub";
import EChartBox from "@/components/charts/EChartBox";
import {
  Search,
  CheckCircle2,
  Layers,
  Navigation,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface SpatialMapWorkspaceProps {
  data: MudikHubBundle;
  darkMode: boolean;
}

const fmt = (n: number) => n.toLocaleString("id-ID");

const MODA_COLORS: Record<string, string> = {
  "Angkutan Udara": "#1d4ed8",
  "Kereta Api": "#ea580c",
  "Angkutan Jalan": "#16a34a",
  "Angkutan SDP": "#9333ea",
  "Angkutan Laut": "#0284c7",
};

const UNIFORM_RADIUS = 4.2;
const INDONESIA_BOUNDS: [[number, number], [number, number]] = [
  [-10.8, 95.0],
  [5.8, 141.0],
];

export default function SpatialMapWorkspace({ data, darkMode }: SpatialMapWorkspaceProps) {
  const [selectedModa, setSelectedModa] = useState<string>("ALL");
  const [selectedProvinsi, setSelectedProvinsi] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<SimpulNode | null>(null);
  const [legendOpen, setLegendOpen] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [tablePage, setTablePage] = useState<number>(1);
  const rowsPerPage = 15;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const heatmapLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const provinces = useMemo(() => {
    const s = new Set<string>();
    data.simpul_1212.forEach((n) => {
      if (n.provinsi && n.provinsi !== "-") s.add(n.provinsi);
    });
    return Array.from(s).sort();
  }, [data.simpul_1212]);

  const top10Ids = useMemo(() => {
    const sorted = [...data.simpul_1212].sort(
      (a, b) => (b.proyeksi_pnp_2026 || 0) - (a.proyeksi_pnp_2026 || 0)
    );
    return new Set(sorted.slice(0, 10).map((n) => n.simpul_id));
  }, [data.simpul_1212]);

  const filteredNodes = useMemo(() => {
    return data.simpul_1212.filter((n) => {
      if (selectedModa !== "ALL" && n.nama_moda !== selectedModa) return false;
      if (selectedProvinsi !== "ALL" && n.provinsi !== selectedProvinsi) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = n.nama_simpul.toLowerCase().includes(q);
        const matchCode = n.kode_simpul.toLowerCase().includes(q);
        const matchProv = n.provinsi.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchProv) return false;
      }
      return true;
    });
  }, [data.simpul_1212, selectedModa, selectedProvinsi, searchQuery]);

  // Reset Peta ke Wilayah Kepulauan Indonesia (Sabang s.d Merauke)
  const handleResetIndonesia = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(INDONESIA_BOUNDS, {
        padding: [20, 20],
        animate: true,
      });
    }
  };

  // Initialize Leaflet Map on Client
  useEffect(() => {
    let isCancelled = false;
    if (!mapContainerRef.current) return;

    import("leaflet").then((L) => {
      if (isCancelled || !mapContainerRef.current) return;

      // Hapus instance leaflet sebelumnya jika container sudah pernah diinisialisasi
      if ((mapContainerRef.current as any)._leaflet_id) {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } else {
          delete (mapContainerRef.current as any)._leaflet_id;
        }
      }

      const map = L.map(mapContainerRef.current, {
        center: [-2.5, 118.0],
        zoom: 5,
        zoomControl: true,
      });

      const tileUrl = darkMode
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

      L.tileLayer(tileUrl, {
        attribution: "&copy; OpenStreetMap contributors | Pusdatin Kemenhub RI",
        maxZoom: 18,
      }).addTo(map);

      // Layer 1: Heatmap (di bawah)
      const heatmapGroup = L.layerGroup().addTo(map);
      heatmapLayerRef.current = heatmapGroup;

      // Layer 2: Markers (di atas)
      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      mapInstanceRef.current = map;
      setMapReady(true);

      setTimeout(() => {
        if (!isCancelled && map) {
          map.invalidateSize();
          map.fitBounds(INDONESIA_BOUNDS, { padding: [15, 15] });
        }
      }, 250);
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        heatmapLayerRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer saat darkMode berubah
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });
      const tileUrl = darkMode
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
      L.tileLayer(tileUrl, {
        attribution: "&copy; OpenStreetMap contributors | Pusdatin Kemenhub RI",
        maxZoom: 18,
      }).addTo(map);
    });
  }, [darkMode]);

  // Render Lapisan Heatmap Kepadatan Arus Spasial
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !heatmapLayerRef.current) return;

    const heatGroup = heatmapLayerRef.current;
    heatGroup.clearLayers();

    if (!showHeatmap || filteredNodes.length === 0) return;

    import("leaflet.heat")
      .then(({ HeatLayer }) => {
        if (!heatmapLayerRef.current) return;
        const validNodes = filteredNodes.filter(
          (n) => typeof n.lat === "number" && typeof n.lon === "number"
        );
        if (validNodes.length === 0) return;

        const maxVol = Math.max(
          ...validNodes.map((n) => n.proyeksi_pnp_2026 || 0),
          100000
        );

        const heatPoints = validNodes.map((n) => {
          const vol = n.proyeksi_pnp_2026 || 0;
          // Normalisasi skala logaritmik agar wilayah luar Jawa tetap terpancar seimbang
          const intensity = Math.min(1.0, Math.max(0.18, Math.pow(vol / maxVol, 0.4)));
          return [n.lat, n.lon, intensity] as [number, number, number];
        });

        const heatLayer = new HeatLayer(heatPoints, {
          radius: 30,
          blur: 20,
          maxZoom: 11,
          minOpacity: 0.38,
          gradient: {
            0.15: "#38bdf8",
            0.35: "#10b981",
            0.60: "#fbbf24",
            0.82: "#f97316",
            1.00: "#ef4444",
          },
        });

        heatGroup.addLayer(heatLayer);
      })
      .catch((err) => {
        console.warn("HeatLayer gagal dimuat:", err);
      });
  }, [filteredNodes, mapReady, showHeatmap]);

  // Render 1.212 Markers SAMA RATA (UNIFORM RADIUS: 4.2px)
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !markersLayerRef.current) return;

    import("leaflet").then((L) => {
      const layerGroup = markersLayerRef.current;
      if (!layerGroup) return;
      layerGroup.clearLayers();

      filteredNodes.forEach((node) => {
        if (typeof node.lat !== "number" || typeof node.lon !== "number") return;

        const color = MODA_COLORS[node.nama_moda] || "#0284c7";
        const isTop10 = top10Ids.has(node.simpul_id);

        // Ukuran titik seragam sama rata sesuai arahan statistisi Kemenhub (4.2px)
        const circle = L.circleMarker([node.lat, node.lon], {
          radius: UNIFORM_RADIUS,
          fillColor: color,
          color: isTop10 ? "#f59e0b" : "#ffffff",
          weight: isTop10 ? 1.8 : 1.1,
          opacity: 1.0,
          fillOpacity: 0.9,
        });

        // Hover Effect Halus
        circle.on("mouseover", () => {
          circle.setStyle({ radius: 6.5, weight: 2.2, fillOpacity: 1.0 });
        });
        circle.on("mouseout", () => {
          circle.setStyle({
            radius: UNIFORM_RADIUS,
            weight: isTop10 ? 1.8 : 1.1,
            fillOpacity: 0.9,
          });
        });

        // Tooltip Cepat
        circle.bindTooltip(
          `<b>${node.nama_simpul}</b><br/><span style="color:#38bdf8;">${fmt(
            node.proyeksi_pnp_2026
          )} org</span>`,
          {
            direction: "top",
            offset: [0, -4],
            className:
              "bg-slate-900 text-white text-[11px] px-2 py-1 rounded-lg shadow-lg border border-slate-700",
          }
        );

        // Popup Rinci saat Diklik
        const popupHtml = `
          <div style="font-family:Inter,sans-serif;min-width:220px;padding:2px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
              <span style="font-size:10px;font-weight:700;text-transform:uppercase;color:${color};">
                ${node.nama_moda}
              </span>
              <span style="font-size:10px;font-weight:700;background:#f1f5f9;color:#475569;padding:1px 6px;border-radius:4px;">
                ${node.kode_simpul}
              </span>
            </div>
            <div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:4px;line-height:1.3;">
              ${node.nama_simpul}
            </div>
            <div style="font-size:11px;color:#475569;margin-bottom:6px;">
              Provinsi: <b>${node.provinsi}</b>
            </div>
            <div style="border-top:1px solid #e2e8f0;padding-top:6px;font-size:11px;color:#1e293b;">
              <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                <span>Realisasi 2025:</span>
                <b>${fmt(node.realisasi_pnp_2025)} org</b>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                <span>Proyeksi 2026:</span>
                <b style="color:#0284c7;">${fmt(node.proyeksi_pnp_2026)} org</b>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                <span>Proyeksi Sarana:</span>
                <b>${fmt(node.proyeksi_sarana_2026)} unit</b>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:10px;color:#64748b;margin-top:5px;border-top:1px dashed #cbd5e1;padding-top:4px;">
                <span>Koordinat GPS:</span>
                <span>${node.lat.toFixed(4)}, ${node.lon.toFixed(4)}</span>
              </div>
            </div>
          </div>
        `;

        circle.bindPopup(popupHtml);
        circle.on("click", () => {
          setSelectedNode(node);
        });
        circle.addTo(layerGroup);
      });
    });
  }, [filteredNodes, mapReady, top10Ids]);

  // Top 12 Simpul Chart
  const top12Nodes = useMemo(() => {
    return [...filteredNodes]
      .sort((a, b) => b.proyeksi_pnp_2026 - a.proyeksi_pnp_2026)
      .slice(0, 12)
      .reverse();
  }, [filteredNodes]);

  const textColor = darkMode ? "#cbd5e1" : "#334155";
  const gridColor = darkMode ? "rgba(148, 163, 184, 0.14)" : "rgba(148, 163, 184, 0.22)";

  const topSimpulChartOption = useMemo(() => {
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
      grid: { top: 32, right: 28, bottom: 24, left: 165 },
      xAxis: {
        type: "value",
        axisLabel: {
          color: textColor,
          fontSize: 10,
          formatter: (v: number) =>
            v >= 1000000 ? `${(v / 1000000).toFixed(1)}Jt` : `${(v / 1000).toFixed(0)}Rb`,
        },
        splitLine: { lineStyle: { color: gridColor, type: "dashed" } },
      },
      yAxis: {
        type: "category",
        data: top12Nodes.map((n) => n.nama_simpul.slice(0, 22)),
        axisLabel: { color: textColor, fontSize: 11, fontWeight: 600 },
      },
      series: [
        {
          name: "Realisasi 2025",
          type: "bar",
          data: top12Nodes.map((n) => n.realisasi_pnp_2025),
          itemStyle: { color: "#64748b", borderRadius: [0, 4, 4, 0] },
        },
        {
          name: "Proyeksi 2026/2027",
          type: "bar",
          data: top12Nodes.map((n) => n.proyeksi_pnp_2026),
          itemStyle: { color: "#0284c7", borderRadius: [0, 4, 4, 0] },
        },
      ],
    };
  }, [top12Nodes, darkMode, textColor, gridColor]);

  const sortedForTable = useMemo(() => {
    return [...filteredNodes].sort((a, b) => b.proyeksi_pnp_2026 - a.proyeksi_pnp_2026);
  }, [filteredNodes]);

  const totalPages = Math.max(1, Math.ceil(sortedForTable.length / rowsPerPage));
  const paginatedNodes = sortedForTable.slice(
    (tablePage - 1) * rowsPerPage,
    tablePage * rowsPerPage
  );

  const focusNodeOnMap = (node: SimpulNode) => {
    setSelectedNode(node);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([node.lat, node.lon], 10, { animate: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SPASIAL 1.212 SIMPUL TERVALIDASI - STACKED LEGA (TANPA KIRI-KANAN SQUEEZED) */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* BARIS 1: JUDUL & DESKRIPSI LEBAR PENUH (TIDAK TERPOTONG) */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tervalidasi Tim Statistisi & Tim Spasial Pusdatin (1.212 Simpul Resmi STRATEGI Kemenhub)
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Pemetaan Geospasial Web GIS 1.212 Titik Simpul Transportasi Nasional
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-5xl leading-relaxed">
            Seluruh 1.212 titik simpul pantauan nasional telah melalui pembersihan ETL (257 Bandara, 197 Stasiun KA, 215 Terminal Jalan, 276 Pelabuhan Penyeberangan, dan 267 Pelabuhan Laut).
          </p>
        </div>

        {/* BARIS 2: 5 KARTU FILTER MODA MEMBENTANG HORIZONTAL PENUH */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
          {[
            { label: "Udara", sub: "Bandara", count: 257, moda: "Angkutan Udara", dot: "#1d4ed8" },
            { label: "Perkeretaapian", sub: "Stasiun KA", count: 197, moda: "Kereta Api", dot: "#ea580c" },
            { label: "Jalan (Bus)", sub: "Terminal Bus", count: 215, moda: "Angkutan Jalan", dot: "#16a34a" },
            { label: "Penyeberangan", sub: "Pelabuhan SDP", count: 276, moda: "Angkutan SDP", dot: "#9333ea" },
            { label: "Laut (Pelni)", sub: "Pelabuhan Laut", count: 267, moda: "Angkutan Laut", dot: "#0284c7" },
          ].map((item) => {
            const active = selectedModa === item.moda;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setSelectedModa(active ? "ALL" : item.moda);
                  setTablePage(1);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  active
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-sky-600 dark:border-sky-500 shadow-md ring-2 ring-sky-400/30"
                    : "bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:bg-slate-100/80 dark:hover:bg-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold opacity-90">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.dot }}
                    />
                    <span>{item.label}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.sub}
                  </div>
                </div>
                <div className="text-xl font-black num-tabular">{item.count}</div>
              </button>
            );
          })}
        </div>

        {/* BARIS 3: BAR FILTER & PENCARIAN SIMPUL */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setTablePage(1);
              }}
              placeholder="Cari nama bandara, stasiun, terminal, pelabuhan, atau kode simpul..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <select
            value={selectedModa}
            onChange={(e) => {
              setSelectedModa(e.target.value);
              setTablePage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100"
          >
            <option value="ALL">Semua Moda (1.212 Simpul)</option>
            <option value="Angkutan Udara">Angkutan Udara (257 Bandara)</option>
            <option value="Kereta Api">Perkeretaapian (197 Stasiun)</option>
            <option value="Angkutan Jalan">Angkutan Jalan (215 Terminal)</option>
            <option value="Angkutan SDP">Penyeberangan ASDP (276 Pelabuhan)</option>
            <option value="Angkutan Laut">Angkutan Laut (267 Pelabuhan)</option>
          </select>

          <select
            value={selectedProvinsi}
            onChange={(e) => {
              setSelectedProvinsi(e.target.value);
              setTablePage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100"
          >
            <option value="ALL">Seluruh Provinsi ({provinces.length} Provinsi)</option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {(selectedModa !== "ALL" || selectedProvinsi !== "ALL" || searchQuery !== "") && (
            <button
              onClick={() => {
                setSelectedModa("ALL");
                setSelectedProvinsi("ALL");
                setSearchQuery("");
                setTablePage(1);
                handleResetIndonesia();
              }}
              className="px-3 py-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-200 transition"
            >
              Reset Filter ({filteredNodes.length} tampil)
            </button>
          )}
        </div>
      </div>

      {/* PETA WEB GIS LEAFLET + PANEL LEGENDA & RANKING TOP 12 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* PETA UTAMA (8 KOLOM) */}
        <div className="xl:col-span-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          {/* BAR KONTROL DI ATAS PETA (SEPERTI DI WEB LAMA) */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>{filteredNodes.length} Simpul Multimoda Terpetakan</span>
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal">
                Skala Koordinat Resmi Pusdatin
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mr-1">
                Kontrol Peta:
              </span>

              {/* TOGGLE HEATMAP */}
              <button
                onClick={() => setShowHeatmap((prev) => !prev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
                  showHeatmap
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-sky-600 dark:border-sky-500 shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-70"
                }`}
                title="Nyalakan / Matikan Lapisan Heatmap Kepadatan Spasial"
              >
                <span>🔥</span>
                <span>Heatmap Kepadatan</span>
              </button>

              {/* PUSATKAN INDONESIA */}
              <button
                onClick={handleResetIndonesia}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-sky-600 transition flex items-center gap-1.5 shadow-sm"
                title="Pusatkan Peta ke Seluruh Kepulauan Indonesia (Sabang s.d Merauke)"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-500" />
                <span>Pusatkan Indonesia</span>
              </button>
            </div>
          </div>

          {/* CANVAS PETA LEAFLET & LEGENDA FLOATING */}
          <div className="relative w-full h-[520px]">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* FLOATING COLLAPSIBLE LEGEND (POJOK KIRI BAWAH) */}
            <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/95 text-white rounded-2xl shadow-xl border border-slate-700/80 backdrop-blur transition-all duration-200">
              {legendOpen ? (
                <div className="p-3.5 max-w-[250px]">
                  <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-slate-700/60">
                    <div className="text-xs font-extrabold tracking-wide flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-sky-400" />
                      <span>Keterangan Peta Spasial</span>
                    </div>
                    <button
                      onClick={() => setLegendOpen(false)}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Ciutkan Keterangan Peta"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* GRADIENT HEATMAP */}
                  <div className="text-[10px] text-slate-300 mb-1 flex items-center justify-between">
                    <span>Intensitas Kepadatan:</span>
                    <span className="text-[9px] font-bold text-sky-300 bg-sky-950 px-1.5 py-0.5 rounded">
                      Posko Nataru
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-rose-600 mb-1" />
                  <div className="flex justify-between text-[9px] text-slate-400 mb-1 font-semibold">
                    <span>Rendah</span>
                    <span>Sedang</span>
                    <span>Padat</span>
                    <span>Puncak</span>
                  </div>
                  <div className="text-[8.5px] text-slate-400 italic mb-2.5 leading-tight">
                    *Normalisasi Kernel Density thd. Soetta (Simpul Terpadat)
                  </div>

                  {/* SEBARAN TITIK MODA (UKURAN SAMA RATA) */}
                  <div className="border-t border-slate-700/70 pt-2">
                    <div className="text-[10px] font-bold text-slate-200 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                      <span>Simpul (Ukuran Seragam)</span>
                      <span className="text-slate-400 font-normal">1.212 Titik</span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8] border border-white/60" />
                          Udara
                        </span>
                        <span className="font-bold text-sky-300 num-tabular">257 Bandara</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] border border-white/60" />
                          Perkeretaapian
                        </span>
                        <span className="font-bold text-amber-300 num-tabular">197 Stasiun</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] border border-white/60" />
                          Jalan (Bus)
                        </span>
                        <span className="font-bold text-emerald-300 num-tabular">215 Terminal</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#9333ea] border border-white/60" />
                          Penyeberangan
                        </span>
                        <span className="font-bold text-purple-300 num-tabular">276 Pelabuhan</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] border border-white/60" />
                          Laut (Pelni)
                        </span>
                        <span className="font-bold text-cyan-300 num-tabular">267 Pelabuhan</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setLegendOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white hover:text-sky-300 transition"
                  title="Buka Keterangan Peta Spasial"
                >
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>Keterangan Peta Spasial</span>
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* KANAN (4 KOLOM): GRAFIK TOP 12 SIMPUL TERPADAT */}
        <div className="xl:col-span-4 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-500" />
              Top 12 Simpul Terpadat ({selectedModa === "ALL" ? "Nasional" : selectedModa})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Komparasi Realisasi 2025 vs Proyeksi 2026/2027 (Orang)
            </p>
            <EChartBox option={topSimpulChartOption} height="390px" />
          </div>

          {selectedNode && (
            <div className="mt-3 p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-xs">
              <div className="font-bold text-sky-800 dark:text-sky-300 flex items-center justify-between">
                <span>📍 {selectedNode.nama_simpul}</span>
                <span className="px-2 py-0.5 rounded bg-sky-200 dark:bg-sky-900 text-[10px]">
                  {selectedNode.kode_simpul}
                </span>
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <div>Moda: <b>{selectedNode.nama_moda}</b></div>
                <div>Provinsi: <b>{selectedNode.provinsi}</b></div>
                <div>Realisasi 2025: <b>{fmt(selectedNode.realisasi_pnp_2025)}</b></div>
                <div>
                  Proyeksi 2026:{" "}
                  <b className="text-sky-600 dark:text-sky-400">
                    {fmt(selectedNode.proyeksi_pnp_2026)}
                  </b>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TABEL DIREKTORI LENGKAP 1.212 SIMPUL TRANSPORTASI NASIONAL */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Direktori Data Olahan 1.212 Simpul Pantauan Nasional (Portal STRATEGI Kemenhub)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Menampilkan {filteredNodes.length} simpul terfilter — Klik baris simpul untuk menyorot lokasi di peta Web GIS
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              disabled={tablePage <= 1}
              onClick={() => setTablePage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 font-semibold"
            >
              &larr; Sebelumnya
            </button>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Hal {tablePage} / {totalPages}
            </span>
            <button
              disabled={tablePage >= totalPages}
              onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 font-semibold"
            >
              Berikutnya &rarr;
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] uppercase text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-3 px-3 font-bold">ID / Kode</th>
                <th className="py-3 px-3 font-bold">Nama Simpul Transportasi</th>
                <th className="py-3 px-3 font-bold">Moda</th>
                <th className="py-3 px-3 font-bold">Provinsi</th>
                <th className="py-3 px-3 text-right font-bold">Realisasi 2025 (Orang)</th>
                <th className="py-3 px-3 text-right font-bold">Proyeksi 2026 (Orang)</th>
                <th className="py-3 px-3 text-right font-bold">Proyeksi Sarana</th>
                <th className="py-3 px-3 text-center font-bold">Koordinat (Lat, Lon)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedNodes.map((n) => (
                <tr
                  key={n.simpul_id}
                  onClick={() => focusNodeOnMap(n)}
                  className="hover:bg-sky-50/70 dark:hover:bg-slate-800/60 cursor-pointer transition"
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-500 dark:text-slate-400">
                    {n.kode_simpul}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {n.nama_simpul}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: MODA_COLORS[n.nama_moda] || "#0284c7" }}
                    >
                      {n.nama_moda}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-medium">
                    {n.provinsi}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300">
                    {fmt(n.realisasi_pnp_2025)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-sky-700 dark:text-sky-400">
                    {fmt(n.proyeksi_pnp_2026)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                    {fmt(n.proyeksi_sarana_2026)} unit
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-500">
                    {n.lat.toFixed(4)}, {n.lon.toFixed(4)}
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
