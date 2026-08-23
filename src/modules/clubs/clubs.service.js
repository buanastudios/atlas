import { fetchFromTable } from '../../lib/supabase.js';

export class ClubsService {
  static async getClubs() {
    const { data } = await fetchFromTable('clubs');
    return data;
  }
}
