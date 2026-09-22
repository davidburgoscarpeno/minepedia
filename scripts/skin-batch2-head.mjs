// Generates original 64x64 Minecraft skin PNGs, drawn pixel by pixel in code.
// All designs are original Minepedia fan art - no Mojang textures, no third-party skins.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// ---- 64x64 skin layout (same UV map as the Skin Maker) ----
function boxFaces(x, y, dw, dh, dp) {
  return {
    top:    [x + dp, y, dw, dp],
    bottom: [x + dp + dw, y, dw, dp],
    right:  [x, y + dp, dp, dh],
    front:  [x + dp, y + dp, dw, dh],
    left:   [x + dp + dw, y + dp, dp, dh],
    back:   [x + dp + dw + dp, y + dp, dw, dh]
  };
}
const PARTS = [
  { id: 'head',   faces: boxFaces(0, 0, 8, 8, 8) },
  { id: 'hat',    faces: boxFaces(32, 0, 8, 8, 8) },
  { id: 'body',   faces: boxFaces(16, 16, 8, 12, 4) },
  { id: 'jacket', faces: boxFaces(16, 32, 8, 12, 4) },
  { id: 'rarm',   faces: boxFaces(40, 16, 4, 12, 4) },
  { id: 'rarm2',  faces: boxFaces(40, 32, 4, 12, 4) },
  { id: 'rleg',   faces: boxFaces(0, 16, 4, 12, 4) },
  { id: 'rleg2',  faces: boxFaces(0, 32, 4, 12, 4) },
  { id: 'larm',   faces: boxFaces(32, 48, 4, 12, 4) },
  { id: 'larm2',  faces: boxFaces(48, 48, 4, 12, 4) },
  { id: 'lleg',   faces: boxFaces(16, 48, 4, 12, 4) },
  { id: 'lleg2',  faces: boxFaces(0, 48, 4, 12, 4) }
];
const FACE_ORDER = ['top', 'bottom', 'right', 'front', 'left', 'back'];
const FACE_SHADE = { top: 1.12, bottom: 0.78, right: 0.9, front: 1, left: 0.95, back: 0.84 };

const hex = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255]; };
const mul = (c, f) => [Math.min(255, Math.round(c[0] * f)), Math.min(255, Math.round(c[1] * f)), Math.min(255, Math.round(c[2] * f)), c[3] ?? 255];
const mix = (a, b, t) => [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t), 255];

class Skin {
  constructor() { this.d = new Uint8ClampedArray(64 * 64 * 4); }
  px(x, y, c) { if (x < 0 || x > 63 || y < 0 || y > 63) return; const i = (y * 64 + x) * 4; this.d[i] = c[0]; this.d[i+1] = c[1]; this.d[i+2] = c[2]; this.d[i+3] = c[3] ?? 255; }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c); }
  fr(part, face) { return PARTS.find(p => p.id === part).faces[face]; }
  fpx(part, face, rx, ry, c) { const r = this.fr(part, face); this.px(r[0] + rx, r[1] + ry, c); }
  frect(part, face, rx, ry, w, h, c) { const r = this.fr(part, face); this.rect(r[0] + rx, r[1] + ry, w, h, c); }
  ffill(part, face, c) { const r = this.fr(part, face); this.rect(r[0], r[1], r[2], r[3], c); }
  base(part, c, shaded = true) { FACE_ORDER.forEach(f => this.ffill(part, f, shaded ? mul(c, FACE_SHADE[f]) : c)); }
}

