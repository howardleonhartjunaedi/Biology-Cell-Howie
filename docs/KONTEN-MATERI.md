# KONTEN MATERI — Website SEL (sumber kebenaran untuk semua teks di website)

> Semua teks di website diambil dari file ini. Sumber utama: slide guru **"BAB 1 SEL"** (Biologi XI, TP 25/26),
> slide guru **"SEL Update 2"**, **Rangkuman Biologi Sel** milik kelompok, dan **Rancangan Website Sel Kelompok 4** (Pertemuan 2).
> Tanda **[CEK]** = perlu dikonfirmasi ke guru/buku sebelum final (lihat §9). Jangan menambah fakta di luar file ini.

---

## 1. Landing page (index.html)

### Adegan 1 — Di atas laguna
- Judul: **SEL**
- Tagline: *Kecil, tapi menyusun segalanya.*
- Petunjuk: "Gulir untuk menyelam ↓" · tombol kecil "Lewati intro"

### Adegan 2 — Menyelam
- "Setiap makhluk hidup di laguna ini, dari ikan kecil sampai pohon di tepi pantai, tersusun dari **sel**."
- "Sel adalah unit struktural dan fungsional terkecil makhluk hidup: bagian terkecil yang mampu menjalankan kegiatan hidup."

### Adegan 3 — Terumbu dan ikan
- "Setiap sel berasal dari sel yang sudah ada sebelumnya." (Rudolf Virchow, 1858)
- "Sebagian besar sel berukuran 10–100 µm, terlalu kecil untuk dilihat tanpa mikroskop."
- Penghitung skala: 30 cm → 1 cm → 1 mm → 20 µm

### Adegan 4 — Sel hewan
- Judul layar: **Sel hewan**
- "Sel hewan hanya dibatasi **membran plasma**, tanpa dinding sel. Karena itu bentuknya lentur dan tidak tetap."
- Label organel yang menyala:
  - Membran plasma: mengatur zat yang keluar dan masuk sel
  - Nukleus: pusat kendali sel, tempat DNA disimpan
  - Mitokondria: tempat respirasi sel yang menghasilkan ATP
  - RE dan badan Golgi: membuat, mengemas, dan mengirim protein
  - Lisosom: mencerna zat di dalam sel
  - Sentriol: membentuk benang spindel saat sel membelah
- Fakta: "Otot ikan yang terus berenang butuh banyak energi, jadi selnya kaya **mitokondria**." (slide: makin besar kebutuhan energi, makin banyak mitokondria)

### Adegan 5 — Karang
- "Karang adalah **hewan**. Di dalam selnya hidup alga kecil yang berfotosintesis dan berbagi makanan dengan karang." [CEK sumber]

### Adegan 6 — Lamun dan sel tumbuhan
- "Lamun bukan rumput laut. Lamun adalah **tumbuhan berbunga** yang hidup di laut." [CEK sumber]
- Judul layar: **Sel tumbuhan**
- Label: Dinding sel (lapisan kaku dari selulosa yang membuat bentuk sel tetap) · Kloroplas (tempat fotosintesis) · Vakuola besar (menyimpan cairan sel dan menjaga tekanan turgor)
- Fakta: "Sebagian oksigen di air laguna berasal dari fotosintesis lamun dan alga."

### Adegan 7 — Lumpur: ringkasan
- Judul layar: **Dua sel, satu laguna**
- "Sel ikan dan sel lamun sama-sama **eukariotik**: punya nukleus bermembran, mitokondria, RE, badan Golgi, dan ribosom. Bedanya:"

| Ciri | Sel hewan (ikan) | Sel tumbuhan (lamun) |
|---|---|---|
| Dinding sel | Tidak ada | Ada (selulosa) |
| Plastida (kloroplas) | Tidak ada | Ada |
| Vakuola | Kecil, tidak permanen | Besar, permanen |
| Sentriol | Ada | Tidak ada (sentrosom tanpa sentriol) |
| Lisosom | Ada | Umumnya tidak ada; vakuola tengah dapat berperan seperti lisosom |
| Bentuk | Tidak tetap | Tetap |

