/**
 * Copy pre-paywall stars+laurels PNG into assets/onboarding and
 * chroma-key cream/off-white background to transparent (colors preserved).
 */
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "assets", "onboarding");

const SOURCE = path.join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "g-App-Prayer-app",
  "assets",
  "c__Users_samar_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-9acbc579-e694-47ab-a768-29df79f98efc.png"
);

const DEST = path.join(OUT_DIR, "prepaywall-stars-laurels.png");

class CreamBackgroundCutter {
  static luminance(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  static chroma(r, g, b) {
    return Math.max(r, g, b) - Math.min(r, g, b);
  }

  /**
   * Cream / off-white → alpha 0; gold stars + dark laurels stay.
   * Soft edge via luminance + chroma ramp for anti-aliased fringes.
   */
  static process(png) {
    let kept = 0;
    let cleared = 0;
    const softClearLum = 205;
    const hardKeepLum = 175;
    const softClearChroma = 48;
    const hardKeepChroma = 72;

    for (let i = 0; i < png.data.length; i += 4) {
      const r = png.data[i];
      const g = png.data[i + 1];
      const b = png.data[i + 2];
      const a = png.data[i + 3];

      if (a === 0) {
        cleared += 1;
        continue;
      }

      const lum = this.luminance(r, g, b);
      const chr = this.chroma(r, g, b);

      // Saturated gold / ink always kept.
      if (chr >= hardKeepChroma || lum <= hardKeepLum) {
        kept += 1;
        continue;
      }

      // Near-white cream with low chroma → clear.
      if (lum >= softClearLum && chr <= softClearChroma) {
        png.data[i] = 0;
        png.data[i + 1] = 0;
        png.data[i + 2] = 0;
        png.data[i + 3] = 0;
        cleared += 1;
        continue;
      }

      // Soft fringe between cream and content.
      const lumT =
        lum >= softClearLum
          ? 1
          : lum <= hardKeepLum
            ? 0
            : (lum - hardKeepLum) / (softClearLum - hardKeepLum);
      const chrT =
        chr <= softClearChroma
          ? 1
          : chr >= hardKeepChroma
            ? 0
            : (hardKeepChroma - chr) / (hardKeepChroma - softClearChroma);
      const clearAmount = Math.min(1, Math.max(0, lumT * chrT));
      const alpha = Math.round(a * (1 - clearAmount));

      if (alpha < 8) {
        png.data[i] = 0;
        png.data[i + 1] = 0;
        png.data[i + 2] = 0;
        png.data[i + 3] = 0;
        cleared += 1;
        continue;
      }

      png.data[i + 3] = alpha;
      kept += 1;
    }

    return { kept, cleared };
  }

  static cropTransparent(png) {
    let minX = png.width;
    let minY = png.height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < png.height; y += 1) {
      for (let x = 0; x < png.width; x += 1) {
        const i = (png.width * y + x) << 2;
        if (png.data[i + 3] > 8) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX < 0) return png;

    const pad = 2;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(png.width - 1, maxX + pad);
    maxY = Math.min(png.height - 1, maxY + pad);

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    const cropped = new PNG({ width, height });

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const src = ((minY + y) * png.width + (minX + x)) << 2;
        const dst = (y * width + x) << 2;
        cropped.data[dst] = png.data[src];
        cropped.data[dst + 1] = png.data[src + 1];
        cropped.data[dst + 2] = png.data[src + 2];
        cropped.data[dst + 3] = png.data[src + 3];
      }
    }

    return cropped;
  }

  static cutFile(source, dest) {
    if (!fs.existsSync(source)) {
      throw new Error(`Missing source: ${source}`);
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const png = PNG.sync.read(fs.readFileSync(source));
    const result = this.process(png);
    const cropped = this.cropTransparent(png);
    fs.writeFileSync(dest, PNG.sync.write(cropped));
    return {
      dest: path.relative(ROOT, dest).replace(/\\/g, "/"),
      width: cropped.width,
      height: cropped.height,
      ...result,
    };
  }
}

const summary = CreamBackgroundCutter.cutFile(SOURCE, DEST);
console.log(JSON.stringify(summary, null, 2));
