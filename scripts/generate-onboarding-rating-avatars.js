/**
 * Generates circular pastel avatar PNGs with initials for the rating step.
 * Run: `node scripts/generate-onboarding-rating-avatars.js`
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const SIZE = 96;
const OUT_DIR = path.join(__dirname, "..", "assets", "onboarding", "avatars");

/** Compact 5x7 uppercase glyphs for initials. */
const GLYPHS = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  M: ["10001", "11011", "10101", "10001", "10001", "10001", "10001"],
};

const AVATARS = [
  { id: "amina", initials: "AK", fill: [168, 201, 180] },
  { id: "yusuf", initials: "YR", fill: [185, 168, 208] },
  { id: "anonymous", initials: "A", fill: [196, 184, 154] },
  { id: "sara", initials: "SM", fill: [157, 188, 212] },
];

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(width, height, getPixel) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  const rows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      const i = 1 + x * 4;
      row[i] = r;
      row[i + 1] = g;
      row[i + 2] = b;
      row[i + 3] = a;
    }
    rows.push(row);
  }

  const idat = zlib.deflateSync(Buffer.concat(rows));
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

class AvatarGlyphPainter {
  static drawInitials(pixels, initials, ink) {
    const scale = 4;
    const glyphW = 5 * scale;
    const glyphH = 7 * scale;
    const gap = 3 * scale;
    const totalW = initials.length * glyphW + (initials.length - 1) * gap;
    const startX = Math.floor((SIZE - totalW) / 2);
    const startY = Math.floor((SIZE - glyphH) / 2);

    for (let letterIndex = 0; letterIndex < initials.length; letterIndex += 1) {
      const glyph = GLYPHS[initials[letterIndex]];
      if (!glyph) continue;
      const ox = startX + letterIndex * (glyphW + gap);
      for (let row = 0; row < 7; row += 1) {
        for (let col = 0; col < 5; col += 1) {
          if (glyph[row][col] !== "1") continue;
          for (let dy = 0; dy < scale; dy += 1) {
            for (let dx = 0; dx < scale; dx += 1) {
              const x = ox + col * scale + dx;
              const y = startY + row * scale + dy;
              if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) continue;
              const index = (y * SIZE + x) * 4;
              pixels[index] = ink[0];
              pixels[index + 1] = ink[1];
              pixels[index + 2] = ink[2];
              pixels[index + 3] = 255;
            }
          }
        }
      }
    }
  }

  static build(fill, initials) {
    const cx = (SIZE - 1) / 2;
    const cy = (SIZE - 1) / 2;
    const radius = SIZE / 2 - 1;
    const pixels = new Uint8Array(SIZE * SIZE * 4);
    const ink = [61, 56, 50];

    for (let y = 0; y < SIZE; y += 1) {
      for (let x = 0; x < SIZE; x += 1) {
        const index = (y * SIZE + x) * 4;
        const dist = Math.hypot(x - cx, y - cy);
        if (dist > radius + 0.5) {
          pixels[index + 3] = 0;
          continue;
        }
        const edge = Math.max(0, Math.min(1, radius + 0.5 - dist));
        pixels[index] = fill[0];
        pixels[index + 1] = fill[1];
        pixels[index + 2] = fill[2];
        pixels[index + 3] = Math.round(255 * edge);
      }
    }

    this.drawInitials(pixels, initials, ink);
    return encodePng(SIZE, SIZE, (x, y) => {
      const i = (y * SIZE + x) * 4;
      return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
    });
  }
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const avatar of AVATARS) {
  const dest = path.join(OUT_DIR, `${avatar.id}.png`);
  fs.writeFileSync(dest, AvatarGlyphPainter.build(avatar.fill, avatar.initials));
  console.log(`Wrote ${dest}`);
}