- Teaser: "Lumpur ini juga penuh **bakteri**: sel prokariotik yang tidak punya membran inti."

### Adegan 8 — Gelap
- "Ini baru permukaannya." · "Siap melihat lebih dalam?" · Tombol: **Lanjut: Lab Sel →**

---

## 2. Pengetahuan dasar sel (dipakai di landing, rangkuman, dan kuis)

**Teori sel (slide BAB 1):**
- Robert Hooke (1635–1703): mengamati sayatan gabus, menamai ruang-ruang kecil *cellulae* (sel).
- Antonie van Leeuwenhoek (1674): penemu sel hidup (protista, sperma, bakteri) dengan lensa.
- Schleiden (tumbuhan) & Schwann (hewan): sel adalah kesatuan struktural; semua makhluk hidup tersusun atas sel.
- Max Schultze: sel adalah kesatuan fungsional; protoplasma bagian penting sel.
- Rudolf Virchow (1858): *omnis cellula e cellula* — setiap sel berasal dari sel sebelumnya.
- Robert Brown (1820-an): menemukan titik buram dalam sel = nukleus.
- Kesimpulan: semua makhluk hidup terdiri atas sel; sel unit struktural terkecil; unit fungsional; berasal dari sel sebelumnya; unit hereditas.

**Ukuran & mikroskop (slide SEL Update 2):** sebagian besar sel 10–100 µm; mikroskop cahaya perbesaran sampai 1000×; mikroskop elektron daya pisah 2–4 nm.

**Prokariotik vs eukariotik (slide BAB 1):**
| Ciri | Prokariotik | Eukariotik |
|---|---|---|
| Contoh | Bakteri, archaea, sianobakteri | Protista, jamur, tumbuhan, hewan |
| Ukuran | ~1–10 µm [CEK: slide lain menulis 0,5–1 µm] | ~10–100 µm |
| Inti | Nukleoid, tidak ada membran inti | Nukleus sejati bermembran ganda |
| DNA | Sirkuler | Linear (kromosom) dengan protein histon |
| Ribosom | 70S (50S + 30S) | 80S (60S + 40S) |
| Organel bermembran | Tidak ada | Ada (RE, Golgi, mitokondria, dll.) |
| Pembelahan | Pembelahan biner | Mitosis dan meiosis |

**Komposisi kimia sel (slide SEL Update 2):** air 70–85% [CEK: slide BAB 1 menulis "+90%"], protein 10–20%, lipid 2–3%, karbohidrat 1%, zat anorganik 1%.

---

## 3. Organel (halaman Lab Sel — sel.html)

Sel hewan: membran plasma, sitoplasma, nukleus, mitokondria, RE kasar, RE halus, ribosom, badan Golgi, lisosom, peroksisom, sentriol.
Sel tumbuhan: dinding sel, membran plasma, sitoplasma, nukleus, mitokondria, kloroplas, vakuola, RE kasar, RE halus, ribosom, badan Golgi, peroksisom.

### 3.1 Organel dengan detail penuh (bagian bernomor)

**NUKLEUS** — membran ganda · ada di hewan & tumbuhan
- Singkat: Pusat kendali sel yang menyimpan informasi genetik (DNA).
- Bagian:
  1. **Membran inti (karioteka)** — D: Membran lapis dua yang berpori dan terhubung dengan RE kasar. F: Memisahkan isi nukleus dari sitoplasma.
  2. **Pori nukleus** — D: Lubang-lubang pada membran inti. F: Jalur keluar masuk molekul, misalnya mRNA.
  3. **Nukleoplasma** — D: Cairan inti berbentuk gel berisi ion, protein, nukleotida, dan benang kromatin. F: Tempat keberadaan materi genetik.
  4. **Nukleolus (anak inti)** — D: Bagian bulat, padat, dan berwarna gelap di dalam nukleus. F: Tempat sintesis rRNA dan perakitan subunit ribosom.
  5. **Kromatin** — D: Untaian DNA dan protein yang membentuk benang panjang; saat menggulung menjadi kromosom. F: Menyimpan materi genetik.
