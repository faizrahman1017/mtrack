export const CATEGORIES = {
  expense: [
    'Makanan & Minuman',
    'Transportasi',
    'Tagihan',
    'Hiburan',
    'Belanja',
    'Kesehatan',
    'Dana Darurat',
    'Investasi',
    'Tabungan',
    'Pulsa & Paket Data',
    'Laundry',
    'Jajan',
    'Skincare & Makeup',
    'Custom',
  ],
  income: [
    'Gaji',
    'Bisnis',
    'Investasi',
    'Bonus',
    'Pencairan Dana',
    'Custom',
  ],
}

export const PAYMENT_METHODS = ['Cash', 'QRIS', 'Transfer', 'Kartu']

export const CUSTOM_CATEGORY_LABEL = 'Custom'

// Setiap metode pembayaran dikelompokkan ke salah satu "dompet":
// Cash = uang fisik di tangan, selain itu (QRIS/Transfer/Kartu) = saldo di rekening/bank
export const ACCOUNT_GROUP = {
  Cash: 'cash',
  QRIS: 'rekening',
  Transfer: 'rekening',
  Kartu: 'rekening',
}
