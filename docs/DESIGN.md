# DESIGN.md — Aturan desain website SEL

Aturan ini merangkum skill desain yang terpasang di komputer Howard dan wajib diikuti sebelum dan saat mendesain:
**design-taste-frontend**, **ui-ux-pro-max**, **impeccable** (craft floor), **no-ai-design-slop**,
**make-interfaces-feel-better**, dan **frontend-design**. Kalau aturan skill bertentangan dengan `CLAUDE.md`,
keputusan Howard yang dipakai. Daftar bentrokan ada di bagian 4.

## 1. Arah desain (tesis visual)
- **Mode (impeccable):** Beranda = *Experience* (pengunjung berada di dalam perjalanan menyelam).
  Lab Sel, Gerbang Sel, dan Lab Osmosis = *Read* (memahami materi). Kuis = *Operate* (menyelesaikan tugas).
  Rangkuman = *Read*.
- **Satu ide:** "menyelam dari laguna ke dalam sel". Warna air di Beranda, lab gelap di halaman 2–6.
- **Satu momen unggulan per halaman.** Keberanian dipakai di satu tempat (adegan 3D); sekitarnya tenang dan rapi.
- **Gelap dipilih dari situasi pemakaian**, bukan karena kategori. Website ditampilkan di proyektor kelas, dan
  lab gelap membuat model 3D yang menyala lebih jelas.

## 2. Lantai kualitas (wajib di setiap komponen)
| Aturan | Nilai | Sumber skill |
|---|---|---|
| Kontras teks biasa | ≥ 4,5 : 1 (teks besar ≥ 3 : 1). Diukur, bukan ditebak. | ui-ux-pro-max §1, impeccable |
| Area sentuh | Tombol dan tautan di luar paragraf minimal **44 × 44 px** (`--tap-min`) | ui-ux-pro-max §2, taste |
| Fokus keyboard | Cincin fokus koral selalu terlihat; tautan "Langsung ke isi" jadi yang pertama dicapai Tab | ui-ux-pro-max §1, taste |
| Transisi | Tidak pernah `transition: all`; sebutkan properti yang berubah; 150–300 ms | make-interfaces-feel-better |
| Tekan | Tombol mengecil sedikit saat ditekan (`scale(0.97)`); kartu bertaut naik 2 px saat hover | make-interfaces-feel-better, taste |
| Teks | Judul `text-wrap: balance`, paragraf `text-wrap: pretty`, lebar paragraf ≤ 68ch | make-interfaces-feel-better, impeccable |
| Angka berubah | `font-variant-numeric: tabular-nums` (timer kuis, penghitung, meter) | make-interfaces-feel-better |
| Permukaan browser | Warna seleksi, kursor teks, scrollbar, `accent-color` mengikuti palet | impeccable |
| Gerak | Hormati `prefers-reduced-motion`; tidak ada fade-in di setiap section; tidak ada parallax pada teks; gerak harus menjelaskan sesuatu | taste, no-ai-design-slop, frontend-design |
| Ikon | Ikon SVG satu gaya, bukan emoji | ui-ux-pro-max §4, impeccable |
| Gambar | Tidak ada gambar kosong; ukuran disiapkan agar tidak geser (CLS < 0,1); WebP | ui-ux-pro-max §3 |
| Responsif | Dicek di 1440, 1024, 768, 390, dan 320 px; tidak ada scroll ke samping | ui-ux-pro-max §5, taste |
| Satu sistem | Satu gaya tombol utama, satu gaya kartu, satu skala radius, satu gaya tautan | taste |

## 3. Yang ditolak (anti-slop)
- Kartu seragam "ikon + judul + teks" sebagai struktur halaman; kartu di dalam kartu.
- Teks bergradasi, kaca/blur sebagai hiasan, garis warna tebal di sisi kartu, bayangan blok tanpa blur.
- Nomor bagian 01/02/03 kecuali isinya memang urutan (contoh yang **boleh**: 6 langkah pompa Na⁺/K⁺).
- Fakta, angka, atau testimoni yang dikarang. Semua isi dari `KONTEN-MATERI.md`.
- Warna ungu/lavender.
- Efek yang bisa dipindah ke produk lain tanpa diubah (tes "removal" dari no-ai-design-slop).

## 4. Bentrokan skill ↔ CLAUDE.md (menunggu keputusan Howard)
| Topik | Kata skill | Kata CLAUDE.md / mockup | Sementara |
|---|---|---|---|
| Eyebrow (label kecil di atas judul, mis. `SEL · LAB`) | impeccable: **dilarang**. frontend-design: label huruf kapital & pemisah titik tengah adalah tanda desain AI | §4.2 dan mockup memakai eyebrow | Belum diubah |
| Panah `→` di teks tombol | frontend-design: tanda desain AI | §4.3 `Lanjut: <Halaman> →` | Belum diubah |
| Judul huruf kapital semua + tracking lebar | impeccable: tracking minimum −0,04em, tidak ada larangan kapital untuk judul | §4.2 Montserrat 800 kapital, tracking 0,12–0,2em | Tetap (logo/judul adalah identitas) |
| Keterangan di bawah gambar | taste: tidak boleh ada caption | Aturan emas 13: label "Ilustrasi, bukan skala sebenarnya" | Tetap (kejujuran materi lebih penting) |
| Efek shader | taste: hanya untuk situs teknologi/game | Konsep 3D sudah disetujui | Tetap (isi materi = topik sains/teknis) |
| Font dari Google | impeccable: self-host | §3.1 self-host "kalau sempat" | Self-host di Fase 7 |
