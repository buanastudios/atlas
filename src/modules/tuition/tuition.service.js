import { fetchFromTable, insertIntoTable, localStore } from '../../lib/supabase.js';

export class TuitionService {
  static async getInvoices() {
    const { data } = await fetchFromTable('tuition_invoices', '*', {
      order: { column: 'id', ascending: false }
    });
    return data;
  }

  static async payInvoice(invoiceId) {
    localStore.update('tuition_invoices', invoiceId, {
      status: 'PAID',
      paid_at: new Date().toISOString().split('T')[0]
    });
    return true;
  }

  static async createInvoice(payload) {
    const invoiceNo = `INV-202608-${Math.floor(100 + Math.random() * 900)}`;
    const fullPayload = {
      ...payload,
      invoice_no: invoiceNo,
      status: 'UNPAID',
      paid_at: null
    };
    return await insertIntoTable('tuition_invoices', fullPayload);
  }
}
