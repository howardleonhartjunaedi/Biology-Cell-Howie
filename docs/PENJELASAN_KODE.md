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
**Tugas file ini:** "Naskah" Beranda. Tiap baris berkata: section HTML mana → adegan 3D apa → bagian mana dari adegan itu.
- `from`/`to` — bagian section (0 = atas, 1 = bawah). Section `sel-tumbuhan` dibagi dua: 0–0,45 lamun, 0,45–1 sel tumbuhan.
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
6. Opasitas dan warna tirai diatur. `syncDom` menyorot teks yang sesuai.
**Bagian penting:**
- `visibilitychange` — kalau tab disembunyikan, loop berhenti (hemat baterai). Saat kembali, jalan lagi.
- `ResizeObserver` — kalau tinggi isi halaman berubah (font selesai dimuat, layar diputar), posisi section diukur ulang.
- `dispose()` — saat Mode Tenang dinyalakan atau halaman ditinggalkan, semua geometri, material, dan tekstur dibuang dari memori.
- `try { createRenderer } catch` — kalau browser tidak mendukung WebGL, panggung tidak dibuat dan halaman tetap tampil sebagai teks.

## src/pages/landing/dom-sync.js
**Tugas file ini:** Menyamakan teks dengan 3D. Saat mitokondria menyala di 3D, kata "Mitokondria" di daftar juga berwarna koral.
- `activePart(progress, jumlah)` — rumus yang **sama** dipakai oleh adegan 3D dan teks, jadi keduanya tidak mungkin berbeda.
- Tangga skala 30 cm → 1 cm → 1 mm → 20 µm ikut menyala satu per satu saat section terumbu digulir.

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

## scenes/reef.js + fish-school.js + coral-garden.js (adegan 3 dan 5)
- **Ikan:** satu `InstancedMesh` — satu bentuk ikan digambar puluhan kali dalam **satu** perintah gambar (hemat). Badan = bola yang dipipihkan, ekor = kerucut.
- Setiap frame, posisi tiap ikan dihitung di lingkaran, dan arah hadapnya mengikuti arah renang.
- **Ekor bergoyang:** `addSwimWiggle` menyisipkan rumus ke shader bawaan: bagian ekor (`tailWeight`) digeser ke samping dengan gelombang sinus.
- **Kamera:** mengikuti satu ikan pemimpin dan makin mendekat (seperti zoom ke kulit ikan, lalu masuk ke sel hewan).
- **Karang (progres 0,6–1):** kamera berpindah ke taman karang: cabang (silinder) bergoyang dan gundukan bertekstur kasar.

## scenes/animal-cell.js + cell-parts.js (adegan 4)
- **Membran:** bola transparan yang bergoyang seperti jeli (`addWobble` menggeser permukaan dengan perkalian tiga sinus).
- **Organel:** nukleus + nukleolus, 5 mitokondria (kapsul), RE dan badan Golgi (busur bertumpuk), lisosom (bola kecil), sentriol (dua tabung tegak lurus).
- **Menyala bergiliran:** `createHighlighter` — organel aktif warnanya penuh dan bercahaya (`emissiveIntensity`), yang lain diredupkan ke 55%. Urutannya sama dengan daftar teks.
- Di layar lebar, sel digeser ke kanan (`subjectShift`) supaya tidak menutupi teks.
- Label di halaman: "Ilustrasi, bukan skala sebenarnya."

## scenes/seagrass.js + shaders/caustics.frag.glsl (adegan 6, bagian 1)
- **Lamun:** ribuan helai tipis dalam satu `InstancedMesh`, bergoyang dengan `addSway`.
- **Kaustik:** pola cahaya bergelombang di pasir. Shader mengulang rumus sinus/kosinus tiga kali untuk membuat garis-garis terang yang bergerak.

## scenes/plant-cell.js (adegan 6, bagian 2)
Kotak membulat (`RoundedBoxGeometry`) sebagai dinding sel, membran di dalamnya, vakuola besar di tengah, nukleus terdorong ke pinggir, 16 kloroplas di tepi.
Yang menyala bergiliran: dinding sel → kloroplas → vakuola, sama dengan urutan daftar teks.

## scenes/mud.js (adegan 7–8)
Dasar lumpur bergelombang (titik-titik bidang digeser acak), butiran sedimen melayang. Di progres 0,7–1, latar, kabut, dan cahaya memudar ke hitam.

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
