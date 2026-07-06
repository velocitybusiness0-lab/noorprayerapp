/**
 * Generates minimal solid-colour PNG placeholder assets so the Expo config
 * and prebuild have valid icon/splash images. Replace these with real art
 * later. Run: `node scripts/generate-placeholder-assets.js`
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

function solidPng(width, height, [r, g, b, a]) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const row = Buffer.alloc(1 + width * 4);
  for (let x = 0; x < width; x++) {
    row[1 + x * 4] = r;
    row[1 + x * 4 + 1] = g;
    row[1 + x * 4 + 2] = b;
    row[1 + x * 4 + 3] = a;
  }
  const raw = Buffer.concat(Array.from({ length: height }, () => row));
  const idat = zlib.deflateSync(raw);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const outDir = path.join(__dirname, "..", "assets", "images");
fs.mkdirSync(outDir, { recursive: true });

const nearBlack = [11, 11, 12, 255];
const white = [245, 245, 247, 255];

const assets = [
  { name: "icon.png", w: 1024, h: 1024, color: nearBlack },
  { name: "adaptive-icon.png", w: 1024, h: 1024, color: nearBlack },
  { name: "splash.png", w: 1242, h: 2436, color: nearBlack },
  { name: "notification-icon.png", w: 96, h: 96, color: white },
  { name: "favicon.png", w: 48, h: 48, color: nearBlack },
];

for (const a of assets) {
  fs.writeFileSync(path.join(outDir, a.name), solidPng(a.w, a.h, a.color));
  console.log("wrote", a.name);
}
