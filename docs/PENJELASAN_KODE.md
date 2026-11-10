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

---

# BERANDA 3D (Fase 2)

Gambaran besar: di belakang teks Beranda ada **satu kanvas WebGL** yang menempel di layar (`position: fixed`).
Saat halaman digulir, kode membaca posisi gulir, menentukan adegan mana yang sedang aktif, lalu menggambar adegan itu.
Semua objek 3D (air, pulau, ikan, karang, lamun, sel) **dibuat sendiri dengan kode Three.js**, tidak ada model yang diunduh.

```
main.js -> stage.js -+-> conductor.js   (posisi gulir -> adegan + progres)
                     +-> scenes/index.js -> surface / reef / animal-cell / seagrass / plant-cell / mud
                     +-> title-ripple.js (efek riak judul SEL)
                     +-> dom-sync.js     (menyorot teks yang sesuai dengan 3D)
                     +-> core/renderer.js + core/quality.js
```

## src/core/renderer.js
**Tugas file ini:** Membuat **satu** `WebGLRenderer` dengan pengaturan hemat.
**Dipakai oleh:** `src/pages/landing/stage.js`
**Bagian penting:**
- `PIXEL_RATIO_BY_TIER` — jumlah piksel yang digambar: tinggi 1,5×, sedang 1×, rendah 0,75×. Makin kecil, makin ringan.
- `antialias: tier === 'high'` — penghalus tepi hanya untuk laptop kuat.
- `ACESFilmicToneMapping` — mengatur terang-gelap agar warna terlihat seperti film, tidak "terbakar" putih.
- `autoClear = false` — kita menggambar dua lapis (adegan, lalu judul) di atas satu sama lain, jadi pembersihan layar diatur manual.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa hanya satu renderer? J: Setiap renderer memakai memori kartu grafis. Satu renderer dipakai bergantian oleh semua adegan.

## src/core/quality.js
**Tugas file ini:** Mengukur FPS (gambar per detik) dan menurunkan kualitas otomatis kalau laptop berat.
**Cara kerja (langkah demi langkah):**
1. `startTier()` menebak awal: layar kecil atau prosesor ≤ 4 inti → "medium", selain itu "high".
2. `tick(dt)` menghitung jumlah frame setiap 2 detik.
3. FPS < 40 → turun satu tingkat (high → medium → low) dengan mengecilkan resolusi.
4. Sudah di "low" dan FPS < 20 → Mode Tenang dinyalakan, lalu muncul pesan kecil (`showToast`).
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Apa itu FPS? J: Frames per second. 60 FPS = gambar diganti 60 kali per detik, terasa mulus. Di bawah 30 mulai patah-patah.

## src/data/landing-chapters.json
**Tugas file ini:** "Naskah" adegan hero Beranda. Tiap baris berkata: section HTML mana → adegan 3D apa → bagian mana dari adegan itu. Sejak 10 Nov hanya dua baris (permukaan dan menyelam); sisa perjalanan memakai video scroll-scrub (lihat `scroll-sequence.js`).
- `from`/`to` — bagian section (0 = atas, 1 = bawah).
- `sceneStart`/`sceneEnd` — progres adegan. Contoh: adegan `surface` dipakai di dua section: permukaan (0–0,35) lalu menyelam (0,35–1).
- `veilIn`/`veilOut` — warna "tirai" yang menutup layar sebentar saat berganti adegan, supaya pergantian tidak terlihat meloncat.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa disimpan di JSON? J: Supaya urutan cerita bisa diubah tanpa mengubah kode.

## src/pages/landing/conductor.js
**Tugas file ini:** "Dirigen". Mengubah posisi gulir menjadi: section aktif, adegan aktif, progres adegan, dan tirai.
**Cara kerja (langkah demi langkah):**
1. `measureSections()` mencatat posisi atas dan tinggi setiap section.
2. Titik fokus = tengah layar (`scrollY + tinggi layar / 2`). Section aktif = section terakhir yang bagian atasnya sudah melewati titik fokus.
3. `sectionT` = sudah berapa persen section itu dilewati (0–1).
4. Baris JSON yang cocok dicari, lalu `sceneProgress` dihitung dengan `lerp`.
5. `update()` memakai `smoothY` yang mengejar posisi gulir sebenarnya sedikit demi sedikit (`1 - Math.exp(-5 * dt)`), supaya kamera bergerak halus.
6. `exact()` memakai posisi gulir asli (tanpa penghalusan) untuk menyorot teks, supaya teks selalu tepat.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Apa itu lerp? J: `lerp(a, b, t)` = titik di antara a dan b. t = 0 hasilnya a, t = 1 hasilnya b, t = 0,5 tepat di tengah.

## src/pages/landing/stage.js
**Tugas file ini:** "Panggung". Membuat kanvas, renderer, tirai, lalu menjalankan putaran gambar (render loop).
**Dipakai oleh:** `src/pages/landing/main.js`
**Cara kerja setiap frame (`frame()`):**
1. `dt` = waktu sejak frame sebelumnya, dibatasi maksimal 1/30 detik supaya animasi tidak melompat setelah jeda.
2. Monitor kualitas diberi `dt`.
3. Dirigen memberi tahu adegan aktif dan progresnya. Adegan dibuat **hanya saat pertama dibutuhkan** (`getScene`) lalu disimpan.
4. Adegan aktif di-`update` lalu digambar. Hanya adegan aktif yang digambar.
5. Kalau sedang di section permukaan/menyelam, judul SEL digambar di atasnya.
6. Opasitas dan warna tirai diatur.
7. **Setelah hero** (bagian atas `#perjalanan` sudah melewati tengah layar), panggung tidak menggambar adegan 3D lagi, tetapi bidang frame walkthrough dari `sequence/plane.js`. Tirai teal memudar sesuai posisi section, jadi peralihan dari menyelam ke video tidak meloncat. Tetap **satu** renderer WebGL untuk seluruh halaman.
**Bagian penting:**
- `visibilitychange` — kalau tab disembunyikan, loop berhenti (hemat baterai). Saat kembali, jalan lagi.
- `ResizeObserver` — kalau tinggi isi halaman berubah (font selesai dimuat, layar diputar), posisi section diukur ulang.
- `dispose()` — saat Mode Tenang dinyalakan atau halaman ditinggalkan, semua geometri, material, dan tekstur dibuang dari memori.
- `try { createRenderer } catch` — kalau browser tidak mendukung WebGL, panggung tidak dibuat dan halaman tetap tampil sebagai teks.

## src/pages/landing/title-ripple.js + shaders/title.frag.glsl
**Tugas file ini:** Efek riak air pada judul **SEL** (CLAUDE.md §6.1.1).
**Cara kerja (langkah demi langkah):**
1. `drawText` menggambar "SEL" dan tagline ke kanvas 2D biasa, tepat di posisi `<h1>` asli (diukur dengan `getBoundingClientRect`). Kanvas itu menjadi tekstur.
2. Tekstur ditempel di satu persegi yang menutupi seluruh layar (`PlaneGeometry(2, 2)`).
3. Shader (program kecil di kartu grafis) menentukan, untuk setiap piksel, **dari titik mana di tekstur warna diambil**. Kalau diambil dari tempat yang sedikit bergeser, teks terlihat membengkok seperti di bawah air.
4. **Lensa kursor:** piksel dalam radius 90 px dari kursor digeser menjauh, kekuatannya mengecil halus dengan kurva cosinus, maksimal 6 px, makin kuat kalau kursor bergerak cepat.
5. **Riak:** setiap kursor bergerak 40 px, satu titik riak disimpan (`addRipple`: posisi x, y, waktu mulai, kekuatan). Riak berupa cincin yang melebar 120 px/detik, lebar pita 24 px, dan memudar dalam 1,5 detik. Klik = riak besar 5 px.
6. Maksimal 16 riak disimpan bergiliran (`nextRipple = (nextRipple + 1) % 16`).
7. Saat digulir ke adegan 2, `heroProgress` naik: riak makin kuat, judul tenggelam (`uScroll`) dan memudar (`uOpacity`).
**Bagian penting:**
- Baris shader `exp(-(ring * ring) / (2.0 * RING_WIDTH * RING_WIDTH))` — kurva lonceng (Gauss): kuat tepat di cincin, cepat melemah di luar cincin.
- Baris shader `sin(ring * 0.25)` — bentuk gelombang naik-turun di dalam cincin.
- Saat diam, semua geseran = 0, jadi teks 100% tajam.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa tidak pakai CSS saja? J: CSS tidak bisa membengkokkan setiap piksel huruf seperti pantulan air. Shader bisa, dan berjalan di kartu grafis jadi tetap ringan.
- T: Kenapa ada `<h1>` asli juga? J: Untuk mesin pencari, pembaca layar, dan Mode Tenang. Di mode 3D warnanya dibuat transparan.

