/**
 * Chroma-key solid red/blue fills from onboarding slideshow PNGs,
 * keeping near-white artwork on a transparent alpha channel.
 */
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const ROOT = path.join(__dirname, "..");

const JOBS = [
  {
    file: "assets/onboarding/red-slide-1-momentum.png",
    key: "red",
  },
  {
    file: "assets/onboarding/red-slide-2-door.png",
    key: "red",
  },
  {
    file: "assets/onboarding/blue-slide-mountain.png",
    key: "blue",
  },
];

class SlideBackgroundCutter {
  static sampleCornerKey(png) {
    const samples = [
      this.readPixel(png, 0, 0),
      this.readPixel(png, png.width - 1, 0),
      this.readPixel(png, 0, png.height - 1),
      this.readPixel(png, png.width - 1, png.height - 1),
    ];
    return {
      r: Math.round(samples.reduce((s, p) => s + p.r, 0) / samples.length),
      g: Math.round(samples.reduce((s, p) => s + p.g, 0) / samples.length),
      b: Math.round(samples.reduce((s, p) => s + p.b, 0) / samples.length),
    };
  }

  static readPixel(png, x, y) {
    const i = (png.width * y + x) << 2;
    return {
      r: png.data[i],
      g: png.data[i + 1],
      b: png.data[i + 2],
      a: png.data[i + 3],
    };
  }

  static distance(a, b) {
    const dr = a.r - b.r;
    const dg = a.g - b.g;
    const db = a.b - b.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  static luminance(p) {
    return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
  }

  static chromaVsKey(p, key, mode) {
    if (mode === "red") {
      // Red fill is high-R / low-G / low-B; white has strong G+B.
      return (p.g + p.b) / 2 - (key.g + key.b) / 2;
    }
    // Blue fill is low-R / low-G / high-B; white has strong R+G.
    return (p.r + p.g) / 2 - (key.r + key.g) / 2;
  }

  static process(png, mode) {
    const key = this.sampleCornerKey(png);
    const bgSoft = 28;
    const fgHard = 95;
    let kept = 0;
    let cleared = 0;

    for (let y = 0; y < png.height; y += 1) {
      for (let x = 0; x < png.width; x += 1) {
        const i = (png.width * y + x) << 2;
        const pixel = {
          r: png.data[i],
          g: png.data[i + 1],
          b: png.data[i + 2],
          a: png.data[i + 3],
        };

        if (pixel.a === 0) {
          cleared += 1;
          continue;
        }

        const distKey = this.distance(pixel, key);
        const chroma = this.chromaVsKey(pixel, key, mode);
        const lum = this.luminance(pixel);
        const nearWhite =
          lum > 170 && Math.max(pixel.r, pixel.g, pixel.b) - Math.min(pixel.r, pixel.g, pixel.b) < 55;

        let alpha;
        if (distKey < bgSoft && chroma < 18) {
          alpha = 0;
        } else if (nearWhite || chroma > fgHard) {
          alpha = 255;
        } else if (chroma <= 0 && distKey < 80) {
          alpha = 0;
        } else {
          alpha = Math.round(
            Math.max(0, Math.min(255, ((chroma - 12) / (fgHard - 12)) * 255))
          );
        }

        if (alpha < 8) {
          png.data[i] = 0;
          png.data[i + 1] = 0;
          png.data[i + 2] = 0;
          png.data[i + 3] = 0;
          cleared += 1;
          continue;
        }

        // Un-mix background spill so edges become white + alpha.
        const a = alpha / 255;
        const inv = 1 - a;
        let r = (pixel.r - key.r * inv) / a;
        let g = (pixel.g - key.g * inv) / a;
        let b = (pixel.b - key.b * inv) / a;
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));

        // Pull residual tint toward neutral white/soft-gray.
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        if (maxC - minC > 12 && lum > 140) {
          const mid = (r + g + b) / 3;
          r = mid + (r - mid) * 0.15;
          g = mid + (g - mid) * 0.15;
          b = mid + (b - mid) * 0.15;
        }

        png.data[i] = Math.round(r);
        png.data[i + 1] = Math.round(g);
        png.data[i + 2] = Math.round(b);
        png.data[i + 3] = alpha;
        kept += 1;
      }
    }

    this.neutralizeFringe(png);
    return { key, kept, cleared };
  }

  /** Pull residual red/blue edge spill toward soft white/gray. */
  static neutralizeFringe(png) {
    for (let i = 0; i < png.data.length; i += 4) {
      const a = png.data[i + 3];
      if (a === 0) continue;
      let r = png.data[i];
      let g = png.data[i + 1];
      let b = png.data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const spread = max - min;
      if (spread > 25) {
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const target = Math.max(lum, Math.min(255, lum + spread * 0.35));
        r = g = b = target;
      }
      if (Math.max(r, g, b) < 90 && a < 180) {
        png.data[i] = 0;
        png.data[i + 1] = 0;
        png.data[i + 2] = 0;
        png.data[i + 3] = 0;
        continue;
      }
      png.data[i] = Math.round(r);
      png.data[i + 1] = Math.round(g);
      png.data[i + 2] = Math.round(b);
    }
  }

  static cutFile(relativePath, mode) {
    const absolute = path.join(ROOT, relativePath);
    const png = PNG.sync.read(fs.readFileSync(absolute));
    const result = this.process(png, mode);
    fs.writeFileSync(absolute, PNG.sync.write(png));
    return { file: relativePath, ...result, width: png.width, height: png.height };
  }
}

for (const job of JOBS) {
  const summary = SlideBackgroundCutter.cutFile(job.file, job.key);
  console.log(
    JSON.stringify(
      {
        file: summary.file,
        size: `${summary.width}x${summary.height}`,
        key: summary.key,
        kept: summary.kept,
        cleared: summary.cleared,
      },
      null,
      2
    )
  );
}
