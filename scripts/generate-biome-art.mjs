// Original procedural pixel-art biome scenes (64x36 blocks -> 256x144 PNG).
// All art generated in code by Minepedia - no Mojang assets.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const W = 64, H = 36, BS = 4;
const hex = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mul = (c, f) => [Math.min(255, c[0] * f | 0), Math.min(255, c[1] * f | 0), Math.min(255, c[2] * f | 0)];
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t | 0, a[1] + (b[1] - a[1]) * t | 0, a[2] + (b[2] - a[2]) * t | 0];
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

class Scene {
  constructor(seed = 7) { this.g = new Array(W * H).fill(null); this.r = rng(seed); }
  b(x, y, c) { x |= 0; y |= 0; if (x < 0 || x >= W || y < 0 || y >= H) return; this.g[y * W + x] = c; }
  get(x, y) { return (x >= 0 && x < W && y >= 0 && y < H) ? this.g[y * W + x] : null; }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.b(x + i, y + j, c); }
  sky(top, bottom, y0 = 0, y1 = 24) { for (let y = y0; y < y1; y++) this.rect(0, y, W, 1, mix(top, bottom, (y - y0) / (y1 - y0))); }
  sun(x, y, c) { this.rect(x - 2, y - 1, 5, 3, c); this.rect(x - 1, y - 2, 3, 5, c); }
  cloud(x, y, c) { this.rect(x, y, 6, 1, c); this.rect(x + 1, y - 1, 3, 1, c); this.rect(x + 7, y, 2, 1, mul(c, 0.92)); }
  // terrain from column height fn; top block topC, under underC, deep deepC; dither for texture
  terrain(hfn, topC, underC, deepC, topDepth = 1) {
    this.heights = [];
    for (let x = 0; x < W; x++) {
      const h = Math.round(hfn(x));
      this.heights.push(h);
      for (let y = h; y < H; y++) {
        let c = y < h + topDepth ? topC : y < h + 5 ? underC : deepC;
        if (this.r() < 0.22) c = mul(c, 0.86 + this.r() * 0.1);
        this.b(x, y, c);
      }
    }
  }
  flat(h) { return () => h; }
  hill(base, amp, wl, ph = 0) { return x => base + Math.sin(x / wl + ph) * amp + Math.sin(x / (wl * 0.37) + ph * 2) * amp * 0.4; }
  oak(x, trunkC, leafC, th = 4, r = 2) {
    const gy = this.heights ? this.heights[x] : 24;
    this.rect(x, gy - th, 1, th, trunkC);
    for (let dy = -r; dy <= 0; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.abs(dx) + Math.abs(dy) > r + 1) continue;
      if (!this.get(x + dx, gy - th + dy)) this.b(x + dx, gy - th + dy, mul(leafC, 0.85 + this.r() * 0.3));
    }
    this.b(x, gy - th - r - 1, leafC);
  }
  spruce(x, trunkC, leafC, th = 7) {
    const gy = this.heights ? this.heights[x] : 24;
    this.rect(x, gy - th, 1, th, trunkC);
    for (let i = 0; i < th - 1; i++) { const w2 = i % 2 === 0 ? 2 : 1; this.rect(x - w2, gy - th + 1 + i, w2 * 2 + 1, 1, mul(leafC, 0.85 + this.r() * 0.2)); }
    this.b(x, gy - th, leafC);
  }
  acacia(x, trunkC, leafC) {
    const gy = this.heights ? this.heights[x] : 24;
    this.rect(x, gy - 5, 1, 5, trunkC);
    this.rect(x - 3, gy - 6, 7, 1, leafC); this.rect(x - 2, gy - 7, 5, 1, mul(leafC, 1.08));
    this.b(x - 2, gy - 5, leafC); this.b(x + 2, gy - 5, leafC);
  }
  cactus(x, h = 3) { const gy = this.heights[x]; this.rect(x, gy - h, 1, h, hex('#3f7a3f')); this.b(x, gy - h, hex('#4f8a4f')); }
  deadbush(x) { const gy = this.heights[x]; this.b(x, gy - 1, hex('#8a6a3a')); this.b(x - 1, gy - 1, mul(hex('#8a6a3a'), 0.9)); this.b(x + 1, gy - 1, mul(hex('#8a6a3a'), 0.9)); }
  flower(x, c) { const gy = this.heights[x]; this.b(x, gy - 1, c); this.b(x, gy - 2, mul(c, 1.15)); }
  bigMushroom(x, capC, stemC, h = 5) {
    const gy = this.heights[x];
    this.rect(x, gy - h, 1, h, stemC);
    this.rect(x - 2, gy - h - 2, 5, 2, capC);
    this.rect(x - 1, gy - h - 3, 3, 1, mul(capC, 1.1));
    [[-1, -2], [1, -2], [0, -3]].forEach(([dx, dy]) => this.b(x + dx, gy - h + dy, hex('#f1f3f6')));
  }
  pillar(x, wdt, hTop, c) { const gy = this.heights[x]; for (let i = 0; i < wdt; i++) this.rect(x + i, gy - hTop + (i === 0 || i === wdt - 1 ? 2 : 0), 1, hTop, mul(c, 0.9 + this.r() * 0.2)); }
  spikes(x, h, c) { const gy = this.heights[x]; for (let i = 0; i < h; i++) { const wdt = i < h * 0.4 ? 2 : 1; this.rect(x, gy - i, wdt, 1, mul(c, 0.9 + this.r() * 0.2)); } }
  lavaPool(x0, wdt, y) { this.rect(x0, y, wdt, 1, hex('#f7a83f')); this.rect(x0, y + 1, wdt, 1, hex('#e8762a')); this.rect(x0 - 1, y, 1, 2, hex('#3a3d42')); this.rect(x0 + wdt, y, 1, 2, hex('#3a3d42')); }
  water(x0, wdt, y, c) { this.rect(x0, y, wdt, 2, c); this.rect(x0, y, wdt, 1, mul(c, 1.2)); }
  toPNG() {
    const data = new Uint8ClampedArray(W * BS * H * BS * 4);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const c = this.g[y * W + x] || [0, 0, 0];
      for (let sy = 0; sy < BS; sy++) for (let sx = 0; sx < BS; sx++) {
        const di = ((y * BS + sy) * W * BS + (x * BS + sx)) * 4;
        data[di] = c[0]; data[di + 1] = c[1]; data[di + 2] = c[2]; data[di + 3] = 255;
      }
    }
    return encodePNG(W * BS, H * BS, data);
  }
}