## src/pages/landing/scenes/shared.js
**Tugas file ini:** Alat bantu bersama untuk semua adegan.
- `lerp`, `clamp01` (batasi 0–1), `smooth` (percepatan halus di awal dan akhir), `rangeT` (ubah rentang progres menjadi 0–1).
- `seededRandom` — angka acak yang selalu sama setiap dimuat, jadi tampilan konsisten.
- `createDriftParticles` — butiran melayang berbentuk bulat.
- `addSway` — menambah gerak bergoyang ke material: makin tinggi bagian objek, makin besar goyangannya.
- `disposeScene` — buang semua memori adegan.

## scenes/surface.js + shaders/water.vert.glsl + water.frag.glsl (adegan 1–2)
- **Air:** bidang 200×200 dengan banyak titik. Vertex shader menaikkan-turunkan setiap titik dengan jumlah tiga gelombang sinus (`waveHeight`), lalu menghitung arah permukaan (normal) untuk pantulan.
- **Fragment shader:** warna dicampur antara pirus terang dan biru dalam berdasarkan sudut pandang (efek Fresnel). Kilau matahari (`glint`) hanya di kejauhan. Dari bawah air (`gl_FrontFacing` salah) permukaan terlihat terang seperti jendela cahaya.
- **Pulau hutan:** `forest-layers.js` menggambar siluet pulau di kanvas 2D lalu dipasang sebagai lapisan datar berjarak berbeda, dengan kabut di antaranya (2.5D).
- **Menyelam:** kamera turun dari y = 2,4 ke bawah permukaan. Saat `camera.position.y < 0`, warna latar dan kabut berganti ke biru bawah laut, gelembung dan sinar cahaya (`god-rays.js`) dinyalakan.

## scenes/god-rays.js
Sinar cahaya bawah air: beberapa bidang tipis bertekstur gradasi putih→transparan, dicampur dengan `AdditiveBlending` (warnanya ditambahkan, jadi terlihat bercahaya). Opasitasnya naik-turun pelan.

## Catatan performa (diukur 8 Nov di PC Howard, 1440×900)
139–144 FPS di semua adegan. **Belum diuji di laptop sekolah**; kalau berat, `quality.js` menurunkan resolusi lalu Mode Tenang.
Ukuran JavaScript setelah build: 717 KB (198 KB setelah dikompres), sebagian besar adalah library three.js.

---

# REDESIGN ADEGAN 1 BERANDA (8 Nov, permintaan Howard)

Tujuan: adegan pertama terlihat seperti laguna Raja Ampat sungguhan di pagi hari, bukan gambar vektor.
Bukit vektor buatan kode (`forest-layers.js`) dan air buatan sendiri di atas permukaan **dihapus** dan diganti aset nyata.

## src/pages/landing/scenes/sky.js
**Tugas file ini:** Memuat langit HDRI dan mencari posisi matahari di dalamnya.
**Dipakai oleh:** `surface.js`
**Cara kerja (langkah demi langkah):**
1. `HDRLoader` memuat file `.hdr` (foto langit 360° dengan cahaya yang sangat terang tersimpan apa adanya).
2. `findSun()` memeriksa setiap piksel di setengah atas gambar dan mencari yang paling terang. Itu matahari.
3. Posisi piksel (u, v) diubah menjadi arah 3D dengan rumus bola: sudut kiri-kanan `phi` dan sudut naik `elevation`.
4. `PMREMGenerator` membuat versi kabur dari langit untuk pencahayaan (environment), sehingga benda memantulkan langit.
5. `scene.background` = langit, `scene.environment` = cahaya dari langit.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Apa itu HDRI? J: Foto panorama 360° yang menyimpan kecerahan asli. Matahari benar-benar jauh lebih terang dari awan, jadi pantulan di air terlihat nyata.
- T: Kenapa matahari dicari otomatis? J: Supaya kilau di air (`sunDirection`) selalu cocok dengan posisi matahari di langit, walau file HDRI diganti.

## src/pages/landing/scenes/surface.js (bagian di atas air)
**Yang berubah:**
- **Air:** memakai `Water.js` bawaan three.js. Air ini menggambar ulang pemandangan dari bawah (seperti cermin) ke tekstur kecil
  (`REFLECTION_SIZE`: 512/384/256 px sesuai tingkat kualitas), lalu menggoyangkan pantulan itu dengan `waternormals.jpg` yang bergerak.
  Hasilnya: pantulan langit dan pulau, warna turquoise di dekat kamera, kilau matahari.
- **Kamera rendah:** tinggi 1,3 unit. `basePitch` menunduk sedikit supaya cakrawala berada di ±45% tinggi layar:
  `-Math.atan(0.05 * 2 * tan(FOV/2))` (5% di atas tengah layar).
- **Arah kamera:** `yaw` dihitung dari posisi matahari lalu digeser `SUN_SIDE_ANGLE` (1,35 radian ≈ 77°) supaya matahari ada di samping,
  bukan di depan. Kalau menghadap matahari, langit jadi putih menyilaukan dan judul tidak terbaca.
- **Bawah air:** tetap memakai shader air lama (`water.vert/frag.glsl`), hanya terlihat dari bawah (`BackSide`).
- **Partikel halus** di atas air dan **sinar matahari** lembut (`createSunShafts`, opasitas 5%).

## src/pages/landing/scenes/island-layers.js + shaders/island.frag.glsl
**Tugas file ini:** Tiga lapis pulau dari foto Unsplash (Simon Spring), dipasang pada jarak berbeda: 92, 125, dan 180 unit.
**Cara kerja (langkah demi langkah):**
1. Setiap lapis memakai **potongan** foto (`crop`: kiri, atas, kanan, bawah dalam 0–1), hanya bagian pulau. Air di foto dibuang karena kita punya air 3D sendiri.
2. Shader menghapus langit dari foto (`skyAmount`): piksel yang **biru** (biru jauh lebih besar dari merah), **awan** (terang dan tidak berwarna),
   atau **putih kebiruan** dibuat transparan. Pulau hijau dan batu karst abu-abu gelap tetap terlihat.
3. **Aerial perspective:** lapis yang jauh dicampur dengan warna kabut biru (`uHaze` 0,6 / 0,3 / 0,1). Di dunia nyata, gunung jauh juga terlihat lebih biru dan pudar.
4. Tepi kiri-kanan setiap lapis memudar halus (`smoothstep`) supaya tidak terlihat potongan lurus.
5. **Parallax:** `update(pointer, scroll)` menggeser lapis dekat lebih banyak daripada lapis jauh (`depth` 1 / 0,45 / 0,15) saat kursor bergerak dan saat digulir.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa langit tidak dihapus di Photoshop? J: Dengan shader, foto asli tidak diubah dan aturan hapusnya bisa disetel angka. Tidak perlu program tambahan.
- T: Apa itu parallax? J: Benda dekat terlihat bergerak lebih cepat daripada benda jauh saat kita bergeser. Ini memberi rasa kedalaman.

## src/pages/landing/hero.css
**Tugas file ini:** Tata letak adegan 1.
- Judul `clamp(96px, 16vw, 220px)`, jarak huruf 0,25em, **rata kiri** mulai kolom ke-2 dari grid 12 kolom (aturan §4.5: tidak semua rata tengah).
- Tidak ada bayangan teks (aturan §4.5). Efek riak tetap dari `title-ripple.js`.
- **Indikator gulir:** garis tipis 1 px dengan titik terang yang turun berulang (`@keyframes scroll-cue`). Di Mode Tenang animasinya berhenti.
  Teks "Gulir untuk menyelam" tetap ada sebagai `aria-label` untuk pembaca layar.
- **Lewati intro** kecil di kanan bawah.
- **Vignette** (gelap tipis di pinggir) dan **film grain** (bintik halus, opasitas 6%) dibuat dengan CSS, bukan WebGL, jadi tidak membebani kartu grafis.
- **Nav transparan** selama di atas hero: kelas `nav-over-hero` di `<body>`.

## src/pages/landing/main.js — `updateNavOverHero()`
Kalau posisi gulir masih kurang dari 65% tinggi hero, `<body>` diberi kelas `nav-over-hero` (nav transparan, menu disembunyikan ke tombol "Menu").
Setelah lewat, kelas dilepas dan nav kembali berlatar gelap. Dipanggil saat gulir dan saat ukuran layar berubah.

## Perbaikan kecil
- `stage.js`: `THREE.Clock` sudah usang di three.js versi ini, diganti `THREE.Timer` (juga otomatis berhenti saat tab disembunyikan).
- `title-ripple.js`: bayangan teks dihapus; tekstur dibuang (`dispose`) sebelum digambar ulang supaya tidak ada peringatan WebGL saat ukuran layar berubah.

---

