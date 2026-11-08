# PENJELASAN KODE — Website SEL

File ini menjelaskan setiap file kode dengan bahasa sederhana, supaya Howard bisa menjawab pertanyaan guru.

---

## vite.config.js
**Tugas file ini:** Memberi tahu Vite bahwa website ini punya 6 halaman HTML, bukan hanya satu.
**Dipakai oleh:** perintah `npm run dev` dan `npm run build`.
**Cara kerja (langkah demi langkah):**
1. Daftar `pages` berisi nama keenam halaman.
2. `map` mengubah tiap nama menjadi pasangan `[nama, alamat file lengkap]`, misalnya `['kuis', 'C:/.../kuis.html']`.
3. `Object.fromEntries` mengubah daftar pasangan itu menjadi satu objek.
4. Objek itu dipasang di `build.rollupOptions.input`, sehingga saat build Vite membuat keenam halaman.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa perlu file ini? J: Tanpa file ini, Vite hanya membangun `index.html`. Halaman lain tidak ikut saat di-upload.
- T: Apa itu Vite? J: Alat yang menjalankan server lokal saat membuat website dan menggabungkan file saat website siap online.

---

## src/data/pages.json
**Tugas file ini:** Satu daftar berisi keenam halaman: id, nama file, label di menu, dan kalimat pratinjau.
**Dipakai oleh:** `src/core/nav.js` dan `src/core/footer-next.js`.
**Bagian penting:**
- Urutan isi daftar = urutan perjalanan website (Beranda → … → Rangkuman).
- Kalau ingin mengganti nama menu, cukup ubah file ini. Navigasi dan footer ikut berubah otomatis.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa teks menu tidak ditulis langsung di HTML? J: Supaya tidak ditulis enam kali. Satu sumber data dipakai semua halaman, jadi tidak ada yang tertinggal saat diubah.

---

## src/styles/tokens.css
**Tugas file ini:** Menyimpan semua warna, jenis huruf, dan ukuran dasar sebagai variabel CSS.
**Dipakai oleh:** semua file CSS lain lewat `var(--nama)`.
**Bagian penting:**
- `--c-deep`, `--c-lagoon`, `--c-aqua` — warna air untuk Beranda.
- `--c-lab`, `--c-lab-2` — latar gelap seperti laboratorium untuk halaman 2–6.
- `--c-coral` — warna aksen untuk tombol dan halaman aktif.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Apa itu variabel CSS? J: Nama untuk sebuah nilai. Misalnya `--c-coral` berisi `#FF7A59`. Kalau warnanya diganti di satu tempat, semua tombol ikut berubah.

---

## src/styles/base.css
**Tugas file ini:** Gaya dasar seluruh website: reset ukuran kotak, warna latar, huruf, judul, tautan, dan fokus keyboard.
**Bagian penting:**
- `box-sizing: border-box` — lebar elemen sudah termasuk padding, jadi tata letak lebih mudah dihitung.
- `body.theme-water` — Beranda memakai latar biru laut, halaman lain latar lab gelap.
- `.display`, `.tagline`, `.eyebrow` — tiga gaya teks utama (judul besar, kalimat miring, label kecil).
- `:focus-visible` — garis koral muncul saat elemen dipilih dengan tombol Tab, supaya pengguna keyboard tahu posisinya.
- `@view-transition { navigation: auto; }` — browser yang mendukung membuat perpindahan halaman memudar halus.
- `@media (prefers-reduced-motion: reduce)` — kalau pengguna mematikan animasi di komputernya, semua animasi dibuat hampir nol.

---

## src/styles/components.css
**Tugas file ini:** Gaya komponen yang dipakai berulang: navigasi, tombol, kartu, footer "Lanjut", dan titik progres.
**Bagian penting:**
- `.nav` — bilah menu menempel di atas (`position: fixed`) dengan latar agak transparan dan efek blur.
- `@media (max-width: 860px)` — di layar sempit, daftar menu disembunyikan dan tombol "Menu" muncul. Kelas `nav--open` menampilkan daftar itu lagi.
- `.nav .nav__menu-button` — ditulis dengan dua kelas supaya lebih kuat daripada aturan `.toggle`. Sebelumnya tombol Menu muncul di laptop karena tertimpa.
- `.toggle[aria-pressed='true'] .toggle__dot` — titik pada tombol Mode Tenang menjadi hijau saat mode aktif.
- `.footer-next__main` — kartu besar "Lanjut: … →".
- `.progress-dots__dot--done` — titik yang sudah dilewati diwarnai koral.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa nama kelasnya pakai `__` dan `--`? J: Ini gaya penamaan BEM. `nav__link` artinya "link di dalam nav". `nav__link--active` artinya "link nav versi aktif".

