/**
 * Atlas Edu — Supabase Client & Resilient Data Layer (src/lib/supabase.js)
 * Production Supabase client with RLS compliance and offline fallback store.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL.startsWith('http') &&
  !SUPABASE_URL.includes('your-project-ref')
);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ── In-Memory & LocalStorage Resilience Store ──────────────────────────────
class LocalDataStore {
  constructor() {
    this.keyPrefix = 'atlas_data_';
    this.initDefaultData();
  }

  initDefaultData() {
    const defaults = {
      halaqah_logs: [
        { id: 1, date: '2026-08-24', session: 'Shubuh & Halaqah Pagi', student_name: 'Ahmad Fauzan', status: 'Hadir', mutabaah: 'Al-Baqarah 1-20', updated_at: new Date().toISOString() },
        { id: 2, date: '2026-08-24', session: 'Shubuh & Halaqah Pagi', student_name: 'Muhammad Farhan', status: 'Hadir', mutabaah: 'Ali Imran 50-75', updated_at: new Date().toISOString() },
        { id: 3, date: '2026-08-24', session: 'Shubuh & Halaqah Pagi', student_name: 'Zaid bin Tsabit', status: 'Sakit', notes: 'Demam ringan', updated_at: new Date().toISOString() }
      ],
      tahfizh_records: [
        { id: 1, student_name: 'Ahmad Fauzan', surah: 'An-Naba', ayat: '1-40', grade: 'Mumtaz (A+)', ustadz: 'Ust. Ibrahim', date: '2026-08-23' },
        { id: 2, student_name: 'Fathir Azzam', surah: 'An-Naziat', ayat: '1-46', grade: 'Jayyid Jiddan (A)', ustadz: 'Ust. Ibrahim', date: '2026-08-23' },
        { id: 3, student_name: 'Rayhan Putra', surah: 'Abasa', ayat: '1-42', grade: 'Mumtaz (A+)', ustadz: 'Ust. Salman', date: '2026-08-22' }
      ],
      tuition_invoices: [
        { id: 1, invoice_no: 'INV-202608-001', student_name: 'Ahmad Fauzan', amount: 1500000, month: 'Agustus 2026', status: 'PAID', paid_at: '2026-08-05' },
        { id: 2, invoice_no: 'INV-202608-002', student_name: 'Muhammad Farhan', amount: 1500000, month: 'Agustus 2026', status: 'PAID', paid_at: '2026-08-07' },
        { id: 3, invoice_no: 'INV-202608-003', student_name: 'Zaid bin Tsabit', amount: 1500000, month: 'Agustus 2026', status: 'UNPAID', paid_at: null }
      ],
      ppdb_admissions: [
        { id: 1, reg_number: 'PPDB-2026-042', full_name: 'Sulaiman Al-Habsyi', target_grade: 'SD Kelas 1', parent_name: 'Abdullah Al-Habsyi', phone: '081234567890', status: 'VERIFIED', created_at: '2026-08-20' },
        { id: 2, reg_number: 'PPDB-2026-043', full_name: 'Aisyah Humaira', target_grade: 'SD Kelas 1', parent_name: 'Farid Rahman', phone: '081398765432', status: 'INTERVIEW', created_at: '2026-08-21' }
      ],
      mbg_logs: [
        { id: 1, date: '2026-08-24', menu_name: 'Nasi Organik, Ayam Bakar Madu, Sayur Sop, Pisang Barangan', portion_target: 350, portion_received: 350, organoleptic_status: 'PASSED', courier_name: 'Pak Sugeng (Dapur Sentral)', receiver_name: 'Ustdz. Fatimah' }
      ],
      governance_audits: [
        { id: 1, domain: 'COBIT 2019 - EDM01', title: 'Tata Kelola Data Pendidikan & Privasi', score: 96.5, status: 'WTP - Compliant', certified_date: '2026-07-15' },
        { id: 2, domain: 'ISO 9001:2015', title: 'Manajemen Mutu Pembelajaran Terpadu', score: 98.0, status: 'Certified', certified_date: '2026-06-20' }
      ],
      facilities: [
        { id: 1, room_name: 'Masjid Utama Lantai 2', capacity: 400, status: 'Tersedia', current_booking: 'Halaqah Sore' },
        { id: 2, room_name: 'Lab Multimedia & Komputer', capacity: 40, status: 'Digunakan', current_booking: 'CBT Tahsin' }
      ],
      clubs: [
        { id: 1, name: 'Klub Panahan Sunnah', members_count: 45, coach: 'Coach Arif', schedule: 'Sabtu Pagi 07:30' },
        { id: 2, name: 'Robotika & Sains Qurani', members_count: 28, coach: 'Ust. Dimas', schedule: 'Ahad Siang 13:00' }
      ]
    };

    for (const [table, data] of Object.entries(defaults)) {
      if (!localStorage.getItem(this.keyPrefix + table)) {
        localStorage.setItem(this.keyPrefix + table, JSON.stringify(data));
      }
    }
  }

  getTable(table) {
    try {
      const data = localStorage.getItem(this.keyPrefix + table);
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  }

  setTable(table, data) {
    localStorage.setItem(this.keyPrefix + table, JSON.stringify(data));
  }

  insert(table, item) {
    const list = this.getTable(table);
    const newItem = { id: Date.now(), created_at: new Date().toISOString(), ...item };
    list.unshift(newItem);
    this.setTable(table, list);
    return newItem;
  }

  update(table, id, updates) {
    const list = this.getTable(table);
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
      this.setTable(table, list);
      return list[idx];
    }
    return null;
  }

  delete(table, id) {
    let list = this.getTable(table);
    list = list.filter(i => i.id !== id);
    this.setTable(table, list);
    return true;
  }
}

export const localStore = new LocalDataStore();

/**
 * Universal Data Fetcher: Tries Supabase table, falls back to localStore seamlessly
 */
export async function fetchFromTable(table, select = '*', options = {}) {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from(table).select(select);
      if (options.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? false });
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }
      const { data, error } = await query;
      if (!error && data) return { data, source: 'supabase' };
    } catch (e) {
      console.warn(`[Supabase fetch fallback] for ${table}:`, e.message);
    }
  }
  return { data: localStore.getTable(table), source: 'local' };
}

/**
 * Universal Data Inserter: Writes to Supabase and syncs local cache
 */
export async function insertIntoTable(table, payload) {
  localStore.insert(table, payload);
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from(table).insert(payload).select().single();
      if (!error) return { data, source: 'supabase' };
    } catch (e) {
      console.warn(`[Supabase insert fallback] for ${table}:`, e.message);
    }
  }
  return { data: payload, source: 'local' };
}
