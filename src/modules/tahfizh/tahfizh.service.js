import { fetchFromTable, insertIntoTable } from '../../lib/supabase.js';

export class TahfizhService {
  static async getRecords() {
    const { data } = await fetchFromTable('tahfizh_records', '*', {
      order: { column: 'id', ascending: false }
    });
    return data;
  }

  static async submitSetoran(payload) {
    const fullPayload = {
      ...payload,
      date: new Date().toISOString().split('T')[0]
    };
    return await insertIntoTable('tahfizh_records', fullPayload);
  }
}