---

## src/core/calm-mode.js
**Tugas file ini:** Menyimpan dan membaca pilihan **Mode Tenang** (tanpa animasi 3D).
**Dipakai oleh:** `page-setup.js` dan `nav.js`.
**Cara kerja (langkah demi langkah):**
1. `isCalmMode()` membaca `localStorage` dengan kunci `sel:mode-tenang`.
2. Kalau pengguna belum pernah memilih, fungsi mengikuti setelan komputer `prefers-reduced-motion`.
3. `setCalmMode(on)` menyimpan pilihan, menambah/menghapus kelas `calm` di `<html>`, lalu mengirim sinyal `calmmodechange` agar halaman lain bisa bereaksi.
4. `applyCalmMode()` dipanggil saat halaman dibuka supaya pilihan terakhir langsung dipakai.
**Bagian penting:**
- `try { ... } catch` — di mode penyamaran browser, `localStorage` kadang diblokir. Tanpa `try`, website bisa error.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Apa itu localStorage? J: Tempat kecil di browser untuk menyimpan data teks. Data tetap ada walau halaman ditutup.

---

## src/core/nav.js
**Tugas file ini:** Membuat bilah navigasi atas di setiap halaman.
**Dipakai oleh:** `page-setup.js`.
**Cara kerja (langkah demi langkah):**
1. `renderNav(currentId)` membuat elemen `<nav>`, logo "SEL", dan daftar `<ul>`.
2. Untuk setiap halaman di `pages.json`, `createLink` membuat satu tautan. Halaman yang sedang dibuka diberi kelas aktif dan `aria-current="page"`.
3. `createMenuButton` membuat tombol "Menu" untuk ponsel. Klik → kelas `nav--open` dipasang/dilepas.
4. `createCalmToggle` membuat tombol Mode Tenang. Klik → `setCalmMode` dipanggil dan `aria-pressed` diperbarui.
5. `document.body.prepend(nav)` menaruh navigasi di paling atas halaman.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa navigasi dibuat dengan JavaScript, bukan ditulis di HTML? J: Supaya satu kode dipakai di enam halaman. Kalau ditulis di HTML, harus disalin enam kali.
- T: Apa fungsi `aria-current` dan `aria-expanded`? J: Memberi tahu pembaca layar (untuk tunanetra) halaman mana yang aktif dan apakah menu sedang terbuka.

---

## src/core/footer-next.js
**Tugas file ini:** Membuat footer di bawah setiap halaman: tombol "Lanjut", tautan "Sebelumnya", dan titik progres.
**Cara kerja (langkah demi langkah):**
1. Mencari posisi halaman sekarang di `pages.json` dengan `findIndex`.
2. Halaman berikutnya = posisi + 1. Kalau sudah di halaman terakhir (Rangkuman), tombol kembali ke Beranda dengan teks "↺ Selam lagi dari awal".
3. `createDots` membuat 6 titik; titik sampai halaman sekarang diwarnai.
4. Tautan "Sebelumnya" hanya dibuat kalau ada halaman sebelumnya (Beranda tidak punya).

---

## src/core/page-setup.js
**Tugas file ini:** Satu fungsi `setupPage()` yang menyiapkan semua bagian umum halaman.
**Cara kerja:**
1. Mengimpor tiga file CSS (Vite memasukkannya ke halaman).
2. Membaca id halaman dari `<body data-page="...">`.
3. Menjalankan Mode Tenang, navigasi, dan footer.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Dari mana halaman tahu dirinya halaman apa? J: Dari atribut `data-page` di tag `<body>`, misalnya `data-page="kuis"`.

---

## src/pages/*/main.js
**Tugas file ini:** Titik awal kode tiap halaman. Untuk sekarang hanya memanggil `setupPage()`.
Nanti tiap halaman menambahkan kodenya sendiri di sini (adegan 3D, kuis, dan lain-lain).

---

