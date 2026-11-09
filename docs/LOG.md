# LOG PEMBUATAN WEBSITE SEL

Catatan harian untuk laporan (BAB IV Kendala, BAB VI Evaluasi).

## Minggu, 8 November 2026 — Fase −1 dan Fase 0

**Yang dikerjakan**
- Fase −1: mengecek skill dan alat. Skill GSAP, frontend-design, web-design-guidelines, dan find-skills sudah ada.
  Skill Three.js (cloudai-x/threejs-skills) dipasang. GitHub CLI 2.103.3 dan Vercel CLI 65.12.1 dipasang.
  Node.js 24.20.0 dan Git 2.55 sudah tersedia.
- Fase 0: membuat proyek Vite multi-halaman dengan 6 halaman kosong (Beranda, Lab Sel, Gerbang Sel, Lab Osmosis,
  Kuis, Rangkuman). Membuat token warna, gaya dasar, navigasi atas dengan tombol Mode Tenang, menu ponsel,
  dan footer "Lanjut" dengan titik progres di setiap halaman.
- Memasang library yang disetujui: vite, three, gsap, lenis, dan @gltf-transform (alat kompres model).
- Membuat alat `tools/inspect-model.mjs` dan `tools/compress-models.mjs` untuk audit model 3D.

**Kendala dan solusi**
- Tombol "Menu" muncul di layar laptop padahal seharusnya hanya di ponsel. Penyebab: aturan CSS `.toggle` ditulis
  setelah `.nav__menu-button` sehingga menimpanya. Solusi: memakai selektor yang lebih spesifik `.nav .nav__menu-button`.
- Repositori GitHub model 3D (BiologySimulation) ternyata sudah pindah nama; data diambil dari alamat barunya.

**Langkah berikutnya**
- Mengunduh dan memeriksa model 3D kandidat, lalu menulis keputusan di `docs/ASSETS.md`.
- Membuat repositori GitHub dan deploy pertama ke Vercel.
- Fase 1: mengisi semua halaman dengan teks materi asli.

## Minggu, 8 November 2026 (lanjutan) — Aturan desain dari skill
**Yang dikerjakan**
- Membaca skill desain yang dipasang Howard (design-taste-frontend, ui-ux-pro-max, impeccable, no-ai-design-slop,
  make-interfaces-feel-better, frontend-design) dan merangkumnya di `docs/DESIGN.md`.
- Mengaudit kerangka yang sudah dibuat terhadap aturan itu dan memperbaikinya: kontras warna abu-abu, ukuran area klik 44 px,
  tautan "Langsung ke isi", transisi yang spesifik, tombol tekan, perataan teks, warna seleksi dan scrollbar.

**Kendala dan solusi**
- Warna abu-abu bawaan desain ternyata gagal uji kontras (2,7–4,3 : 1). Solusi: warna baru yang diukur 5,2–6,2 : 1.
- Muncul error "Transition was skipped" di console setiap pindah halaman. Solusi: skrip kecil di `<head>` yang menangkap
  lompatan transisi (`public/view-transition.js`). Dicek di versi build: tidak ada error baru.
- Beberapa aturan skill bertentangan dengan rancangan yang sudah disetujui (eyebrow, panah di tombol). Dicatat di
  `docs/DESIGN.md` bagian 4 untuk diputuskan Howard.

## Minggu, 8 November 2026 (lanjutan) — Beranda versi teks
**Yang dikerjakan**
- Memakai skill cinematic-gsap-lenis-motion-system (gulir halus Lenis + ScrollTrigger), build-threejs-scroll-worlds
  (rencana satu dunia 3D yang dikendalikan gulir, untuk Fase 2), dan landing-page-design (efek kata menyala saat digulir).
- Membuat 8 adegan Beranda lengkap dengan teks dari KONTEN-MATERI §1, tabel "Dua sel, satu laguna", dan tombol "Lewati intro".
- Warna latar adegan makin gelap mengikuti kedalaman.

**Kendala dan solusi**
- Menu atas pecah menjadi dua baris di layar sedang. Solusi: `white-space: nowrap` dan menu ponsel mulai di lebar 1000 px.
- Kata "bakteri" terpisah ke baris sendiri di kotak fakta karena aturan CSS lama. Solusi: aturan itu dihapus.
- Skill landing-page-design melarang huruf miring dan meminta struktur halaman jualan (FAQ, harga). Tidak dipakai karena
  Beranda adalah perjalanan belajar, bukan halaman jualan, dan rancangan sudah disetujui.

