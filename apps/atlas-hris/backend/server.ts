/**
 * Project Atlas — Staffing, Attendance & Payroll Engine (`atlas-hris`)
 * Page 1 & 8 PRD v5.0 Specification
 * Developed by Buana Studios (Hikmatullah / Abu Hafidz @thesaktibuana)
 */

export interface EmployeeRecord {
  id: string;
  nip: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  employmentType: 'Tetap' | 'Kontrak' | 'Magang';
  salary: number;
  status: 'Aktif' | 'Nonaktif';
  dossierStatus: 'Belum Lengkap' | 'Menunggu Verifikasi' | 'Terverifikasi';
}

export interface EmployeeDossier {
  employeeNip: string;
  nikKtp: string;
  npwp?: string;
  bpjsKesehatan?: string;
  bpjsKetenagakerjaan?: string;
  educationLevel: string;
  university: string;
  maritalStatus: string;
  emergencyContact: string;
  submittedAt: string;
}

export class AtlasHRISService {
  private employees: Map<string, EmployeeRecord> = new Map();
  private dossiers: Map<string, EmployeeDossier> = new Map();

  constructor() {
    const defaultEmp: EmployeeRecord = {
      id: 'emp-001',
      nip: 'NIP-2026-001',
      name: 'Hikmatullah Sakti Buana',
      email: 'sakti@buana.studio',
      phone: '081234567890',
      department: 'Corporate & Technology',
      position: 'Lead Architect & Developer',
      employmentType: 'Tetap',
      salary: 25000000,
      status: 'Aktif',
      dossierStatus: 'Terverifikasi'
    };
    this.employees.set(defaultEmp.nip, defaultEmp);
  }

  public async getEmployees(): Promise<EmployeeRecord[]> {
    return Array.from(this.employees.values());
  }

  public async saveEmployee(emp: EmployeeRecord): Promise<EmployeeRecord> {
    this.employees.set(emp.nip, emp);
    return emp;
  }

  public async deleteEmployee(nip: string): Promise<boolean> {
    return this.employees.delete(nip);
  }

  public async submitDossier(dossier: EmployeeDossier): Promise<boolean> {
    this.dossiers.set(dossier.employeeNip, dossier);
    const emp = this.employees.get(dossier.employeeNip);
    if (emp) {
      emp.dossierStatus = 'Menunggu Verifikasi';
      this.employees.set(emp.nip, emp);
    }
    return true;
  }
}
