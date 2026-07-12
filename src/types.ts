/**
 * GIOK UP - Master Database Schema / Types
 * Versi Terbaru sesuai revisi fitur Promo & Keranjang
 */

export type GameCategoryType = 'Mobile' | 'PC' | 'Console' | 'Voucher';

// 1. USER
export interface User {
  id: string; // Alias for id_user
  id_user: string;
  username: string;
  password?: string; // Hidden on client
  nomor_hp: string;
  email?: string;
  role: 'user' | 'admin';
  riwayat_login: ActivityLog[];
  created_at: string;
}

// 2. KATEGORI (Game)
export interface Category {
  id: string; // Alias for id_game
  id_game?: string;
  name: string; // Alias for nama
  nama?: string;
  image: string; // Alias for tumbnail
  tumbnail?: string; // URL Image
  developer: string;
  category: GameCategoryType; // Alias for category_type
  category_type?: GameCategoryType;
  popular?: boolean;
  latest?: boolean;
}

// 3. PRODUK
export interface Product {
  id: string; // Alias for id_produk
  id_produk?: string;
  id_game: string; // Relasi ke Kategori
  name: string; // Alias for nama
  nama?: string; // Nama Nominal (Contoh: 86 Diamonds)
  jenis_topup?: string; // Instant / Gift / DLL
  nominal: string;
  price: number; // Alias for harga_produk
  harga_produk?: number;
  promoPrice?: number; // Alias for promo_harga
  promo_harga?: number; // Harga setelah diskon event (bukan promo code)
  status_aktif?: boolean;
}

// 4. PROMO (Kode Diskon)
export interface Promo {
  id_promo: string;
  created_at: string;
  kode_promo: string;
  potongan_harga: number;
  tipe_potongan: 'persen' | 'nominal';
  tanggal_berlaku: string;
  syarat_penggunaan: string;
  min_transaksi?: number;
}

// 5. TRANSAKSI (Order)
export interface Transaction {
  id: string; // Alias for id_transaksi
  id_transaksi: string;
  id_user?: string; // ID user pengorder (bisa 'Guest')
  name?: string; // User display name
  item?: string; // Full line item name
  gameId?: string;
  gameName?: string;
  productId?: string;
  productName?: string;
  id_produk?: string;
  user_id_game: string; // ID / Nickname di dalam game
  id_server: string; // Server game (Contoh: Asia, 1234)
  amount: number; // Alias for total_harga
  price?: number; // Old price field
  total_harga: number; // Total setelah fee & diskon promo
  status: 'Pending' | 'Success' | 'Failed' | 'Processing';
  date: string; // Alias for tanggal
  tanggal: string;
  paymentMethod?: string; // Alias for payment_method
  payment_method: string;
  paymentLogo?: string;
  promoDetails?: {
    code: string;
    discount: number;
  };
}

// 6. PEMBAYARAN
export interface Payment {
  id_pembayaran: string;
  id_transaksi: string;
  metode: 'e-wallet' | 'bank' | 'pulsa' | 'qris';
  nama_metode: string; // Contoh: GoPay, BCA
  status_pembayaran: 'Unpaid' | 'Paid' | 'Expired';
  reference_id_pg: string; // ID dari Payment Gateway
  fee: number;
  jumlah_bayar: number;
}

// 7. RIWAYAT TRANSAKSI (LOG)
export interface TransactionLog {
  id_log: string;
  id_transaksi: string;
  perubahan_status: string;
  keterangan: string;
  timestamp: string;
}

// 8. REWARD (Sistem Hadiah Pengguna Baru)
export interface Reward {
  id: string;
  id_user: string;
  kode_redeem: string;
  potongan: number;
  tipe: 'persen' | 'nominal';
  expires_at: string; // Masa berlaku 7 hari
  created_at: string;
  claimed_at?: string;
  used_at?: string;
  status: 'Available' | 'Claimed' | 'Used' | 'Expired';
  keterangan: string;
}

// 9. ADMIN
export interface Admin {
  id_admin: string;
  username: string;
  permissions: string[];
  last_login: string;
}

// 9. BANNER
export interface Banner {
  id_banner: string;
  tipe: 'featured' | 'promo' | 'trending';
  image_url: string;
  id_game?: string;
  id_produk?: string;
  urutan_tampilan: number;
  active: boolean;
}

// --- Tambahan Interface untuk UI Logic ---

export interface CartItem {
  cartId: string;
  gameId: string; // Restored
  productId: string; // Restored
  id_produk?: string;
  productName: string;
  id_game?: string;
  gameName: string;
  gameImage: string;
  price: number;
  promoPrice?: number;
  userId: string; // User ID Game
  id_server?: string;
  whatsapp?: string; // Restored
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'Login' | 'Transaction' | 'Update' | 'Delete' | 'Create';
  user: string;
  details: string;
}

export interface AppSettings {
  siteName: string;
  logoUrl: string;
  contactWhatsapp: string;
  maintenanceMode: boolean;

  notificationsEnabled: boolean;
  apiProviderUrl: string;
  apiSecret: string;
}

// 10. DAILY REWARD CONFIG
export interface DailyRewardConfig {
  day: number;
  discount: number;
  maxDiscount?: number;
  minTopUp: number;
  activeHours: number;
  status: 'Active' | 'Inactive';
  isSurprise?: boolean;
}

export interface WeeklyRewardProgress {
  currentDay: number; // 1 to 7
  lastClaimDate: string | null;
  streak: number;
  claimedCodes: ClaimedRedeemCode[];
}

export interface ClaimedRedeemCode {
  code: string;
  discount: number;
  maxDiscount: number;
  minTransaction: number;
  expiresAt: string;
  isUsed: boolean;
  day: number;
}

// Re-export alias untuk kompatibilitas code lama jika diperlukan
export type Game = Category;
export type ProductItem = Product;
export type Order = Transaction;
export type GameCategory = GameCategoryType;
export type PaymentMethod = {
  id: string;
  name: string;
  group: string;
  fee: number;
  logo: string;
};
