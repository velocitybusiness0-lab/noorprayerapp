/**
 * Copy rating laurel PNGs into assets/onboarding and chroma-key light
 * grey/white backgrounds so only the black silhouette remains.
 */
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "assets", "onboarding");

const CURSOR_ASSETS = path.join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "g-App-Prayer-app",
  "assets"
);

const JOBS = [
  {
    side: "left",
    source: path.join(
      CURSOR_ASSETS,
      "c__Users_samar_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-508670f9-f61d-41bc-926c-182bc6b42ad3.png"
    ),
    dest: path.join(OUT_DIR, "rating-laurel-left.png"),
  },
  {
    side: "right",
    source: path.join(
      CURSOR_ASSETS,
      "c__Users_samar_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-c9041c4c-af89-4b34-bbaa-2606fa2fbe5c.png"
    ),
    dest: path.join(OUT_DIR, "rating-laurel-right.png"),
  },
];

class LaurelBackgroundCutter {
  static luminance(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Light grey/white → alpha 0; black silhouette stays opaque.
   * Soft edge via luminance ramp for anti-aliased fringes.
   */
  static process(png) {
    let kept = 0;
    let cleared = 0;
    const softClear = 210;
    const hardKeep = 90;

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

      let alpha;
      if (lum >= softClear) {
        alpha = 0;
      } else if (lum <= hardKeep) {
        alpha = 255;
      } else {
        alpha = Math.round(
          ((softClear - lum) / (softClear - hardKeep)) * 255
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

      // Solid black silhouette so tintColor works cleanly in RN Image.
      png.data[i] = 0;
      png.data[i + 1] = 0;
      png.data[i + 2] = 0;
      png.data[i + 3] = alpha;
      kept += 1;
    }

    return { kept, cleared };
  }

  static cutFile(source, dest) {
    if (!fs.existsSync(source)) {
      throw new Error(`Missing source: ${source}`);
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const png = PNG.sync.read(fs.readFileSync(source));
    const result = this.process(png);
    fs.writeFileSync(dest, PNG.sync.write(png));
    return {
      dest: path.relative(ROOT, dest).replace(/\\/g, "/"),
      width: png.width,
      height: png.height,
      ...result,
    };
  }
}

for (const job of JOBS) {
  const summary = LaurelBackgroundCutter.cutFile(job.source, job.dest);
  console.log(
    JSON.stringify(
      {
        side: job.side,
        file: summary.dest,
        size: `${summary.width}x${summary.height}`,
        kept: summary.kept,
        cleared: summary.cleared,
      },
      null,
      2
    )
  );
}