// ---- shared drawing helpers ----
function eyes(S, skinC, iris = [38, 58, 92]) {
  [1, 2, 5, 6].forEach(ex => S.fpx('head', 'front', ex, 3, [255, 255, 255]));
  S.fpx('head', 'front', 2, 3, iris); S.fpx('head', 'front', 5, 3, iris);
}
function mouth(S, skinC) { S.frect('head', 'front', 3, 5, 2, 1, mul(skinC, 0.62)); }
function hair(S, style, hc) {
  if (style === 'bald') return;
  S.ffill('head', 'top', mul(hc, 1.05));
  if (style === 'buzz') return;
  S.frect('head', 'front', 0, 0, 8, 1, hc);                    // fringe
  S.frect('head', 'right', 0, 0, 8, 2, mul(hc, 0.9));
  S.frect('head', 'left', 0, 0, 8, 2, mul(hc, 0.95));
  S.frect('head', 'back', 0, 0, 8, 3, mul(hc, 0.84));
  if (style === 'long') {
    S.frect('head', 'back', 0, 3, 8, 5, mul(hc, 0.84));
    S.frect('head', 'right', 6, 2, 2, 4, mul(hc, 0.9));
    S.frect('head', 'left', 0, 2, 2, 4, mul(hc, 0.95));
  }
  if (style === 'ponytail') S.frect('head', 'back', 3, 3, 2, 5, mul(hc, 0.8));
  if (style === 'mohawk') { S.base('hat', [0,0,0,0]); S.frect('hat', 'top', 3, 0, 2, 8, hc); S.frect('head', 'top', 3, 0, 2, 8, hc); }
}
function sleeves(S, c, len = 4) {
  for (const p of ['rarm', 'larm']) ['front', 'back', 'left', 'right'].forEach(f => S.frect(p, f, 0, 0, 4, len, mul(c, FACE_SHADE[f])));
  S.ffill('rarm', 'top', mul(c, 1.1)); S.ffill('larm', 'top', mul(c, 1.1));
}
function shoes(S, c) {
  for (const p of ['rleg', 'lleg']) ['front', 'back', 'left', 'right'].forEach(f => S.frect(p, f, 0, 10, 4, 2, mul(c, FACE_SHADE[f])));
  S.ffill('rleg', 'bottom', mul(c, 0.8)); S.ffill('lleg', 'bottom', mul(c, 0.8));
}
function hands(S, c) { // gloves
  for (const p of ['rarm', 'larm']) ['front', 'back', 'left', 'right'].forEach(f => S.frect(p, f, 0, 9, 4, 3, mul(c, FACE_SHADE[f])));
  S.ffill('rarm', 'bottom', mul(c, 0.8)); S.ffill('larm', 'bottom', mul(c, 0.8));
}
function belt(S, c, buckle = null) {
  S.frect('body', 'front', 0, 9, 8, 1, c); S.frect('body', 'back', 0, 9, 8, 1, mul(c, 0.85));
  S.frect('body', 'left', 0, 9, 4, 1, mul(c, 0.92)); S.frect('body', 'right', 0, 9, 4, 1, mul(c, 0.9));
  if (buckle) S.frect('body', 'front', 3, 9, 2, 1, buckle);
}
function hatBox(S, c) { S.base('hat', c); } // full box hat/helmet on layer 2

// person base: head+face+hair, torso, arms(+sleeves), legs(+shoes)
function person(o) {
  const S = new Skin();
  const skinC = hex(o.skin);
  S.base('head', skinC);
  hair(S, o.hair ?? 'short', hex(o.hairC ?? '#4a3b2a'));
  if (!o.noFace) { eyes(S, skinC, o.iris ? hex(o.iris) : undefined); mouth(S, skinC); }
  S.base('body', hex(o.shirt));
  S.base('rarm', skinC); S.base('larm', skinC);
  if (o.sleeves) sleeves(S, hex(o.sleeves));
  S.base('rleg', hex(o.pants)); S.base('lleg', hex(o.pants));
  if (o.shoes) shoes(S, hex(o.shoes));
  return S;
}