# POLISH PASS (8 Nov)
- `src/styles/tokens.css` — semua angka spasi (`--s-1`…`--s-16` = 8…128 px), ukuran huruf (`--fs-display/h1/h2/body/caption`), dan gerak (`--dur-*`, `--ease-*`) disimpan di satu tempat.
- `src/core/motion.js` — membaca token gerak dari CSS lalu membuat easing GSAP yang sama (`CustomEase`), jadi animasi CSS dan GSAP terasa sama.
- `src/core/preloader.js` — layar pembuka sekali per sesi: angka 0→100% mengikuti aset yang benar-benar dimuat (sinyal `sel:assets-progress` / `sel:assets-ready` dari `stage.js`), lalu huruf SEL naik dari balik mask dan layar tersapu ke atas.
- `src/core/text-reveal.js` — judul dan paragraf muncul per baris dari balik mask. Pembaca layar membaca salinan utuh (`visually-hidden`), potongan kata disembunyikan (`aria-hidden`).
- `src/core/cursor.js` — lingkaran kecil yang membesar dengan tulisan "Lihat" di atas tombol/tautan. Mati di layar sentuh dan reduced-motion.
- `src/core/magnetic.js` — tombol sedikit "tertarik" ke kursor dan mengecil saat ditekan.
- `src/core/ambient-sound.js` — suara air dibuat langsung oleh browser (noise + filter low-pass yang naik-turun), tanpa file audio. Default mati.
- `src/core/debug.js` — panel lil-gui hanya saat `npm run dev` dan alamat berakhiran `?debug`. Tidak ikut ke website online.
- `src/pages/landing/conductor.js` — penghalusan memakai waktu asli (`rawDt`) supaya di laptop lambat adegan tidak tertinggal dari teks.

---

# LAB SEL (sel.html) — Fase 3

Gambaran besar: halaman ini punya **dua layar** di HTML: layar sel (`#layar-sel`) dan layar detail (`#layar-detail`).
Isi teks selalu ada di HTML, jadi halaman bisa dipakai penuh tanpa 3D (Mode Tenang). Kalau 3D aktif, `lab-viewer.js` menggambar sel di belakangnya.

```
main.js ──► organelle-ui.js   (daftar organel + panel detail dari organel.json)
        └─► lab-viewer.js ──► lab-room.js, cell-models.js, detail-models.js, highlight.js, detail-pins.js, core/info-card.js
```

## src/data/organel.json
**Tugas file ini:** Semua isi Lab Sel dari KONTEN-MATERI §3: daftar organel per sel, nama, keterangan singkat, membran, deskripsi, fungsi, bagian bernomor, dan "Tahukah kamu?".
- `detail: "full"` = punya bagian bernomor (nukleus, mitokondria, kloroplas, badan Golgi, RE). `"simple"` = hanya deskripsi dan fungsi.
- `re-kasar` dan `re-halus` menunjuk ke `re` (`detailOf`), jadi keduanya membuka layar detail Retikulum Endoplasma dengan bagian yang sesuai terpilih.
- Deskripsi bagian yang tidak ada di KONTEN (misalnya sisi cis/trans Golgi) **sengaja dikosongkan** (aturan emas 4).

## src/pages/sel/main.js
**Tugas file ini:** Mengatur halaman: sel mana yang tampil, membuka/menutup layar detail, tombol ‹ ›, tombol panah keyboard, dan alamat `#nama-organel`.
**Cara kerja:**
1. `setCell('hewan' | 'tumbuhan')` mengganti judul, tombol Hewan/Tumbuhan, dan daftar organel.
2. `openOrganelle(id)` — kalau ada 3D, kamera terbang dulu ke organel (`viewer.flyTo`), lalu layar sel disembunyikan dan layar detail ditampilkan. Alamat berubah menjadi `sel.html#mitokondria`.
3. Kalau halaman dibuka dengan `#mitokondria` (misalnya dari tombol "Pelajari lagi" di kuis), detail itu langsung terbuka.
4. 3D dimuat belakangan dengan `import('./lab-viewer.js')`, jadi teks sudah tampil walau 3D belum siap. Di Mode Tenang, 3D tidak dimuat sama sekali.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa ada `history.replaceState`? J: Mengubah alamat tanpa memuat ulang halaman, supaya tautan bisa dibagikan langsung ke organel tertentu.

## src/pages/sel/organelle-ui.js
**Tugas file ini:** Menggambar daftar organel (tombol) dan mengisi panel detail (judul, DESKRIPSI, FUNGSI, chip bagian, breadcrumb).
- `showDetail` — kalau sebuah bagian dipilih, label atas menjadi `BAGIAN 3 DARI 4` dan breadcrumb `Sel Hewan › Mitokondria › Krista`.
- `neighbours` — mencari organel sebelum dan sesudah untuk tombol `‹ Nukleus` dan `RE kasar ›`.

## src/pages/sel/cell-models.js
**Tugas file ini:** Membuat sel hewan dan sel tumbuhan dari bentuk dasar three.js.
- Setiap bagian diberi label `userData.organelle` (misalnya `'mitokondria'`). Label inilah yang dibaca saat kursor menyentuh organel.
- **Potongan (cutaway):** membran, sitoplasma, dinding sel, dan selubung nukleus memakai `clippingPlanes` — bidang potong yang membuang setengah bagian depan, jadi isi sel terlihat seperti gambar buku.
- Ribosom memakai `InstancedMesh` (satu bentuk, digambar 140 kali sekaligus).
- `organelleMeshes(cell)` membuat peta `id → daftar mesh` supaya satu organel bisa disorot semua bagiannya.

## src/pages/sel/lab-room.js
Ruang lab: latar gelap, grid tipis di lantai, pedestal kaca dengan cincin bercahaya, lampu sorot (`SpotLight`) dan kerucut cahaya, debu melayang.
`setLight(0…1)` dipakai untuk efek "lampu menyala" saat halaman dibuka.

## src/pages/sel/lab-viewer.js
**Tugas file ini:** Mengendalikan semua 3D di Lab Sel.
**Bagian penting:**
- **Memilih organel (raycasting):** garis lurus "ditembakkan" dari kamera melewati posisi kursor (`raycaster.setFromCamera`). Benda pertama yang kena adalah yang ditunjuk. Selubung (membran, sitoplasma, dinding) diberi prioritas paling rendah, supaya organel di dalamnya tetap bisa dipilih.
- **Sorot:** organel yang ditunjuk bercahaya, yang lain diredupkan ke 55% (`highlight.js`). Kartu info dengan pin dan garis muncul di dekatnya (`core/info-card.js`).
- **Miring mengikuti kursor:** sel berputar maksimal ±25° kiri-kanan dan ±15° atas-bawah, mengejar posisi kursor dengan halus.
- **Geser sel:** tombol ‹ ›, panah keyboard, atau geser jari (lebih dari 60 px). Sel lama meluncur keluar, sel baru meluncur masuk (GSAP).
- **Terbang ke organel:** kamera bergerak ±1 detik ke depan organel, lalu layar detail tampil.
- **Posisi tengah:** `setViewOffset` menggeser pusat gambar 3D ke tengah kolom kiri (bukan tengah layar), jadi sel tidak tertutup daftar organel.
- **Layar sempit:** kamera mundur otomatis (`NARROW_ASPECT`) supaya sel muat di ponsel.

## src/pages/sel/detail-models.js
Model besar untuk layar detail. Lima organel lengkap dibuat khusus dengan bagian-bagiannya: nukleus (selubung, pori, nukleoplasma, nukleolus, kromatin), mitokondria (membran luar, membran dalam, krista, matriks), kloroplas (membran, tilakoid, grana, stroma), badan Golgi (sisterna, sisi cis, sisi trans, vesikel), RE (kasar dengan ribosom, halus, lumen).
Setiap bagian punya **titik jangkar** (`anchor`) tempat pin bernomor ditempel. Organel sederhana memakai salinan bentuk dari sel.

## src/pages/sel/detail-pins.js
Pin bernomor (tombol HTML) yang mengikuti titik jangkar 3D setiap frame: titik 3D diubah ke koordinat layar dengan `project(camera)`. Klik pin → panel kanan menampilkan bagian itu.
**T: Kenapa pin pakai tombol HTML, bukan digambar di 3D?** J: Supaya bisa diklik dengan keyboard, dibaca pembaca layar, dan tetap tajam.

---

# GERBANG SEL (gerbang-sel.html) — Fase 4

## src/data/membran.json
Semua teks dari KONTEN-MATERI §4: pengantar, 5 bagian membran (fosfolipid, protein integral, protein perifer, glikoprotein, glikolipid), 5 mode, 6 langkah pompa, tabel "Zat apa lewat mana?", jenis protein pembawa, dan transpor aktif lain.

## src/pages/gerbang/main.js
Mengatur tombol mode (chip), panel penjelasan, tombol Jeda/Putar, Langkah berikutnya, Ulangi, dan slider kecepatan.
Logika pompa ada di `pump-state.js`, bukan di 3D, jadi di Mode Tenang tombol "Langkah berikutnya" tetap menjalankan siklus dan penghitung.

