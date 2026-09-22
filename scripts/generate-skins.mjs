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

// ---- the 16 original designs ----
const DESIGNS = [];

// 1. Knight
DESIGNS.push({ slug: 'knight', name: 'Royal Knight', category: 'Fantasy & Adventure', tags: ['knight', 'armor', 'medieval', 'warrior'],
  desc: 'A medieval knight in chainmail and steel, with a red-cross tabard and a plumed great helm on the second layer. Built for castle sieges and dragon hunts.',
  draw() {
    const S = person({ skin: '#f2c9a4', hairC: '#5c4033', shirt: '#9aa3ad', sleeves: '#9aa3ad', pants: '#4a4f57', shoes: '#2f3339' });
    S.frect('body', 'front', 3, 1, 2, 6, hex('#c1121f'));            // cross vertical
    S.frect('body', 'front', 2, 2, 4, 2, hex('#c1121f'));            // cross arms
    belt(S, hex('#3a3f45'), hex('#ffd166'));
    hatBox(S, hex('#8d949c'));                                       // helm
    S.frect('hat', 'front', 1, 3, 6, 1, hex('#23272e'));             // visor slit
    S.frect('hat', 'front', 3, 4, 2, 3, hex('#23272e'));             // breath holes
    S.frect('hat', 'top', 3, 2, 2, 5, hex('#c1121f'));               // plume
    return S;
  }});

// 2. Ninja
DESIGNS.push({ slug: 'ninja', name: 'Shadow Ninja', category: 'Fantasy & Adventure', tags: ['ninja', 'stealth', 'dark'],
  desc: 'A stealth shinobi wrapped in midnight cloth with only the eyes uncovered, red belt and soft tabi boots. For players who strike from the shadows.',
  draw() {
    const S = person({ skin: '#e0ac69', hair: 'bald', noFace: true, shirt: '#232733', sleeves: '#232733', pants: '#1b1f2a', shoes: '#10131a' });
    const cloth = hex('#232733');
    S.base('head', cloth);
    S.frect('head', 'front', 0, 2, 8, 3, hex('#e0ac69'));            // eye band
    eyes(S, hex('#e0ac69'), [16, 18, 24]);
    belt(S, hex('#c1121f'));
    S.frect('body', 'front', 0, 0, 8, 1, hex('#2c3244'));            // collar wrap
    return S;
  }});

// 3. Astronaut
DESIGNS.push({ slug: 'astronaut', name: 'Astronaut', category: 'Fantasy & Adventure', tags: ['space', 'astronaut', 'sci-fi'],
  desc: 'A full EVA space suit with mission patch, grey gloves and boots, and a bubble helmet with a blue glass visor on the overlay layer. Ready for the End.',
  draw() {
    const S = person({ skin: '#c68642', hairC: '#2f2a26', shirt: '#e8eaee', sleeves: '#e8eaee', pants: '#dfe3e9', shoes: '#6b7280' });
    hands(S, hex('#6b7280'));
    S.frect('body', 'front', 1, 1, 2, 2, hex('#1d4ed8'));            // mission patch
    S.fpx('body', 'front', 1, 1, hex('#ef4444'));
    S.frect('body', 'front', 5, 2, 2, 1, hex('#9aa3ad'));            // name tag
    belt(S, hex('#9aa3ad'));
    hatBox(S, hex('#f1f3f6'));                                       // helmet
    S.frect('hat', 'front', 1, 2, 6, 4, hex('#7dd3fc'));             // visor
    S.frect('hat', 'front', 1, 2, 6, 1, hex('#a5e3ff'));
    S.fpx('hat', 'front', 2, 3, [255, 255, 255, 255]);               // glare
    return S;
  }});

