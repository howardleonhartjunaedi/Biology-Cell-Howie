// Ikon garis (outline) kecil yang digambar sendiri dengan SVG, satu gaya untuk seluruh situs.
// Dipakai menggantikan karakter ⏸ ▶ yang di Windows tampil sebagai emoji berwarna.
// Ikon selalu berdampingan dengan teks, jadi diberi aria-hidden (pembaca layar membaca teksnya saja).
const PATHS = {
  play: '<path d="M7 5.5v13l11-6.5z" />',
  pause: '<path d="M8 5v14M16 5v14" />',
  restart: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" /><path d="M4.5 4.5v4.2h4.2" />',
};

export function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${PATHS[name]}</svg>`;
}

export function setIconLabel(button, name, label) {
  button.innerHTML = `${icon(name)}<span>${label}</span>`;
}