## src/pages/gerbang/pump-state.js
**Tugas file ini:** "Otak" pompa Na⁺/K⁺ tanpa gambar.
- `state.step` (0–5) = langkah yang sedang berjalan, `state.progress` (0–1) = sudah berapa persen langkah itu.
- `finishStep()` menambah penghitung tepat di langkah yang benar: langkah 2 → ATP +1, langkah 3 → Na⁺ keluar +3, langkah 6 → K⁺ masuk +2 dan siklus +1.
- Jadi satu siklus selalu **3 Na⁺ keluar, 2 K⁺ masuk, 1 ATP** (sesuai KONTEN §4.3).
- `bars()` membuat bar Na⁺ di luar dan K⁺ di dalam naik setiap siklus (melawan gradien).
**T: Kenapa logikanya dipisah dari 3D?** J: Supaya angka selalu benar walau 3D mati, dan kode 3D hanya "mengikuti" langkah yang sedang berjalan.

## src/pages/gerbang/membrane-model.js
Membran 3D: dua lapis fosfolipid (kepala bola biru, dua ekor tabung krem) dengan `InstancedMesh`, ditambah protein integral, saluran (channel), protein pembawa (carrier), pompa, protein perifer, rantai karbohidrat glikoprotein dan glikolipid.
Fosfolipid tidak digambar di tempat protein berdiri (`blockedByProtein`). Setiap bagian diberi label `userData.part` untuk kartu info.

## src/pages/gerbang/modes/flow.js
Alat bantu untuk molekul yang bergerak: setiap molekul punya `phase` 0→1 yang maju setiap frame. Fungsi `path(phase)` menentukan posisinya.
Satu `InstancedMesh` menggambar semua molekul sejenis sekaligus.

## src/pages/gerbang/modes/passive.js
- **Difusi:** O₂ (merah) dan CO₂ (abu-abu) turun menembus lapisan fosfolipid. Label LUAR/DALAM SEL menampilkan jumlah molekul di tiap sisi.
- **Difusi terfasilitasi:** glukosa (heksagon kuning) lewat protein pembawa yang berubah bentuk (mengembang-mengempis), ion lewat saluran protein.
- **Osmosis:** molekul air (biru) bergerak dari sisi hipotonik ke sisi hipertonik (zat terlarut krem lebih banyak di bawah).
- Saat mendekati membran, molekul "ditarik" ke jalur protein dengan `smoothstep`, jadi gerakannya mulus.

## src/pages/gerbang/modes/pump.js
Pompa Na⁺/K⁺ 3D: Na⁺ bola oranye, K⁺ kubus merah, ATP bintang kuning (dua tetrahedron digabung). Posisi tiap ion dihitung dari `state.step` dan `state.progress` milik `pump-state.js`:
langkah 1 Na⁺ naik ke pompa · langkah 2 ATP datang, fosfat menempel, pompa berubah bentuk · langkah 3 Na⁺ keluar · langkah 4 K⁺ masuk ke pompa · langkah 5 fosfat lepas · langkah 6 K⁺ masuk sel.

## src/pages/gerbang/membrane-viewer.js
Renderer, cahaya lab, kamera, kartu info saat kursor menunjuk bagian membran, pergantian mode, Jeda/Kecepatan.
Mode Struktur memisahkan dua lapisan sedikit (exploded view). Kanvas berhenti menggambar saat bagian 3D digulir keluar layar (`IntersectionObserver`).

---

# LAB OSMOSIS (lab-osmosis.html) — Fase 5

## src/data/osmosis.json
Semua teks dari KONTEN-MATERI §5: nama sel, tiga larutan, enam keadaan (nama, arah air, mengapa, contoh nyata), kotak "Ingat!", dan 3 soal tebakan.
`water` (`in`/`out`/`both`) menentukan arah panah biru di mikroskop.

## src/pages/osmosis/microscope.js
**Tugas file ini:** menggambar pandangan mikroskop dengan Canvas 2D (bukan WebGL, jadi ringan dan tetap jalan di Mode Tenang).
- Semua gambar memakai "dunia" 600 × 600, lalu `setTransform` memperbesar sesuai ukuran canvas dan `devicePixelRatio` (tajam di layar retina).
- `seeded()` membuat angka acak yang selalu sama, jadi susunan sel tidak berubah setiap halaman dibuka.
- `cellMetrics(sel, larutan, p)` = "otak" perubahan sel. `p` adalah progres 0→1.
  Sel darah merah: hipotonik → volume naik 30% lalu `burst` (pecah), hipertonik → volume turun dan `crenation` (gerigi) naik.
  Sel bawang: `fill` = seberapa penuh protoplas mengisi dinding sel, `turgor` = tekanan turgor.
- Gerigi krenasi dibuat dengan jari-jari yang naik-turun mengikuti `sin(11·sudut)`.
- Plasmolisis: protoplas (ungu, warna antosianin bawang merah) mengecil dan sudutnya makin bulat, warnanya makin pekat.
- Urutan animasi setelah klik: tetes jatuh (0,55 detik) → riak → sel berubah selama 3,2 detik (`easeInOut`).
- `prefers-reduced-motion`: animasi dilewati, langsung keadaan akhir.
**T: Kenapa tidak memakai video seperti rencana awal?** J: CLAUDE.md §6.4 mengizinkan animasi langsung sebagai cadangan. Hasilnya lebih ringan (tanpa file video) dan bisa diatur dari kode.

## src/pages/osmosis/main.js
Membuat tombol sel dan larutan dari JSON, menghubungkan tombol ke mikroskop, memperbarui meter setiap frame,
dan menampilkan Hasil Pengamatan saat animasi sudah 85% selesai. Gambar soal "Tebak" memakai `renderStill()` (keadaan akhir tanpa animasi).

---

# KUIS (kuis.html) — Fase 6

## src/data/soal.json
68 soal pilihan ganda (4 opsi) yang dibuat hanya dari KONTEN-MATERI §2–§5. Setiap soal punya `topik`, `konsep`, `penjelasan`, `halaman` (tautan "Pelajari lagi"), dan `status: "perlu-cek"` sampai disetujui.

## src/pages/kuis/quiz-core.js
Alat bersama: nama topik, pembagian ujian `EXAM_SPLIT` (4/8/7/6), batas predikat `GRADE_LIMITS` (A ≥ 85, B ≥ 70, C ≥ 55, D), acak Fisher–Yates.
`prepare()` mengacak urutan opsi lalu menghitung ulang posisi jawaban benar (`order.indexOf(jawaban)`).
**T: Kenapa Fisher–Yates, bukan `sort(() => Math.random() - 0.5)`?** J: Cara `sort` tidak adil (urutan tertentu lebih sering muncul). Fisher–Yates memberi peluang sama untuk setiap urutan.

## src/pages/kuis/practice.js
Mode Latihan: pilih topik dan jumlah → jawab → tombol langsung hijau/merah + penjelasan + "Pelajari lagi". Soal yang salah disimpan, jadi "Ulangi soal yang salah" hanya memutar soal itu.

## src/pages/kuis/exam.js
Mode Ujian:
- Timer memakai jam asli (`Date.now()` dibandingkan `endsAt`), bukan menghitung mundur dengan `setInterval`, supaya tetap tepat walau tab sempat tidak aktif.
- Kuning saat ≤ 10:00, merah saat ≤ 5:00, kumpul otomatis di 0:00.
- Navigator 1–25: biru = dijawab, kuning = ragu-ragu, abu = kosong. Tidak ada umpan balik sampai dikumpulkan.
- `<dialog>` konfirmasi menyebut jumlah soal kosong dan ragu-ragu.
- Riwayat 5 ujian terakhir disimpan di `localStorage` (`sel:kuis-riwayat`) dengan `try/catch` (jika penyimpanan diblokir, kuis tetap jalan).
- `beforeunload` memperingatkan jika halaman ditutup saat ujian berjalan.

## src/pages/kuis/report.js
Laporan: skor, nilai 0–100, predikat, waktu, benar/salah/kosong, bar per topik (HTML/CSS biasa), Kelebihan (≥ 80%),
Perlu dipelajari lagi (< 60%, dengan konsep yang terlewat dan tautan halaman), pembahasan lengkap.
"Unduh Report Card" menggambar kartu 1080 × 1350 di `<canvas>` lalu `toBlob()` → file PNG. Tidak perlu library tambahan.

---

# RANGKUMAN (rangkuman.html)

## src/data/rangkuman.json
5 kartu ringkasan (KONTEN §7), urutan kelompok kredit, anggota, dan identitas (KONTEN §8).

## src/pages/rangkuman/main.js
Membuat kartu, tabel, kredit, dan anggota dari JSON. Kredit diambil langsung dari `credits.json`, jadi setiap aset baru otomatis muncul.
Baris identitas yang kosong (nama guru) tidak ditampilkan.
Tata letak kartu asimetris di grid 12 kolom: 7+5, 12, 5+7.

---

# DETAIL 3D — Gerbang Sel dan Lab Sel (pembaruan)

