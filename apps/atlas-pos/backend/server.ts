/**
 * Project Atlas — Retail POS & Inventory Server Engine (`atlas-pos`)
 * Developed by Buana Studios (Hikmatullah / Abu Hafidz @thesaktibuana)
 */

export interface POSItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
}

export class AtlasPOSService {
  private inventory: POSItem[] = [
    { id: 'pos-1', sku: 'BK-001', name: 'Kitab / Buku Text', price: 45000, stock: 150 },
    { id: 'pos-2', sku: 'AP-002', name: 'Seragam Batik Suite', price: 120000, stock: 80 },
    { id: 'pos-3', sku: 'ST-003', name: 'Stationery Set', price: 25000, stock: 200 }
  ];

  public async getInventory(): Promise<POSItem[]> {
    return this.inventory;
  }
}
