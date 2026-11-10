# SEL: Kecil, tapi menyusun segalanya

Website edukasi interaktif tentang **sel** untuk mata pelajaran Biologi kelas XI. Pengunjung diajak menyelam ke sebuah laguna tropis, lalu "mengecil" dari ukuran ikan sampai ukuran sel. Setelah itu, mereka menjelajahi organel, membran sel, osmosis, kuis dan rangkuman.

**🔗 Kunjungi website: [biologicchowie.netlify.app](https://biologicchowie.netlify.app)**

Proyek akhir Pengembangan Web, Kelompok 4, kelas XI-A5, Kolese Kanisius Jakarta.

---

## Daftar isi

- [Halaman](#halaman)
- [Teknologi](#teknologi)
- [Menjalankan di komputer sendiri](#menjalankan-di-komputer-sendiri)
- [Struktur folder](#struktur-folder)
- [Deploy ke Netlify](#deploy-ke-netlify)
- [Aksesibilitas & performa](#aksesibilitas--performa)
- [Sumber materi & aset](#sumber-materi--aset)
- [Anggota kelompok](#anggota-kelompok)

---

## Halaman

| No | Halaman | File | Isi |
|---|---|---|---|
| 1 | **Beranda** | `index.html` | Hero pulau dengan judul ripple air, lalu walkthrough scroll ke dalam laguna: ikan, karang dan lamun sampai foto mikroskop sel hewan & tumbuhan. Ada juga skala ukuran 30 cm → 20 µm dan perbandingan sel hewan vs sel tumbuhan. |
| 2 | **Lab Sel** | `sel.html` | Model 3D sel hewan dan sel tumbuhan. Arahkan kursor untuk menyorot organel, klik untuk melihat detail struktur dan fungsinya. |
| 3 | **Gerbang Sel** | `gerbang-sel.html` | Simulasi 3D membran plasma (model mosaik fluida), transpor zat masuk-keluar sel, dan simulasi **pompa Na⁺/K⁺** langkah demi langkah. |
| 4 | **Lab Osmosis** | `lab-osmosis.html` | Pilih larutan **hipotonik, isotonik, atau hipertonik**, lalu lihat apa yang terjadi pada sel hewan dan sel tumbuhan, lengkap dengan penjelasannya. |
| 5 | **Kuis** | `kuis.html` | Mode latihan dengan pembahasan langsung, dan **Mode Ujian**: 25 soal pilihan ganda, timer 30 menit, laporan nilai serta topik yang perlu dipelajari lagi. |
| 6 | **Rangkuman** | `rangkuman.html` | Kartu rangkuman materi, daftar sumber & kredit aset, dan anggota kelompok. |

Setiap halaman diakhiri tombol menuju halaman berikutnya, jadi website bisa dibaca berurutan seperti satu cerita.

---

## Teknologi

| Teknologi | Dipakai untuk |
|---|---|
| **HTML, CSS, JavaScript** (ES modules, tanpa framework) | Struktur, tampilan dan logika semua halaman |
| **[Vite](https://vitejs.dev)** | Server pengembangan dan build multi-halaman |
| **[Three.js](https://threejs.org)** | Grafis 3D & WebGL: model sel, membran, shader efek air |
| **[GSAP](https://gsap.com) + ScrollTrigger** | Animasi dan animasi berbasis scroll |
| **[Lenis](https://lenis.darkroom.engineering)** | Smooth scrolling di seluruh website |

**Desain:** font Montserrat & Cormorant Garamond. Palet warna laguna: deep `#063B4C`, lagoon `#1FC8C8`, cream `#FFF4D6`, coral `#FF7A59`. Tampilan "lab" gelap memakai `#0E1116`.

---

## Menjalankan di komputer sendiri

Butuh [Node.js](https://nodejs.org) versi 18 atau lebih baru.

```bash
# 1. Clone repository
git clone https://github.com/howardleonhartjunaedi/BiologyCellHowie.git
cd BiologyCellHowie

# 2. Install dependency
npm install

# 3. Jalankan server pengembangan
npm run dev
```

Buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

Untuk membuat versi produksi:

```bash
npm run build     # hasil di folder dist/
npm run preview   # cek hasil build di browser
```

---

## Struktur folder

```
├── index.html, sel.html, gerbang-sel.html, lab-osmosis.html, kuis.html, rangkuman.html
├── public/
│   ├── models/          # model 3D (.glb) yang sudah dikompres
│   └── seq/             # frame walkthrough (.webp)
└── src/
    ├── core/            # kode bersama: renderer, smooth scroll, navigasi, transisi, loader
    ├── pages/           # kode khusus tiap halaman
    └── data/            # isi materi dalam JSON: organel, membran, osmosis, soal, rangkuman, kredit
```

Isi materi (teks organel, soal kuis, rangkuman) disimpan terpisah di `src/data/*.json`, jadi materi bisa diperbaiki tanpa mengubah kode.

---

## Deploy ke Netlify

Website ini di-deploy di **[biologicchowie.netlify.app](https://biologicchowie.netlify.app)**.

| Pengaturan | Nilai |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 18+ |

Langkahnya:
1. Login ke [Netlify](https://app.netlify.com), lalu pilih **Add new site → Import an existing project → GitHub**.
2. Pilih repository ini dan isi pengaturan di atas.
3. Ganti nama situs di **Site configuration → Change site name** menjadi `biologicchowie`.

Setiap `git push` ke branch `main` otomatis memperbarui website.

---

## Aksesibilitas & performa

- **Mode Tenang**: tombol di navigasi untuk mematikan animasi berat, efek WebGL dan smooth scroll. Konten tetap lengkap.
- Mengikuti pengaturan **prefers-reduced-motion** di perangkat pengguna.
- Kualitas grafis otomatis diturunkan di komputer yang lebih lambat (seperti komputer lab sekolah).
- Gambar walkthrough dimuat bertahap, jadi halaman bisa digunakan sebelum semua file selesai diunduh.
- Bisa dinavigasi dengan keyboard, dengan teks alternatif pada gambar penting.

---

## Sumber materi & aset

**Materi** disusun dari bahan ajar Biologi kelas XI Kolese Kanisius (presentasi *BAB 1 Sel* dan *Sel Update 2*) serta buku *Biologi Vol. 3.8*.

**Aset pihak ketiga** dipakai sesuai lisensinya masing-masing:

| Jenis | Sumber | Lisensi |
|---|---|---|
| Video bawah air | [Pexels](https://www.pexels.com) | Pexels License |
| Foto mikroskop | [Wikimedia Commons](https://commons.wikimedia.org) | CC BY / CC BY-SA / Public Domain |
| HDRI langit | [Poly Haven](https://polyhaven.com) | CC0 |
| Model 3D | Sketchfab & GitHub (lihat daftar) | CC BY / CC BY-NC / CC BY-NC-SA |

Daftar lengkap pembuat, lisensi dan tautan setiap aset ada di halaman **Rangkuman** dan di [`src/data/credits.json`](src/data/credits.json).

Kode website ini dibuat untuk keperluan pendidikan. Aset pihak ketiga tetap milik pembuatnya masing-masing.

---

## Anggota kelompok

**Kelompok 4, XI-A5, Kolese Kanisius**

| No. absen | Nama | Peran |
|---|---|---|
| 17 | Gavin Maruli Wilianata | Anggota |
| 19 | Greg Nigel Kenjiro Pardede | Anggota |
| 20 | Howard Leonhart Junaedi | Ketua, pengembang website |
| 21 | Jaden Sutedja | Anggota |
| 33 | Raphael Krisna Rahardian | Anggota |