## src/pages/gerbang/membrane-model.js (dibuat ulang)
- `tailGeometry()`: dua ekor asam lemak + "leher" gliserol. Ekor kedua dibuat dari dua potongan dengan sudut 0,42 rad, meniru tekukan ikatan rangkap pada asam lemak tak jenuh.
- `lipidLayer()`: setiap fosfolipid diberi geseran, tinggi, dan putaran acak kecil (`seeded()` supaya selalu sama), warna kepala lewat `setColorAt` (InstancedMesh boleh punya warna per salinan). Hasilnya terlihat "cair" sesuai model mozaik fluida.
- `lumpy()`: menggeser setiap titik permukaan protein memakai gabungan gelombang `sin`, lalu `computeVertexNormals()` agar cahaya mengikuti benjolan. Protein jadi terlihat globular, bukan kapsul licin.
- Protein disusun dari beberapa `subunit()` (kapsul tegak) dan `blob()` (bola gepeng) yang digabung dengan `mergeGeometries` menjadi **satu mesh**. Karena tetap satu mesh dengan satu material, kode animasi lama (`pump.scale`, `pump.material`, `carrier.scale`) tetap bekerja.
  Saluran = 5 subunit melingkar dengan lubang di tengah; pembawa = 2 lobus dengan celah; pompa = badan di membran + domain bawah tempat ATP menempel.
- `PROTEIN_SCALE` membuat protein menonjol di atas dan bawah lapisan kepala, seperti gambar di buku.
- `carbChain()`: oligosakarida bercabang, manik gula dihubungkan batang tipis yang diputar dengan `quaternion.setFromUnitVectors`.

## src/pages/gerbang/modes/pump.js
Selama mode Pompa, material pompa dibuat tembus pandang (`opacity 0.55`, `depthWrite false`) supaya ion yang menempel di dalam pompa tetap terlihat; dikembalikan saat ganti mode.

## src/pages/sel/cell-models.js (organel lebih detail)
- **Nukleus:** membran luar + membran dalam (karioteka dua lapis), nukleoplasma tembus pandang, 46 pori nukleus (`InstancedMesh` torus yang dihadapkan keluar dengan `matrix.lookAt`), kromatin = `TubeGeometry` mengikuti jalur acak (random walk) di dalam nukleus, nukleolus.
- **Mitokondria:** membran luar tembus pandang, matriks, dan 6 krista (lipatan) di dalamnya. Geometri dibuat sekali (`MITO`) lalu dipakai ulang semua mitokondria.
- **RE kasar:** `studRibosomes()` mengambil titik acak dari permukaan tabung RE (`attributes.position` + `normal`) dan menempelkan ribosom di sana.
- **Ribosom:** dua subunit (besar dan kecil) digabung jadi satu geometri.
- **Badan Golgi:** ditambah vesikel di ujung sisterna.
- **Lisosom:** kantong tembus pandang berisi butiran enzim. **Peroksisom:** kantong dengan inti kristal (oktahedron).
- **Sentriol:** `centrioleGeometry()` menyusun 9 kelompok × 3 mikrotubulus melingkar (9 triplet, KONTEN §3.2); sepasang, saling tegak lurus.
- **Kloroplas:** membran tembus pandang dengan 3 grana (tumpukan cakram tilakoid) di dalamnya.

---

# RASA RUANG 3D DI BERANDA (pembaruan)

## src/pages/landing/scenes/depth.js
**Tugas file ini:** memberi petunjuk kedalaman. Mata menilai jarak dari tiga hal: **paralaks** (benda dekat bergeser lebih cepat), **oklusi** (benda dekat menutupi benda jauh), dan **perspektif udara** (benda jauh memudar oleh kabut).
- `createDepthDust()`: tiga lapis partikel. Lapis jauh kecil dan banyak, lapis dekat besar, buram, dan jarang (seperti bokeh kamera).
  Di shader, `mod(p - uCamera + uBox/2, uBox) - uBox/2` membuat kotak partikel "membungkus" kamera: partikel yang tertinggal di belakang muncul lagi di depan, jadi berapa pun jauhnya kamera bergerak, selalu ada partikel di sekitarnya. Semua dihitung di GPU, tanpa beban JavaScript per partikel.
  Ukuran titik `uSize * 300 / jarak` → makin dekat makin besar. Partikel memudar di tepi kotak (tidak "muncul tiba-tiba") dan terlalu dekat dengan kamera.

---

# BERSIH-BERSIH TAMPILAN (anti-vibecode §4.5)

## src/core/icons.js
`icon(nama)` mengembalikan SVG garis 24×24 (play, pause, restart). Warna mengikuti teks (`stroke: currentColor`), ukuran 16 px (`.icon` di `components.css`), dan `aria-hidden="true"` karena selalu ada teks di sebelahnya. `setIconLabel(tombol, ikon, teks)` mengisi tombol dengan ikon + teks.
**T: Kenapa tidak memakai karakter ⏸ ▶ saja?** J: Di Windows karakter itu tampil sebagai emoji berwarna yang tidak cocok dengan gaya situs, dan §4.5 melarang ikon emoji.

## Perubahan gaya lain
- `.nav` kini berlatar solid tanpa `backdrop-filter` (kaca buram termasuk gaya yang dilarang §4.5).
- `.quiz-label`, `.result__grid dt`, `.organel-groups__name`, `.review__status`: tidak lagi huruf besar berjarak lebar, supaya label eyebrow tidak muncul di setiap panel.

---

# AUDIT WEB INTERFACE GUIDELINES (pembaruan)
- **Alamat mencerminkan tampilan:** `history.replaceState` mengganti `?mode=ujian` (Kuis) dan `?sel=tumbuhan` (Lab Osmosis) tanpa memuat ulang halaman. Saat halaman dibuka, `URLSearchParams` membaca nilai itu dan langsung menampilkan mode/sel yang sesuai.
- **Tipografi:** spasi tak terputus (U+00A0) di antara angka dan satuan, dan tanda kutip melengkung di file JSON materi.
- **`logo.translate = false`** menghasilkan atribut `translate="no"`: fitur terjemahan browser tidak akan mengubah nama "SEL".

---

# INTRO HALAMAN DAN CADANGAN (pembaruan)

## src/core/page-intro.js
- `introHeader()`: anak-anak kepala halaman (eyebrow, judul, tagline, tombol mode) dianimasikan `gsap.from({ y: 24, opacity: 0 })` dengan `stagger` 0,08 detik. `clearProps` menghapus gaya sisa setelah selesai.
- `revealBlocks()`: kartu dan panel (`BLOCKS`) disembunyikan lalu dimunculkan dengan `ScrollTrigger.batch` saat bagian atasnya mencapai 92% tinggi layar, sekali saja (`once: true`). Elemen yang sedang `hidden` dilewati supaya tidak terjebak tak terlihat.
- Pengaman: setelah 2,5 detik, blok di layar yang masih transparan dipaksa tampil.
- Tidak berjalan di Beranda (sudah punya koreografi sendiri), saat gerak dikurangi, atau di Mode Tenang.

## src/core/renderer.js — `webglcontextlost`
Jika GPU kehilangan konteks (driver error, memori penuh), `event.preventDefault()` lalu Mode Tenang dinyalakan dan muncul pesan. Halaman 3D yang mendengarkan `calmmodechange` akan membuang renderer-nya, dan semua isi tetap bisa dipakai.

## src/core/smooth-scroll.js
Lenis tidak dijalankan jika `prefers-reduced-motion: reduce`.

## Kepatuhan token (§4.5) — src/styles/polish.css, src/pages/kuis/report.js
**Tugas perubahan ini:** memastikan semua ukuran huruf dan jarak memakai token, dan setiap tombol punya semua state.
**Bagian penting:**
- `:active { transform: scale(0.97) }` — saat tombol ditekan, tombol mengecil sedikit sebagai tanda "sudah ditekan". Dulu hanya di layar sentuh, sekarang di semua perangkat.
- `.segmented__item:hover:not([aria-checked='true'])` — teks pilihan yang belum aktif menjadi krem saat disorot. Pilihan yang sudah aktif tidak berubah.
- Di `report.js`, tombol unduh diberi `aria-busy="true"` dan teks "Menyiapkan gambar…" selama kanvas diubah menjadi PNG. Jika `toBlob` mengembalikan `null` (gagal), tombol menampilkan "Gagal membuat gambar, coba lagi".
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa semua angka jarak harus token? J: Supaya jarak di seluruh situs mengikuti satu irama 8px dan bisa diubah dari satu file (`tokens.css`).
- T: Apa itu `aria-busy`? J: Atribut yang memberi tahu pembaca layar bahwa tombol sedang memproses.