// 4. Wizard
DESIGNS.push({ slug: 'wizard', name: 'Starlight Wizard', category: 'Fantasy & Adventure', tags: ['wizard', 'magic', 'robe'],
  desc: 'An old mage in a violet robe scattered with golden stars, long white beard and a wide-brimmed hat on the second layer. Enchanting table not included.',
  draw() {
    const S = person({ skin: '#f2c9a4', hairC: '#d9d9d9', shirt: '#5a189a', sleeves: '#5a189a', pants: '#3c096c', shoes: '#2b2d42' });
    S.frect('head', 'front', 1, 5, 6, 3, hex('#e8e8e8'));            // beard
    S.frect('head', 'front', 2, 5, 4, 1, hex('#f2c9a4'));            // mouth gap
    S.frect('head', 'front', 3, 5, 2, 1, hex('#c98a6b'));
    const star = (p, f, x, y) => { S.fpx(p, f, x, y, hex('#ffd166')); };
    [[2,3],[5,6],[3,8],[6,2],[1,7],[4,10],[6,9],[2,11]].forEach(([x,y]) => star('body','front',x,y));
    [[3,4],[6,7],[2,9],[5,11]].forEach(([x,y]) => star('body','back',x,y));
    hatBox(S, hex('#5a189a'));                                       // hat
    ['front','back','left','right'].forEach(f => S.frect('hat', f, 0, 6, 8, 2, mul(hex('#7b2cbf'), FACE_SHADE[f]))); // brim
    S.frect('hat', 'top', 2, 2, 4, 4, mul(hex('#7b2cbf'), 1.1));
    S.fpx('hat', 'front', 3, 3, hex('#ffd166')); S.fpx('hat', 'front', 5, 4, hex('#ffd166'));
    return S;
  }});

// 5. Pirate
DESIGNS.push({ slug: 'pirate', name: 'Corsair Pirate', category: 'Fantasy & Adventure', tags: ['pirate', 'sea', 'captain'],
  desc: 'A sea-worn corsair with red bandana, eyepatch, gold-buckled belt and heavy boots. Ideal for ocean monument raids and buried-treasure hunts.',
  draw() {
    const S = person({ skin: '#e0ac69', hairC: '#2f2a26', shirt: '#e8e2d0', sleeves: '#e8e2d0', pants: '#3b2d23', shoes: '#14100c' });
    const red = hex('#b3402a');
    S.frect('head', 'top', 0, 0, 8, 8, mul(red, 1.08));               // bandana
    S.frect('head', 'front', 0, 0, 8, 2, red);
    S.frect('head', 'right', 0, 0, 8, 2, mul(red, 0.9));
    S.frect('head', 'left', 0, 0, 8, 2, mul(red, 0.95));
    S.frect('head', 'back', 0, 0, 8, 3, mul(red, 0.84));
    S.frect('head', 'back', 1, 3, 2, 3, mul(red, 0.8));               // knot tail
    S.frect('head', 'front', 5, 2, 2, 2, hex('#14100c'));             // eyepatch
    S.frect('head', 'front', 2, 2, 3, 1, hex('#14100c'));             // strap
    belt(S, hex('#14100c'), hex('#ffd166'));
    return S;
  }});

// 6. Chef
DESIGNS.push({ slug: 'chef', name: 'Master Chef', category: 'Professions', tags: ['chef', 'cook', 'food'],
  desc: 'A kitchen master with tall white toque, neckerchief, double-button jacket and apron on the overlay layer. Cooks a suspicious amount of baked potatoes.',
  draw() {
    const S = person({ skin: '#8d5524', hairC: '#1a1a1a', hair: 'buzz', shirt: '#f1f3f6', sleeves: '#f1f3f6', pants: '#1f2430', shoes: '#10131a' });
    [2, 4, 6].forEach(y => { S.fpx('body', 'front', 3, y, hex('#1f2430')); S.fpx('body', 'front', 4, y, hex('#1f2430')); }); // buttons
    S.frect('body', 'front', 2, 0, 4, 1, hex('#c1121f'));             // neckerchief
    S.base('jacket', hex('#f7f8fa'));                                 // apron
    S.frect('jacket', 'front', 2, 2, 4, 3, hex('#e8eaee'));           // apron pocket
    hatBox(S, hex('#f7f8fa'));                                        // toque
    S.frect('hat', 'top', 1, 1, 6, 6, mul(hex('#ffffff'), 1));
    return S;
  }});