- Fungsi nukleus: mengendalikan metabolisme sel, mengontrol sintesis protein (membuat mRNA sesuai perintah DNA), menyimpan informasi genetik, tempat replikasi DNA.
- Tahukah kamu? Sel darah merah manusia dewasa tidak punya nukleus, sedangkan sel otot rangka punya banyak nukleus.

**MITOKONDRIA** — membran ganda · hewan & tumbuhan
- Singkat: Tempat respirasi sel yang menghasilkan energi (ATP).
- Bagian:
  1. **Membran luar** — D: Membran pembungkus paling luar. F: Pembatas antara mitokondria dengan sitoplasma.
  2. **Membran dalam** — D: Membran kedua di sebelah dalam. F: Tempat rantai respirasi yang menghasilkan ATP.
  3. **Krista** — D: Lipatan-lipatan membran dalam. F: Memperluas permukaan untuk respirasi sehingga ATP yang dihasilkan lebih banyak.
  4. **Matriks** — D: Cairan di dalam mitokondria yang mengandung DNA sirkuler, RNA, dan ribosom. F: Tempat berbagai reaksi respirasi; DNA-nya membuat mitokondria bisa memperbanyak diri.
- Ukuran ±0,5 µm, bentuk seperti sosis; organel semiotonom.
- Tahukah kamu? Makin besar kebutuhan energi, makin banyak mitokondria. Contoh: sel hati bisa punya sekitar 1000 mitokondria.

**KLOROPLAS** — membran ganda · hanya tumbuhan (dan alga)
- Singkat: Plastida berwarna hijau, tempat fotosintesis.
- Bagian:
  1. **Membran luar & membran dalam** — F: Pelindung dan pemisah antara kloroplas dan sitoplasma.
  2. **Tilakoid** — D: Kantong-kantong pipih. F: Menyusun grana; tempat reaksi terang.
  3. **Grana (granum)** — D: Tumpukan tilakoid yang mengandung klorofil dan karotenoid. F: Aktif dalam reaksi terang fotosintesis.
  4. **Stroma** — D: Cairan di luar tilakoid. F: Tempat reaksi gelap (siklus Calvin).
- Tahukah kamu? Kloroplas punya DNA sendiri, seperti mitokondria. Plastida lain: kromoplas (warna selain hijau, misal wortel) dan leukoplas (tidak berwarna, menyimpan cadangan makanan: amiloplas, elaioplas, proteinoplas).

**BADAN GOLGI** — membran tunggal · hewan & tumbuhan (pada tumbuhan disebut diktiosom)
- Singkat: "Kantor pos" sel: mengubah, mengemas, dan mengirim protein.
- Bagian:
  1. **Sisterna** — D: Kantong pipih yang bertumpuk. F: Tempat protein dimodifikasi (misalnya ditambah karbohidrat menjadi glikoprotein).
  2. **Sisi cis** — F: Sisi yang menerima vesikel dari RE.
  3. **Sisi trans** — F: Sisi tempat keluarnya hasil olahan.
  4. **Vesikel** — D: Gelembung kecil. F: Mengangkut makromolekul ke tujuan atau keluar sel.
- Fungsi: membentuk lisosom, akrosom (pada sperma), glikolipid, dan vesikel sekresi; banyak di sel kelenjar.

**RETIKULUM ENDOPLASMA (RE)** — membran tunggal · hewan & tumbuhan
- Singkat: Jaringan saluran bermembran yang terhubung dengan membran inti.
- Bagian:
  1. **RE kasar** — D: Ditempeli ribosom. F: Sintesis protein yang lalu dibungkus vesikel dan diproses di badan Golgi.
  2. **RE halus** — D: Tanpa ribosom. F: Sintesis lipid (fosfolipid, steroid), metabolisme karbohidrat, menetralkan racun.
  3. **Lumen/sisterna** — D: Ruang di dalam saluran RE. F: Tempat menampung dan mengangkut hasil sintesis.
- Tahukah kamu? RE halus banyak di sel hati (detoksifikasi). Di sel otot, RE halus disebut retikulum sarkoplasma.