## src/pages/sel/glb-cell.js
**Tugas file ini:** memuat dua model 3D unduhan, sel hewan (montanna, CC BY 4.0) dan sel tumbuhan (okchs, CC BY 4.0), lalu menyiapkannya supaya setiap organel bisa disorot dan diklik.
**Dipakai oleh:** sel.html → main.js → lab-viewer.js
**Cara kerja (langkah demi langkah):**
1. `loadCellModel('hewan')` atau `loadCellModel('tumbuhan')` membaca pengaturan dari objek `CELLS` (alamat file, cara memetakan organel, ukuran, warna).
2. `GLTFLoader` membaca file `.glb`. File dikompresi dengan Draco, jadi `DRACOLoader` membukanya memakai dekoder di `/draco/` (lokal, tanpa internet).
3. `prepare()` memberi setiap mesh id organel di `mesh.userData.organelle`. Sel hewan memakai **nama material** (tabel `ANIMAL_BY_MATERIAL`), sel tumbuhan memakai **nama node** (tabel `PLANT_BY_NODE`), karena model tumbuhan memberi nama yang jelas seperti `cell_wall` dan `golgi`.
4. Mesh yang tidak ada di daftar organel (sitoskeleton, lisosom tumbuhan, bintik anotasi) dibuang supaya raycast lebih ringan.
5. Material asli diganti `labMaterial()`: `MeshPhysicalMaterial` dengan clearcoat 0,5 dan roughness 0,4. Membran dan sitoplasma dibuat padat (tidak tembus pandang).
6. Sel hewan: satu mesh kuning berisi sentriol dan lisosom sekaligus. `islandIndices()` memecahnya; bagian panjang menjadi sentriol, bagian bulat menjadi lisosom.
7. Kedua model tidak punya peroksisom, jadi `addPeroxisomes()` menaruh peroksisom buatan sendiri di titik sitoplasma yang kosong.
8. `fit()` memusatkan model, mengecilkannya ke ukuran panggung, dan memiringkannya ke arah kamera.
**Bagian penting:**
- `aliases`: di model tumbuhan, RE kasar dan RE halus adalah satu mesh. Mesh itu diberi `userData.aliases = ['re-halus']`, sehingga saat "RE halus" dipilih dari daftar, mesh yang sama menyala.
- `islandIndices()`: cara "union-find". Dua titik di satu segitiga dianggap satu kelompok; kelompok yang terpisah = benda terpisah.
- `compact()`: geometri baru yang hanya berisi titik milik bagian itu, supaya kotak batasnya pas (penting untuk layar detail).
- Di `lab-viewer.js`, `swapInModel()` mengganti model buatan sendiri dengan model unduhan setelah selesai dimuat. Jika gagal, model buatan sendiri tetap dipakai dan console menampilkan peringatan.
- Di `highlight.js`, organel aktif diproses **terakhir**, supaya mesh yang dipakai dua organel tetap menyala, tidak tertimpa redup.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa model 70 MB bisa jadi 1,8 MB? J: Draco memadatkan data titik, dan 2.002 ribosom yang bentuknya sama disimpan sekali saja lalu digambar berulang (*instancing*).
- T: Bagaimana komputer tahu organel mana yang disorot? J: Raycaster menembakkan garis dari kamera melewati posisi kursor. Mesh pertama yang kena dibaca `userData.organelle`-nya.
- T: Boleh memakai model orang lain? J: Boleh, lisensinya CC BY 4.0: wajib mencantumkan nama pembuat dan menyebut bahwa model dimodifikasi. Itu ada di halaman Rangkuman.

## tools/inspect-materials.mjs, tools/model-preview.html
**Tugas:** alat bantu pengembang, tidak ikut ke situs. `inspect-materials.mjs` mencetak warna, jumlah segitiga, dan posisi setiap material. `model-preview.html` menampilkan model dengan tombol per material dan mencatat koordinat titik yang diklik (mode `?pick`).

---

# WALKTHROUGH SCROLL-SCRUB BERANDA (10 Nov, permintaan Howard)

Adegan 3D setelah hero (ikan, karang, lamun, sel, lumpur buatan kode) diganti video nyata yang "digulir" seperti halaman produk AirPods. Hero pulau + judul SEL beriak tetap memakai Three.js.

## Dari video ke gambar
1. `tools/make-walkthrough.mjs` merakit video sementara `assets-src/walkthrough.mp4` (34,5 detik) dari 5 klip Pexels, 1 foto mikroskop, dan 2 render sel Lab Sel (`tools/render-cell.html`). ffmpeg menyamakan ukuran (1280×720), menambah transisi `xfade` 1 detik, zoom pelan pada foto, dan grade warna teal yang sama untuk semua klip. Kalau Howard punya hasil edit DaVinci sendiri, cukup taruh di `assets-src/walkthrough.mp4`.
2. `tools/make-frames.mjs` memotong video menjadi 10 gambar per detik → `public/seq/f_0001.webp` … `f_0345.webp` (WebP kualitas 55, total 17,5 MB), lalu menulis jumlah frame ke `src/data/seq.json`.

## src/pages/landing/scroll-sequence.js
**Tugas file ini:** menghubungkan posisi scroll dengan nomor frame dan panel teks.
**Cara kerja (langkah demi langkah):**
1. Section `#perjalanan` di-**pin** oleh ScrollTrigger: section diam di layar selama pengguna menggulir sejauh 600% tinggi layar (`end: '+=600%'`).
2. Timeline GSAP dengan `scrub: 0.5` mengubah `state.progress` dari 0 ke 1 sepanjang jarak itu. `scrub: 0.5` artinya progres mengejar scroll dengan jeda setengah detik, supaya terasa halus.
3. **progress → frame:** `nomor = 1 + round(progress × (jumlah frame − 1))`. Progres 0 = frame 1, progres 1 = frame 345.
4. Panel teks dari `landing-beats.json` muncul dan hilang di titik progres `from`/`to`. Setiap baris dibuka dengan masker (`clip-path: inset(...)`) sambil naik sedikit (`yPercent`).
5. Mode Tenang / `prefers-reduced-motion`: tidak ada pin dan tidak ada animasi. `buildStatic()` menampilkan 6 gambar diam (detik `still` tiap panel) berurutan bersama teksnya.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Kenapa tidak memutar `<video>` saja? J: Video yang dilompati waktunya (`currentTime`) sering patah-patah dan tidak bisa mundur dengan halus. Gambar satu per satu bisa langsung ditampilkan di posisi mana pun, maju atau mundur.
- T: Apa itu pin? J: Section ditahan di layar seolah menempel, sementara scroll tetap berjalan; scroll itu dipakai untuk memajukan video.

## src/pages/landing/sequence/frames.js
**Tugas file ini:** memuat gambar frame secara bertahap.
- **Urutan muat:** setiap frame ke-8 dulu (1, 9, 17, …), lalu sisanya. Jadi seluruh perjalanan cepat tersedia dalam versi "kasar", lalu celahnya diisi.
- **Frame terdekat:** `imageAt(progress)` mencari frame yang diminta; kalau belum dimuat, dicari ke kiri dan kanan sampai ketemu frame yang sudah ada. Layar tidak pernah kosong.
- **Siap 25%:** preloader halaman menunggu sampai 25% frame dimuat (`READY_SHARE`), sisanya dimuat di latar belakang sambil pengguna membaca hero.
- **HP:** di layar < 768 px hanya setiap frame ke-2 yang dimuat, supaya memori dan kuota lebih hemat.

## src/pages/landing/sequence/plane.js + shaders/sequence.vert.glsl + sequence.frag.glsl
**Tugas file ini:** menggambar frame di WebGL dengan efek halus.
- Satu bidang 2×2 yang menutupi layar (kamera ortografis). Tekstur Three.js-nya **diganti gambarnya** setiap frame berubah: `texture.image = gambar; texture.needsUpdate = true` → gambar diunggah ulang ke GPU.
- `uCoverScale` meniru CSS `object-fit: cover`: kalau layar lebih lebar dari video, bagian atas-bawah video dipotong; kalau lebih sempit, kiri-kanan dipotong. Gambar tidak pernah gepeng.
- **Riak kursor:** `sin(jarak × 42 − waktu × 3,5) × e^(−jarak × 7)` menggeser koordinat tekstur sedikit di sekitar kursor. Kekuatannya (`uRipple`) naik saat kursor bergerak dan meluruh lagi.
- **Vignette:** tepi layar digelapkan sedikit. **Grain:** bintik acak kecil yang berubah tiap frame, seperti film.
**T: Kenapa tekstur memakai `NoColorSpace`?** J: Gambar WebP sudah dalam sRGB dan shader kita tidak mengubah warna, jadi warna dikirim apa adanya ke layar.

## src/pages/landing/sequence/canvas2d.js
Cadangan kalau WebGL tidak bisa dibuat: `drawImage` ke `<canvas>` biasa. Potongan sumber (`sx, sy, width, height`) dihitung manual supaya hasilnya seperti `object-fit: cover`.

## src/pages/landing/sequence/panels.js + src/data/landing-beats.json
`buildBeat()` membuat `<article>` dari data JSON. Setiap blok (`title`, `lead`, `quote`, `scale`, `terms`, `fact`, `note`, `poetic`) punya fungsi pembuatnya sendiri di objek `BUILDERS`. Isi teks diambil dari KONTEN-MATERI §1, termasuk skala satu baris "30 cm › 1 cm › 1 mm › 20 µm".

## src/pages/landing/main.js (pembaruan)
- Preloader menunggu **dua** hal: tekstur hero (`sel:surface-ready`) dan 25% frame. `reportLoading()` menggabungkan keduanya menjadi satu persentase.
- Kalau WebGL gagal dibuat, walkthrough dibuat ulang dengan canvas 2D.
- Saat Mode Tenang dinyalakan/dimatikan, panggung dan walkthrough dibuang lalu dibuat ulang dalam mode yang sesuai.

