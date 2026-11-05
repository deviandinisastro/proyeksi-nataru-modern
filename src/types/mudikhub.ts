export interface MetadataBundle {
  nama_sistem: string;
  instansi: string;
  unit_kerja: string;
  sumber_data_resmi: string;
  pengembang: string;
  mentor: string;
  periode_posko: string;
  champion_model: string;
  mape_agregat_nasional_pct: number;
  akurasi_kumulatif_pct: number;
  total_simpul_nasional: number;
  rincian_simpul_moda: Record<string, number>;
}

export interface KpiUtama {
  total_penumpang_realisasi_2024: number;
  total_penumpang_realisasi_2025: number;
  total_penumpang_proyeksi_2026: number;
  pertumbuhan_penumpang_yoy_pct: number;
  total_sarana_angkutan_umum_2025: number;
  total_sarana_angkutan_umum_2026: number;
  total_lhr_tol_2025: number;
  total_lhr_tol_2026: number;
  pertumbuhan_tol_yoy_pct: number;
  total_arteri_2025: number;
  total_arteri_2026: number;
  pertumbuhan_arteri_yoy_pct: number;
  rata_rata_load_factor_2025_pct: number;
  rata_rata_load_factor_2026_pct: number;
  puncak_load_factor_h_minus_1_pct: number;
  puncak_mudik_hari: string;
  puncak_mudik_volume: number;
  puncak_balik_hari: string;
  puncak_balik_volume: number;
}

export interface ModaSummary {
  moda: string;
  warna: string;
  jumlah_simpul: number;
  satuan_sarana: string;
  realisasi_pnp_2022: number;
  realisasi_pnp_2023: number;
  realisasi_pnp_2024: number;
  realisasi_pnp_2025: number;
  proyeksi_pnp_2026: number;
  pertumbuhan_pnp_yoy_pct: number;
  pangsa_pasar_pct: number;
  realisasi_sarana_2024: number;
  realisasi_sarana_2025: number;
  proyeksi_sarana_2026: number;
  pertumbuhan_sarana_yoy_pct: number;
  load_factor_2025_pct: number;
  load_factor_2026_pct: number;
}

export interface KalenderHari {
  hari_posko: string;
  tanggal: string;
  hari_pekan: string;
  fase: string;
  penumpang_2024: number;
  penumpang_2025: number;
  penumpang_proyeksi_2026: number;
  sarana_2024: number;
  sarana_2025: number;
  sarana_proyeksi_2026: number;
  status_kode: "HIJAU" | "KUNING" | "MERAH";
  status_label: string;
  rekomendasi_taktis: string;
  is_puncak: boolean;
}

export interface HarianModaRow {
  Hari_Operasional: string;
  Hari_Pekan_2026: string;
  Moda: string;
  Volume_2024: number;
  Volume_2025: number;
  Proyeksi_2026_2027: number;
}

export interface GerbangTolItem {
  gerbang_tol: string;
  keluar_realisasi_2025: number;
  keluar_proyeksi_2026: number;
  masuk_realisasi_2025: number;
  masuk_proyeksi_2026: number;
  total_proyeksi_2026: number;
  pertumbuhan_yoy_pct: number;
}

export interface AsdpKendaraanItem {
  lintas: string;
  realisasi_total_2025: number;
  proyeksi_total_2026: number;
  proyeksi_roda_2: number;
  proyeksi_roda_4: number;
  proyeksi_truk_logistik: number;
  kebijakan: string;
}

export interface TournamentModel {
  peringkat: number;
  nama_model: string;
  kategori: string;
  mape_agregat_nasional_pct: number;
  deviasi_kumulatif_pct: number;
  akurasi_total_pct: number;
  proyeksi_total_pnp: number;
  status_kelayakan: string;
  keunggulan_teknis: string;
}

export interface SawCriterion {
  kode: string;
  nama: string;
  atribut: "Benefit" | "Cost";
  bobot: number;
  satuan: string;
  penjelasan: string;
}

export interface SawResultRow {
  moda: string;
  vol_pnp: number;
  yoy_pct: number;
  sarana_proyeksi: number;
  c1_lonjakan: number;
  c2_load_factor: number;
  c3_cadangan_pct: number;
  armada_tambahan_unit: number;
  satuan_unit: string;
  aksi_taktis: string;
  r1_norm: number;
  r2_norm: number;
  r3_norm: number;
  skor_preferensi_v: number;
  skor_saw_100: number;
  peringkat_prioritas: number;
  status_urgensi: string;
}

export interface SawScenario {
  id: string;
  nama_skenario: string;
  deskripsi: string;
  pembagi_normalisasi: {
    max_c1: number;
    max_c2: number;
    min_c3: number;
  };
  hasil_saw: SawResultRow[];
}

export interface SimpulNode {
  simpul_id: string;
  kode_simpul: string;
  kode_moda: string;
  nama_moda: string;
  jenis_simpul: string;
  nama_simpul: string;
  provinsi: string;
  tipe_simpul: string;
  lat: number;
  lon: number;
  sumber_koordinat: string;
  realisasi_pnp_2025: number;
  proyeksi_pnp_2026: number;
  realisasi_sarana_2025: number;
  proyeksi_sarana_2026: number;
  porsi_moda_pct: number;
  pertumbuhan_yoy_pct: number;
  volume_tahunan_strategi: number;
  armada_tahunan_strategi: number;
}

export interface DataDictionaryTable {
  nama_tabel: string;
  jenis_tabel: string;
  deskripsi: string;
  kolom: {
    nama: string;
    tipe: string;
    keterangan: string;
  }[];
}

export interface MudikHubBundle {
  metadata: MetadataBundle;
  kpi_utama: KpiUtama;
  moda_penumpang_summary: ModaSummary[];
  kalender_18_hari: KalenderHari[];
  harian_penumpang_per_moda: HarianModaRow[];
  harian_sarana_per_moda: HarianModaRow[];
  gerbang_tol_jakarta: GerbangTolItem[];
  asdp_kendaraan: AsdpKendaraanItem[];
  tournament_7_models: TournamentModel[];
  spk_saw: {
    kriteria: SawCriterion[];
    skenario: Record<string, SawScenario>;
  };
  star_schema_meta: {
    dim_waktu: any[];
    dim_moda: any[];
    dim_event: any[];
    data_dictionary: DataDictionaryTable[];
    etl_audit_summary: {
      sumber_ekstraksi: string;
      baris_simpul_mentah: number;
      anomali_nan_dihapus: number;
      detail_anomali_dihapus: string;
      koordinat_terimputasi: number;
      total_simpul_bersih: number;
      persentase_kelengkapan_spasial: number;
    };
  };
  simpul_1212: SimpulNode[];
}