## Minggu, 8 November 2026 (lanjutan) — Beranda 3D lengkap (adegan 1–8)
**Yang dikerjakan**
- Satu kanvas WebGL di belakang teks, dikendalikan posisi gulir lewat "dirigen" (`conductor.js`) dan naskah `landing-chapters.json`.
- Adegan 1–2: laguna dengan shader air, pulau hutan 2.5D, efek riak judul SEL, menyelam menembus permukaan, sinar cahaya, gelembung.
- Adegan 3 dan 5: kawanan ikan (instancing) yang diikuti kamera, taman karang bergoyang.
- Adegan 4: sel hewan ilustrasi; organel menyala bergiliran sinkron dengan daftar teks.
- Adegan 6: padang lamun dengan pola kaustik, lalu sel tumbuhan (dinding sel, kloroplas, vakuola menyala bergiliran).
- Adegan 7–8: lumpur dengan sedimen, lalu memudar ke hitam sebelum tombol "Lanjut: Lab Sel".
- Pengatur kualitas otomatis, Mode Tenang mematikan 3D, render berhenti saat tab disembunyikan.

**Kendala dan solusi**
- Ekor ikan terbalik (terlihat seperti mata panah). Solusi: kerucut ekor diputar ke arah sebaliknya.
- Butiran terlihat kotak saat dekat kamera. Solusi: tekstur titik bulat.
- Fungsi butiran menimpa posisi tinggi yang diatur adegan (gelembung loncat ke permukaan). Solusi: simpan tinggi dasar dulu.
- Setelah muat ulang, adegan salah (ikan muncul di section lamun) karena posisi section diukur sebelum tata letak berubah. Solusi: `ResizeObserver` mengukur ulang.
- Kamera menembus padang lamun dan teks sulit dibaca di atas pasir terang. Solusi: lamun digeser ke kanan, pasir digelapkan, scrim gelap di sisi kiri teks.

**Langkah berikutnya**
- Uji di laptop sekolah / proyektor. PC sendiri: 139–144 FPS.
- Lanjut ke halaman Lab Sel.

## Minggu, 8 November 2026 (lanjutan) — Redesign adegan 1 Beranda
**Yang dikerjakan**
- Howard menilai hero terlihat murah (bukit vektor datar, air polos, judul berbayangan, nav teal solid). Redesign hanya adegan 1.
- Langit HDRI CC0 dari Poly Haven, air `Water.js` dengan pantulan, tiga lapis pulau dari foto Unsplash dengan kabut biru dan parallax.
- Judul tanpa bayangan, rata kiri di grid 12 kolom; indikator gulir garis; "Lewati intro" di kanan bawah; nav transparan di atas hero.
- Vignette dan film grain halus dengan CSS.
- Screenshot sebelum/sesudah di `docs/laporan/screenshots/fase2-landing-hero-*.png` (1440, 1024, 390).

**Kendala dan solusi**
- HDRI pertama ("Spruit Sunrise") ternyata berisi pepohonan Afrika Selatan di cakrawala, jadi terlihat di belakang pulau. Solusi: pakai HDRI "pure sky" (langit saja).
- HDRI kedua ("Kloofendal 28d Misty") terlalu putih berkabut; judul krem tidak terbaca dan air jadi abu-abu. Solusi: "Qwantani Morning" (langit biru pagi) dan kamera diputar menyamping dari matahari.
- Sisa awan abu-abu ikut terlihat setelah langit foto dihapus. Solusi: aturan hapus ditambah (awan lebih gelap dan putih kebiruan ikut dihapus).
- Pulau terlalu besar dan menutupi judul. Solusi: lapis dikecilkan dan dijauhkan.
- Rumus cakrawala salah dua kali lipat (cakrawala di 40%). Solusi: diperbaiki ke 45%.
- Nav kadang tetap gelap saat diuji karena IntersectionObserver salah membaca saat ukuran jendela uji berubah. Solusi: cukup cek posisi gulir.
- Peringatan WebGL saat ukuran layar berubah. Solusi: tekstur judul dibuang sebelum digambar ulang.

