import commands from '../data/commands.json';
import recipes from '../data/recipes.json';
import enchantments from '../data/enchantments.json';
import mobs from '../data/mobs.json';
import guides from '../data/guides.json';
import villagers from '../data/villagers.json';
import itemData from '../data/items.json';
import farms from '../data/farms.json';
import biomes from '../data/biomes.json';
import structures from '../data/structures.json';
import seeds from '../data/seeds.json';
import versions from '../data/versions.json';

export async function GET() {
  const items = [
    ...commands.map(c => ({ name: `${c.name} command`, kind: 'command', url: `/commands/${c.slug}/`, keywords: c.keywords })),
    ...recipes.map(r => ({ name: `${r.name} recipe`, kind: 'recipe', url: `/recipes/${r.slug}/`, keywords: r.keywords })),
    ...enchantments.map(e => ({ name: e.name, kind: 'enchantment', url: `/enchantments/${e.slug}/`, keywords: e.keywords })),
    ...mobs.map(m => ({ name: m.name, kind: 'mob', url: `/mobs/${m.slug}/`, keywords: m.keywords })),
    ...guides.map(g => ({ name: g.name, kind: 'guide', url: `/guides/${g.slug}/`, keywords: g.keywords })),
    ...villagers.map(v => ({ name: `${v.name} villager trades`, kind: 'villager', url: `/villagers/${v.slug}/`, keywords: v.keywords })),
    ...itemData.map(i => ({ name: i.name, kind: 'item', url: `/items/${i.slug}/`, keywords: i.keywords })),
    ...farms.map(f => ({ name: f.name, kind: 'farm', url: `/farms/${f.slug}/`, keywords: f.keywords })),
    ...biomes.map(b => ({ name: `${b.name} biome`, kind: 'biome', url: `/biomes/${b.slug}/`, keywords: b.keywords })),
    ...structures.map(s => ({ name: s.name, kind: 'structure', url: `/structures/${s.slug}/`, keywords: s.keywords })),
    ...seeds.map(s => ({ name: s.name, kind: 'seed', url: `/seeds/${s.slug}/`, keywords: s.keywords })),
    ...versions.map(v => ({ name: v.name, kind: 'version', url: `/versions/${v.slug}/`, keywords: v.keywords })),
    { name: 'Nether Coordinate Calculator', kind: 'tool', url: '/tools/nether-calculator/', keywords: 'nether calculator coordinates convert portal 8:1' },
    { name: 'XP Calculator', kind: 'tool', url: '/tools/xp-calculator/', keywords: 'xp calculator levels experience points enchanting level 30' },
    { name: 'Ore Finder: Best Y Levels', kind: 'tool', url: '/tools/ore-finder/', keywords: 'ore distribution best y level diamond iron gold mining' },
    { name: 'How to Install Mods', kind: 'guide', url: '/mods/install-mods-java/', keywords: 'install mods fabric neoforge modrinth java loader mods folder' },
    { name: 'Essential Performance Mods', kind: 'guide', url: '/mods/essential-mods/', keywords: 'sodium lithium iris fabric api jei emi jade appleskin performance fps' },
    { name: 'Best Content Mods', kind: 'guide', url: '/mods/best-content-mods/', keywords: 'create mod botania twilight forest farmers delight terralith mekanism' },
    { name: 'Shaders Guide', kind: 'guide', url: '/mods/shaders/', keywords: 'shaders iris complementary bsl install vibrant visuals' },
    { name: 'Bedrock Add-ons', kind: 'guide', url: '/mods/bedrock-addons/', keywords: 'bedrock addons mcaddon marketplace console mobile' }
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}