// 7. Farmer
DESIGNS.push({ slug: 'farmer', name: 'Crop Farmer', category: 'Professions', tags: ['farmer', 'village', 'crops'],
  desc: 'A hard-working farmer in red flannel, denim overalls and a wide straw hat on the second layer. Wheat farms fear them, villagers love them.',
  draw() {
    const S = person({ skin: '#e0ac69', hairC: '#6b4f2a', shirt: '#b3402a', sleeves: '#b3402a', pants: '#3f5f8a', shoes: '#4a3520' });
    const denim = hex('#3f5f8a');
    S.frect('body', 'front', 0, 4, 8, 8, denim);                      // overalls
    S.frect('body', 'front', 1, 0, 1, 4, denim); S.frect('body', 'front', 6, 0, 1, 4, denim); // straps
    S.frect('body', 'front', 3, 5, 2, 2, mul(denim, 1.2));            // pocket
    belt(S, mul(denim, 0.7));
    hatBox(S, hex('#d9b45b'));                                        // straw hat
    ['front','back','left','right'].forEach(f => S.frect('hat', f, 0, 5, 8, 1, hex('#8d6b3d'))); // band
    ['front','back','left','right'].forEach(f => S.frect('hat', f, 0, 6, 8, 2, mul(hex('#e3c377'), FACE_SHADE[f]))); // brim
    return S;
  }});

// 8. Scientist
DESIGNS.push({ slug: 'scientist', name: 'Lab Scientist', category: 'Professions', tags: ['scientist', 'lab', 'glasses'],
  desc: 'A researcher in safety glasses and a white lab coat worn open on the overlay layer, over a blue shirt. Currently studying why creepers explode.',
  draw() {
    const S = person({ skin: '#f2c9a4', hairC: '#404040', shirt: '#4361ee', sleeves: '#4361ee', pants: '#6b7280', shoes: '#1f2430' });
    const coat = hex('#f1f3f6');
    S.base('jacket', coat);                                           // lab coat
    S.frect('jacket', 'front', 3, 0, 2, 8, [0, 0, 0, 0]);             // open front
    S.frect('jacket', 'front', 3, 0, 2, 1, mul(coat, 0.92));
    S.frect('head', 'front', 1, 3, 2, 1, hex('#1f2430'));             // glasses
    S.frect('head', 'front', 5, 3, 2, 1, hex('#1f2430'));
    S.frect('head', 'front', 3, 3, 2, 1, hex('#1f2430'));
    S.fpx('head', 'front', 0, 3, hex('#1f2430')); S.fpx('head', 'front', 7, 3, hex('#1f2430'));
    S.frect('body', 'front', 5, 1, 2, 2, hex('#e63946'));             // pen pocket
    return S;
  }});

// 9. Doctor
DESIGNS.push({ slug: 'doctor', name: 'Medic', category: 'Professions', tags: ['doctor', 'medic', 'healer'],
  desc: 'A field medic in teal scrubs with stethoscope and ID badge. Heals the whole squad after every raid, no emeralds charged.',
  draw() {
    const S = person({ skin: '#5c3836', hairC: '#0d0d0d', shirt: '#0e9594', sleeves: '#0e9594', pants: '#0b7675', shoes: '#f1f3f6' });
    const dark = hex('#2b2d42');
    S.frect('body', 'front', 2, 2, 1, 4, dark); S.frect('body', 'front', 5, 2, 1, 4, dark); // stetho tubes
    S.frect('body', 'front', 3, 6, 2, 1, dark);
    S.fpx('body', 'front', 4, 7, mul(dark, 1.4));                     // chest piece
    S.frect('body', 'front', 6, 3, 1, 2, hex('#f1f3f6'));             // ID badge
    S.frect('body', 'front', 0, 0, 8, 1, mul(hex('#0e9594'), 1.2));   // collar
    return S;
  }});

