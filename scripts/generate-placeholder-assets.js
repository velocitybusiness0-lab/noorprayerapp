/**
 * Generates Miraj placeholder PNG assets (icon, splash, notification).
 * Run: `node scripts/generate-placeholder-assets.js`
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

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
      const [r, g, b, a] = getPixel(x, y, width, height);
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

const BG = [11, 11, 12, 255];
const FG = [247, 244, 239, 255];
const ACCENT = [107, 158, 136, 255];

function dist(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function inCircle(x, y, cx, cy, r) {
  return dist(x, y, cx, cy) <= r;
}

function inRing(x, y, cx, cy, inner, outer) {
  const d = dist(x, y, cx, cy);
  return d >= inner && d <= outer;
}

/** Simple crescent + star mark for Miraj. */
function mirajMarkPixel(x, y, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const scale = width / 1024;
  const outerR = 250 * scale;
  const innerR = 190 * scale;
  const cutCx = cx + 70 * scale;
  const cutCy = cy - 20 * scale;
  const cutR = 210 * scale;

  const crescent =
    inRing(x, y, cx, cy, innerR, outerR) && !inCircle(x, y, cutCx, cutCy, cutR);

  const starCx = cx + 150 * scale;
  const starCy = cy - 90 * scale;
  const star = inCircle(x, y, starCx, starCy, 28 * scale);

  if (crescent || star) return FG;
  return null;
}

function solidPixel(color) {
  return () => color;
}

function brandedPixel() {
  return (x, y, width, height) => mirajMarkPixel(x, y, width, height) ?? BG;
}

function splashPixel() {
  return (x, y, width, height) => {
    const mark = mirajMarkPixel(x, y, width, height);
    if (mark) return mark;
    return BG;
  };
}

function notificationPixel() {
  return (x, y, width, height) => {
    const mark = mirajMarkPixel(x, y, width, height);
    if (mark) return [255, 255, 255, 255];
    return [0, 0, 0, 0];
  };
}

const outDir = path.join(__dirname, "..", "assets", "images");
fs.mkdirSync(outDir, { recursive: true });

const assets = [
  { name: "icon.png", w: 1024, h: 1024, pixel: brandedPixel() },
  { name: "adaptive-icon.png", w: 1024, h: 1024, pixel: brandedPixel() },
  { name: "splash.png", w: 1242, h: 2436, pixel: splashPixel() },
  { name: "notification-icon.png", w: 96, h: 96, pixel: notificationPixel() },
  { name: "favicon.png", w: 48, h: 48, pixel: brandedPixel() },
];

for (const asset of assets) {
  fs.writeFileSync(
    path.join(outDir, asset.name),
    encodePng(asset.w, asset.h, asset.pixel)
  );
  console.log("wrote", asset.name);
}
