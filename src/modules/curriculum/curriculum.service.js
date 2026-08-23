export class CurriculumService {
  static async getPillars() {
    return [
      {
        id: 'diniyah',
        title: 'Pilar 1: Diniyah & Karakter Qurani',
        badge: 'Inti Pokok',
        color: 'border-purple-500/40 bg-purple-950/30 text-purple-300',
        modules: ['Tahfizh & Tajwid Bersanad', 'Aqidah Shahihah & Fiqih Ibadah', 'Adab & Akhlaq Mulia (Nabawiyah)']
      },
      {
        id: 'sains',
        title: 'Pilar 2: Sains, Matematika & STEM',
        badge: 'Akademik',
        color: 'border-blue-500/40 bg-blue-950/30 text-blue-300',
        modules: ['Olimpiade Matematika & Logika', 'Eksperimen Sains & Robotika Dasar', 'Coding & Computational Thinking']
      },
      {
        id: 'bahasa',
        title: 'Pilar 3: Bahasa Internasional',
        badge: 'Komunikasi',
        color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300',
        modules: ['Bahasa Arab Fusha Aktif (Muhadatsah)', 'Bahasa Inggris Konversasi & Storytelling', 'Literasi & Jurnalistik Cilik']
      },
      {
        id: 'leadership',
        title: 'Pilar 4: Kepemimpinan & Kemandirian',
        badge: 'Lifeskills',
        color: 'border-amber-500/40 bg-amber-950/30 text-amber-300',
        modules: ['Outing & Tafakkur Alam', 'Public Speaking & Muhadharah', 'Manajemen Finansial Santri']
      },
      {
        id: 'riset',
        title: 'Pilar 5: Riset & Karya Terapan',
        badge: 'Inovasi',
        color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300',
        modules: ['Proyek Karya Ilmiah Santri (KIS)', 'Portofolio Digital & Pameran Hasil Belajar', 'Inovasi Lingkungan & Bank Sampah']
      }
    ];
  }
}
