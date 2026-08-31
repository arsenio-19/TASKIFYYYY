# Taskify — To-Do List App

Aplikasi to-do list bertema **Taskify**, dibangun dengan HTML, **Tailwind CSS**, dan JavaScript murni (tanpa framework JS, tanpa perlu koneksi internet untuk jalan — Tailwind sudah di-build jadi file CSS statis di `dist/tailwind.css`).

## Cara menjalankan

1. Ekstrak isi file zip ini.
2. Buka file `index.html` langsung di browser, **atau** jalankan local server (disarankan agar semua fitur berjalan mulus), misalnya:
   ```
   npx serve .
   ```
   atau
   ```
   python3 -m http.server 8080
   ```
   lalu buka `http://localhost:8080`.

## Akun demo

Supaya bisa langsung dicoba tanpa daftar dulu, sudah disiapkan satu akun contoh:

- **Email:** `demo@taskify.com`
- **Password:** `taskify123`

Atau bisa juga bikin akun baru sendiri lewat "Sign Up", atau klik "Continue browsing without logging in" untuk lihat-lihat papan task sebagai tamu (tanpa bisa menambah/mengedit task).

## Fitur

- **Halaman Login/Sign Up** bertema biru langit, ukuran lebih wajar untuk desktop, lengkap dengan catatan "kamu harus sign in dulu" di bagian bawah.
- **Home page bisa diakses tanpa login** — tapi membuat/mengedit/mencentang task akan diminta login terlebih dahulu.
- **Sidebar**: tombol buka/tutup ada di baris paling atas, logo & nama Taskify di bawahnya (logo lebih besar, nama "Taskify" berwarna biru supaya jelas kebaca), lalu tombol "Make a new plan" dan kalender mini. Saat sidebar ditutup (collapsed), yang tampil cuma ikon: toggle → logo → tombol plus (create task) → ikon kalender (klik untuk buka lagi sidebar penuh).
- **Papan hari** dimulai dari **Today** (bukan menampilkan hari-hari lampau), bisa digeser dengan panah kiri/kanan. Ada 2 contoh task di hari-hari sebelum hari ini (bisa dilihat kalau geser ke kiri / klik tanggal di kalender), sedangkan hari-hari ke depan sengaja dibiarkan kosong — akan terisi sendiri begitu task dibuat di hari itu.
- **Checkbox** pada setiap task — saat dicentang, kartu berubah warna pastel biru, teks jadi dicoret tapi tetap kebaca.
- **Popup form** untuk menambah/mengedit/menghapus task, lengkap dengan kategori berwarna, tanggal, dan jam.
- Sepenuhnya responsif: sidebar otomatis jadi drawer yang bisa dibuka lewat ikon ☰ di layar HP/tablet kecil.
- Semua data tersimpan otomatis di `localStorage` browser (tidak perlu server/database).

## Catatan

Karena ini demo front-end murni, sistem login bersifat **mock** (disimpan di localStorage browser kamu sendiri), bukan otentikasi server sungguhan. Cocok untuk prototipe, portofolio, atau dasar pengembangan lebih lanjut.

## Backend / Data Layer

Taskify menggunakan LocalStorage sebagai data layer lokal untuk menyimpan data pengguna, session, dan task. Pengelolaan penyimpanan dipisahkan ke dalam `js/storage.js`, sehingga aplikasi tidak membutuhkan server atau database eksternal.

## Struktur file

```
taskify/
├── index.html
├── script.js
├── tailwind.config.js     # konfigurasi Tailwind
├── package.json
├── src/
│   └── input.css          # source Tailwind (@tailwind base/components/utilities)
├── dist/
│   └── tailwind.css       # hasil build Tailwind — inilah yang dipakai index.html
└── assets/
    └── logo.jpg
```

## Kalau mau edit tampilan (ubah class Tailwind)

1. Install dependency: `npm install`
2. Edit `index.html` / `script.js` seperlunya (tambah/ubah class Tailwind).
3. Build ulang CSS-nya:
   ```
   npx tailwindcss -i ./src/input.css -o ./dist/tailwind.css --minify
   ```
   atau untuk mode watch saat development:
   ```
   npx tailwindcss -i ./src/input.css -o ./dist/tailwind.css --watch
   ```