## Kejujuran materi
- Klip sel hewan dan sel tumbuhan adalah **render model 3D Lab Sel** (montanna dan okchs), bukan video mikroskop. Pexels tidak punya video sel hewan asli yang jelas; video "sel" di sana kebanyakan animasi abstrak.
- Foto mikroskop (Lidija Ostojić) adalah sel daun yang memiliki stomata, **bukan sel lamun**, dan diberi keterangan begitu di panel.
- Rekaman dasar laut menunjukkan pasir, sedangkan teks KONTEN menyebut "lumpur".


## Perbaikan hover layar sentuh — 10 November 2026

`@media (hover: hover)` memeriksa apakah perangkat input utama mampu melakukan hover (menunjuk tanpa menekan). Browser hanya menjalankan aturan di dalamnya jika kemampuan tersebut tersedia. Pada layar sentuh, ketukan tidak lagi meninggalkan warna atau gerakan hover. Pemeriksaan ini berdasarkan kemampuan input, bukan lebar layar.

### src/styles/polish.css
**Tugas perubahan ini:** State hover tombol umum, tombol hantu, tombol pil/bulat, saklar, chip bagian, segmented, pilihan sel, dan chip Gerbang Sel.
**Dipakai oleh:** Semua halaman melalui gaya bersama.
**Cara kerja (langkah demi langkah):**
1. Browser memeriksa media query `@media (hover: hover)`.
2. Jika cocok, selector `:hover` menggunakan deklarasi CSS yang sama seperti sebelumnya.
3. Jika tidak cocok, gaya hover dilewati; aturan fokus, tekan, dan pilihan tetap berlaku.
**Bagian penting:** Nilai warna, ukuran, dan token yang sudah digunakan tidak diubah.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Mengapa hover dibatasi? J: Layar sentuh tidak memiliki gerakan menunjuk seperti mouse. Media query mencegah efek hover tersisa setelah ketukan, sementara klik tetap bekerja.

### src/styles/components.css
**Tugas perubahan ini:** State hover tautan navigasi, navigasi halaman berikut/sebelumnya, dan pilihan segmented.
**Dipakai oleh:** Semua halaman melalui komponen bersama.
**Cara kerja (langkah demi langkah):**
1. Browser memeriksa media query `@media (hover: hover)`.
2. Jika cocok, selector `:hover` menggunakan deklarasi CSS yang sama seperti sebelumnya.
3. Jika tidak cocok, gaya hover dilewati; aturan fokus, tekan, dan pilihan tetap berlaku.
**Bagian penting:** Nilai warna, ukuran, dan token yang sudah digunakan tidak diubah.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Mengapa hover dibatasi? J: Layar sentuh tidak memiliki gerakan menunjuk seperti mouse. Media query mencegah efek hover tersisa setelah ketukan, sementara klik tetap bekerja.

### src/pages/kuis/kuis.css
**Tugas perubahan ini:** State hover chip topik, opsi jawaban yang tidak dinonaktifkan, dan nomor navigasi soal.
**Dipakai oleh:** kuis.html.
**Cara kerja (langkah demi langkah):**
1. Browser memeriksa media query `@media (hover: hover)`.
2. Jika cocok, selector `:hover` menggunakan deklarasi CSS yang sama seperti sebelumnya.
3. Jika tidak cocok, gaya hover dilewati; aturan fokus, tekan, dan pilihan tetap berlaku.
**Bagian penting:** Nilai warna, ukuran, dan token yang sudah digunakan tidak diubah.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Mengapa hover dibatasi? J: Layar sentuh tidak memiliki gerakan menunjuk seperti mouse. Media query mencegah efek hover tersisa setelah ketukan, sementara klik tetap bekerja.

### src/pages/osmosis/osmosis.css
**Tugas perubahan ini:** State hover tombol larutan.
**Dipakai oleh:** lab-osmosis.html.
**Cara kerja (langkah demi langkah):**
1. Browser memeriksa media query `@media (hover: hover)`.
2. Jika cocok, selector `:hover` menggunakan deklarasi CSS yang sama seperti sebelumnya.
3. Jika tidak cocok, gaya hover dilewati; aturan fokus, tekan, dan pilihan tetap berlaku.
**Bagian penting:** Nilai warna, ukuran, dan token yang sudah digunakan tidak diubah.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Mengapa hover dibatasi? J: Layar sentuh tidak memiliki gerakan menunjuk seperti mouse. Media query mencegah efek hover tersisa setelah ketukan, sementara klik tetap bekerja.

### src/pages/sel/detail.css
**Tugas perubahan ini:** State hover pin detail organel.
**Dipakai oleh:** sel.html pada tampilan detail organel.
**Cara kerja (langkah demi langkah):**
1. Browser memeriksa media query `@media (hover: hover)`.
2. Jika cocok, selector `:hover` menggunakan deklarasi CSS yang sama seperti sebelumnya.
3. Jika tidak cocok, gaya hover dilewati; aturan fokus, tekan, dan pilihan tetap berlaku.
**Bagian penting:** Selector `.detail-pin[aria-pressed='true']` dipisahkan dari `:hover` dan tetap di luar media query agar pin terpilih tetap terlihat pada HP.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Mengapa hover dibatasi? J: Layar sentuh tidak memiliki gerakan menunjuk seperti mouse. Media query mencegah efek hover tersisa setelah ketukan, sementara klik tetap bekerja.

### src/pages/sel/lab.css
**Tugas perubahan ini:** State hover tombol daftar organel.
**Dipakai oleh:** sel.html pada tampilan sel.
**Cara kerja (langkah demi langkah):**
1. Browser memeriksa media query `@media (hover: hover)`.
2. Jika cocok, selector `:hover` menggunakan deklarasi CSS yang sama seperti sebelumnya.
3. Jika tidak cocok, gaya hover dilewati; aturan fokus, tekan, dan pilihan tetap berlaku.
**Bagian penting:** Selector `.organelle-button.is-active` dipisahkan dari `:hover` dan tetap di luar media query agar organel terpilih tetap terlihat pada HP.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Mengapa hover dibatasi? J: Layar sentuh tidak memiliki gerakan menunjuk seperti mouse. Media query mencegah efek hover tersisa setelah ketukan, sementara klik tetap bekerja.

### src/pages/landing/hero.css
**Tugas perubahan ini:** State hover tautan Lewati intro.
**Dipakai oleh:** index.html.
**Cara kerja (langkah demi langkah):**
1. Browser memeriksa media query `@media (hover: hover)`.
2. Jika cocok, selector `:hover` menggunakan deklarasi CSS yang sama seperti sebelumnya.
3. Jika tidak cocok, gaya hover dilewati; aturan fokus, tekan, dan pilihan tetap berlaku.
**Bagian penting:** Nilai warna, ukuran, dan token yang sudah digunakan tidak diubah.
**Kemungkinan pertanyaan guru & jawabannya:**
- T: Mengapa hover dibatasi? J: Layar sentuh tidak memiliki gerakan menunjuk seperti mouse. Media query mencegah efek hover tersisa setelah ketukan, sementara klik tetap bekerja.
## Viewport responsif — 10 November 2026

### src/styles/tokens.css, base.css, dan components.css

Ukuran minimum judul turun menjadi `2rem` melalui token `--fs-h1`. Judul boleh membungkus jika teks yang diperbesar tidak muat. Pada layar selebar 360 piksel atau kurang, navigasi memakai jarak yang lebih rapat agar logo, Menu, Suara, dan Mode Tenang muat. Menu terbuka memakai tinggi layar yang sedang terlihat (`100dvh`) dikurangi tinggi bilah navigasi. Isinya bisa digulir saat ruang vertikal terbatas.

### src/pages/landing/main.js dan sequence.css

Angka skala bisa pindah ke baris berikutnya. Setiap angka tetap bersama satuannya. Jika tinggi layar mencapai `30rem` atau kurang, Beranda menampilkan gambar dan teks dalam urutan yang bisa digulir. Saat orientasi berubah, media query diperiksa ulang dan Beranda menyesuaikan cara menampilkan perjalanan.

### src/pages/gerbang/gerbang.css, membrane-viewer.js, dan src/core/renderer.js

Kanvas membran berada di dalam `#gate-stage`. `ResizeObserver` mengukur ulang panggung ketika ukurannya berubah. Renderer menerima ukuran kanvas, lalu kamera menyesuaikan rasio dan zoom. Saat kursor menunjuk atau jari mengetuk, posisi masukan dihitung dari tepi kanvas supaya bagian membran yang diperiksa sesuai dengan posisi di layar. Petunjuk penggunaan pada `src/data/membran.json` menyebut kedua cara tersebut.

### src/core/info-card.js dan src/styles/components.css