**Catatan aturan baru (§4.5 anti-vibecode)**
- Adegan 3–8 masih memakai bentuk buatan kode (ikan, karang, lamun, sel). Perlu keputusan Howard apakah diganti aset nyata.

## Minggu, 8 November 2026 (lanjutan) — Polish pass dan perbaikan tampilan
**Yang dikerjakan**
- Token spasi 8 px, type scale, dan motion token dipakai di semua CSS dan GSAP.
- Preloader (penghitung + huruf SEL keluar dari mask), text reveal per baris, kursor kustom, tombol magnetik, grain + vignette, suara air (Web Audio, default mati), panel lil-gui di `?debug`.
- Perbaikan dari skill web-design-guidelines: `color-scheme`, `theme-color`, `touch-action`, `scroll-margin-top`, animasi berhenti saat reduced-motion.
- Perbaikan "tampilan asal-asalan": bayangan teks dihapus (diganti scrim lebih gelap), ikan tidak lagi menutupi kolom teks, ikan lebih halus, text reveal ramah pembaca layar.

**Kendala dan solusi**
- Adegan 3D tertinggal satu section di uji headless (1,5 FPS). Penyebab sebenarnya: penghalusan kamera memakai waktu frame yang dibatasi, jadi di laptop lambat kamera ikut lambat. Solusi: dirigen memakai waktu asli.

## Senin, 9 November 2026 — Lab Sel (Fase 3)
**Yang dikerjakan**
- Materi 3D Beranda diperbaiki (lingkungan pantulan, material fisik, geometri halus).
- Lab Sel lengkap: daftar organel dan panel detail (bisa tanpa 3D), ruang lab 3D dengan lampu sorot dan pedestal kaca,
  sel hewan dan tumbuhan terpotong (cutaway), sorot + kartu info saat kursor menunjuk, miring mengikuti kursor, geser sel,
  kamera terbang ke organel, layar detail dengan pin bernomor untuk 5 organel lengkap, tautan langsung `sel.html#organel`.
- Acuan: deskripsi CLAUDE.md §6.2 (belum ada desain Figma yang disetujui).

**Kendala dan solusi**
- Layar sel dan layar detail tampil bersamaan karena `display: grid` mengalahkan atribut `hidden`. Solusi: aturan `.lab-view[hidden]`.
- RE pada sel tumbuhan menembus dinding sel. Solusi: diperkecil dan digeser.
- Di ponsel, tombol menu terpotong dan sel terlalu besar. Solusi: jarak tombol diperkecil, kamera mundur otomatis di layar sempit.
- Peringatan GSAP "target not found" dari judul yang isinya berubah. Solusi: judul dinamis diberi `data-no-reveal`.

## Selasa, 10 November 2026 — Gerbang Sel (Fase 4)
**Yang dikerjakan**
- Gerbang Sel: 5 mode wajib (Struktur, Difusi, Difusi terfasilitasi, Osmosis, Pompa Na⁺/K⁺) dengan membran 3D, kartu info,
  Jeda/Langkah berikutnya/Ulangi/kecepatan, penghitung dan bar pompa, tanda muatan (+ luar / − dalam).
- Endositosis, eksositosis, kotranspor ditampilkan sebagai teks di bawah (versi 3D belum dibuat).

**Kendala dan solusi**
- Kamera terlalu dekat sehingga membran memenuhi layar. Solusi: kamera dijauhkan.
- Tombol kontrol tidak bergaya karena gaya `.pill-button` hanya ada di file Lab Sel. Solusi: dipindah ke `components.css`.
- Atribut `hidden` kalah oleh `display: flex` (kontrol dan tautan kartu). Solusi: aturan `[hidden]` khusus.

## Selasa, 10 November 2026 — Lab Osmosis, Kuis, Rangkuman (Fase 5, 6, dan halaman 6)
**Yang dikerjakan**
- Lab Osmosis: mikroskop bundar (Canvas 2D) untuk sel darah merah dan sel epidermis bawang merah, tombol Hipotonik/Isotonik/Hipertonik,
  animasi tetesan + riak, panah biru arah air, meter Volume sel dan Tekanan turgor, panel Hasil Pengamatan (arah air, mengapa, contoh nyata),
  tabel 6 keadaan, kotak "Ingat!", dan 3 soal "Tebak keadaan sel ini". Video pra-render diganti animasi langsung (pilihan cadangan di CLAUDE.md §6.4).