### 3.2 Organel detail sederhana
- **Membran plasma** — Selaput tipis pembatas sel, tersusun fosfolipid dua lapis + protein + karbohidrat (model mozaik fluida). Fungsi: mengatur keluar masuk zat (selektif permeabel), menerima rangsang (reseptor), melindungi sel. Tahukah kamu? Tebalnya hanya 5–10 nm.
- **Sitoplasma** — Cairan sel di luar nukleus berisi sitosol dan organel, bersifat koloid (bisa berubah sol ↔ gel). Fungsi: tempat organel dan sebagian besar reaksi metabolisme.
- **Ribosom** — Butiran nukleoprotein (tidak bermembran) dari 2 subunit (besar & kecil). Fungsi: sintesis protein. Ribosom bebas → protein untuk sel itu sendiri; ribosom pada RE → protein membran & protein yang disekresikan. Tahukah kamu? "S" (Svedberg) bukan satuan ukuran, tetapi laju pengendapan saat disentrifugasi.
- **Lisosom** — Kantong bulat bermembran tunggal berisi enzim hidrolitik, dibentuk dari badan Golgi. Fungsi: pencernaan intrasel, autofagi (menghancurkan organel rusak), autolisis (menghancurkan sel sendiri, misal hilangnya ekor kecebong). Tahukah kamu? Kekurangan enzim lisosom menyebabkan penyakit Tay-Sachs.
- **Peroksisom** — Kantong bulat bermembran tunggal berisi enzim oksidatif dan katalase. Fungsi: mengubah H₂O₂ (beracun) menjadi H₂O dan O₂. Banyak di sel hati dan ginjal.
- **Sentriol** — Sepasang tabung dari 9 triplet mikrotubulus, saling tegak lurus, berada dalam sentrosom. Fungsi: membentuk benang spindel saat pembelahan sel. Hanya di sel hewan.
- **Vakuola** — Rongga berisi cairan sel, dibungkus membran tunggal (tonoplas). Pada tumbuhan besar dan permanen. Fungsi: menjaga tekanan turgor, menyimpan zat makanan, pigmen, dan sisa metabolisme. Tahukah kamu? Hewan bersel satu punya vakuola makanan dan vakuola kontraktil (pengatur tekanan osmotik).
- **Dinding sel** — Lapisan kaku di luar membran sel tumbuhan dari selulosa, hemiselulosa, pektin (dan lignin pada sel tua). Fungsi: memberi bentuk tetap, melindungi, menahan tekanan turgor. Bagian: lamela tengah (perekat antarsel), dinding primer, dinding sekunder; plasmodesmata menghubungkan sitoplasma sel tetangga.
- **Sitoskeleton** (opsional) — Mikrotubulus (tabung berongga, diameter 18–20 nm menurut slide guru), mikrofilamen (aktin & miosin), filamen intermediet (keratin). Fungsi: memberi bentuk sel dan menggerakkan organel.

---

## 4. Membran & transpor (halaman Gerbang Sel — gerbang-sel.html)

### 4.1 Struktur membran (mode Struktur)
- **Fosfolipid** — D: Dua lapis; kepala hidrofilik (suka air) menghadap keluar, ekor hidrofobik (tidak suka air) di tengah. F: Penghalang utama; jalur difusi sederhana.
- **Protein integral** — D: Menembus membran. F: Saluran (channel), pembawa (carrier), dan pompa.
- **Protein perifer** — D: Menempel di permukaan membran. F: Enzim dan penahan kerangka sel.
- **Glikoprotein** — D: Protein + rantai karbohidrat (oligosakarida). F: Identitas sel, pengenalan antarsel, reseptor rangsang.
- **Glikolipid** — D: Lipid + rantai karbohidrat. F: Pengenalan sel dan kestabilan membran.
- Teks pengantar: "Membran plasma adalah gerbang sel. Membran ini bersifat selektif permeabel: hanya zat tertentu yang bisa lewat. Susunannya disebut model mozaik fluida — bisa bergerak seperti cairan, dan sisi luar serta dalamnya berbeda (asimetris)."

