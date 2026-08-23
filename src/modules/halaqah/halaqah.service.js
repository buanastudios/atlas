import { fetchFromTable, insertIntoTable } from '../../lib/supabase.js';

export class HalaqahService {
  static async getLogs() {
    const { data } = await fetchFromTable('halaqah_logs', '*', {
      order: { column: 'id', ascending: false }
    });
    return data;
  }

  static async submitAttendance(payload) {
    const fullPayload = {
      ...payload,
      date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    };
    return await insertIntoTable('halaqah_logs', fullPayload);
  }
}