- Kuis: bank 68 soal (sel 17, organel 19, membran 17, osmosis 15), Mode Latihan (topik, jumlah, umpan balik langsung, "Pelajari lagi",
  ulangi soal yang salah) dan Mode Ujian (25 soal dengan pembagian 4/8/7/6, timer 30 menit kuning/merah, navigator, ragu-ragu,
  konfirmasi sebelum kumpul, kumpul otomatis saat waktu habis, laporan per topik, pembahasan, riwayat di perangkat, unduh kartu nilai PNG).
- Rangkuman: 5 kartu ringkasan, kredit otomatis dari `credits.json`, tabel anggota dan identitas, kalimat penutup.

**Kendala dan solusi**
- Laporan "Unduh Report Card" di rencana memakai library `html-to-image`, padahal library baru harus izin dulu. Solusi: kartu nilai digambar sendiri di `<canvas>` lalu disimpan sebagai PNG.
- Tombol pilihan dua sisi (Sel Hewan | Sel Tumbuhan) dibutuhkan juga di Kuis. Solusi: gayanya `.segmented` dipindah ke `components.css`.
- Nama guru belum diketahui. Solusi: baris guru disembunyikan otomatis selama isinya kosong di `rangkuman.json`.

## Selasa, 10 November 2026 — Detail 3D (Gerbang Sel dan Lab Sel)
**Yang dikerjakan**
- Gerbang Sel: protein dibuat ulang dari beberapa subunit dengan permukaan bergelombang (protein integral 4 subunit, saluran 5 subunit dengan pori, pembawa 2 lobus, pompa dengan domain ATP di sitoplasma), protein menonjol di atas dan bawah membran.
  Fosfolipid: satu ekor bertekuk (asam lemak tak jenuh), tinggi dan putaran sedikit berbeda (kesan "cair"), warna kepala bervariasi. Rantai karbohidrat bercabang. Kamera dijauhkan agar membran tidak terpotong.
- Lab Sel: nukleus dengan membran inti dua lapis, pori nukleus, kromatin kusut, nukleolus; mitokondria tembus pandang dengan krista; ribosom dua subunit dan menempel di RE kasar; vesikel badan Golgi;
  lisosom berisi butiran enzim; peroksisom dengan inti kristal; sentriol dari 9 triplet mikrotubulus; kloroplas dengan grana.
- Screenshot sebelum/sesudah: `docs/laporan/screenshots/fase7-*`.

**Kendala dan solusi**
- Protein tenggelam di antara kepala fosfolipid sehingga hampir tidak terlihat. Solusi: protein diperbesar 1,2–1,4× dan fosfolipid di sekitarnya diberi ruang lebih lebar.
- Pompa yang lebih besar menutupi ion Na⁺/K⁺ yang menempel. Solusi: pompa dibuat tembus pandang selama mode Pompa.

## Selasa, 10 November 2026 — Rasa ruang 3D di Beranda
**Yang dikerjakan**
- File baru `scenes/depth.js`: partikel tiga lapis (jauh, tengah, dekat/bokeh) yang selalu mengelilingi kamera, sel-sel tetangga di kejauhan + satu sel latar depan, dan jaringan sel tumbuhan di belakang sel lamun.
- Sel hewan dan sel tumbuhan: kamera kini mengitari sel (orbit) sambil naik/turun, bukan hanya mundur. Sel tetap di tengah dunia, posisinya di layar diatur dengan `setViewOffset`.
- Padang lamun: lamun latar depan yang lebih tinggi dilewati kamera; daun lamun meruncing dan melengkung.
- Lumpur: kerikil di sepanjang jalur kamera dan cahaya rendah dari samping. Terumbu, penyelaman, dan lumpur memakai partikel tiga lapis.
- Screenshot: `docs/laporan/screenshots/fase7-beranda-ruang-*`.

**Kendala dan solusi**
- Sel latar depan terlalu besar dan menutupi sel utama. Solusi: diperkecil dan digeser ke tepi kanan.
- Jaringan sel tumbuhan terlalu terang sehingga bersaing dengan sel utama dan teks. Solusi: dibuat lebih jauh, lebih gelap, lebih transparan.
- Adegan lumpur hampir hitam sehingga kerikil tidak terlihat. Solusi: lantai sedikit lebih terang + cahaya samping.