## tools/inspect-model.mjs
**Tugas file ini:** Alat untuk memeriksa file model 3D (.glb) sebelum dipakai. Tidak ikut ke website.
**Cara pakai:** `npm run inspect -- assets-src/nama.glb`
**Cara kerja:**
1. Membaca file .glb dengan library glTF-Transform.
2. Menghitung jumlah node, mesh, segitiga, dan tekstur.
3. Menampilkan lisensi yang tersimpan di metadata file.
4. Mendaftar semua material dan berapa kali dipakai. Ini penting karena organel harus punya material terpisah supaya bisa disorot satu per satu.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa model harus diperiksa dulu? J: Untuk memastikan lisensinya boleh dipakai, ukurannya tidak terlalu berat, dan organelnya bisa dipilih satu per satu.

---

## tools/compress-models.mjs
**Tugas file ini:** Mengompres semua model di `assets-src/` dan menyimpan hasilnya di `public/models/`.
**Cara pakai:** `npm run compress`
**Cara kerja:** Untuk setiap file .glb, menjalankan perintah `gltf-transform optimize` dengan kompresi meshopt
(memperkecil data bentuk) dan tekstur WebP maksimal 1024 piksel.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa model perlu dikompres? J: Model sel hewan aslinya 70 MB. Itu terlalu lama dimuat di Wi-Fi sekolah. Targetnya di bawah 8 MB per model.

---

## Perbaikan desain (8 Nov, setelah membaca skill desain — lihat `docs/DESIGN.md`)
**Yang diubah dan alasannya:**
- `--c-muted` diganti dari `#6B7A86` ke `#7F8E9A`. Warna lama hanya punya kontras 3,9–4,3 : 1 (di bawah syarat 4,5 : 1),
  jadi teks abu-abu kecil sulit dibaca di proyektor. Di Beranda (latar biru) dipakai `--c-muted-water` `#8FC3C4`
  karena abu-abu di atas biru tua hanya 2,7 : 1.
- `--tap-min: 44px` — semua tautan menu, logo, tombol Mode Tenang, dan tautan "Sebelumnya" dibuat minimal 44 px tingginya
  supaya mudah diklik/disentuh.
- `transition-property` ditulis satu per satu (bukan `transition: all`), supaya browser hanya menganimasikan yang perlu.
- `:active { transform: scale(0.97) }` — tombol terasa "ditekan" saat diklik.
- `text-wrap: balance` pada judul (baris judul sama panjang), `text-wrap: pretty` pada paragraf (tidak ada satu kata tersisa
  sendirian di baris terakhir), `max-width: 68ch` agar baris paragraf tidak terlalu panjang dibaca.
- `::selection`, `caret-color`, `scrollbar-color`, `accent-color` — bagian bawaan browser ikut memakai warna website.
- Kelas `.card` dihapus karena belum dipakai (aturan anti-slop: jangan membuat kartu tanpa isi yang membutuhkannya).

## Tautan "Langsung ke isi" (di `src/core/nav.js`)
**Tugas:** Tautan tersembunyi yang muncul saat pengguna menekan Tab pertama kali. Kalau diklik, langsung lompat ke `<main id="main">`.
**Kenapa:** Pengguna keyboard tidak perlu menekan Tab melewati 8 tombol menu di setiap halaman.
**CSS:** `.skip-link` digeser ke atas layar (`translateY(-200%)`) dan baru turun saat `:focus-visible`.

## public/view-transition.js
**Tugas file ini:** Mencegah pesan error "Transition was skipped" di console saat pindah halaman.
**Cara kerja:**
1. Browser modern membuat animasi perpindahan halaman (View Transitions). Kadang animasi itu dilewati, misalnya saat
   halaman dimuat ulang cepat. Browser lalu menganggapnya error yang "tidak ditangkap".
2. File ini mendengarkan event `pageswap` (halaman lama) dan `pagereveal` (halaman baru), lalu memasang `.catch()` kosong
   pada janji (promise) transisi, sehingga lompatan transisi tidak lagi tercatat sebagai error.
**Kenapa di folder `public/` dan dimuat di `<head>`:** `pagereveal` terjadi sebelum halaman pertama kali digambar.
Kode modul biasa (`src/...`) dijalankan terlambat untuk menangkapnya. Skrip biasa di `<head>` dijalankan lebih dulu.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Apa itu promise? J: Janji bahwa suatu proses akan selesai nanti, entah berhasil atau gagal. `.catch()` menangani kalau gagal.

---

