import { writeFileSync, mkdirSync } from 'fs';
mkdirSync('public/item-icons', { recursive: true });

function make(fn) {
  const g = Array.from({ length: 16 }, () => Array(16).fill(null));
  const px = (x, y, c) => { if (x >= 0 && x < 16 && y >= 0 && y < 16) g[y][x] = c; };
  const rect = (x, y, w, h, c) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) px(i, j, c); };
  const line = (x0, y0, x1, y1, c) => {
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    while (true) { px(x0, y0, c); if (x0 === x1 && y0 === y1) break; const e2 = 2 * err; if (e2 > -dy) { err -= dy; x0 += sx; } if (e2 < dx) { err += dx; y0 += sy; } }
  };
  fn({ px, rect, line });
  return g;
}
const svg = (g) => {
  let r = '';
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (g[y][x]) r += `<rect x="${x}" y="${y}" width="1" height="1" fill="${g[y][x]}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">${r}</svg>`;
};

const W = '#8a5a2b', WD = '#6b4423', WL = '#a06c3a', DK = '#3a2a18', I = '#b8b8b8', ID = '#7a7a7a', G = '#f5c542', DIA = '#5ad1d1', RED = '#c03428', WH = '#ececec', GR = '#4a9b3a', BL = '#3a7bd5';

