// Cadangan tanpa WebGL: frame digambar ke <canvas> biasa dengan drawImage.
// Potongan gambar dihitung manual supaya hasilnya seperti CSS object-fit: cover.
const MAX_PIXEL_RATIO = 1.5;

export function createCanvasDrawer(canvas) {
  const context = canvas.getContext('2d');
  let current = null;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    if (current) draw(current, true);
  }

  function draw(image, force = false) {
    if (!image || (image === current && !force)) return;
    current = image;
    const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const width = canvas.width / scale;
    const height = canvas.height / scale;
    const sx = (image.naturalWidth - width) / 2;
    const sy = (image.naturalHeight - height) / 2;
    context.drawImage(image, sx, sy, width, height, 0, 0, canvas.width, canvas.height);
  }

  resize();
  return { draw, resize };
}
