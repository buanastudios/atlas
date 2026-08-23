import { fetchFromTable } from '../../lib/supabase.js';

export class GovernanceService {
  static async getAudits() {
    const { data } = await fetchFromTable('governance_audits');
    return data;
  }
}