// ---- extra detail helpers ----
function hood(S, c) {
  S.frect('hat', 'back', 0, 0, 8, 8, mul(c, 0.84));
  S.frect('hat', 'right', 2, 0, 6, 8, mul(c, 0.9));
  S.frect('hat', 'left', 0, 0, 6, 8, mul(c, 0.95));
  S.ffill('hat', 'top', mul(c, 1.05));
}
function cap(S, c) {
  S.ffill('hat', 'top', mul(c, 1.05));
  S.frect('hat', 'front', 0, 0, 8, 2, c);
  S.frect('hat', 'right', 0, 0, 4, 2, mul(c, 0.9));
  S.frect('hat', 'left', 4, 0, 4, 2, mul(c, 0.95));
  S.frect('hat', 'back', 0, 0, 8, 2, mul(c, 0.84));
  S.frect('hat', 'front', 1, 2, 6, 1, mul(c, 0.75)); // brim
}
function beanie(S, c) {
  S.ffill('hat', 'top', mul(c, 1.02));
  S.frect('hat', 'front', 0, 0, 8, 3, c); S.frect('hat', 'back', 0, 0, 8, 3, mul(c, 0.84));
  S.frect('hat', 'right', 0, 0, 8, 3, mul(c, 0.9)); S.frect('hat', 'left', 0, 0, 8, 3, mul(c, 0.95));
}
function headphones(S, c) {
  S.frect('hat', 'top', 3, 0, 2, 8, c);
  S.frect('hat', 'right', 2, 2, 4, 4, c); S.frect('hat', 'left', 2, 2, 4, 4, c);
  S.frect('hat', 'right', 3, 3, 2, 2, mul(c, 1.3)); S.frect('hat', 'left', 3, 3, 2, 2, mul(c, 1.3));
}
function crown(S) { const g = hex('#ffd166'); S.ffill('hat', 'top', g); [0, 2, 4, 6].forEach(x => S.fpx('hat', 'front', x, 0, g)); }
function ears(S, c) { // animal ear nubs on top
  S.frect('hat', 'top', 1, 1, 2, 2, c); S.frect('hat', 'top', 5, 1, 2, 2, c);
}
function horns(S, c) { S.frect('hat', 'top', 0, 0, 2, 3, c); S.frect('hat', 'top', 6, 0, 2, 3, c); }
function antennae(S, c) { S.frect('hat', 'top', 2, 3, 1, 3, c); S.frect('hat', 'top', 5, 3, 1, 3, c); S.fpx('hat', 'top', 2, 2, mul(c, 1.4)); S.fpx('hat', 'top', 5, 2, mul(c, 1.4)); }
function emblemStar(S, c) { S.fpx('body', 'front', 3, 3, c); S.frect('body', 'front', 3, 4, 1, 2, c); S.frect('body', 'front', 2, 4, 3, 1, c); S.fpx('body', 'front', 2, 6, c); S.fpx('body', 'front', 5, 6, c); }
function emblemHeart(S, c) { S.fpx('body', 'front', 3, 3, c); S.fpx('body', 'front', 5, 3, c); S.frect('body', 'front', 2, 4, 5, 1, c); S.frect('body', 'front', 3, 5, 3, 1, c); S.fpx('body', 'front', 4, 6, c); }
function emblemBolt(S, c) { S.fpx('body', 'front', 4, 3, c); S.fpx('body', 'front', 3, 4, c); S.frect('body', 'front', 3, 5, 2, 1, c); S.fpx('body', 'front', 4, 6, c); S.fpx('body', 'front', 3, 7, c); }
function emblemSkull(S, c) { S.frect('body', 'front', 3, 3, 3, 3, c); S.fpx('body', 'front', 3, 4, [0,0,0]); S.fpx('body', 'front', 5, 4, [0,0,0]); S.frect('body', 'front', 4, 6, 1, 1, c); }
function emblemCreeper(S, c) { S.fpx('body', 'front', 3, 3, c); S.fpx('body', 'front', 5, 3, c); S.fpx('body', 'front', 4, 4, c); S.frect('body', 'front', 3, 5, 3, 1, c); S.fpx('body', 'front', 3, 6, c); S.fpx('body', 'front', 5, 6, c); }
function emblemFlower(S, c) { S.fpx('body', 'front', 4, 4, mul(c, 1.3)); [[3,3],[5,3],[3,5],[5,5]].forEach(([x,y]) => S.fpx('body', 'front', x, y, c)); }
function jerseyNumber(S, n, c) { const digits = String(n).slice(0, 2); S.frect('body', 'front', 3, 3, 2, 3, c); if (digits.length > 1) S.frect('body', 'front', 5, 3, 2, 3, c); }
function robe(S, c, sash) {
  S.base('body', c);
  for (const p of ['rleg', 'lleg']) ['front','back','left','right'].forEach(f => S.frect(p, f, 0, 0, 4, 8, mul(c, FACE_SHADE[f])));
  if (sash) { S.frect('body', 'front', 0, 8, 8, 1, sash); S.frect('body', 'back', 0, 8, 8, 1, mul(sash, 0.85)); }
}
function apron(S, c) { S.frect('body', 'front', 1, 3, 6, 8, c); S.frect('body', 'front', 2, 1, 4, 2, c); }
function tie(S, c) { S.frect('body', 'front', 3, 1, 2, 1, mul(c, 0.9)); S.frect('body', 'front', 3, 2, 2, 4, c); S.fpx('body', 'front', 3, 6, c); S.fpx('body', 'front', 4, 6, c); }
function legStripes(S, c) { for (const p of ['rleg','lleg']) { S.frect(p, 'left', 0, 0, 1, 10, mul(c, 0.95)); S.frect(p, 'right', 3, 0, 1, 10, mul(c, 0.9)); } }
function collar(S, c) { S.frect('body', 'front', 2, 0, 4, 1, c); }
function glasses(S, c) { S.frect('head', 'front', 1, 3, 2, 1, c); S.frect('head', 'front', 5, 3, 2, 1, c); S.fpx('head', 'front', 3, 3, c); S.fpx('head', 'front', 4, 3, c); }
function mask(S, c) { S.frect('head', 'front', 0, 5, 8, 3, mul(c, 0.95)); }
function chestStrap(S, c) { for (let i = 0; i < 8; i++) S.fpx('body', 'front', i, Math.min(8, 1 + Math.floor(i / 1)), i % 2 ? mul(c, 1) : c); }
function scarf(S, c) { S.frect('body', 'front', 0, 0, 8, 2, c); S.frect('body', 'back', 0, 0, 8, 2, mul(c, 0.85)); S.frect('body', 'front', 5, 2, 2, 3, mul(c, 0.95)); }
const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf) { let c = 0xffffffff; for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function encodePNG(w, h, data) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(data.buffer, y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  const chunk = (type, d) => { const len = Buffer.alloc(4); len.writeUInt32BE(d.length); const t = Buffer.from(type); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, d]))); return Buffer.concat([len, t, d, crc]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

// ---- preview renderer (front/side/back, overlay on top) ----
function renderView(S, view, scale) {
  const W = view === 'side' ? 8 : 16, H = 32;
  const out = new Uint8ClampedArray(W * scale * H * scale * 4);
  const drawFace = (part, face, dx, dy) => {
    const r = S.fr(part, face);
    for (let y = 0; y < r[3]; y++) for (let x = 0; x < r[2]; x++) {
      const si = ((r[1] + y) * 64 + (r[0] + x)) * 4;
      if (S.d[si + 3] === 0) continue;
      for (let sy = 0; sy < scale; sy++) for (let sx = 0; sx < scale; sx++) {
        const di = (((dy + y) * scale + sy) * (W * scale) + ((dx + x) * scale + sx)) * 4;
        out[di] = S.d[si]; out[di+1] = S.d[si+1]; out[di+2] = S.d[si+2]; out[di+3] = 255;
      }
    }
  };
  if (view === 'front' || view === 'back') {
    const f = view;
    const armL = view === 'front' ? ['rarm', 'rarm2'] : ['larm', 'larm2'];
    const armR = view === 'front' ? ['larm', 'larm2'] : ['rarm', 'rarm2'];
    const legL = view === 'front' ? ['rleg', 'rleg2'] : ['lleg', 'lleg2'];
    const legR = view === 'front' ? ['lleg', 'lleg2'] : ['rleg', 'rleg2'];
    drawFace('head', f, 4, 0); drawFace('body', f, 4, 8);
    drawFace(armL[0], f, 0, 8); drawFace(armR[0], f, 12, 8);
    drawFace(legL[0], f, 4, 20); drawFace(legR[0], f, 8, 20);
    drawFace('hat', f, 4, 0); drawFace('jacket', f, 4, 8);
    drawFace(armL[1], f, 0, 8); drawFace(armR[1], f, 12, 8);
    drawFace(legL[1], f, 4, 20); drawFace(legR[1], f, 8, 20);
  } else {
    drawFace('head', 'left', 0, 0); drawFace('body', 'left', 2, 8);
    drawFace('larm', 'left', 2, 8); drawFace('lleg', 'left', 2, 20);
    drawFace('hat', 'left', 0, 0); drawFace('jacket', 'left', 2, 8);
    drawFace('larm2', 'left', 2, 8); drawFace('lleg2', 'left', 2, 20);
  }
  return { w: W * scale, h: H * scale, data: out };
}