Kartu informasi bersama untuk Lab Sel dan Gerbang Sel mengukur ukuran kartu dan ruang layar sebelum menentukan posisinya. Kartu bisa muncul di kiri atau kanan titik pilihan. Posisinya dibatasi agar tetap di dalam layar dan di bawah navigasi.

**Pertanyaan guru. Mengapa kamera mengukur kanvas?** Kanvas Gerbang Sel hanya memakai satu bagian dari halaman. Ukuran kanvas menentukan cara model diproyeksikan dan bagian model yang terkena saat pengguna mengetuk.

## Hero Beranda: pulau penuh, tipografi baru, kemiringan kursor — 10 November 2026

**Pulau dari tepi ke tepi.** Di `scenes/island-layers.js` tiap lapisan sekarang punya `tile` (lebar satu potongan foto) dan `span` (lebar total). Shader `island.frag.glsl` mengulang foto sebanyak `span / tile` kali secara bolak-balik: potongan ganjil dicerminkan, jadi tepi kanan foto bertemu tepi kanan cerminnya dan sambungan tidak terlihat patah. Pudar tepi hanya 3% di ujung paling luar, sehingga garis pulau tidak lagi terpotong di tengah layar.

**Teks.** Judul punya label kecil di atas ("Biologi XI · Bab 1 · Kelompok 4") dan kalimat pembuka dari KONTEN §1 di bawah slogan. Jarak huruf judul diturunkan dari 0,25em ke 0,06em supaya "SEL" terbaca sebagai satu kata.

**Kontras.** Judul dan slogan digambar lewat WebGL (`title-ripple.js`), jadi kontrasnya diatur di sana: kanvas teks diberi bayangan lembut, dan shader `title.frag.glsl` menggambar elips gelap transparan di belakang judul sebelum teks. Label dan kalimat DOM memakai `text-shadow`.

**Perspektif mengikuti kursor.** Shader judul menghitung `depth = 1 - dot(jarak dari pusat, uTilt) / perspektif`, lalu membagi posisi dengan `depth`: sisi yang dekat kursor menjauh dan sisi lain mendekat, seperti model di Lab Sel. Label dan kalimat (`.hero-meta`) dimiringkan dengan sudut yang sama lewat variabel CSS `--tilt-x` dan `--tilt-y`. Kemiringan maksimal 7°, dihaluskan tiap frame, hanya untuk mouse, dan dimatikan di Mode Tenang atau saat gerak dikurangi.
## Kemiringan dan kontras judul Beranda — 10 November 2026

- `src/pages/landing/title-ripple.js` mengubah posisi mouse menjadi target kemiringan hingga 20° per sumbu. Perubahan sudut tetap bertahap. Saat mouse meninggalkan halaman, sudut kembali ke nol. Label dan kalimat pembuka membaca variabel CSS yang sama dari pembungkus teks. Ketika efek dilepas, misalnya saat Mode Tenang dinyalakan, variabel kemiringan dibersihkan.
- `src/styles/tokens.css` menyimpan jarak perspektif 1000 px yang dipakai oleh shader dan `src/pages/landing/hero.css`. Jarak yang lebih pendek membuat perubahan ukuran sisi dekat dan sisi jauh terlihat lebih jelas.
- `src/pages/landing/shaders/title.frag.glsl` memperlebar gradasi gelap yang sudah ada di belakang teks. Opasitas pusat naik dari 42% ke 74% dan warna diambil dari token `--c-lab`. Tepi gradasi tetap memudar ke pemandangan.
## Transisi Beranda dan kecepatan gulir — 10 November 2026

- `src/pages/landing/landing.css` memindahkan lapisan gelap adegan menyelam ke elemen semu `::before`. Masker gradien membuat lapisan memudar pada bagian atas dan bawah, sehingga batas dengan pemandangan air tidak tampak sebagai garis mendadak. Teks tetap berada di atas lapisan.
- `src/core/smooth-scroll.js` mengubah `WHEEL_MULTIPLIER` dari 0,9 menjadi 0,55. Putaran roda mouse menghasilkan jarak gulir yang lebih pendek. `LERP` turun dari 0,1 menjadi 0,075 agar gerak menuju posisi baru lebih perlahan. Mode Tenang dan preferensi gerak dikurangi tetap memakai pengaturan gulir sebelumnya.
## Transisi walkthrough dan gulir — 10 November 2026

- `src/pages/landing/sequence.css` memakai masker gradien pada lapisan gelap walkthrough agar lapisan itu memudar di batas awal dan akhir. Latar ringkasan memakai gradien yang berawal transparan lalu menjadi gelap secara bertahap. Latar bagian penutup dimulai dengan warna dan opasitas yang sama dengan akhir ringkasan. Warna gelap menggunakan token `--c-lab`.
- `src/core/smooth-scroll.js` menurunkan `WHEEL_MULTIPLIER` dari 0,55 ke 0,4 agar satu putaran roda menghasilkan jarak lebih pendek. `LERP` turun dari 0,075 ke 0,05 sehingga pergerakan menuju posisi baru lebih halus.
## Latar gelap Beranda yang menyatu — 10 November 2026

- `index.html` membungkus bagian menyelam, perjalanan, ringkasan, dan penutup dalam `.journey-shade`. `src/pages/landing/landing.css` menempatkan satu lapisan gradien di belakang semua bagian tersebut. Lapisan masuk perlahan di awal dan tetap gelap sampai bagian paling bawah.
- `src/styles/tokens.css` menyimpan tiga tingkat kegelapan gradien. `src/pages/landing/sequence.css` tidak lagi menambahkan lapisan terpisah pada video, ringkasan, dan penutup.
- `src/core/page-setup.js` menerima opsi `footer`. `src/pages/landing/main.js` memilih `footer: false` agar Beranda berakhir dengan tombol Lab Sel yang sudah ada. Halaman lain tetap memakai footer secara bawaan.
## Posisi dan pergantian model Lab Sel — 10 November 2026

- `src/pages/sel/lab.css` membatasi tampilan sel utama setinggi layar pada desktop dengan tinggi minimal 600 piksel. Daftar organel bisa digulir di dalam kotaknya. Pada ponsel dan layar desktop yang lebih pendek, halaman tetap bisa digulir agar semua kontrol terjangkau. Footer disembunyikan saat tampilan sel utama terkunci; navigasi di atas tetap dapat dipakai.
- `src/pages/sel/main.js` mengembalikan posisi halaman ke atas saat pengguna kembali dari detail organel.
- `src/pages/sel/lab-viewer.js` membiarkan model lama tetap di tempat sambil menurunkan `opacity` materialnya selama 1,5 kali durasi lambat. Model baru masuk seperti sebelumnya. `setCellOpacity()` menyimpan opacity, transparansi, dan pengaturan penulisan kedalaman tiap material lalu mengembalikannya setelah model lama memudar. `finishFade()` juga membersihkan animasi ketika pengguna berganti cepat, membuka detail, atau keluar dari tampilan. Jika model selesai dimuat saat transisi, tingkat opacity diterapkan ke model penggantinya. Preferensi gerak dikurangi tetap berpindah langsung.

**Pertanyaan guru. Mengapa material dikembalikan setelah memudar?** Model yang sama dapat dipilih lagi. Nilai aslinya dipulihkan agar model tampil penuh ketika digunakan kembali.
## Fade model sel yang keluar — 10 November 2026

`src/pages/sel/lab-viewer.js` menggerakkan model lama ke samping dengan jarak lebih pendek sambil menurunkan opacity secara merata selama 1,35 detik. Model lama disembunyikan setelah opacity mencapai nol. Animasi masuk model baru tetap memakai jarak dan durasi sebelumnya. Jika model selesai dimuat di tengah transisi, posisi, sisa gerakan keluar, dan opacity diterapkan ke model pengganti.
## Kredit penggunaan AI — 10 November 2026

`src/data/credits.json` mencatat Claude Code dan Codex sebagai dua entri kategori `ai`, beserta nama model yang diberikan Howard. `src/pages/rangkuman/main.js` membaca dan menampilkan entri tersebut otomatis di kelompok Penggunaan AI. Pernyataan di `docs/KONTEN-MATERI.md` diperbarui agar sesuai dengan kredit.
## Penataan kredit AI dan sumber materi — 10 November 2026

`src/data/credits.json` menyimpan nama model pada kolom `model` untuk Claude Code dan Codex. `src/pages/rangkuman/main.js` menampilkan kolom tersebut setelah nama penyedia pada baris informasi kredit. Keterangan kedua alat menyebut penggunaannya sebagai asisten coding. Penulis sumber materi pertama diperbarui sesuai keterangan Howard, begitu juga daftar sumber di `docs/KONTEN-MATERI.md`.
## Identitas anggota — 10 November 2026

`src/data/rangkuman.json` menentukan urutan anggota yang ditampilkan oleh `renderTeam()`. Ketua dipindah ke urutan pertama dan identitas mencantumkan tahun pelajaran 2026/2027 serta mata pelajaran Biologi & INF (Informatika). Sumber identitas di `docs/KONTEN-MATERI.md` diperbarui sesuai keterangan Howard.
