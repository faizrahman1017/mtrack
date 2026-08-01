# Duitin — Catatan Keuangan

Aplikasi pencatat pemasukan & pengeluaran pribadi. React + Vite + Tailwind + Supabase, bisa diinstall sebagai PWA di HP.

## 1. Jalankan di lokal (buat coba-coba dulu)

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. File `.env` sudah berisi kredensial Supabase kamu — jangan di-commit ke GitHub public repo (sudah masuk `.gitignore`).

## 2. Setup database Supabase (WAJIB dijalankan sekali)

1. Buka Supabase Dashboard (supabase.com/dashboard) → project kamu (`rigjcrmigatioudqwbny`)
2. Masuk ke **SQL Editor** → buat query baru
3. Copy-paste seluruh isi file `supabase_schema.sql` di folder ini → klik **Run**
4. Ini akan bikin tabel `transactions` + aktifkan Row Level Security, jadi tiap akun cuma bisa lihat datanya sendiri

## 3. Bikin akun untuk adekmu / orang lain (manual)

1. Di Supabase Dashboard → **Authentication** → **Users** → **Add user** → **Create new user**
2. Isi email & password → centang "Auto Confirm User" kalau mau langsung bisa login tanpa verifikasi email
3. Selesai — user itu bisa langsung login di app, dan datanya otomatis terpisah dari user lain (berkat Row Level Security)

Untuk nambah user baru kapan saja, ulangi langkah ini kapan pun tanpa perlu ubah kode.

## 4. Deploy ke Cloudflare Pages

**Opsi A — lewat GitHub (disarankan, auto-deploy tiap kali update):**

1. Push folder ini ke repo GitHub baru
2. Di dash.cloudflare.com → **Create application** → **Pages** → **Connect to Git**
3. Pilih repo-nya. Setting build:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Di bagian **Environment variables**, tambahkan:
   - `VITE_SUPABASE_URL` = `https://rigjcrmigatioudqwbny.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (anon key kamu, dari file `.env`)
5. Deploy. Cloudflare kasih URL `xxx.pages.dev` — bisa dipakai langsung atau disambungkan ke domain sendiri di tab **Custom domains**

**Opsi B — upload manual (tanpa GitHub):**

```bash
npm run build
npx wrangler pages deploy dist --project-name=duitin
```
(butuh `npx wrangler login` dulu sekali)

## 5. Install sebagai app di HP (PWA)

Setelah live di Cloudflare Pages, buka linknya di HP:
- **Android (Chrome)**: menu titik tiga → "Tambahkan ke layar utama"
- **iPhone (Safari)**: tombol share → "Tambah ke Layar Utama"

Nanti muncul sebagai app dengan ikon sendiri, terasa kayak app native.

## Struktur fitur

- **Catat** — input transaksi cepat, tab pengeluaran/pemasukan, kategori custom
- **Riwayat** — pilih tanggal lewat strip kalender (bar hijau/merah nunjukin untung/rugi hari itu), edit & hapus transaksi lama
- **Laporan** — tab Mingguan / Bulanan / Tahunan, chart arus kas + breakdown kategori pengeluaran

## Struktur project

```
src/
  components/   # komponen reusable (form, item transaksi, day-strip, dll)
  pages/        # 3 halaman utama + login
  hooks/        # useAuth, useTransactions (koneksi ke Supabase)
  lib/          # supabase client, format angka/tanggal, agregasi laporan
supabase_schema.sql   # skema database, jalankan sekali di Supabase SQL Editor
```
