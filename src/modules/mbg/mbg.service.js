import { fetchFromTable, insertIntoTable } from '../../lib/supabase.js';

export class MbgService {
  static async getLogs() {
    const { data } = await fetchFromTable('mbg_logs', '*', {
      order: { column: 'id', ascending: false }
    });
    return data;
  }

  static async submitReceipt(payload) {
    const fullPayload = {
      ...payload,
      date: new Date().toISOString().split('T')[0],
      organoleptic_status: 'PASSED'
    };
    return await insertIntoTable('mbg_logs', fullPayload);
  }
}