const icons = {
  'crafting-table': make(({ rect }) => { rect(1,1,14,14,'#5d3f22'); rect(2,2,12,4,WL); rect(2,6,12,9,W); rect(4,7,3,3,DK); rect(9,7,3,3,DK); rect(4,11,3,1,DK); rect(9,11,3,1,DK); rect(2,2,12,1,'#b98a55'); }),
  'torch': make(({ rect, px }) => { rect(7,7,2,9,W); rect(6,3,4,4,G); rect(7,4,2,2,'#ff9a1f'); px(7,2,'#fff3b0'); px(8,2,'#fff3b0'); }),
  'chest': make(({ rect }) => { rect(1,3,14,11,W); rect(1,3,14,1,WL); rect(1,7,14,1,WD); rect(7,6,2,3,'#d8d8d8'); rect(1,13,14,1,WD); rect(1,3,1,11,WD); rect(14,3,1,11,WD); }),
  'furnace': make(({ rect }) => { rect(2,1,12,14,ID); rect(3,2,10,3,'#8a8a8a'); rect(4,6,8,7,'#3a3a3a'); rect(5,7,6,5,'#1a1a1a'); rect(3,2,10,1,'#9a9a9a'); }),
  'bed': make(({ rect }) => { rect(1,5,14,3,WH); rect(6,5,9,3,RED); rect(1,8,14,3,WD); rect(1,11,2,3,DK); rect(13,11,2,3,DK); rect(2,6,3,2,'#ffffff'); }),
  'boat': make(({ rect, px }) => { rect(3,8,10,2,WL); rect(2,10,12,2,W); rect(3,12,10,1,WD); px(2,9,W); px(13,9,W); rect(6,9,4,1,'#c89548'); }),
  'shield': make(({ rect, px }) => { rect(3,1,10,2,I); rect(2,3,12,5,I); rect(3,8,10,2,I); rect(4,10,8,2,I); rect(5,12,6,1,I); rect(6,13,4,1,I); px(7,14,I); px(8,14,I); rect(4,3,8,4,W); rect(7,3,2,10,'#d8d8d8'); rect(5,4,6,2,WD); }),
  'bucket': make(({ rect, line }) => { rect(3,3,10,1,'#8a8a8a'); line(3,4,5,13,I); line(12,4,10,13,I); rect(5,13,6,1,I); rect(4,5,8,2,'#d0d0d0'); line(4,2,7,0,'#8a8a8a'); line(11,2,8,0,'#8a8a8a'); }),
  'anvil': make(({ rect }) => { rect(1,2,14,3,'#4a4a4a'); rect(1,2,14,1,'#6a6a6a'); rect(6,5,4,3,'#3a3a3a'); rect(3,8,10,3,'#4a4a4a'); rect(2,11,12,2,'#3a3a3a'); }),
  'enchanting-table': make(({ rect, px }) => { rect(1,5,14,9,'#241533'); rect(1,5,14,2,'#160d22'); rect(2,14,12,1,'#0d0812'); rect(3,0,10,4,RED); rect(3,0,10,1,'#d84a3a'); px(7,3,WH); px(8,3,WH); rect(7,7,2,2,DIA); px(6,8,'#3a9b9b'); px(9,8,'#3a9b9b'); }),
  'campfire': make(({ rect, line, px }) => { line(2,12,13,15,WD); line(13,12,2,15,W); rect(6,6,4,6,'#ff9a1f'); rect(7,4,2,8,'#ffc832'); px(7,3,'#fff3b0'); px(5,2,'#b0b0b0'); px(9,1,'#909090'); }),
  'blast-furnace': make(({ rect }) => { rect(2,1,12,14,'#5a5a5a'); rect(3,2,10,3,'#7a7a7a'); rect(3,6,10,1,'#3a3a3a'); rect(5,8,6,6,'#2a1a10'); rect(6,9,4,4,'#ff8c1a'); rect(7,10,2,2,'#ffc832'); }),
  'smoker': make(({ rect }) => { rect(2,2,12,13,'#6a5a4a'); rect(5,0,6,3,'#3a3a3a'); rect(6,1,4,1,'#1a1a1a'); rect(4,5,8,7,'#4a3f33'); rect(5,6,6,5,'#2f2820'); }),
  'shears': make(({ line, rect }) => { line(3,3,10,12,I); line(12,3,5,12,I); rect(2,11,3,3,ID); rect(10,11,3,3,ID); line(3,3,9,11,'#d8d8d8'); }),
  'compass': make(({ rect, px }) => { rect(4,2,8,1,ID); rect(4,13,8,1,ID); rect(2,4,1,8,ID); rect(13,4,1,8,ID); px(3,3,ID); px(12,3,ID); px(3,12,ID); px(12,12,ID); rect(5,5,6,6,WH); rect(7,5,2,3,RED); rect(7,8,2,3,'#7a7a7a'); }),
  'clock': make(({ rect, px }) => { rect(4,2,8,1,G); rect(4,13,8,1,G); rect(2,4,1,8,G); rect(13,4,1,8,G); px(3,3,G); px(12,3,G); px(3,12,G); px(12,12,G); rect(5,5,6,6,'#fff8e0'); px(8,6,'#1a1a1a'); px(8,7,'#1a1a1a'); px(9,8,'#1a1a1a'); }),
  'ladder': make(({ rect }) => { rect(3,1,2,14,W); rect(11,1,2,14,W); rect(3,2,10,1,WL); rect(3,6,10,1,WL); rect(3,10,10,1,WL); rect(3,14,10,1,WL); }),
  'tnt': make(({ rect }) => { rect(2,2,12,12,RED); rect(2,6,12,4,'#e8e0d0'); rect(2,2,12,1,'#d84a3a'); rect(4,7,2,2,'#1a1a1a'); rect(7,7,2,2,'#1a1a1a'); rect(10,7,2,2,'#1a1a1a'); }),
  'bow': make(({ line, px }) => { line(10,1,5,4,W); line(5,4,3,8,W); line(3,8,5,12,W); line(5,12,10,15,W); line(10,1,10,15,'#d8d8d8'); px(8,7,'#d8d8d8'); px(7,8,'#d8d8d8'); }),
  'fishing-rod': make(({ line, px }) => { line(2,14,12,2,W); line(12,2,12,9,'#c8c8c8'); px(11,10,'#8a8a8a'); px(13,10,'#8a8a8a'); px(12,11,'#8a8a8a'); }),
  'flint-and-steel': make(({ line, px, rect }) => { line(2,13,11,4,'#9a9a9a'); line(3,14,12,5,'#7a7a7a'); rect(9,1,4,3,'#3a3a3a'); px(13,6,G); px(14,7,'#ff9a1f'); px(12,8,'#fff3b0'); }),
  'grindstone': make(({ rect, line }) => { rect(5,4,6,6,ID); rect(6,5,4,4,'#8a8a8a'); line(5,10,3,14,W); line(10,10,12,14,W); rect(2,14,4,1,WD); rect(10,14,4,1,WD); rect(7,2,2,2,'#5a5a5a'); }),
  'minecart': make(({ rect }) => { rect(2,5,12,5,ID); rect(3,6,10,3,'#8a8a8a'); rect(3,11,3,3,'#2a2a2a'); rect(10,11,3,3,'#2a2a2a'); rect(2,5,12,1,'#9a9a9a'); }),
  'diamond-sword': make(({ line, rect }) => { line(2,13,10,5,DIA); line(3,14,11,6,'#3a9b9b'); rect(4,9,1,1,'#8ad1d1'); line(8,10,10,12,'#c8c8c8'); line(9,11,10,10,'#c8c8c8'); line(10,13,12,15,WD); }),
  'diamond-pickaxe': make(({ line, rect }) => { rect(3,2,10,3,DIA); rect(2,3,2,3,DIA); rect(12,3,2,3,DIA); rect(3,2,10,1,'#8ad1d1'); line(7,5,2,14,WD); line(8,5,3,15,W); }),
  'diamond-axe': make(({ line, rect }) => { rect(8,2,6,5,DIA); rect(8,2,6,1,'#8ad1d1'); rect(13,3,2,2,'#3a9b9b'); line(8,3,2,13,WD); line(9,3,3,14,W); }),
  'bread': make(({ rect, px }) => { rect(2,5,12,7,'#c89548'); rect(2,5,12,2,'#dba85c'); px(3,4,'#dba85c'); px(12,4,'#dba85c'); rect(5,7,1,3,'#a06c3a'); rect(8,7,1,3,'#a06c3a'); rect(11,7,1,3,'#a06c3a'); }),
  'cake': make(({ rect, px }) => { rect(2,4,12,4,'#f0e6d0'); rect(2,8,12,6,'#c89548'); rect(2,8,12,1,'#dba85c'); px(4,3,RED); px(8,3,RED); px(12,3,RED); px(4,2,'#d84a3a'); px(8,2,'#d84a3a'); px(12,2,'#d84a3a'); rect(2,10,12,1,'#f0e6d0'); }),
  'golden-apple': make(({ rect, px }) => { rect(5,5,6,8,G); rect(4,6,8,6,G); px(5,4,'#b8860b'); rect(7,2,2,2,'#b8860b'); px(9,2,GR); px(10,3,GR); px(6,6,'#fff3b0'); px(5,7,'#fff3b0'); }),
  'paper': make(({ rect }) => { rect(4,2,9,12,'#f0f0f0'); rect(4,2,9,1,'#ffffff'); rect(5,4,7,1,'#b0b0b0'); rect(5,6,7,1,'#b0b0b0'); rect(5,8,7,1,'#b0b0b0'); rect(5,10,5,1,'#b0b0b0'); }),
  'book': make(({ rect }) => { rect(3,2,10,12,RED); rect(4,3,8,10,'#d84a3a'); rect(3,2,2,12,'#8a2018'); rect(6,5,4,5,WH); }),
  'bookshelf': make(({ rect }) => { rect(1,1,14,14,W); rect(2,2,12,5,DK); rect(2,9,12,5,DK); rect(3,3,2,4,RED); rect(6,3,2,4,BL); rect(9,3,2,4,GR); rect(12,3,1,4,G); rect(3,10,2,4,'#7a4a9b'); rect(6,10,2,4,'#c87018'); rect(9,10,2,4,RED); rect(12,10,1,4,BL); }),
  'hopper': make(({ rect, line }) => { rect(2,2,12,4,ID); rect(4,6,8,3,'#8a8a8a'); rect(6,9,4,3,ID); rect(7,12,2,3,ID); rect(2,2,12,1,'#9a9a9a'); }),
  'piston': make(({ rect }) => { rect(2,4,12,10,ID); rect(2,1,12,3,'#b08a50'); rect(2,1,12,1,'#c89a60'); rect(6,6,4,4,'#5a5a5a'); rect(3,5,10,1,'#8a8a8a'); }),
  'sticky-piston': make(({ rect, px }) => { rect(2,4,12,10,ID); rect(2,1,12,3,'#b08a50'); rect(6,6,4,4,'#6abe30'); px(7,7,'#8ad650'); px(5,8,'#6abe30'); px(10,9,'#6abe30'); rect(3,5,10,1,'#8a8a8a'); }),
  'ender-chest': make(({ rect }) => { rect(1,3,14,11,'#1a2530'); rect(1,3,14,1,'#2a3a4a'); rect(1,7,14,1,'#101a24'); rect(1,13,14,1,'#101a24'); rect(7,6,2,3,'#b060e0'); rect(3,5,2,2,'#2a3a4a'); rect(11,10,2,2,'#2a3a4a'); }),
  'crossbow': make(({ rect, line, px }) => { rect(2,7,12,3,W); rect(2,7,12,1,WL); line(2,5,2,3,'#c8c8c8'); line(14,5,14,3,'#c8c8c8'); line(2,3,14,3,'#c8c8c8'); rect(7,4,2,6,ID); px(8,2,'#d8d8d8'); }),
  'firework-rocket': make(({ rect, line, px }) => { rect(6,3,4,8,RED); rect(6,5,4,2,WH); rect(6,3,4,1,'#d84a3a'); px(7,2,'#d8d8d8'); px(8,2,'#d8d8d8'); line(8,11,8,14,WD); px(5,13,G); px(11,14,G); px(4,11,'#ff9a1f'); }),
  'lead': make(({ line, px }) => { line(3,3,12,3,W); line(12,3,12,10,W); line(12,10,7,12,W); line(7,12,5,10,W); line(5,10,5,7,W); line(5,7,8,6,W); px(3,4,WD); px(3,5,WD); }),
  'dispenser': make(({ rect }) => { rect(2,1,12,14,ID); rect(3,2,10,3,'#8a8a8a'); rect(5,6,6,6,'#2a2a2a'); rect(6,7,4,4,'#1a1a1a'); rect(3,2,10,1,'#9a9a9a'); }),
  // enchantments
  'sharpness': make(({ line, rect }) => { line(2,13,10,5,I); line(3,14,11,6,'#8a8a8a'); line(8,10,10,12,G); line(10,13,12,15,WD); rect(4,8,1,1,'#e8e8e8'); }),
  'protection': make(({ rect, px }) => { rect(3,1,10,2,I); rect(2,3,12,5,I); rect(3,8,10,2,I); rect(4,10,8,2,I); rect(6,12,4,1,I); px(7,13,I); px(8,13,I); rect(5,3,6,4,BL); rect(6,4,4,2,'#5a9be5'); }),
  'unbreaking': make(({ rect, px }) => { rect(1,2,14,3,'#4a4a4a'); rect(1,2,14,1,'#6a6a6a'); rect(6,5,4,3,'#3a3a3a'); rect(3,8,10,3,'#4a4a4a'); rect(2,11,12,2,'#3a3a3a'); px(12,1,'#8ad1d1'); px(13,2,'#5ad1d1'); px(2,10,'#5ad1d1'); px(1,9,'#8ad1d1'); px(8,13,'#5ad1d1'); }),
  'mending': make(({ rect, px }) => { rect(3,4,4,3,RED); rect(9,4,4,3,RED); rect(2,5,12,4,RED); rect(4,9,8,2,RED); rect(6,11,4,2,RED); px(7,13,RED); px(8,13,RED); px(12,2,G); px(13,3,'#fff3b0'); px(2,2,'#fff3b0'); }),
  'efficiency': make(({ line, rect }) => { rect(3,2,10,3,I); rect(2,3,2,3,I); rect(12,3,2,3,I); rect(3,2,10,1,'#d8d8d8'); line(7,5,2,14,WD); line(8,5,3,15,W); }),
  'fortune': make(({ rect, px }) => { rect(3,8,4,4,DIA); rect(9,8,4,4,'#3ad14a'); rect(6,3,4,4,G); px(4,9,'#e8e8e8'); px(10,9,'#e8e8e8'); px(7,4,'#fff3b0'); }),
  'silk-touch': make(({ rect, px }) => { rect(3,3,10,10,'#a8d8e8'); rect(4,4,8,8,'#c8e8f0'); px(5,5,'#ffffff'); px(6,6,'#ffffff'); px(12,2,'#ffffff'); px(13,3,'#ffffff'); px(2,12,'#ffffff'); }),
  'looting': make(({ rect, px }) => { rect(2,9,4,3,G); rect(6,8,4,3,G); rect(10,9,4,3,G); px(3,10,'#fff3b0'); px(7,9,'#fff3b0'); px(11,10,'#fff3b0'); rect(6,3,4,3,'#e8c832'); px(13,3,'#fff3b0'); px(2,4,'#fff3b0'); }),
  'feather-falling': make(({ line, rect, px }) => { line(4,12,10,2,WH); line(5,13,11,3,'#c8c8c8'); px(6,10,WH); px(8,7,WH); px(9,5,WH); line(5,14,3,15,'#e8b83a'); px(12,12,'#8ad1d1'); px(13,13,'#8ad1d1'); }),
  'infinity': make(({ line, px }) => { line(2,8,4,6,DIA); line(4,6,6,6,DIA); line(6,6,8,8,DIA); line(8,8,10,10,DIA); line(10,10,12,10,DIA); line(12,10,14,8,DIA); line(14,8,12,6,DIA); line(12,6,10,6,DIA); line(10,6,8,8,DIA); line(8,8,6,10,DIA); line(6,10,4,10,DIA); line(4,10,2,8,DIA); px(2,7,DIA); px(13,7,DIA); }),
  'fire-aspect': make(({ rect, px }) => { rect(6,6,4,8,'#ff8c1a'); rect(7,3,2,10,'#ffc832'); px(7,2,'#fff3b0'); px(5,7,'#ff6a1a'); px(11,8,'#ff6a1a'); px(6,12,'#c03410'); px(9,13,'#c03410'); }),
  'knockback': make(({ line, rect }) => { line(2,8,10,8,WH); line(10,8,7,5,WH); line(10,8,7,11,WH); rect(12,4,2,8,RED); line(2,4,4,4,'#8a8a8a'); line(2,12,4,12,'#8a8a8a'); }),
  'power': make(({ line, px }) => { line(10,1,5,4,RED); line(5,4,3,8,RED); line(3,8,5,12,RED); line(5,12,10,15,RED); line(10,1,10,15,'#e8e8e8'); px(8,7,G); px(7,8,G); }),
  'punch': make(({ rect, px }) => { rect(4,5,8,7,'#e8b83a'); rect(5,3,2,3,'#e8b83a'); rect(8,3,2,3,'#e8b83a'); rect(11,4,2,2,'#e8b83a'); px(2,2,'#fff3b0'); px(13,2,'#fff3b0'); px(2,13,'#fff3b0'); px(13,13,'#fff3b0'); }),
  'thorns': make(({ line, px, rect }) => { line(8,14,8,4,GR); px(6,8,GR); px(10,10,GR); px(6,11,GR); px(10,6,GR); rect(6,1,4,3,'#d84a6a'); px(7,2,'#e87a8a'); }),
  'respiration': make(({ rect, px }) => { rect(3,9,3,3,'#6ab8e8'); rect(8,6,4,4,'#6ab8e8'); rect(11,10,2,2,'#6ab8e8'); px(4,10,'#c8e8f8'); px(9,7,'#c8e8f8'); px(6,4,'#9ac8e8'); px(5,5,'#9ac8e8'); }),
  'aqua-affinity': make(({ rect, px, line }) => { line(8,2,5,7,BL); line(8,2,11,7,BL); rect(4,7,8,5,BL); rect(5,12,6,2,BL); px(6,8,'#8ac8f0'); px(7,9,'#8ac8f0'); }),
  'depth-strider': make(({ rect, px }) => { rect(4,3,5,9,BL); rect(4,12,8,3,BL); rect(4,3,5,2,'#5a9be5'); px(12,4,'#8ac8f0'); px(13,6,'#8ac8f0'); px(12,8,'#8ac8f0'); }),
  'soul-speed': make(({ rect, px }) => { rect(4,3,5,9,'#4a6a7a'); rect(4,12,8,3,'#4a6a7a'); rect(4,3,5,2,'#6a8a9a'); px(11,4,'#6ad1d1'); px(12,6,'#6ad1d1'); px(11,8,'#6ad1d1'); px(13,5,'#3a9b9b'); }),
  'swift-sneak': make(({ rect, px, line }) => { rect(4,4,5,8,'#3a3a3a'); rect(4,12,8,3,'#3a3a3a'); rect(4,4,5,2,'#5a5a5a'); line(11,10,14,10,'#8ad1d1'); line(11,12,13,12,'#8ad1d1'); px(12,8,'#8ad1d1'); }),

  // villager professions
  'librarian': make(({ rect }) => { rect(3,2,10,12,RED); rect(4,3,8,10,'#d84a3a'); rect(3,2,2,12,'#8a2018'); rect(6,5,4,5,WH); rect(6,7,4,1,'#b0b0b0'); }),
  'farmer': make(({ line, rect, px }) => { line(8,14,8,4,'#c89548'); px(6,6,'#dba85c'); px(10,6,'#dba85c'); px(6,9,'#dba85c'); px(10,9,'#dba85c'); px(6,12,'#dba85c'); px(10,12,'#dba85c'); rect(5,3,6,2,G); }),
  'armorer': make(({ rect }) => { rect(4,2,8,3,I); rect(3,5,10,7,I); rect(6,5,4,7,'#8a8a8a'); rect(3,5,10,1,'#d8d8d8'); rect(5,12,2,2,'#8a8a8a'); rect(9,12,2,2,'#8a8a8a'); }),
  'toolsmith': make(({ line, rect }) => { rect(3,2,10,3,I); rect(2,3,2,3,I); rect(12,3,2,3,I); rect(3,2,10,1,'#d8d8d8'); line(7,5,2,14,WD); line(8,5,3,15,W); }),
  'weaponsmith': make(({ line, rect }) => { line(2,13,10,5,I); line(3,14,11,6,'#8a8a8a'); line(8,10,10,12,'#c8c8c8'); line(10,13,12,15,WD); rect(4,8,1,1,'#e8e8e8'); }),
  'cleric': make(({ rect, px }) => { rect(6,3,4,2,'#c8c8c8'); rect(5,5,6,8,'#7a4a9b'); rect(6,6,4,5,'#9b6ac8'); px(7,7,'#c89ae8'); px(4,13,'#5a3a78'); px(11,13,'#5a3a78'); rect(7,1,2,2,'#8a8a8a'); }),
  'cartographer': make(({ rect, px, line }) => { rect(3,3,10,10,'#e8d8a8'); px(5,5,GR); px(9,6,GR); px(6,8,BL); px(10,9,BL); line(4,11,8,10,'#b09a68'); px(11,4,RED); }),
  'fletcher': make(({ line, rect, px }) => { line(3,13,12,4,WD); rect(11,2,3,3,I); px(3,13,'#e8e8e8'); px(4,12,'#e8e8e8'); px(2,12,'#e8e8e8'); px(3,14,'#e8e8e8'); }),
  'butcher': make(({ rect, px }) => { rect(4,4,8,9,'#e8a8a8'); rect(5,5,6,7,'#f0b8b8'); px(6,6,'#d88a8a'); px(9,9,'#d88a8a'); rect(11,2,3,3,WH); rect(12,1,2,2,WH); }),
  'fisherman': make(({ rect, px }) => { rect(3,6,9,5,BL); rect(10,7,3,3,'#5a9be5'); px(12,6,BL); px(12,10,BL); px(5,7,'#1a1a1a'); px(4,8,'#8ac8f0'); px(6,9,'#8ac8f0'); rect(2,12,12,1,'#8ac8f0'); rect(3,13,10,1,'#6ab8e8'); }),
  'leatherworker': make(({ rect }) => { rect(4,2,8,3,'#8a5a2b'); rect(3,5,10,7,'#a06c3a'); rect(6,5,4,7,'#8a5a2b'); rect(3,5,10,1,'#b98a55'); }),
  'mason': make(({ rect }) => { rect(2,3,12,11,ID); rect(2,3,12,1,'#9a9a9a'); rect(2,7,12,1,'#5a5a5a'); rect(2,11,12,1,'#5a5a5a'); rect(7,3,1,4,'#5a5a5a'); rect(4,8,1,3,'#5a5a5a'); rect(10,8,1,3,'#5a5a5a'); rect(7,12,1,2,'#5a5a5a'); }),
  'shepherd': make(({ rect, px }) => { rect(3,3,10,10,WH); px(4,4,'#d8d8d8'); px(8,6,'#d8d8d8'); px(5,9,'#d8d8d8'); px(10,10,'#d8d8d8'); px(7,12,'#d8d8d8'); px(11,4,'#d8d8d8'); }),
  // structures
  'village': make(({ rect }) => { rect(3,7,10,7,'#c8b890'); rect(2,5,12,3,'#8a5a2b'); rect(3,4,10,1,'#a06c3a'); rect(7,9,3,5,WD); rect(4,9,2,2,'#6ab8e8'); rect(11,9,2,2,'#6ab8e8'); }),
  'stronghold': make(({ rect, px }) => { rect(2,2,12,12,ID); rect(2,2,12,1,'#9a9a9a'); rect(2,7,12,1,'#5a5a5a'); rect(7,2,1,5,'#5a5a5a'); rect(4,8,1,6,'#5a5a5a'); rect(11,8,1,6,'#5a5a5a'); rect(6,9,4,4,'#3a6a4a'); px(7,10,'#6abe30'); px(8,11,'#6abe30'); }),
  'ancient-city': make(({ rect, px }) => { rect(2,2,12,12,'#1a2530'); px(4,4,'#3a9b9b'); px(8,5,'#5ad1d1'); px(11,3,'#3a9b9b'); px(5,8,'#5ad1d1'); px(9,9,'#3a9b9b'); px(3,11,'#3a9b9b'); px(7,12,'#5ad1d1'); px(12,11,'#3a9b9b'); }),
  'bastion-remnant': make(({ rect, px }) => { rect(2,2,12,12,'#2a2228'); rect(2,2,12,2,'#3a3238'); px(4,6,G); px(8,8,G); px(11,5,G); px(5,11,G); rect(6,3,4,3,'#1a1518'); }),
  'nether-fortress': make(({ rect }) => { rect(2,2,12,12,'#3a1a1a'); rect(2,2,12,1,'#5a2a2a'); rect(2,7,12,1,'#1a0d0d'); rect(2,12,12,1,'#1a0d0d'); rect(5,2,1,5,'#1a0d0d'); rect(10,2,1,5,'#1a0d0d'); rect(4,8,1,4,'#1a0d0d'); rect(8,8,1,4,'#1a0d0d'); rect(12,8,1,4,'#1a0d0d'); }),
  'trial-chambers': make(({ rect }) => { rect(2,3,12,11,'#b87a50'); rect(2,3,12,2,'#d89a68'); rect(2,8,12,1,'#8a5a3a'); rect(2,12,12,1,'#8a5a3a'); rect(6,5,4,6,'#3a3a3a'); rect(7,6,2,4,'#5ad1d1'); }),
  'woodland-mansion': make(({ rect }) => { rect(2,6,12,8,'#3a2a1a'); rect(1,4,14,3,'#2a1e12'); rect(6,8,4,6,'#1a120a'); rect(3,8,2,2,'#e8c832'); rect(11,8,2,2,'#e8c832'); }),
  'ocean-monument': make(({ rect, px }) => { rect(2,4,12,10,'#5a9b8a'); rect(2,4,12,2,'#7abbaa'); px(4,8,'#3a7b6a'); px(9,10,'#3a7b6a'); px(11,7,'#3a7b6a'); rect(6,2,4,2,'#e8b83a'); }),
  'mineshaft': make(({ rect, line }) => { rect(2,2,2,12,W); rect(12,2,2,12,W); rect(2,2,12,2,W); line(4,9,12,13,ID); line(4,12,12,9,ID); rect(6,10,4,1,'#2a2a2a'); }),
  'desert-temple': make(({ rect, line }) => { line(8,2,2,13,'#d8c090'); line(8,2,14,13,'#d8c090'); rect(2,13,12,1,'#c8b080'); rect(6,7,4,5,'#b89868'); rect(7,8,2,3,'#e8a018'); }),
  'jungle-temple': make(({ rect, px }) => { rect(2,4,12,10,'#6a7a5a'); rect(2,4,12,2,'#7a8a6a'); px(4,8,'#4a6a3a'); px(9,6,'#4a6a3a'); px(11,11,'#4a6a3a'); px(6,12,'#4a6a3a'); rect(6,8,4,4,'#3a4a2a'); }),
  'trail-ruins': make(({ rect, px }) => { rect(2,4,12,10,'#9a8a7a'); px(4,6,'#c8b8a8'); px(8,8,'#6a5a4a'); px(11,5,'#c8b8a8'); px(5,11,'#6a5a4a'); rect(6,3,5,2,'#b84a3a'); px(3,12,'#b84a3a'); px(12,10,'#b84a3a'); }),
  // farms
  'iron-farm': make(({ rect, px }) => { rect(3,4,10,9,ID); rect(3,4,10,2,'#9a9a9a'); px(5,7,'#3a3a3a'); px(10,7,'#3a3a3a'); rect(5,10,6,1,'#3a3a3a'); px(2,13,'#8a8a8a'); px(13,13,'#8a8a8a'); }),
  'mob-farm': make(({ rect }) => { rect(3,2,10,12,'#3a3a3a'); rect(4,3,8,10,'#1a1a1a'); rect(5,5,2,4,'#4a4a4a'); rect(9,5,2,4,'#4a4a4a'); rect(5,10,2,2,'#4a4a4a'); rect(9,10,2,2,'#4a4a4a'); rect(2,1,12,1,'#5a5a5a'); }),
  'sugarcane-farm': make(({ rect, px }) => { rect(4,2,2,12,GR); rect(9,3,2,11,'#6abe30'); px(3,5,'#6abe30'); px(8,6,GR); px(3,9,'#6abe30'); px(8,11,GR); rect(2,14,12,1,'#6a4a2a'); }),
  'gold-xp-farm': make(({ rect, px }) => { rect(4,3,8,5,G); rect(4,3,8,1,'#fff3b0'); px(4,11,'#6abe30'); px(7,10,'#8ad650'); px(10,12,'#6abe30'); px(12,10,'#8ad650'); px(6,13,'#6abe30'); }),
  'raid-farm': make(({ rect, px }) => { rect(7,2,2,12,'#8a8a8a'); rect(9,2,5,6,'#4a4a4a'); px(10,4,WH); px(12,4,WH); px(11,6,WH); rect(2,2,5,6,'#4a4a4a'); px(3,4,WH); px(5,6,WH); }),
  'witch-farm': make(({ rect, line, px }) => { line(2,8,14,8,'#4a3a5a'); rect(5,3,6,5,'#5a4a6a'); px(8,2,'#3a2a4a'); rect(6,9,4,5,'#3a2a4a'); px(7,10,'#8a5aa8'); }),
  'pumpkin-melon-farm': make(({ rect, px }) => { rect(3,4,10,9,'#e88018'); rect(3,4,10,1,'#f09828'); px(6,4,'#c86a10'); px(9,4,'#c86a10'); rect(7,2,2,3,GR); rect(6,7,1,2,'#8a4a08'); rect(10,7,1,2,'#8a4a08'); rect(7,10,3,1,'#8a4a08'); }),
  'bamboo-farm': make(({ rect, px }) => { rect(4,2,2,13,'#5aa83a'); rect(9,1,2,14,'#6abe30'); px(3,4,'#6abe30'); px(8,7,'#5aa83a'); px(3,10,'#6abe30'); px(12,3,GR); px(12,9,GR); }),
  'guardian-xp-farm': make(({ rect, px }) => { rect(3,3,10,10,'#5a9b8a'); rect(5,5,6,6,'#e8e0d0'); rect(6,6,4,4,'#3a3a3a'); px(7,7,'#ff8c1a'); px(2,4,'#3a7b6a'); px(13,11,'#3a7b6a'); px(2,11,'#3a7b6a'); px(13,4,'#3a7b6a'); }),
  // commands
  'give': make(({ rect }) => { rect(3,5,10,9,GR); rect(3,5,10,1,'#6abe30'); rect(7,5,2,9,'#e8e8e8'); rect(3,8,10,2,'#e8e8e8'); rect(5,2,2,3,'#e8e8e8'); rect(9,2,2,3,'#e8e8e8'); }),
  'tp': make(({ line, rect }) => { line(2,13,11,4,'#5ad1d1'); rect(11,2,2,4,'#5ad1d1'); rect(9,4,4,2,'#5ad1d1'); line(3,14,12,5,'#3a9b9b'); }),
  'summon': make(({ rect, px }) => { rect(7,2,2,12,'#5ad1d1'); rect(2,7,12,2,'#5ad1d1'); px(4,4,'#5ad1d1'); px(11,4,'#5ad1d1'); px(4,11,'#5ad1d1'); px(11,11,'#5ad1d1'); px(7,7,'#e8e8e8'); px(8,8,'#e8e8e8'); }),
  'locate': make(({ rect, px }) => { rect(4,2,8,1,ID); rect(4,13,8,1,ID); rect(2,4,1,8,ID); rect(13,4,1,8,ID); px(3,3,ID); px(12,3,ID); px(3,12,ID); px(12,12,ID); rect(5,5,6,6,WH); rect(7,5,2,3,RED); rect(7,8,2,3,'#7a7a7a'); }),
  'gamemode': make(({ rect, px }) => { rect(6,2,4,14,ID); rect(2,6,12,4,ID); px(6,2,ID); px(12,12,'#8a8a8a'); rect(6,6,4,4,'#3a3a3a'); px(11,2,ID); px(2,11,ID); px(13,6,ID); px(4,13,'#8a8a8a'); px(11,13,'#8a8a8a'); px(2,2,'#8a8a8a'); px(13,13,'#8a8a8a'); }),
  'fill': make(({ rect, px }) => { rect(2,2,5,5,'#5ad1d1'); rect(9,2,5,5,'#3a9b9b'); rect(2,9,5,5,'#3a9b9b'); rect(9,9,5,5,'#5ad1d1'); px(6,6,'#2a7a7a'); px(9,9,'#2a7a7a'); }),
  'effect': make(({ rect, px }) => { rect(6,3,4,2,'#c8c8c8'); rect(5,5,6,8,'#9b4a9b'); rect(6,6,4,5,'#c86ac8'); px(7,7,'#e89ae8'); rect(7,1,2,2,'#8a8a8a'); px(4,13,'#7a3a7a'); px(11,13,'#7a3a7a'); }),
  'time': make(({ rect, px }) => { rect(4,2,8,1,G); rect(4,13,8,1,G); rect(2,4,1,8,G); rect(13,4,1,8,G); px(3,3,G); px(12,3,G); px(3,12,G); px(12,12,G); rect(5,5,6,6,'#fff8e0'); px(8,6,'#1a1a1a'); px(8,7,'#1a1a1a'); px(9,8,'#1a1a1a'); }),
  'weather': make(({ rect, px, line }) => { rect(4,3,8,4,'#c8c8c8'); rect(3,5,11,3,'#e8e8e8'); line(5,9,4,12,BL); line(8,9,7,12,BL); line(11,9,10,12,BL); px(13,8,BL); }),
  'enchant': make(({ rect, px }) => { rect(3,2,10,12,'#5a3a8a'); rect(4,3,8,10,'#7a5aaa'); rect(3,2,2,12,'#3a2a5a'); px(7,6,'#e8e8e8'); px(8,7,'#e8e8e8'); px(6,7,'#e8e8e8'); px(7,8,'#e8e8e8'); px(11,4,'#c8a8f0'); px(12,5,'#e8e8e8'); }),
  'setblock': make(({ rect, px }) => { rect(3,3,10,10,'#5ad1d1'); rect(4,4,8,8,'#8ad1d1'); px(5,5,'#e8e8e8'); px(6,6,'#e8e8e8'); }),
  'kill': make(({ rect, px }) => { rect(4,3,8,9,'#e8e8e8'); rect(5,13,6,2,'#e8e8e8'); px(6,6,'#1a1a1a'); px(9,6,'#1a1a1a'); px(7,9,'#1a1a1a'); px(8,9,'#1a1a1a'); rect(6,11,1,2,'#c8c8c8'); rect(9,11,1,2,'#c8c8c8'); }),
  'clear': make(({ line, rect }) => { rect(3,3,10,10,'#3a3a3a'); line(5,5,11,11,'#e84a3a'); line(11,5,5,11,'#e84a3a'); }),
  'spawnpoint': make(({ rect, px }) => { rect(4,6,8,6,RED); rect(4,6,8,1,'#d84a3a'); px(7,4,'#e8e8e8'); px(8,4,'#e8e8e8'); px(7,5,'#e8e8e8'); px(8,5,'#e8e8e8'); rect(3,12,10,1,'#8a2018'); }),
  'xp': make(({ rect, px }) => { rect(5,5,6,6,'#6abe30'); rect(6,6,4,4,'#8ad650'); px(7,7,'#d8ffb0'); px(3,3,'#8ad650'); px(12,4,'#6abe30'); px(4,12,'#6abe30'); px(11,11,'#8ad650'); }),
  'execute': make(({ rect, line, px }) => { line(9,1,5,7,G); line(5,7,8,7,G); line(8,7,4,14,G); px(10,2,'#fff3b0'); px(6,8,'#fff3b0'); }),
  'clone': make(({ rect }) => { rect(2,2,6,6,ID); rect(8,8,6,6,ID); rect(3,3,4,4,'#8a8a8a'); rect(9,9,4,4,'#8a8a8a'); rect(5,5,6,6,'#5a5a5a'); rect(6,6,4,4,'#7a7a7a'); }),
  'damage': make(({ rect, px, line }) => { rect(3,4,4,3,'#b02828'); rect(9,4,4,3,'#b02828'); rect(2,5,12,4,'#b02828'); rect(4,9,8,2,'#b02828'); rect(6,11,4,2,'#b02828'); line(8,5,7,8,'#1a1a1a'); line(7,8,9,10,'#1a1a1a'); }),
  'defaultgamemode': make(({ rect, px }) => { rect(6,2,4,14,ID); rect(2,6,12,4,ID); rect(6,6,4,4,'#3a3a3a'); px(11,2,ID); px(2,11,ID); px(13,6,ID); px(4,13,'#8a8a8a'); px(11,13,'#8a8a8a'); px(2,2,'#8a8a8a'); px(13,13,'#8a8a8a'); px(12,12,'#8a8a8a'); px(8,8,G); }),
  'difficulty': make(({ rect, px }) => { rect(2,12,12,2,'#3a3a3a'); rect(2,12,4,2,GR); rect(6,12,4,2,G); rect(10,12,2,2,'#e84a3a'); rect(11,4,3,6,'#e84a3a'); px(12,2,'#e84a3a'); px(13,3,'#e84a3a'); }),
  'gamerule': make(({ rect }) => { rect(4,2,9,12,'#f0f0f0'); rect(4,2,9,1,'#ffffff'); rect(5,4,7,1,'#7a7a7a'); rect(5,6,7,1,'#7a7a7a'); rect(5,8,7,1,'#7a7a7a'); rect(5,10,5,1,'#7a7a7a'); rect(5,12,6,1,'#3aa655'); }),
  'seed': make(({ line, px, rect }) => { line(8,15,8,9,GR); px(6,8,GR); px(10,8,GR); px(5,7,'#6abe30'); px(11,7,'#6abe30'); rect(6,4,4,3,'#c89548'); px(7,5,'#8a5a2b'); px(9,5,'#8a5a2b'); }),
  'setworldspawn': make(({ rect, px }) => { rect(7,2,2,12,'#8a5a2b'); rect(9,2,6,7,G); rect(9,2,6,1,'#fff3b0'); px(2,13,RED); px(3,12,RED); px(4,13,RED); px(3,14,RED); }),
  'schedule': make(({ rect, px }) => { rect(2,3,12,11,ID); rect(2,3,12,2,'#e84a3a'); rect(4,6,3,3,WH); rect(9,6,3,3,WH); rect(4,10,3,3,WH); rect(9,10,3,3,'#5ad1d1'); px(5,1,'#c8c8c8'); px(11,1,'#c8c8c8'); }),
  'loot': make(({ rect }) => { rect(1,3,14,11,W); rect(1,3,14,1,WL); rect(1,7,14,1,WD); rect(7,6,2,3,'#d8d8d8'); rect(1,13,14,1,WD); rect(1,3,1,11,WD); rect(14,3,1,11,WD); rect(4,9,2,2,G); rect(10,10,2,2,G); }),
  'fillbiome': make(({ rect, px }) => { rect(2,2,5,5,'#4a9b3a'); rect(9,2,5,5,'#6abe30'); rect(2,9,5,5,'#6abe30'); rect(9,9,5,5,'#3a7bd5'); px(6,6,'#2a6a2a'); px(9,9,'#2a5a9a'); }),
  'attribute': make(({ rect, px, line }) => { rect(3,5,4,3,RED); rect(9,5,4,3,RED); rect(2,6,12,4,RED); rect(4,10,8,2,RED); rect(6,12,4,2,RED); line(13,1,13,5,'#6abe30'); px(12,2,'#6abe30'); px(14,2,'#6abe30'); }),
  'item': make(({ rect }) => { rect(2,2,12,12,WD); rect(3,3,10,10,'#3a2a18'); rect(5,5,6,6,'#5ad1d1'); rect(6,6,4,4,'#8ad1d1'); }),
  'scoreboard': make(({ rect, px }) => { rect(2,2,12,12,'#1a1a1a'); rect(3,3,10,2,'#3aa655'); rect(3,6,7,1,'#e8e8e8'); rect(3,8,7,1,'#e8e8e8'); rect(3,10,7,1,'#e8e8e8'); px(11,6,G); px(12,6,G); px(11,8,G); px(11,10,G); px(12,10,G); }),
  'function': make(({ rect, px }) => { rect(3,2,10,12,'#c87a18'); rect(4,3,8,10,'#e89a28'); rect(3,2,2,12,'#8a5a10'); px(6,6,'#3a3a3a'); px(9,6,'#3a3a3a'); px(6,8,'#3a3a3a'); px(9,8,'#3a3a3a'); px(7,10,'#3a3a3a'); px(8,10,'#3a3a3a'); }),
};

for (const [slug, g] of Object.entries(icons)) writeFileSync(`public/item-icons/${slug}.svg`, svg(g));
console.log('generated', Object.keys(icons).length, 'icons');
