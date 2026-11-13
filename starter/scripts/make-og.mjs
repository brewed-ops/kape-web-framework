// Generates public/og-default.png (1200x630) with no dependencies: a flat Black ground,
// an Ice White hairline frame and an Aurora Green bar. It is a neutral placeholder.
// To replace it: export your own 1200x630 PNG (under 300 KB) to public/og-default.png,
// or change the colors below and run `npm run make:og`.
import { writeFileSync } from 'node:fs';
import { deflateSync, crc32 } from 'node:zlib';

const W = 1200;
const H = 630;
// These hex values mirror --ink-0, --paper and --accent in src/styles/tokens.css.
const GROUND = [0x00, 0x04, 0x12];
const FRAME = [0x2a, 0x30, 0x38];
const ACCENT = [0x2b, 0xf0, 0x8a];

const px = new Uint8Array(W * H * 3);
const fill = (x0, y0, x1, y1, c) => {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) px.set(c, (y * W + x) * 3);
};
fill(0, 0, W, H, GROUND);
fill(60, 60, W - 60, 62, FRAME);
fill(60, H - 62, W - 60, H - 60, FRAME);
fill(60, 60, 62, H - 60, FRAME);
fill(W - 62, 60, W - 60, H - 60, FRAME);
fill(100, H - 160, 340, H - 148, ACCENT);

const raw = Buffer.alloc((W * 3 + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W * 3 + 1)] = 0;
  Buffer.from(px.buffer, y * W * 3, W * 3).copy(raw, y * (W * 3 + 1) + 1);
}

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // truecolor RGB
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);
writeFileSync(new URL('../public/og-default.png', import.meta.url), png);
console.log(`wrote public/og-default.png (${png.length} bytes, ${W}x${H})`);
