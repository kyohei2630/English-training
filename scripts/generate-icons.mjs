// Generates simple PNG app icons (no external deps) using a hand-rolled PNG encoder.
// Draws a blue rounded-square background with a white block letter "E" (English) + "30".
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = chunk('IHDR', ihdrData);

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter type none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idatData = deflateSync(raw, { level: 9 });
  const idat = chunk('IDAT', idatData);
  const iend = chunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdr, idat, iend]);
}

function makeIcon(size, { maskable = false } = {}) {
  const px = new Uint8Array(size * size * 4);
  const bg = [37, 99, 235, 255]; // blue-600
  const fg = [255, 255, 255, 255];

  const set = (x, y, color) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    px[i] = color[0];
    px[i + 1] = color[1];
    px[i + 2] = color[2];
    px[i + 3] = color[3];
  };

  const pad = maskable ? Math.round(size * 0.18) : Math.round(size * 0.08);
  const radius = maskable ? 0 : Math.round(size * 0.2);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let inside = true;
      if (radius > 0) {
        const cx = x < radius ? radius : x > size - radius ? size - radius : x;
        const cy = y < radius ? radius : y > size - radius ? size - radius : y;
        if ((x < radius || x > size - radius) && (y < radius || y > size - radius)) {
          const dx = x - cx;
          const dy = y - cy;
          inside = dx * dx + dy * dy <= radius * radius;
        }
      }
      set(x, y, inside ? bg : [0, 0, 0, 0]);
    }
  }

  // Draw a simple open-book glyph using rectangles (two "pages" + spine)
  const gx = pad;
  const gy = pad;
  const gw = size - pad * 2;
  const gh = size - pad * 2;

  const barH = Math.max(2, Math.round(gh * 0.12));
  // Book cover (outer rounded rect outline effect via filled rect)
  const bookTop = gy + Math.round(gh * 0.12);
  const bookBottom = gy + gh - Math.round(gh * 0.22);
  const bookLeft = gx;
  const bookRight = gx + gw;
  const spineX = gx + Math.round(gw / 2);
  const spineW = Math.max(2, Math.round(gw * 0.02));

  const fillRect = (x0, y0, x1, y1, color) => {
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) set(x, y, color);
  };

  // pages background
  fillRect(bookLeft, bookTop, bookRight, bookBottom, fg);
  // spine
  fillRect(spineX - spineW, bookTop, spineX + spineW, bookBottom, bg);
  // page lines (left page)
  const lineGap = Math.round((bookBottom - bookTop) / 5);
  for (let i = 1; i <= 3; i++) {
    const ly = bookTop + lineGap * i;
    fillRect(bookLeft + Math.round(gw * 0.08), ly, spineX - spineW - Math.round(gw * 0.04), ly + Math.max(1, Math.round(size * 0.012)), bg);
    fillRect(spineX + spineW + Math.round(gw * 0.04), ly, bookRight - Math.round(gw * 0.08), ly + Math.max(1, Math.round(size * 0.012)), bg);
  }

  // "30" bar underneath (represents 30-min training) as a bold rounded bar
  fillRect(gx, bookBottom + Math.round(gh * 0.06), gx + gw, bookBottom + Math.round(gh * 0.06) + barH, fg);

  return encodePNG(size, size, Buffer.from(px));
}

mkdirSync(new URL('../public/icons', import.meta.url), { recursive: true });

const outputs = [
  ['icon-192.png', 192, false],
  ['icon-512.png', 512, false],
  ['icon-maskable-192.png', 192, true],
  ['icon-maskable-512.png', 512, true],
  ['apple-touch-icon.png', 180, false],
  ['favicon-32.png', 32, false],
];

for (const [name, size, maskable] of outputs) {
  const buf = makeIcon(size, { maskable });
  writeFileSync(new URL(`../public/icons/${name}`, import.meta.url), buf);
  console.log('wrote', name, size, maskable ? '(maskable)' : '');
}
