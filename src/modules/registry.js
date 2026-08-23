/**
 * Atlas Edu — Central Module Registry (src/modules/registry.js)
 * Single source of truth for all business app launcher icons, metadata, and dynamic imports.
 */

export const MODULE_CATALOG = [
  {
    id: 'halaqah',
    name: 'Absensi KBM',
    category: 'Diniyah',
    icon: 'fa-calendar-check',
    color: 'icon-gradient-indigo',
    description: 'Presensi KBM, shalat berjamaah, dan kedisiplinan harian santri.',
    badge: null,
    load: () => import('./halaqah/index.js'),
  },
  {
    id: 'tahfizh',
    name: 'Tahfizh Quran',
    category: 'Diniyah',
    icon: 'fa-quran',
    color: 'icon-gradient-purple',
    description: 'Jurnal setoran ziyadah, mutaba\'ah hafalan, dan ujian tahfizh.',
    badge: 'Mumtaz',
    load: () => import('./tahfizh/index.js'),
  },
  {
    id: 'ppdb',
    name: 'PPDB Online',
    category: 'Admissions',
    icon: 'fa-user-plus',
    color: 'icon-gradient-blue',
    description: 'Pendaftaran peserta didik baru, upload berkas, dan seleksi.',
    badge: 'Buka',
    load: () => import('./ppdb/index.js'),
  },
  {
    id: 'tuition',
    name: 'SPP Ledger',
    category: 'Finance',
    icon: 'fa-credit-card',
    color: 'icon-gradient-teal',
    description: 'Buku besar SPP santri, status pembayaran, dan rekap kwitansi.',
    badge: null,
    load: () => import('./tuition/index.js'),
  },
  {
    id: 'mbg',
    name: 'Makan Bergizi',
    category: 'Operational',
    icon: 'fa-utensils',
    color: 'icon-gradient-emerald',
    description: 'Log penerimaan Makan Bergizi Gratis (MBG) dan uji organoleptik mutu.',
    badge: 'Siap',
    load: () => import('./mbg/index.js'),
  },
  {
    id: 'curriculum',
    name: 'Kurikulum 5P',
    category: 'Academic',
    icon: 'fa-book-reader',
    color: 'icon-gradient-teal',
    description: 'Pilar kurikulum terpadu: Diniyah, Sains, Bahasa, Karakter, dan Riset.',
    badge: null,
    load: () => import('./curriculum/index.js'),
  },
  {
    id: 'graduation',
    name: 'Kelulusan',
    category: 'Academic',
    icon: 'fa-graduation-cap',
    color: 'icon-gradient-amber',
    description: 'Audit clearance kelulusan 4-pilar dan penerbitan ijazah digital.',
    badge: null,
    load: () => import('./graduation/index.js'),
  },
  {
    id: 'facilities',
    name: 'Fasilitas',
    category: 'Operational',
    icon: 'fa-building',
    color: 'icon-gradient-amber',
    description: 'Peminjaman ruangan, laboratorium, dan perawatan sarana prasarana.',
    badge: null,
    load: () => import('./facilities/index.js'),
  },
  {
    id: 'clubs',
    name: 'Ekstrakurikuler',
    category: 'Academic',
    icon: 'fa-trophy',
    color: 'icon-gradient-emerald',
    description: 'Manajemen klub panahan, robotika, bahasa, dan data prestasi santri.',
    badge: null,
    load: () => import('./clubs/index.js'),
  },
  {
    id: 'governance',
    name: 'WTP & Audit',
    category: 'Governance',
    icon: 'fa-award',
    color: 'icon-gradient-cyan',
    description: 'COBIT 2019, ISO 9001:2015, dan kepatuhan audit WTP.',
    badge: '98%',
    load: () => import('./governance/index.js'),
  },
  {
    id: 'tahun-ajaran',
    name: 'Tahun Ajaran',
    category: 'Governance',
    icon: 'fa-calendar-alt',
    color: 'icon-gradient-rose',
    description: 'Konfigurasi semester aktif, kalender libur, dan periode KBM.',
    badge: null,
    load: () => import('./tahun-ajaran/index.js'),
  },
];

export function getModuleById(id) {
  return MODULE_CATALOG.find((m) => m.id === id) || null;
}

export function getAllModules() {
  return MODULE_CATALOG;
}