### 4.2 Transpor pasif (tidak butuh ATP, dari konsentrasi tinggi ke rendah)
- **Difusi sederhana** — Molekul kecil (O₂, CO₂, asam lemak) langsung menembus lapisan fosfolipid.
- **Difusi terfasilitasi** — Dibantu protein: **saluran protein (channel)** untuk ion, **protein pembawa (carrier)** untuk glukosa dan asam amino (contoh GLUT). Carrier berubah bentuk saat memindahkan zat.
- **Osmosis** — Perpindahan **air** melalui membran semipermeabel dari larutan hipotonik (zat terlarut sedikit) ke larutan hipertonik (zat terlarut banyak). "Gampangnya: air bergerak ke tempat yang lebih pekat."
- Tabel "Zat apa lewat mana?": O₂/CO₂ → difusi sederhana · air → osmosis · glukosa/asam amino → difusi terfasilitasi · ion Na⁺/K⁺ → saluran protein (pasif) atau pompa ion (aktif) · molekul besar (enzim, hormon) → endositosis/eksositosis.
- Jenis protein pembawa: **uniport** (1 zat, 1 arah), **simport** (2 zat, arah sama), **antiport** (2 zat, arah berlawanan).

### 4.3 Pompa Na⁺/K⁺ (transpor aktif primer — langsung memakai ATP, melawan gradien konsentrasi)
Legenda: Na⁺ = bola oranye · K⁺ = kubus merah · ATP = bintang kuning.
1. 3 ion Na⁺ dari sitoplasma menempel pada protein pompa.
2. ATP memberi gugus fosfat pada protein (fosforilasi), sehingga bentuk protein berubah.
3. 3 Na⁺ dilepas ke luar sel.
4. 2 K⁺ dari luar sel menempel pada protein pompa.
5. Menempelnya K⁺ membuat gugus fosfat terlepas; protein kembali ke bentuk awal.
6. 2 K⁺ dilepas ke dalam sel. Siklus diulang.
- Ringkasan: setiap siklus memindahkan **3 Na⁺ keluar dan 2 K⁺ masuk, memakai 1 ATP**.
- Catatan muatan: tiap siklus mengeluarkan lebih banyak muatan positif daripada yang masuk (slide: transpor aktif dipengaruhi muatan listrik di dalam dan luar sel).
- **Penulisan yang benar: Na⁺/K⁺ (bukan Na3+).**

### 4.4 Transpor aktif lain
- **Endositosis** — memasukkan zat dengan vesikel: **fagositosis** (zat padat, contoh sel darah putih memakan bakteri), **pinositosis** (zat cair), **endositosis dengan reseptor** (contoh masuknya kolesterol LDL). Vesikel kemudian menuju lisosom.
- **Eksositosis** — vesikel dari badan Golgi bergerak ke membran, menyatu, lalu isinya dikeluarkan. Contoh: sel pankreas mengeluarkan insulin; pelepasan hormon, enzim pencernaan, neurotransmiter, antibodi.
- **Kotranspor (transpor aktif sekunder)** — zat "menumpang" perbedaan konsentrasi yang dibuat pompa, tidak memakai ATP secara langsung. Contoh: sukrosa masuk ke sel tumbuhan bersama ion H⁺ (pompa proton).

---

## 5. Osmosis pada sel (halaman Lab Osmosis — lab-osmosis.html)

| Larutan | Sel hewan (sel darah merah) | Sel tumbuhan (epidermis bawang merah) |
|---|---|---|
| Hipotonik | **Lisis (hemolisis)** | **Turgid** |
| Isotonik | **Normal** | **Flaksid** |
| Hipertonik | **Krenasi** | **Plasmolisis** |

**Sel hewan**
- *Lisis* — Arah air: masuk ke dalam sel. Mengapa: zat terlarut di luar sel lebih sedikit; sel hewan tidak punya dinding sel, jadi sel terus membengkak lalu pecah. Contoh nyata: infus memakai larutan garam 0,9%, bukan air murni, agar sel darah merah tidak pecah.
- *Normal* — Arah air: masuk dan keluar seimbang. Mengapa: konsentrasi di dalam dan di luar sel sama, bentuk sel tetap. Contoh: larutan NaCl sekitar 0,9% isotonis dengan darah manusia.
- *Krenasi* — Arah air: keluar dari sel. Mengapa: zat terlarut di luar sel lebih banyak; sel kehilangan air, mengerut, permukaannya bergerigi. Contoh: minum air laut saat haus justru membuat tubuh makin kekurangan air.

