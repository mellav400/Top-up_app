import { Game, PaymentMethod, Promo, DailyRewardConfig } from './types';

export const DEFAULT_DAILY_REWARDS: DailyRewardConfig[] = [
  { day: 1, discount: 5, minTopUp: 10000, activeHours: 24, status: 'Active' },
  { day: 2, discount: 10, minTopUp: 20000, activeHours: 24, status: 'Active' },
  { day: 3, discount: 15, minTopUp: 30000, activeHours: 24, status: 'Active' },
  { day: 4, discount: 20, minTopUp: 40000, activeHours: 24, status: 'Active' },
  { day: 5, discount: 25, minTopUp: 50000, activeHours: 24, status: 'Active' },
  { day: 6, discount: 30, minTopUp: 60000, activeHours: 24, status: 'Active' },
  { day: 7, discount: 50, maxDiscount: 100000, minTopUp: 100000, activeHours: 48, status: 'Active' },
];

export const WEEKLY_REWARD_CYCLE: DailyRewardConfig[] = [
  { day: 1, discount: 3, maxDiscount: 2000, minTopUp: 10000, activeHours: 24, status: 'Active' },
  { day: 2, discount: 3, maxDiscount: 2500, minTopUp: 15000, activeHours: 24, status: 'Active' },
  { day: 3, discount: 4, maxDiscount: 3000, minTopUp: 20000, activeHours: 24, status: 'Active' },
  { day: 4, discount: 0, maxDiscount: 4000, minTopUp: 20000, activeHours: 24, status: 'Active', isSurprise: true },
  { day: 5, discount: 5, maxDiscount: 4500, minTopUp: 25000, activeHours: 24, status: 'Active' },
  { day: 6, discount: 6, maxDiscount: 5000, minTopUp: 30000, activeHours: 24, status: 'Active' },
  { day: 7, discount: 12, maxDiscount: 10000, minTopUp: 50000, activeHours: 24, status: 'Active' },
];

