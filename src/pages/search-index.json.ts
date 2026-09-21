import commands from '../data/commands.json';
import recipes from '../data/recipes.json';
import enchantments from '../data/enchantments.json';
import mobs from '../data/mobs.json';
import guides from '../data/guides.json';
import villagers from '../data/villagers.json';

export async function GET() {
  const items = [
    ...commands.map(c => ({ name: `${c.name} command`, kind: 'command', url: `/commands/${c.slug}/`, keywords: c.keywords })),
    ...recipes.map(r => ({ name: `${r.name} recipe`, kind: 'recipe', url: `/recipes/${r.slug}/`, keywords: r.keywords })),
    ...enchantments.map(e => ({ name: e.name, kind: 'enchantment', url: `/enchantments/${e.slug}/`, keywords: e.keywords })),
    ...mobs.map(m => ({ name: m.name, kind: 'mob', url: `/mobs/${m.slug}/`, keywords: m.keywords })),
    ...guides.map(g => ({ name: g.name, kind: 'guide', url: `/guides/${g.slug}/`, keywords: g.keywords })),
    ...villagers.map(v => ({ name: `${v.name} villager trades`, kind: 'villager', url: `/villagers/${v.slug}/`, keywords: v.keywords })),
    { name: 'Nether Coordinate Calculator', kind: 'tool', url: '/tools/nether-calculator/', keywords: 'nether calculator coordinates convert portal 8:1' }
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}
