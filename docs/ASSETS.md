# AUDIT ASET 3D

Status: **sel hewan selesai (10 Nov 2026).** Sel tumbuhan masih model buatan sendiri, menunggu file `assets-src/plant-cell.glb` dari Howard.

## Temuan awal (8 Nov 2026)
- Repo `patrickzhou1234/BiologySimulation` sudah pindah ke `BiologySimulation/BiologySimulation`.
  Lisensi repo = MIT (untuk kode). Lisensi tiap model tersimpan di metadata file .glb masing-masing dan harus dicek.
- Ukuran file di repo:

| File | Ukuran | Dipakai untuk |
|---|---|---|
| `models/animal_cell.glb` | 70,6 MB | Sel hewan (Lab Sel) |
| `models/cell_membrane.glb` | 6,7 MB | Membran (alternatif Gerbang Sel) |
| `models/golgi.glb` | 1,6 MB | Detail badan Golgi |
| `models/mitocondrias.glb` | 2,1 MB | Detail mitokondria |
| `models/rough_er.glb` | 3,7 MB | Kandidat tambahan: detail RE kasar |
| `models/smooth_er.glb` | 0,1 MB | Kandidat tambahan: detail RE halus |
| `models/phospholipid.glb` | 0,1 MB | Kandidat tambahan: fosfolipid |

## Hasil inspeksi

| Model | Lisensi di file | Mesh | Material | Segitiga | Ukuran setelah kompres | Keputusan |
|---|---|---|---|---|---|---|
| `animal_cell.glb` (montanna, "Animal cell 2.0 - annotated in English") | CC-BY-4.0 (tertulis di metadata `asset.extras`) | 2.032 → 25 | 23 → 15 | 746.049 → 180.037 | 70,6 MB → **1,8 MB** | **Dipakai** untuk sel hewan di Lab Sel |

Catatan pengunduhan: URL `patrickzhou1234/.../raw/main/...` dialihkan ke `BiologySimulation/BiologySimulation` dan cabangnya bernama `master`, bukan `main`. File diambil dari
`https://github.com/BiologySimulation/BiologySimulation/raw/master/models/animal_cell.glb` ke `assets-src/` (tidak di-commit, ada di `.gitignore`).

### Perintah kompresi
```
npx gltf-transform optimize assets-src/animal_cell.glb public/models/animal-cell.glb --compress draco --texture-compress webp --texture-size 1024 --join false --palette false --flatten false
```
Tanpa `--join false --palette false --flatten false`, gltf-transform menggabungkan semua organel menjadi 5 mesh dan mengganti warnanya dengan satu tekstur palet (hasil 0,9 MB). Organel tidak bisa disorot satu per satu, jadi tiga langkah itu dimatikan.
Ribosom (2.002 bola × 282 segitiga = 564.564 segitiga) otomatis diubah menjadi satu *instanced mesh*, sehingga ukuran turun jauh.

### Material → organel (dicek visual dengan `tools/model-preview.html`)
Nama material dan nama node di file tidak bermakna (`Material.005`, `Object_32`), jadi setiap material ditampilkan sendiri-sendiri lalu dikenali dari bentuknya.

| Material | Warna asli | Bentuk yang terlihat | Organel (`organel.json`) |
|---|---|---|---|
| `Material` | #CC4643 | mangkuk luar | `membran-plasma` |
| `Material.004` | #507E6B | lempeng datar penampang | `sitoplasma` |
| `Material.001` | #3B1862 | bola berpori | `nukleus` (selubung inti) |
| `Material.010` | #FF32DE | kubah | `nukleus` (nukleoplasma) |
| `Material.009` | #850479 | bola kecil di tengah inti | `nukleus` (nukleolus) |
| `Material.027` | #2428B2 | benang kusut di inti | `nukleus` (kromatin) |
| `Material.003` | #FFC14B | bintik di permukaan inti | `nukleus` (kompleks pori) |
| `Material.005` | #161563 | cincin bertumpuk mengelilingi inti | `re-kasar` |
| `Material.026` | #5E148C | tabung ungu bercabang | `re-halus` |
| `Material.018` | #CC0B26 | 2.002 bintik merah | `ribosom` |
| `Material.006` | #C71618 | kantong pipih bertumpuk | `golgi` |
| `Material.015` | #CC1004 | bintik merah kecil dekat Golgi | `golgi` (vesikel) |
| `Material.008` | #3028BA | 3 kapsul lavender | `mitokondria` (membran luar) |
| `Material.007` | #C7641F | lipatan oranye di dalam kapsul | `mitokondria` (krista) |
| `Material.025` | #F9DB2F | tabung kuning + bola kuning dalam satu mesh | dipecah saat dimuat: tabung → `sentriol`, bola → `lisosom` |

- Bintik sangat kecil (< 0,1 satuan, sisa titik anotasi) disembunyikan.
- **Model tidak punya peroksisom.** Peroksisom buatan sendiri (dari `cell-models.js`) ditaruh di tiga titik sitoplasma yang kosong; titiknya dicari dengan raycast dari atas.

## Keputusan
- Sel hewan Lab Sel: model montanna (CC BY 4.0), material diganti `MeshPhysicalMaterial` lab (clearcoat 0,5, roughness 0,4; membran dan sitoplasma tembus pandang).
- Model buatan sendiri tetap tampil lebih dulu dan menjadi cadangan jika file .glb gagal dimuat.
- Sel tumbuhan: menunggu file dari Howard; sementara memakai model buatan sendiri.