export const GAMES: Game[] = [
  {
    id: 'mlbb',
    name: 'Mobile Legends',
    image: 'https://play-lh.googleusercontent.com/eOSTyn3tnJrezNp0pBV-grARGI8xWM0ylM0fZYoV-ZFaY52wCjyRwn0uIsWrAhQjzg',
    developer: 'Moonton',
    category: 'Mobile',
    popular: true
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    image: 'https://cdn2.steamgriddb.com/icon_thumb/ffbab8235ddc5c0290ecd6ceccc0a61a.png',
    developer: 'Hoyoverse',
    category: 'PC',
    popular: true
  },
  {
    id: 'pubgm',
    name: 'PUBG Mobile',
    image: 'https://games.noizmoon.com/wp-content/uploads/2020/07/pubg-icon.png',
    developer: 'Level Infinite',
    category: 'Mobile',
    popular: true
  },
  {
    id: 'valorant',
    name: 'Valorant',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Valorant_cover.jpg/250px-Valorant_cover.jpg',
    developer: 'Riot Games',
    category: 'PC',
    popular: true
  },
  {
    id: 'ff',
    name: 'Free Fire',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple125/v4/26/16/e8/2616e814-b0d0-4cec-a298-adb2cefba0f0/source/512x512bb.jpg',
    developer: 'Garena',
    category: 'Mobile',
    popular: true
  },
  {
    id: 'codm',
    name: 'Call of Duty: Mobile',
    image: 'https://play-lh.googleusercontent.com/JSGYuR7AN8xOzHPX8NkqvhRlkzMb-Vxe36PDwJ0-FLFxCmK51fRcuB82eIis2q_wUQ',
    developer: 'Activision',
    category: 'Mobile',
    popular: true
  },
  {
    id: 'zenless',
    name: 'Zenless Zone Zero',
    image: 'https://stardb.gg/images/icons/zenless-icon.webp',
    developer: 'Hoyoverse',
    category: 'Mobile',
    latest: true
  },
  {
    id: 'roblox',
    name: 'Roblox',
    image: 'https://static.wikia.nocookie.net/gamingpedia/images/7/77/App-icon-roblox.png/revision/latest?cb=20210309193301',
    developer: 'Roblox Corp',
    category: 'Voucher'
  },
  {
    id: 'hsr',
    name: 'Honkai: Star Rail',
    image: 'https://assets-prd.ignimgs.com/2022/08/24/honkaistarrail-1661335005177.jpg',
    developer: 'Hoyoverse',
    category: 'PC',
    popular: true,
    latest: true
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { 
    id: 'qris', 
    name: 'QRIS', 
    group: 'E-Wallet', 
    fee: 0, 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg' 
  },
  { 
    id: 'dana', 
    name: 'DANA', 
    group: 'E-Wallet', 
    fee: 500, 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg' 
  },
  { 
    id: 'gopay', 
    name: 'GoPay', 
    group: 'E-Wallet', 
    fee: 500, 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' 
  },
  { 
    id: 'bca', 
    name: 'BCA Virtual Account', 
    group: 'Virtual Account', 
    fee: 2500, 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' 
  },
  { 
    id: 'mandiri', 
    name: 'Mandiri Virtual Account', 
    group: 'Virtual Account', 
    fee: 2500, 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg' 
  },
  { 
    id: 'indomaret', 
    name: 'Indomaret', 
    group: 'Retail', 
    fee: 3500, 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Logo_Indomaret.png' 
  },
  { 
    id: 'alfamart', 
    name: 'Alfamart', 
    group: 'Retail', 
    fee: 3500, 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Alfamart_logo.svg' 
  }
];

export const GAME_PRODUCTS: Record<string, any[]> = {
  'mlbb': [
    { id: 'ml-1', name: '3 Diamonds', price: 1500, promoPrice: 1171 },
    { id: 'ml-2', name: '5 Diamonds', price: 2000, promoPrice: 1423 },
    { id: 'ml-3', name: '12 Diamonds', price: 4500, promoPrice: 3323 },
    { id: 'ml-4', name: '19 Diamonds', price: 7000, promoPrice: 5223 },
    { id: 'ml-5', name: '28 Diamonds', price: 10000, promoPrice: 7600 },
    { id: 'ml-6', name: '44 Diamonds', price: 15000, promoPrice: 11400 },
    { id: 'ml-7', name: '59 Diamonds', price: 20000, promoPrice: 15200 },
    { id: 'ml-8', name: '85 Diamonds', price: 30000, promoPrice: 21850, isBestSeller: true },
    { id: 'ml-9', name: '170 Diamonds', price: 60000, promoPrice: 43700, isBestSeller: true },
    { id: 'ml-10', name: '240 Diamonds', price: 85000, promoPrice: 61750 }
  ],
  'genshin': [
    { id: 'gi-1', name: '60 Genesis Crystals', price: 14865 },
    { id: 'gi-2', name: '300 Genesis Crystals', price: 72973, isBestSeller: true },
    { id: 'gi-3', name: '980 Genesis Crystals', price: 229730 },
    { id: 'gi-4', name: '1980 Genesis Crystals', price: 440541 },
    { id: 'gi-5', name: '3280 Genesis Crystals', price: 734234 },
    { id: 'gi-6', name: '6480 Genesis Crystals', price: 1467568 },
    { id: 'gi-bw', name: 'Blessing of the Welkin Moon', price: 79000, isBestSeller: true }
  ],
  'pubgm': [
    { id: 'pubg-1', name: '60 Unknown Cash', price: 17200 },
    { id: 'pubg-2', name: '325 Unknown Cash', price: 86000, isBestSeller: true },
    { id: 'pubg-3', name: '660 Unknown Cash', price: 172000 },
    { id: 'pubg-4', name: '1800 Unknown Cash', price: 430000 },
    { id: 'pubg-5', name: '3850 Unknown Cash', price: 860000 },
    { id: 'pubg-6', name: '8100 Unknown Cash', price: 1720000 }
  ],
  'valorant': [
    { id: 'val-1', name: '475 VP', price: 56000 },
    { id: 'val-2', name: '1000 VP', price: 112000, isBestSeller: true },
    { id: 'val-3', name: '2050 VP', price: 224000 },
    { id: 'val-4', name: '3650 VP', price: 389000 },
    { id: 'val-5', name: '5350 VP', price: 559000 },
    { id: 'val-6', name: '11000 VP', price: 1099000 }
  ],
  'ff': [
    { id: 'ff-1', name: '5 Diamonds', price: 901 },
    { id: 'ff-2', name: '12 Diamonds', price: 1802 },
    { id: 'ff-3', name: '50 Diamonds', price: 7207 },
    { id: 'ff-4', name: '70 Diamonds', price: 9009, isBestSeller: true },
    { id: 'ff-5', name: '140 Diamonds', price: 18018 },
    { id: 'ff-6', name: '355 Diamonds', price: 45045, isBestSeller: true },
    { id: 'ff-7', name: '720 Diamonds', price: 90090 },
    { id: 'ff-8', name: '1450 Diamonds', price: 180180 },
    { id: 'ff-9', name: '2180 Diamonds', price: 270270 },
    { id: 'ff-10', name: '3640 Diamonds', price: 450450 }
  ],
  'hsr': [
    { id: 'hsr-1', name: '60 Oneiric Shards', price: 15300 },
    { id: 'hsr-2', name: '300 Oneiric Shards', price: 73000, promoPrice: 71000, isBestSeller: true },
    { id: 'hsr-3', name: '980 Oneiric Shards', price: 225000 }
  ],
  'zenless': [
    { id: 'zzz-1', name: '60 Monochromes', price: 14414 },
    { id: 'zzz-2', name: '300 + 30 Bonus Monochromes', price: 71171 },
    { id: 'zzz-3', name: 'Keanggotaan Inter-Knot', price: 71171, isBestSeller: true },
    { id: 'zzz-4', name: '980 + 110 Bonus Monochromes', price: 224324 },
    { id: 'zzz-5', name: '1980 + 260 Bonus Monochromes', price: 431532 },
    { id: 'zzz-6', name: '3280 + 600 Bonus Monochromes', price: 719820 },
    { id: 'zzz-7', name: '6480 + 1600 Bonus Monochromes', price: 1440541 }
  ],
  'wuwa': [
    { id: 'wuwa-1', name: '60 Lunites', price: 15000 },
    { id: 'wuwa-2', name: '300 Lunites', price: 75000, promoPrice: 72000, isBestSeller: true }
  ],
  'codm': [
    { id: 'codm-1', name: '31 CP', price: 4505 },
    { id: 'codm-2', name: '63 CP', price: 9009, isBestSeller: true },
    { id: 'codm-3', name: '128 CP', price: 18018 },
    { id: 'codm-4', name: '321 CP', price: 45045 },
    { id: 'codm-5', name: '645 CP', price: 90090 },
    { id: 'codm-6', name: '800 CP', price: 108108 },
    { id: 'codm-7', name: '1373 CP', price: 180180 },
    { id: 'codm-8', name: '2060 CP', price: 270270 },
    { id: 'codm-9', name: '2750 CP', price: 342342 },
    { id: 'codm-10', name: '3564 CP', price: 450450 }
  ],
  'steam': [
    { id: 'steam-1', name: 'IDR 12.000 Wallet Code', price: 18500, promoPrice: 12000, isBestSeller: true },
    { id: 'steam-2', name: 'IDR 250.000 Wallet Code', price: 378000, promoPrice: 250000, isBestSeller: true },
    { id: 'steam-3', name: 'IDR 45.000 Wallet Code', price: 68000, promoPrice: 45000 },
    { id: 'steam-4', name: 'IDR 60.000 Wallet Code', price: 91000, promoPrice: 60000 },
    { id: 'steam-5', name: 'IDR 90.000 Wallet Code', price: 136000, promoPrice: 90000 },
    { id: 'steam-6', name: 'IDR 120.000 Wallet Code', price: 181000, promoPrice: 120000 },
    { id: 'steam-7', name: 'IDR 400.000 Wallet Code', price: 605000, promoPrice: 400000 },
    { id: 'steam-8', name: 'IDR 600.000 Wallet Code', price: 907000, promoPrice: 600000 }
  ],
  'roblox': [
    { id: 'rbx-1', name: '80 Robux', price: 15000 },
    { id: 'rbx-2', name: '400 Robux', price: 75000, promoPrice: 70000, isBestSeller: true },
    { id: 'rbx-3', name: '800 Robux', price: 150000 }
  ]
};

export const PROMOS: Promo[] = [
  {
    id_promo: 'promo-1',
    created_at: '2024-01-01',
    kode_promo: 'DISKON10',
    potongan_harga: 10,
    tipe_potongan: 'persen',
    tanggal_berlaku: '2026-12-31',
    syarat_penggunaan: 'Potongan 10% untuk semua transaksi.',
    min_transaksi: 10000
  },
  {
    id_promo: 'promo-2',
    created_at: '2024-01-01',
    kode_promo: 'HEMAT5000',
    potongan_harga: 5000,
    tipe_potongan: 'nominal',
    tanggal_berlaku: '2026-12-31',
    syarat_penggunaan: 'Potongan Rp 5.000 dengan minimal belanja Rp 50.000.',
    min_transaksi: 50000
  },
  {
    id_promo: 'promo-3',
    created_at: '2024-01-01',
    kode_promo: 'NEWUSER',
    potongan_harga: 20,
    tipe_potongan: 'persen',
    tanggal_berlaku: '2026-12-31',
    syarat_penggunaan: 'Potongan 20% khusus pengguna baru.',
    min_transaksi: 0
  }
];
