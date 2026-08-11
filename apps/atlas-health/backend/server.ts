/**
 * Project Atlas — Healthcare / EMR Server Engine (`atlas-health`)
 * Developed by Buana Studios (Hikmatullah / Abu Hafidz @thesaktibuana)
 */

export interface EMRRecord {
  id: string;
  patientName: string;
  diagnosis: string;
  physician: string;
  status: 'OUTPATIENT' | 'INPATIENT' | 'DISCHARGED';
}

export class AtlasHealthService {
  private records: EMRRecord[] = [
    { id: 'EMR-2026-001', patientName: 'Ahmad Fauzi', diagnosis: 'Check-up Rutin & Pemeriksaan Fisik', physician: 'dr. Hafidz, Sp.PD', status: 'OUTPATIENT' }
  ];

  public async getEMRRecords(): Promise<EMRRecord[]> {
    return this.records;
  }
}
