export class GraduationService {
  static async getStudents() {
    return [
      {
        id: 1,
        name: 'Ahmad Fauzan Al-Ghazi',
        nisn: '0089283741',
        status: 'CLEARANCE_COMPLETE',
        tahfizh_passed: true,
        academic_score: 94.2,
        discipline_status: 'WTP - Bersih',
        ijazah_hash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
      },
      {
        id: 2,
        name: 'Muhammad Farhan Al-Mubarak',
        nisn: '0089283742',
        status: 'CLEARANCE_COMPLETE',
        tahfizh_passed: true,
        academic_score: 91.8,
        discipline_status: 'WTP - Bersih',
        ijazah_hash: 'SHA256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
      },
      {
        id: 3,
        name: 'Fathir Azzam Robbani',
        nisn: '0089283743',
        status: 'PENDING_TAHFIZH_EXAM',
        tahfizh_passed: false,
        academic_score: 88.5,
        discipline_status: 'WTP - Bersih',
        ijazah_hash: null
      }
    ];
  }
}
