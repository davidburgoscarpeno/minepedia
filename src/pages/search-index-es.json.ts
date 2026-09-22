import commands from '../data/commands.json';
import recipes from '../data/recipes.json';
import enchantments from '../data/enchantments.json';
import mobs from '../data/mobs.json';
import guides from '../data/guides.json';
import guidesEs from '../data/guides-es.json';
import potions from '../data/potions.json';
import villagers from '../data/villagers.json';
import itemData from '../data/items.json';
import farms from '../data/farms.json';
import biomes from '../data/biomes.json';
import structures from '../data/structures.json';
import seeds from '../data/seeds.json';
import versions from '../data/versions.json';

export async function GET() {
  const items = [
    ...commands.map(c => ({ name: `${c.name} comando`, kind: 'comando', url: `/es/commands/${c.slug}/`, keywords: `${c.keywords} comando` })),
    ...recipes.map(r => ({ name: `${r.name} receta`, kind: 'receta', url: `/es/recipes/${r.slug}/`, keywords: `${r.keywords} receta crafteo` })),
    ...enchantments.map(e => ({ name: e.name, kind: 'encantamiento', url: `/es/enchantments/${e.slug}/`, keywords: `${e.keywords} encantamiento` })),
    ...mobs.map(m => ({ name: m.name, kind: 'mob', url: `/es/mobs/${m.slug}/`, keywords: m.keywords })),
    ...guides.map(g => ({ name: (guidesEs as any)[g.slug]?.name ?? g.name, kind: 'guía', url: `/es/guides/${g.slug}/`, keywords: `${g.keywords} guía` })),
    ...potions.map(x => ({ name: x.name, kind: 'poción', url: `/es/potions/${x.slug}/`, keywords: `${x.keywords} poción` })),
    ...villagers.map(v => ({ name: `Comercio de ${v.name}`, kind: 'aldeano', url: `/es/villagers/${v.slug}/`, keywords: `${v.keywords} aldeano comercio trades` })),
    ...itemData.map(i => ({ name: i.name, kind: 'objeto', url: `/es/items/${i.slug}/`, keywords: `${i.keywords} objeto` })),
    ...farms.map(f => ({ name: f.name, kind: 'granja', url: `/es/farms/${f.slug}/`, keywords: `${f.keywords} granja` })),
    ...biomes.map(b => ({ name: `${b.name} bioma`, kind: 'bioma', url: `/es/biomes/${b.slug}/`, keywords: `${b.keywords} bioma` })),
    ...structures.map(s => ({ name: s.name, kind: 'estructura', url: `/es/structures/${s.slug}/`, keywords: `${s.keywords} estructura` })),
    ...seeds.map(s => ({ name: s.name, kind: 'semilla', url: `/es/seeds/${s.slug}/`, keywords: `${s.keywords} semilla` })),
    ...versions.map(v => ({ name: v.name, kind: 'versión', url: `/es/versions/${v.slug}/`, keywords: `${v.keywords} versión actualización` })),
    { name: 'Calculadora de coordenadas del Nether', kind: 'herramienta', url: '/es/tools/nether-calculator/', keywords: 'nether calculadora coordenadas convertir portal 8:1 calculator' },
    { name: 'Calculadora de XP', kind: 'herramienta', url: '/es/tools/xp-calculator/', keywords: 'xp calculadora niveles experiencia puntos encantar nivel 30 calculator' },
    { name: 'Ore Finder: mejores niveles Y', kind: 'herramienta', url: '/es/tools/ore-finder/', keywords: 'minerales distribución mejor nivel y diamante hierro oro minar ore finder' },
    { name: 'Cómo instalar mods (Java)', kind: 'guía', url: '/es/mods/install-mods-java/', keywords: 'instalar mods fabric neoforge modrinth java loader carpeta mods install' },
    { name: 'Mods esenciales de rendimiento y QoL', kind: 'guía', url: '/es/mods/essential-mods/', keywords: 'sodium lithium iris fabric api jei emi jade appleskin rendimiento fps mods esenciales' },
    { name: 'Los mejores mods de contenido', kind: 'guía', url: '/es/mods/best-content-mods/', keywords: 'create mod botania twilight forest farmers delight terralith mekanism mods contenido' },
    { name: 'Guía de shaders', kind: 'guía', url: '/es/mods/shaders/', keywords: 'shaders iris complementary bsl instalar vibrant visuals' },
    { name: 'Add-ons de Bedrock', kind: 'guía', url: '/es/mods/bedrock-addons/', keywords: 'bedrock addons mcaddon marketplace consola móvil' },
    { name: 'Cómo crear un servidor de Minecraft', kind: 'guía', url: '/es/servidores/make-a-server/', keywords: 'crear servidor paper port forwarding 25565 playit whitelist eula make server' },
    { name: 'Hosting gratis para servidores', kind: 'guía', url: '/es/servidores/free-hosting/', keywords: 'aternos hosting gratis servidor java bedrock free' },
    { name: 'Plugins esenciales para servidores', kind: 'guía', url: '/es/servidores/plugins/', keywords: 'luckperms essentialsx geysermc viaversion coreprotect plugins paper' }
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}
