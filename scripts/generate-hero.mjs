// Hero panorama: original pixel-art overworld scene (96x40 blocks -> 768x320 PNG).
import fs from 'node:fs';
import zlib from 'node:zlib';
const W = 96, H = 40, BS = 8;
const hex = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mul = (c, f) => [Math.min(255, c[0] * f | 0), Math.min(255, c[1] * f | 0), Math.min(255, c[2] * f | 0)];
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t | 0, a[1] + (b[1] - a[1]) * t | 0, a[2] + (b[2] - a[2]) * t | 0];
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const r = rng(20260922);
const g = new Array(W * H).fill(null);
const B = (x, y, c) => { x |= 0; y |= 0; if (x < 0 || x >= W || y < 0 || y >= H) return; g[y * W + x] = c; };
const R = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) B(x + i, y + j, c); };
// sky
for (let y = 0; y < 30; y++) R(0, y, W, 1, mix(hex('#5e9ede'), hex('#cfe8f7'), y / 30));
// sun + glow
R(78, 3, 5, 3, hex('#f7e08a')); R(79, 2, 3, 5, hex('#f7e08a')); R(77, 4, 7, 1, hex('#f7e08a'));
// clouds
const cloud = (x, y) => { R(x, y, 7, 1, hex('#f4f8fb')); R(x + 2, y - 1, 4, 1, hex('#ffffff')); R(x + 8, y, 3, 1, hex('#e8f0f6')); };
cloud(8, 4); cloud(30, 7); cloud(52, 3); cloud(66, 9); cloud(88, 7);
// far mountains with snow
for (let x = 0; x < W; x++) {
  const h = 17 + Math.sin(x / 7) * 5 + Math.sin(x / 3.1) * 2;
  R(x, Math.round(h), 1, H - Math.round(h), mul(hex('#8d949c'), 0.82 + ((x * 13) % 7) / 24));
  if (h < 15) { B(x, Math.round(h), hex('#eef4f8')); B(x, Math.round(h) + 1, hex('#e0e8f0')); if ((x * 7) % 9 < 3) B(x, Math.round(h) + 2, hex('#dce4ec')); }
}
// mid hills (cherry grove side, x 55-95)
for (let x = 50; x < W; x++) {
  const h = 26 + Math.sin(x / 5 + 2) * 2.5;
  for (let y = Math.round(h); y < H; y++) B(x, y, y < h + 1 ? hex('#7fbf5f') : y < h + 5 ? hex('#8a5a2b') : hex('#6e4520'));
}
const cherry = x => {
  const gy = Math.round(26 + Math.sin(x / 5 + 2) * 2.5);
  R(x, gy - 4, 1, 4, hex('#5c4033'));
  for (let dy = -3; dy <= -1; dy++) for (let dx = -3; dx <= 3; dx++) { if (Math.abs(dx) + Math.abs(dy + 2) > 4) continue; B(x + dx, gy - 3 + dy, mul(hex('#f7a8c4'), 0.9 + r() * 0.25)); }
  B(x, gy - 7, hex('#f7a8c4'));
};
cherry(58); cherry(70); cherry(82); cherry(91);
// plains (x 0-55)
const heights = [];
for (let x = 0; x < 56; x++) {
  const h = Math.round(29 + Math.sin(x / 6) * 1.5);
  heights.push(h);
  for (let y = h; y < H; y++) {
    let c = y < h + 1 ? hex('#6faf3f') : y < h + 5 ? hex('#8a5a2b') : hex('#6e4520');
    if (r() < 0.2) c = mul(c, 0.88 + r() * 0.1);
    B(x, y, c);
  }
}
// river
for (let x = 36; x < 44; x++) { const gy = heights[x]; R(x, gy - 1, 1, 2, hex('#3d7ab8')); B(x, gy - 1, hex('#5a9ad4')); }
// oak trees
const oak = (x, th, rad) => {
  const gy = heights[x];
  R(x, gy - th, 1, th, hex('#6b4f2a'));
  for (let dy = -rad; dy <= 0; dy++) for (let dx = -rad; dx <= rad; dx++) { if (Math.abs(dx) + Math.abs(dy) > rad + 1) continue; if (!g[(gy - th + dy) * W + x + dx]) B(x + dx, gy - th + dy, mul(hex('#4f8a2f'), 0.85 + r() * 0.3)); }
  B(x, gy - th - rad - 1, hex('#5a9a35'));
};
oak(8, 5, 2); oak(18, 4, 2); oak(28, 5, 2); oak(50, 4, 2);
// flowers + grass tufts
[[5, '#e63946'], [14, '#ffd166'], [23, '#f1f3f6'], [33, '#e63946'], [47, '#ffd166']].forEach(([x, c]) => { B(x, heights[x] - 1, hex(c)); });
[3, 11, 20, 26, 31, 53].forEach(x => B(x, heights[x] - 1, mul(hex('#6faf3f'), 1.15)));
// a small house
{ const gy = heights[52] ?? 28; R(52, gy - 5, 7, 5, hex('#b08a5a')); R(51, gy - 6, 9, 1, hex('#6e4520')); R(52, gy - 7, 7, 1, hex('#8a5a2b'));
  R(54, gy - 3, 2, 3, hex('#4a3520')); B(57, gy - 4, hex('#7dd3fc')); B(58, gy - 4, hex('#7dd3fc')); }
// write PNG
const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf) { let c = 0xffffffff; for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function encodePNG(w, h, data) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(data.buffer, y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  const chunk = (type, d) => { const len = Buffer.alloc(4); len.writeUInt32BE(d.length); const t = Buffer.from(type); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, d]))); return Buffer.concat([len, t, d, crc]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const data = new Uint8ClampedArray(W * BS * H * BS * 4);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const c = g[y * W + x] || [0, 0, 0];
  for (let sy = 0; sy < BS; sy++) for (let sx = 0; sx < BS; sx++) { const di = ((y * BS + sy) * W * BS + (x * BS + sx)) * 4; data[di] = c[0]; data[di+1] = c[1]; data[di+2] = c[2]; data[di+3] = 255; }
}
fs.writeFileSync('public/hero-scene.png', encodePNG(W * BS, H * BS, data));
console.log('hero scene written');
