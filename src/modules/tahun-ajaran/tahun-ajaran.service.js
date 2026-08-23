export class TahunAjaranService {
  static async getAcademicYears() {
    return [
      {
        id: 1,
        year: '2026/2027',
        semester: 'Ganjil',
        is_active: true,
        start_date: '2026-07-15',
        end_date: '2026-12-20',
        effective_weeks: 18
      },
      {
        id: 2,
        year: '2026/2027',
        semester: 'Genap',
        is_active: false,
        start_date: '2027-01-05',
        end_date: '2027-06-18',
        effective_weeks: 18
      }
    ];
  }
}