// 10. Firefighter
DESIGNS.push({ slug: 'firefighter', name: 'Firefighter', category: 'Professions', tags: ['firefighter', 'rescue', 'helmet'],
  desc: 'Turnout gear with double reflective stripes, black boots and a red helmet with a gold shield. Laughs at lava. Mostly.',
  draw() {
    const S = person({ skin: '#c68642', hairC: '#3b2d23', shirt: '#3a3f45', sleeves: '#3a3f45', pants: '#33373d', shoes: '#10131a' });
    const y = hex('#ffd166');
    [4, 8].forEach(r => { S.frect('body', 'front', 0, r, 8, 1, y); S.frect('body', 'back', 0, r, 8, 1, mul(y, 0.84)); S.frect('body', 'left', 0, r, 4, 1, mul(y, 0.95)); S.frect('body', 'right', 0, r, 4, 1, mul(y, 0.9)); });
    for (const p of ['rarm', 'larm']) ['front','back','left','right'].forEach(f => S.frect(p, f, 0, 5, 4, 1, mul(y, FACE_SHADE[f])));
    for (const p of ['rleg', 'lleg']) ['front','back','left','right'].forEach(f => S.frect(p, f, 0, 7, 4, 1, mul(y, FACE_SHADE[f])));
    hatBox(S, hex('#c1121f'));                                        // helmet
    ['front','back','left','right'].forEach(f => S.frect('hat', f, 0, 6, 8, 2, mul(hex('#a10d1e'), FACE_SHADE[f])));
    S.frect('hat', 'front', 3, 3, 2, 2, hex('#ffd166'));              // shield
    return S;
  }});

// 11. Diver
DESIGNS.push({ slug: 'diver', name: 'Deep Diver', category: 'Fantasy & Adventure', tags: ['diver', 'ocean', 'swim'],
  desc: 'A deep-sea diver in a navy wetsuit with teal trim, yellow fins, goggles and snorkel. Made for warm-ocean ruins and drowned farms.',
  draw() {
    const S = person({ skin: '#e0ac69', hairC: '#2f2a26', shirt: '#14213d', sleeves: '#14213d', pants: '#14213d', shoes: '#ffd166' });
    const teal = hex('#0e9594');
    S.frect('body', 'front', 0, 0, 1, 12, teal); S.frect('body', 'front', 7, 0, 1, 12, teal); // side trim
    S.frect('body', 'back', 0, 0, 1, 12, mul(teal, 0.84)); S.frect('body', 'back', 7, 0, 1, 12, mul(teal, 0.84));
    hands(S, teal);
    S.frect('head', 'front', 0, 2, 8, 2, hex('#1f2430'));             // goggle strap
    S.frect('head', 'front', 1, 2, 2, 2, hex('#7dd3fc'));             // lenses
    S.frect('head', 'front', 5, 2, 2, 2, hex('#7dd3fc'));
    S.frect('head', 'right', 3, 3, 2, 4, hex('#9aa3ad'));             // snorkel
    S.frect('head', 'right', 3, 2, 2, 1, hex('#ef4444'));
    return S;
  }});

// 12. Explorer
DESIGNS.push({ slug: 'explorer', name: 'Trail Explorer', category: 'Fantasy & Adventure', tags: ['explorer', 'adventure', 'hiking'],
  desc: 'A trail-ready explorer in khaki, with a packed bedroll backpack and a pith helmet on the second layer. Has mapped every biome twice.',
  draw() {
    const S = person({ skin: '#c68642', hairC: '#4a3520', shirt: '#c2a878', sleeves: '#c2a878', pants: '#8a734f', shoes: '#4a3520' });
    const pack = hex('#6b4f2a');
    S.frect('body', 'back', 1, 1, 6, 7, pack);                        // backpack
    S.frect('body', 'back', 1, 0, 6, 1, hex('#5f8a3d'));              // bedroll
    S.frect('body', 'back', 2, 3, 4, 2, mul(pack, 1.2));              // pocket
    S.frect('body', 'front', 1, 0, 1, 8, mul(pack, 1.1));             // straps
    S.frect('body', 'front', 6, 0, 1, 8, mul(pack, 1.1));
    hatBox(S, hex('#d9c9a3'));                                        // pith helmet
    ['front','back','left','right'].forEach(f => S.frect('hat', f, 0, 6, 8, 2, mul(hex('#c9b88f'), FACE_SHADE[f])));
    return S;
  }});

