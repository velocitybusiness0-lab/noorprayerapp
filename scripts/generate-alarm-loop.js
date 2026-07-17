const fs = require("fs");
const path = require("path");

function buildAlarmLoopWav() {
  const sampleRate = 8000;
  const durationSec = 0.9;
  const frequencyHz = 880;
  const sampleCount = Math.floor(sampleRate * durationSec);
  const dataSize = sampleCount * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  const writeString = (offset, value) => {
    buffer.write(value, offset, value.length, "ascii");
  };

  writeString(0, "RIFF");
  buffer.writeUInt32LE(36 + dataSize, 4);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  writeString(36, "data");
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / sampleRate;
    const envelope = i < sampleRate * 0.05 ? i / (sampleRate * 0.05) : 1;
    const sample = Math.sin(2 * Math.PI * frequencyHz * t) * 0.35 * envelope;
    buffer.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
  }

  return buffer;
}

const outDir = path.join(__dirname, "..", "assets", "sounds");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "alarm_loop.wav"), buildAlarmLoopWav());
console.log("Wrote assets/sounds/alarm_loop.wav");