## index.html (Beranda — versi teks, Fase 1)
**Tugas file ini:** Halaman pertama. Berisi 8 "adegan" perjalanan menyelam dalam bentuk HTML biasa, sesuai `KONTEN-MATERI.md` §1.
**Cara kerja:**
1. Setiap adegan adalah satu `<section class="scene">` dengan `id` (`permukaan`, `menyelam`, `terumbu`, `sel-hewan`, `karang`, `sel-tumbuhan`, `ringkasan`, `gelap`).
2. Warna latar tiap adegan makin gelap (biru laguna → biru dalam → hijau lamun → lumpur → hitam), seolah kita makin dalam menyelam.
3. Tombol "Lewati intro" adalah tautan ke `#gelap`, jadi langsung melompat ke adegan terakhir.
4. Teks inilah yang dibaca mesin pencari, pembaca layar, dan dipakai di Mode Tenang. Nanti adegan 3D digambar di belakangnya.
**Bagian penting:**
- `<dl class="term-list">` — daftar istilah: `<dt>` nama organel, `<dd>` fungsinya. Cocok untuk pasangan "istilah: arti".
- `<table>` dengan `<th scope="col">` dan `<th scope="row">` — pembaca layar tahu mana judul kolom dan judul baris.
- `aria-labelledby` — tiap section diberi nama dari judulnya. Judul yang tidak perlu terlihat memakai kelas `visually-hidden`.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa teksnya ditulis di HTML, padahal nanti ada 3D? J: Supaya isi tetap bisa dibaca walau 3D mati (laptop lemah, Mode Tenang), dan bisa dibaca mesin pencari.

## src/styles/content.css
**Tugas file ini:** Gaya untuk isi materi yang dipakai di banyak halaman: section, kutipan, kotak fakta, daftar istilah, tangga skala, tabel.
**Bagian penting:**
- `.table-wrap { overflow-x: auto }` — di ponsel, tabel yang lebar bisa digeser sendiri tanpa membuat seluruh halaman bergeser ke samping.
- `.scale-steps li + li::before { content: '›' }` — tanda panah kecil hanya muncul di antara angka skala, bukan sebelum angka pertama.
- `font-variant-numeric: tabular-nums` — angka punya lebar sama, rapi saat nanti dianimasikan.

## src/pages/landing/landing.css
**Tugas file ini:** Gaya khusus Beranda: adegan setinggi layar (`min-height: 100svh`), warna latar per adegan, judul besar SEL.
**Bagian penting:**
- `100svh` — tinggi layar yang benar di ponsel (tidak tertutup bilah alamat browser).
- `letter-spacing: 0.18em; margin-right: -0.18em` — huruf SEL direnggangkan; margin negatif membuang spasi ekstra setelah huruf terakhir supaya judul tetap tepat di tengah.

## src/core/smooth-scroll.js
**Tugas file ini:** Membuat gulir halus dengan library **Lenis** dan menyambungkannya ke **GSAP ScrollTrigger**.
**Cara kerja:**
1. `start()` membuat Lenis. Setiap kali Lenis menggulir, `ScrollTrigger.update` dipanggil agar animasi tahu posisi gulir terbaru.
2. `gsap.ticker.add(onTick)` — Lenis digerakkan oleh "detak jam" GSAP, jadi keduanya selalu sinkron.
3. Kalau Mode Tenang aktif, Lenis tidak dibuat (gulir biasa). Kalau Mode Tenang dinyalakan/dimatikan, `stop()`/`start()` dipanggil.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa tidak pakai gulir biasa? J: Gulir halus membuat adegan 3D yang mengikuti gulir terasa mulus, tidak patah-patah. Tetapi gulir biasa tetap dipakai untuk Mode Tenang.

## src/pages/landing/word-reveal.js
**Tugas file ini:** Efek kata demi kata: kalimat besar di adegan 2 mula-mula redup (30%), lalu setiap kata menyala berurutan saat digulir.
**Cara kerja:**
1. `wrapWords` mencari semua potongan teks di dalam elemen (termasuk di dalam `<strong>`), lalu membungkus tiap kata dengan `<span class="reveal-word">`. Spasi dibiarkan apa adanya.
2. `gsap.fromTo(words, {opacity: 0.3}, {opacity: 1, stagger: 0.1, scrollTrigger: {..., scrub: 1}})` — kecerahan tiap kata dihubungkan dengan posisi gulir. `stagger` membuat kata berikutnya menyusul sedikit kemudian.
3. Di Mode Tenang, kata tetap dibungkus tetapi tidak dianimasikan, jadi semua langsung terang.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Apa arti `scrub: 1`? J: Animasi tidak berjalan sendiri, melainkan "ditarik" oleh gulir. Angka 1 artinya animasi menyusul posisi gulir dalam ±1 detik supaya halus.