// 13. Mechanic
DESIGNS.push({ slug: 'mechanic', name: 'Redstone Mechanic', category: 'Professions', tags: ['mechanic', 'engineer', 'redstone'],
  desc: 'Overalls, grey tee, oil stains and a name patch: the person you call when the flying machine will not stop. Redstone certified.',
  draw() {
    const S = person({ skin: '#e0ac69', hairC: '#2f2a26', shirt: '#8c8c8c', sleeves: '#8c8c8c', pants: '#2b3a55', shoes: '#10131a' });
    const blue = hex('#2b3a55');
    S.frect('body', 'front', 0, 4, 8, 8, blue);
    S.frect('body', 'front', 1, 0, 1, 4, blue); S.frect('body', 'front', 6, 0, 1, 4, blue);
    S.frect('body', 'front', 1, 1, 2, 1, hex('#f1f3f6'));             // name patch
    S.fpx('body', 'front', 4, 6, hex('#1a1a1a')); S.fpx('body', 'front', 5, 8, hex('#1a1a1a')); S.fpx('body', 'front', 2, 9, hex('#1a1a1a')); // oil stains
    S.frect('rleg', 'front', 0, 5, 2, 3, mul(blue, 1.15));            // tool pocket
    S.frect('hat', 'top', 0, 0, 8, 8, hex('#8d2121'));                // cap
    S.frect('hat', 'front', 0, 0, 8, 2, mul(hex('#8d2121'), 0.9));
    S.frect('hat', 'front', 2, 2, 4, 1, mul(hex('#8d2121'), 0.85));   // brim
    return S;
  }});

// 14. Musician
DESIGNS.push({ slug: 'musician', name: 'Note Block Musician', category: 'Styles', tags: ['music', 'artist', 'headphones'],
  desc: 'Black tee with a white quaver, worn jeans, sneakers and big studio headphones on the overlay layer. Only records note-block covers.',
  draw() {
    const S = person({ skin: '#f2c9a4', hairC: '#1a1a1a', hair: 'long', shirt: '#1a1a1a', sleeves: '#1a1a1a', pants: '#37507e', shoes: '#f1f3f6' });
    const w = hex('#f1f3f6');
    S.frect('body', 'front', 4, 3, 1, 4, w);                          // note stem
    S.frect('body', 'front', 3, 6, 2, 2, w);                          // note head
    S.frect('body', 'front', 5, 3, 1, 1, w);                          // flag
    const hp = hex('#23272e');
    S.frect('hat', 'top', 2, 3, 4, 2, mul(hp, 1.1));                  // headband
    S.frect('hat', 'right', 2, 2, 4, 4, hp); S.frect('hat', 'left', 2, 2, 4, 4, hp); // ear cups
    S.frect('hat', 'right', 3, 3, 2, 2, hex('#e63946')); S.frect('hat', 'left', 3, 3, 2, 2, hex('#e63946'));
    return S;
  }});

// 15. Gardener
DESIGNS.push({ slug: 'gardener', name: 'Flower Gardener', category: 'Professions', tags: ['gardener', 'flowers', 'nature'],
  desc: 'Floral shirt, green apron, gloves and a sun hat with a daisy. Every bee farm and flower forest needs one of these.',
  draw() {
    const S = person({ skin: '#e0ac69', hairC: '#8d5524', hair: 'ponytail', shirt: '#e8e2d0', sleeves: '#e8e2d0', pants: '#6b5b3e', shoes: '#4a3520' });
    [[2,3,'#ff8fa3'],[5,5,'#ffd166'],[6,2,'#ff8fa3'],[3,7,'#ffd166'],[1,6,'#ff8fa3']].forEach(([x,y,c]) => S.fpx('body','front',x,y,hex(c))); // flowers
    S.base('jacket', hex('#5f8a3d'));                                  // apron
    S.frect('jacket', 'back', 0, 0, 8, 12, [0,0,0,0]);
    hands(S, hex('#5f8a3d'));                                          // gloves
    hatBox(S, hex('#e3c377'));                                         // sun hat
    ['front','back','left','right'].forEach(f => S.frect('hat', f, 0, 6, 8, 2, mul(hex('#d9b45b'), FACE_SHADE[f])));
    S.frect('hat', 'front', 1, 4, 2, 2, hex('#ff8fa3'));               // daisy
    S.fpx('hat', 'front', 1, 4, hex('#ffd166'));
    return S;
  }});