**Sel tumbuhan**
- *Turgid* — Arah air: masuk ke dalam sel. Mengapa: vakuola membesar dan membran menekan dinding sel; dinding sel menahan tekanan sehingga sel tidak pecah. Contoh: sayur layu bisa segar lagi setelah direndam air.
- *Flaksid* — Arah air: tidak ada aliran air bersih. Mengapa: konsentrasi seimbang, tekanan turgor rendah, sel lemas. Contoh: tanaman yang kurang disiram menjadi layu.
- *Plasmolisis* — Arah air: keluar dari sel. Mengapa: vakuola mengecil dan membran plasma terlepas dari dinding sel; jika segera dipindah ke air, sel bisa kembali normal (deplasmolisis). Contoh: sayur yang ditaburi garam menjadi lembek; ikan asin dan manisan awet karena garam/gula menarik air keluar dari sel bakteri dan jamur.

**Kotak "Ingat!"** — Lisis dan krenasi terjadi pada sel hewan; turgid dan plasmolisis pada sel tumbuhan. Bedanya ada pada **dinding sel**.

**Praktikum 4 cairan (opsional, hanya jika ada data praktikum kelas):** aquades, NaCl 0,1%, 0,5%, 1%. [CEK: hasil sel bawang harus dicocokkan dengan hasil praktikum kelas, bukan ditebak.]

---

## 6. Bank soal (src/data/soal.json)

- Minimal **60 soal**, ±15 per topik: `sel` (teori sel, ukuran, prokariotik/eukariotik, hewan vs tumbuhan), `organel`, `membran`, `osmosis`.
- Pilihan ganda, 4 opsi, satu jawaban benar, opsi pengecoh masuk akal. Jenis: pengetahuan, pemahaman, dan studi kasus.
- Setiap soal punya penjelasan singkat dan link halaman. Semua soal dibuat **hanya** dari §2–§5. Semua berstatus `perlu-cek` sampai Howard menyetujui.
- Pembagian ujian 25 soal: sel 4 · organel 8 · membran 7 · osmosis 6.

Contoh soal (sudah dari rancangan Pertemuan 2):
1. (organel) Bagian mitokondria berupa lipatan membran dalam untuk memperluas tempat respirasi adalah … → **krista** (pengecoh: matriks, stroma, tilakoid)
2. (membran) Dalam satu siklus, pompa Na⁺/K⁺ memindahkan … → **3 Na⁺ keluar sel dan 2 K⁺ masuk sel** (pengecoh: 2 Na⁺ keluar & 3 K⁺ masuk; 3 Na⁺ masuk & 2 K⁺ keluar; 1 Na⁺ keluar & 1 K⁺ masuk)
3. (osmosis) Sel epidermis bawang ditetesi larutan hipertonik dan membrannya terlepas dari dinding sel. Peristiwa ini disebut … → **plasmolisis** (pengecoh: krenasi, lisis, turgid)
4. (sel) Organel yang hanya ada di sel hewan adalah … → **lisosom dan sentriol** (pengecoh: kloroplas dan vakuola besar; mitokondria dan ribosom; dinding sel dan plastida)
5. (organel) Organel yang mengubah H₂O₂ menjadi H₂O dan O₂ adalah … → **peroksisom**
6. (sel) Pernyataan "setiap sel berasal dari sel sebelumnya" dikemukakan oleh … → **Rudolf Virchow**
7. (membran) Transpor glukosa melalui protein pembawa tanpa ATP disebut … → **difusi terfasilitasi**
8. (osmosis) Mengapa infus menggunakan larutan NaCl 0,9%? → **agar isotonis dengan darah sehingga sel darah merah tidak lisis/krenasi**
9. (organel) Tempat sintesis rRNA dan perakitan subunit ribosom adalah … → **nukleolus**
10. (membran) Sel darah putih memakan bakteri dengan cara … → **fagositosis**
11. (sel) Ribosom sel eukariotik berukuran … → **80S**
12. (organel) Organel yang membentuk benang spindel saat pembelahan sel hewan adalah … → **sentriol**

