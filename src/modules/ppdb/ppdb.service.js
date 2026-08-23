import { fetchFromTable, insertIntoTable } from '../../lib/supabase.js';

export class PpdbService {
  static async getRegistrations() {
    const { data } = await fetchFromTable('ppdb_admissions', '*', {
      order: { column: 'created_at', ascending: false }
    });
    return data;
  }

  static async submitRegistration(payload) {
    const regNumber = `PPDB-2026-${Math.floor(100 + Math.random() * 900)}`;
    const fullPayload = {
      ...payload,
      reg_number: regNumber,
      status: 'VERIFIED',
      created_at: new Date().toISOString()
    };
    return await insertIntoTable('ppdb_admissions', fullPayload);
  }
}