// 16. Gamer
DESIGNS.push({ slug: 'gamer', name: 'Neon Gamer', category: 'Styles', tags: ['gamer', 'hoodie', 'modern'],
  desc: 'Purple hoodie with a lightning bolt, cyan fringe, joggers with side stripes and a gaming headset with mic. Queueing for BedWars.',
  draw() {
    const S = person({ skin: '#f2c9a4', hairC: '#2b2d42', shirt: '#6d28d9', sleeves: '#6d28d9', pants: '#1f2430', shoes: '#f1f3f6' });
    S.frect('head', 'front', 0, 0, 8, 1, hex('#22d3ee'));              // dyed fringe
    S.frect('head', 'top', 0, 6, 8, 2, hex('#22d3ee'));
    S.frect('body', 'front', 4, 2, 2, 1, hex('#ffd166'));              // bolt
    S.frect('body', 'front', 3, 3, 2, 1, hex('#ffd166'));
    S.frect('body', 'front', 3, 4, 2, 1, hex('#ffd166'));
    S.frect('body', 'front', 2, 5, 2, 1, hex('#ffd166'));
    S.frect('body', 'front', 2, 6, 1, 2, hex('#ffd166'));
    for (const p of ['rleg','lleg']) { S.frect(p, 'left', 0, 0, 1, 12, hex('#f1f3f6')); S.frect(p, 'right', 3, 0, 1, 12, hex('#f1f3f6')); } // stripes
    S.frect('hat', 'back', 0, 4, 8, 4, mul(hex('#6d28d9'), 0.84));     // hood
    const hp = hex('#23272e');
    S.frect('hat', 'top', 2, 3, 4, 2, mul(hp, 1.1));
    S.frect('hat', 'right', 2, 2, 4, 4, hp); S.frect('hat', 'left', 2, 2, 4, 4, hp);
    S.frect('hat', 'right', 4, 5, 1, 3, hp);                           // mic arm
    return S;
  }});

// ---- PNG encoder ----
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

// ---- run ----
const outDir = 'public/skins';
fs.mkdirSync(outDir, { recursive: true });
const manifest = [];
const sheetCells = [];
for (const d of DESIGNS) {
  const S = d.draw();
  fs.writeFileSync(path.join(outDir, d.slug + '.png'), encodePNG(64, 64, S.d));
  manifest.push({ slug: d.slug, name: d.name, category: d.category, desc: d.desc, tags: d.tags, file: '/skins/' + d.slug + '.png' });
  sheetCells.push({ slug: d.slug, views: ['front', 'side', 'back'].map(v => renderView(S, v, 6)) });
}
fs.writeFileSync('src/data/gallery-skins.json', JSON.stringify(manifest, null, 2));

// contact sheet for visual QA: 16 rows x 3 views, front 96px wide cells
const cellW = 16 * 6, cellH = 32 * 6, cols = 3, rows = DESIGNS.length;
const sheet = new Uint8ClampedArray(cols * cellW * rows * cellH * 4);
sheetCells.forEach((cell, r) => {
  let xoff = 0;
  cell.views.forEach(v => {
    for (let y = 0; y < v.h; y++) for (let x = 0; x < v.w; x++) {
      const si = (y * v.w + x) * 4;
      if (v.data[si + 3] === 0) continue;
      const di = ((r * cellH + y) * (cols * cellW) + xoff + x) * 4;
      sheet[di] = v.data[si]; sheet[di+1] = v.data[si+1]; sheet[di+2] = v.data[si+2]; sheet[di+3] = 255;
    }
    xoff += cellW;
  });
});
fs.writeFileSync('/tmp/skin-sheet.png', encodePNG(cols * cellW, rows * cellH, sheet));
console.log('generated', manifest.length, 'skins + sheet');