---

## 7. Rangkuman (halaman rangkuman.html)
1. **Sel** — Unit struktural & fungsional terkecil makhluk hidup; setiap sel berasal dari sel sebelumnya; prokariotik (tanpa membran inti) vs eukariotik (nukleus sejati, organel bermembran).
2. **Sel Hewan & Tumbuhan** — 6 perbedaan utama (tabel §1 Adegan 7).
3. **Organel** — Fungsi tiap organel dalam satu baris, dikelompokkan: membran ganda (nukleus, mitokondria, kloroplas) · membran tunggal (RE, Golgi, lisosom, peroksisom, vakuola) · tidak bermembran (ribosom, sentriol).
4. **Membran & Transpor** — Pasif: difusi sederhana, difusi terfasilitasi, osmosis. Aktif: pompa Na⁺/K⁺ (3 keluar, 2 masuk, 1 ATP), kotranspor, endositosis, eksositosis.
5. **Osmosis** — Tabel 6 keadaan (§5).

---

## 8. Identitas & anggota (halaman rangkuman.html)
- **Anggota Kelompok 4 · XI-A5:**
  - 17 — Gavin Maruli Wilianata
  - 19 — Greg Nigel Kenjiro Pardede
  - 20 — Howard Leonhart Junaedi (ketua) [CEK ejaan: file Pertemuan 2 menulis "Juneadi"]
  - 21 — Jaden Sutedja
  - 33 — Raphael Krisna Rahardian
- Sekolah: Kolese Kanisius, Jakarta · Tahun pelajaran 2025/2026 · Mata pelajaran: Biologi & Web Development
- Guru: [ISI nama guru Biologi] · [ISI nama guru Web Development]
- Pernyataan AI: "Website ini dibuat dengan bantuan Claude Code dari Anthropic menggunakan model Opus 5.5 dan Fable 5.2, serta Codex dari OpenAI menggunakan model Astra 6, Sol 6.1, dan Terra, sebagai asisten pemrograman. Seluruh materi telah diperiksa oleh kelompok berdasarkan slide guru dan sumber yang dicantumkan."

---

## 9. Hal yang perlu dicek ke guru (salin ke docs/CEK-MATERI.md)
1. Ukuran sel prokariotik: 0,5–1 µm atau 1–10 µm (slide BAB 1 berbeda di dua tempat).
2. Kadar air sel: 70–85% (SEL Update 2) atau "+90%" (BAB 1).
3. Lisosom pada sel tumbuhan: "tidak ada" vs "jarang; vakuola tengah dapat berperan seperti lisosom".
4. Sentriol pada sel tumbuhan: "tidak ada" vs "biasanya tidak ada".
5. Fakta karang (hewan dengan alga di selnya) dan lamun (tumbuhan berbunga) — tambahkan sumber tepercaya.
6. Protein carrier: slide menyebut untuk transpor aktif, slide lain untuk difusi terfasilitasi — website menjelaskan keduanya.
7. Hasil sel bawang pada NaCl 0,5% dan 1% — cocokkan dengan data praktikum kelas.

---

## 10. Sumber (untuk credits.json kategori "materi")
- Slide guru "BAB 1 SEL" — Biologi XI, TP 25/26, Guru Biologi SMA Kristen 1 BPK Penabur.
- Slide guru "SEL Update 2" — Biologi XI, Kolese Kanisius.
- Rangkuman Biologi Sel — Kelompok 4.
- Rancangan Website Sel Kelompok 4 (Pertemuan 2).
- Genetic Science Learning Center, University of Utah — "Cell Size and Scale", https://learn.genetics.utah.edu/content/cells/scale/
- (Tambahkan buku paket Biologi kelas XI yang dipakai sekolah: penulis, judul, penerbit, tahun.)