const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf) { let c = 0xffffffff; for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function encodePNG(w, h, data) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(data.buffer, y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  const chunk = (type, d) => { const len = Buffer.alloc(4); len.writeUInt32BE(d.length); const t = Buffer.from(type); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, d]))); return Buffer.concat([len, t, d, crc]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

const SCENES = {
  'plains': S => { S.sky(hex('#6aa8e0'), hex('#cfe8f7')); S.sun(52, 4, hex('#f7e08a')); S.cloud(10, 3, hex('#f4f8fb')); S.cloud(30, 6, hex('#eef4f9')); S.cloud(45, 2, hex('#f4f8fb'));
    S.terrain(S.hill(26, 1.5, 9), hex('#6faf3f'), hex('#8a5a2b'), hex('#6e4520'));
    S.oak(12, hex('#6b4f2a'), hex('#4f8a2f')); S.oak(40, hex('#6b4f2a'), hex('#5a9a35'), 5, 2); S.oak(55, hex('#6b4f2a'), hex('#4f8a2f'), 3, 2);
    S.flower(20, hex('#e63946')); S.flower(26, hex('#ffd166')); S.flower(48, hex('#f1f3f6')); S.flower(33, hex('#e63946')); },
  'desert': S => { S.sky(hex('#e8c98f'), hex('#f7ecc8')); S.sun(14, 4, hex('#f7d774'));
    S.terrain(S.hill(26, 2, 7), hex('#e3cf8f'), hex('#d4b96a'), hex('#b39a52'));
    S.rect(40, 20, 10, 2, hex('#d4b96a')); // sandstone ridge
    S.cactus(10, 3); S.cactus(24, 4); S.cactus(52, 2); S.deadbush(18); S.deadbush(34); S.deadbush(58); },
  'badlands': S => { S.sky(hex('#e8b98a'), hex('#f7e0b8')); S.sun(50, 4, hex('#f7d774'));
    // mesa: layered plateaus
    S.terrain(S.flat(28), hex('#b3562f'), hex('#8f3d21'), hex('#6e2c18'));
    S.rect(4, 22, 16, 6, hex('#c97a3f')); S.rect(4, 22, 16, 1, hex('#d9a05b'));
    S.rect(4, 25, 16, 1, hex('#8f3d21')); S.rect(4, 27, 16, 1, hex('#d9a05b'));
    S.rect(28, 24, 12, 4, hex('#b3562f')); S.rect(28, 24, 12, 1, hex('#d9a05b'));
    S.rect(46, 21, 14, 7, hex('#c97a3f')); S.rect(46, 21, 14, 1, hex('#d9a05b')); S.rect(46, 24, 14, 1, hex('#8f3d21')); S.rect(46, 26, 14, 1, hex('#d9a05b'));
    S.rect(0, 28, W, 2, hex('#c9653a')); // red sand floor
    S.cactus(24, 3); S.deadbush(42); S.deadbush(14); },
  'mushroom-fields': S => { S.sky(hex('#8fa4b8'), hex('#c4d2de')); S.cloud(8, 3, hex('#dde6ee')); S.cloud(40, 5, hex('#dde6ee'));
    S.terrain(S.hill(27, 1.5, 8), hex('#8d7d8c'), hex('#7d6d7c'), hex('#5e525e'));
    S.bigMushroom(14, hex('#c1121f'), hex('#e0d5c9')); S.bigMushroom(34, hex('#8a6a4a'), hex('#e0d5c9'), 4); S.bigMushroom(50, hex('#c1121f'), hex('#e0d5c9'), 6);
    S.flower(24, hex('#c1121f')); S.flower(60, hex('#8a6a4a')); },
  'cherry-grove': S => { S.sky(hex('#8fc4e8'), hex('#e8f2f9')); S.cloud(12, 3, hex('#ffffff')); S.cloud(44, 5, hex('#f4f8fb'));
    // mountains w/ snow behind
    for (let x = 0; x < W; x++) { const h = 20 + Math.sin(x / 6) * 4; S.rect(x, Math.round(h), 1, H - Math.round(h), hex('#8d949c')); }
    for (let x = 0; x < W; x++) { const h = 20 + Math.sin(x / 6) * 4; if ((x * 7) % 11 < 5) S.b(x, Math.round(h), hex('#eef4f8')); }
    S.terrain(S.hill(28, 1, 8), hex('#7fbf5f'), hex('#8a5a2b'), hex('#6e4520'));
    const cherry = (x) => { const gy = S.heights[x]; S.rect(x, gy - 4, 1, 4, hex('#5c4033'));
      for (let dy = -3; dy <= -1; dy++) for (let dx = -3; dx <= 3; dx++) { if (Math.abs(dx) + Math.abs(dy + 2) > 4) continue; S.b(x + dx, gy - 3 + dy, mul(hex('#f7a8c4'), 0.9 + S.r() * 0.25)); }
      S.b(x, gy - 7, hex('#f7a8c4')); };
    cherry(14); cherry(30); cherry(48);
    [10, 22, 38, 55, 60].forEach(x => S.flower(x, hex('#f7a8c4'))); },
  'swamp': S => { S.sky(hex('#8fa38a'), hex('#c9d4c0'));
    S.terrain(S.hill(27, 1, 7), hex('#5a6e3f'), hex('#4a3b2f'), hex('#3a2f25'));
    S.water(8, 14, 27, hex('#3a4a2f')); S.water(36, 16, 28, hex('#3a4a2f'));
    const swampOak = x => { const gy = 25; S.rect(x, gy - 4, 1, 4, hex('#5c4033'));
      for (let dy = -2; dy <= 0; dy++) for (let dx = -2; dx <= 2; dx++) S.b(x + dx, gy - 4 + dy, mul(hex('#4a6e2f'), 0.85 + S.r() * 0.3));
      S.rect(x - 2, gy - 2, 1, 3, hex('#3f5e27')); S.rect(x + 2, gy - 2, 1, 2, hex('#3f5e27')); }; // vines
    swampOak(16); swampOak(44);
    [[10],[13],[39],[44]].forEach(([x]) => S.b(x, 26, hex('#4f7a2f'))); }, // lily pads
  'windswept-hills': S => { S.sky(hex('#6aa8e0'), hex('#d8ecf7')); S.cloud(20, 3, hex('#f4f8fb'));
    for (let x = 0; x < W; x++) { const h = 18 + Math.sin(x / 5) * 6 + Math.sin(x / 2.3) * 2; S.rect(x, Math.round(h), 1, H, mul(hex('#7d8894'), 0.85 + ((x * 13) % 7) / 22)); }
    for (let x = 0; x < W; x++) { const h = 18 + Math.sin(x / 5) * 6 + Math.sin(x / 2.3) * 2; if (h < 16) { S.b(x, Math.round(h), hex('#eef4f8')); S.b(x, Math.round(h) + 1, hex('#e0e8f0')); } }
    S.heights = Array.from({ length: W }, (_, x) => Math.round(18 + Math.sin(x / 5) * 6 + Math.sin(x / 2.3) * 2));
    S.spruce(16, hex('#4a3520'), hex('#2f5e2f'), 6); S.spruce(48, hex('#4a3520'), hex('#2f5e2f'), 5); },
  'forest': S => { S.sky(hex('#6aa8e0'), hex('#cfe8f7')); S.sun(54, 4, hex('#f7e08a')); S.cloud(8, 4, hex('#f4f8fb'));
    S.terrain(S.hill(27, 1, 8), hex('#5f9f37'), hex('#8a5a2b'), hex('#6e4520'));
    S.oak(8, hex('#6b4f2a'), hex('#3f7a27'), 5, 2); S.oak(20, hex('#e8e2d0'), hex('#5f9f37'), 5, 2); S.oak(32, hex('#6b4f2a'), hex('#4f8a2f'), 6, 3);
    S.oak(44, hex('#e8e2d0'), hex('#5f9f37'), 4, 2); S.oak(56, hex('#6b4f2a'), hex('#3f7a27'), 5, 2);
    S.flower(15, hex('#e63946')); S.flower(39, hex('#ffd166')); },
  'savanna': S => { S.sky(hex('#e8c98f'), hex('#f2e6c4')); S.sun(12, 4, hex('#f7d774'));
    S.terrain(S.hill(27, 1, 9), hex('#b5a648'), hex('#8a5a2b'), hex('#6e4520'));
    S.rect(44, 22, 14, 6, hex('#9a8a4a')); S.rect(44, 22, 14, 1, hex('#b5a648')); // plateau
    S.acacia(14, hex('#b06a2f'), hex('#6f9a2f')); S.acacia(34, hex('#b06a2f'), hex('#7aa335')); S.acacia(52, hex('#b06a2f'), hex('#6f9a2f')); },
  'ice-spikes': S => { S.sky(hex('#a8cfe4'), hex('#e8f2f9')); S.cloud(30, 3, hex('#ffffff'));
    S.terrain(S.flat(28), hex('#eef4f8'), hex('#dce8f0'), hex('#b8d0e0'));
    S.spikes(10, 10, hex('#a8ddf0')); S.spikes(20, 6, hex('#7fc4e8')); S.spikes(30, 12, hex('#a8ddf0')); S.spikes(42, 7, hex('#7fc4e8')); S.spikes(52, 9, hex('#a8ddf0'));
    S.rect(0, 27, W, 1, hex('#f4f8fb')); },
  'mangrove-swamp': S => { S.sky(hex('#8fae94'), hex('#d4e2d0'));
    S.terrain(S.flat(28), hex('#4a3b2f'), hex('#3d3227'), hex('#2f271f'));
    S.water(0, 20, 27, hex('#3d5a45')); S.water(38, 26, 27, hex('#3d5a45'));
    const mangrove = x => { const gy = 26;
      S.rect(x, gy - 5, 1, 5, hex('#6b3d2a'));
      S.rect(x - 2, gy - 1, 1, 1, hex('#6b3d2a')); S.rect(x + 2, gy - 1, 1, 1, hex('#6b3d2a'));
      S.rect(x - 1, gy - 2, 1, 2, hex('#5c3323')); S.rect(x + 1, gy - 2, 1, 2, hex('#5c3323')); // prop roots
      for (let dy = -3; dy <= -1; dy++) for (let dx = -3; dx <= 3; dx++) { if (Math.abs(dx) + Math.abs(dy + 2) > 4) continue; S.b(x + dx, gy - 5 + dy, mul(hex('#3f7a3f'), 0.85 + S.r() * 0.3)); } };
    mangrove(12); mangrove(34); mangrove(52);
    [[6],[24],[42],[58]].forEach(([x]) => S.b(x, 26, hex('#4f7a2f'))); },
  'dripstone-caves': S => { S.rect(0, 0, W, H, hex('#23262c'));
    S.rect(0, 0, W, 6, hex('#3a3f45')); // ceiling
    for (let x = 0; x < W; x++) if ((x * 7) % 5 < 2) S.b(x, 6, mul(hex('#3a3f45'), 0.85));
    S.rect(0, 30, W, 6, hex('#4a4f57')); // floor
    const stal = (x, len, dir) => { for (let i = 0; i < len; i++) { const wdt = i < len * 0.4 ? 2 : 1; S.rect(x, dir > 0 ? 6 + i : 30 - i, wdt, 1, mul(hex('#a8927a'), 0.85 + S.r() * 0.25)); } };
    stal(10, 7, 1); stal(22, 5, 1); stal(38, 8, 1); stal(52, 5, 1);
    stal(16, 6, -1); stal(30, 8, -1); stal(46, 6, -1);
    S.rect(8, 32, 12, 2, hex('#2f5a6e')); // water
    S.rect(40, 33, 10, 1, hex('#2f5a6e'));
    [[12, 29], [36, 29], [56, 29]].forEach(([x, y]) => { S.b(x, y, hex('#c4b08a')); }); },
  'crimson-forest': S => { S.sky(hex('#4a1a1a'), hex('#2e0f0f'), 0, 30);
    S.terrain(S.flat(29), hex('#8f2a3d'), hex('#6e2a2a'), hex('#4a1a1a'));
    const fungus = (x, h) => { const gy = S.heights[x]; S.rect(x, gy - h, 2, h, hex('#7a3a4d'));
      S.rect(x - 3, gy - h - 2, 8, 2, hex('#b3384e')); S.rect(x - 2, gy - h - 3, 6, 1, mul(hex('#b3384e'), 1.1));
      S.rect(x - 2, gy - h, 1, 3, hex('#d4566a')); S.rect(x + 3, gy - h, 1, 2, hex('#d4566a')); }; // shroomlights/vines
    fungus(14, 8); fungus(34, 6); fungus(52, 9);
    [[8, 28], [24, 28], [44, 28], [58, 28]].forEach(([x, y]) => S.b(x, y, hex('#b3384e'))); // roots
  },
  'warped-forest': S => { S.sky(hex('#14302e'), hex('#0c1e1c'), 0, 30);
    S.terrain(S.flat(29), hex('#1f8a76'), hex('#3a4a3f'), hex('#24302a'));
    const fungus = (x, h) => { const gy = S.heights[x]; S.rect(x, gy - h, 2, h, hex('#3a8a7d'));
      S.rect(x - 3, gy - h - 2, 8, 2, hex('#22b8a0')); S.rect(x - 2, gy - h - 3, 6, 1, mul(hex('#22b8a0'), 1.1));
      S.rect(x - 2, gy - h, 1, 4, hex('#4fe0c8')); S.rect(x + 3, gy - h, 1, 3, hex('#4fe0c8')); };
    fungus(16, 9); fungus(38, 7); fungus(54, 8);
    [[6, 28], [26, 28], [48, 28]].forEach(([x, y]) => S.b(x, y, hex('#4fe0c8'))); },
  'soul-sand-valley': S => { S.sky(hex('#4a4a55'), hex('#33333c'), 0, 30);
    S.terrain(S.hill(29, 1, 6), hex('#52402f'), hex('#46362a'), hex('#382c20'));
    S.pillar(12, 2, 8, hex('#4a4f57')); S.pillar(30, 3, 11, hex('#3d4148')); S.pillar(50, 2, 7, hex('#4a4f57'));
    // soul flames
    [[20, 28], [26, 27], [40, 28], [57, 28]].forEach(([x, y]) => { S.b(x, y, hex('#6fc3df')); S.b(x, y - 1, hex('#a8e0f0')); });
    // fossil arch
    S.rect(42, 22, 1, 6, hex('#e8e2d0')); S.rect(48, 22, 1, 6, hex('#e8e2d0')); S.rect(42, 22, 7, 1, hex('#e8e2d0')); },
  'basalt-deltas': S => { S.sky(hex('#232327'), hex('#17171a'), 0, 30);
    S.terrain(S.flat(30), hex('#2a2d33'), hex('#23262c'), hex('#1a1c21'));
    S.pillar(8, 2, 9, hex('#3a3d42')); S.pillar(20, 1, 5, hex('#44484e')); S.pillar(32, 3, 12, hex('#3a3d42')); S.pillar(48, 2, 7, hex('#44484e')); S.pillar(58, 1, 10, hex('#3a3d42'));
    S.lavaPool(22, 8, 31); S.lavaPool(50, 6, 31);
    [[14, 29], [38, 29], [55, 29]].forEach(([x, y]) => S.b(x, y, hex('#e8762a'))); // magma glow
  }
};

const outDir = 'public/biome-art';
fs.mkdirSync(outDir, { recursive: true });
const made = [];
for (const [slug, fn] of Object.entries(SCENES)) {
  const S = new Scene(slug.length * 131 + 17);
  fn(S);
  fs.writeFileSync(path.join(outDir, slug + '.png'), S.toPNG());
  made.push(slug);
}
// contact sheet: 4 cols
const cols = 4, rows = Math.ceil(made.length / cols), cw = W * BS, ch = H * BS;
const sheet = new Uint8ClampedArray(cols * cw * rows * ch * 4);
made.forEach((slug, i) => {
  const png = fs.readFileSync(path.join(outDir, slug + '.png'));
  // re-render instead of decoding: just re-run scene
  const S = new Scene(slug.length * 131 + 17); SCENES[slug](S);
  const data = S.toPNG(); // not decoded; draw directly from grid
  const ox = (i % cols) * cw, oy = Math.floor(i / cols) * ch;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = S.g[y * W + x] || [0, 0, 0];
    for (let sy = 0; sy < BS; sy++) for (let sx = 0; sx < BS; sx++) {
      const di = ((oy + y * BS + sy) * cols * cw + ox + x * BS + sx) * 4;
      sheet[di] = c[0]; sheet[di + 1] = c[1]; sheet[di + 2] = c[2]; sheet[di + 3] = 255;
    }
  }
});
fs.writeFileSync('/tmp/biome-sheet.png', encodePNG(cols * cw, rows * ch, sheet));
console.log('generated', made.length, 'biome scenes:', made.join(' '));
