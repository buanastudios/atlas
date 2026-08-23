import { fetchFromTable } from '../../lib/supabase.js';

export class FacilitiesService {
  static async getFacilities() {
    const { data } = await fetchFromTable('facilities');
    return data;
  }
}
