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
    { name: 'Guía de advancements de Minecraft', kind: 'guía', url: '/es/advancements/', keywords: 'advancements logros lista todas las pestañas java guía' },
    { name: 'How Did We Get Here? (advancement)', kind: 'advancement', url: '/es/advancements/how-did-we-get-here/', keywords: 'how did we get here todos los efectos desafío oculto 27' },
    { name: 'Hidden in the Depths (advancement)', kind: 'advancement', url: '/es/advancements/hidden-in-the-depths/', keywords: 'ancient debris encontrar netherite minar y15' },
    { name: 'Hot Tourist Destinations (advancement)', kind: 'advancement', url: '/es/advancements/hot-tourist-destinations/', keywords: 'biomas nether explorar todos basalt deltas warped forest' },
    { name: 'Cover Me in Debris (advancement)', kind: 'advancement', url: '/es/advancements/cover-me-in-debris/', keywords: 'armadura netherite completa mejora smithing template' },
    { name: 'Hero of the Village (advancement)', kind: 'advancement', url: '/es/advancements/hero-of-the-village/', keywords: 'raid incursión defender aldea bad omen héroe descuento' },
    { name: 'Sniper Duel (advancement)', kind: 'advancement', url: '/es/advancements/sniper-duel/', keywords: 'skeleton 50 metros flecha arco matar' },
    { name: 'Two by Two (advancement)', kind: 'advancement', url: '/es/advancements/two-by-two/', keywords: 'criar todos los animales lista' },
    { name: 'Serious Dedication (advancement)', kind: 'advancement', url: '/es/advancements/serious-dedication/', keywords: 'azada netherite mejora smithing' },
    { name: 'Free the End (advancement)', kind: 'advancement', url: '/es/advancements/free-the-end/', keywords: 'ender dragon matar end combate guía' },
    { name: "Sky's the Limit (advancement)", kind: 'advancement', url: '/es/advancements/sky-s-the-limit/', keywords: 'elytra encontrar end city barco end exterior' },
    { name: 'Zombie Doctor (advancement)', kind: 'advancement', url: '/es/advancements/zombie-doctor/', keywords: 'cure zombie villager weakness golden apple trade discount' },
    { name: 'Eye Spy (advancement)', kind: 'advancement', url: '/es/advancements/eye-spy/', keywords: 'eye of ender stronghold find throw end portal' },
    { name: 'Cover Me with Diamonds (advancement)', kind: 'advancement', url: '/es/advancements/cover-me-with-diamonds/', keywords: 'diamond armor craft mine y -59' },
    { name: 'Those Were the Days (advancement)', kind: 'advancement', url: '/es/advancements/those-were-the-days/', keywords: 'bastion remnant enter nether piglin gold armor' },
    { name: 'War Pigs (advancement)', kind: 'advancement', url: '/es/advancements/war-pigs/', keywords: 'bastion chest loot piglin brute treasure netherite template' },
    { name: 'Uneasy Alliance (advancement)', kind: 'advancement', url: '/es/advancements/uneasy-alliance/', keywords: 'ghast overworld portal lure fishing rod kill' },
    { name: 'Withering Heights (advancement)', kind: 'advancement', url: '/es/advancements/withering-heights/', keywords: 'summon wither skulls soul sand farm looting' },
    { name: 'Beaconator (advancement)', kind: 'advancement', url: '/es/advancements/beaconator/', keywords: 'beacon full power pyramid 164 blocks nether star' },
    { name: 'A Furious Cocktail (advancement)', kind: 'advancement', url: '/es/advancements/a-furious-cocktail/', keywords: 'all potion effects 17 turtle master splash' },
    { name: 'The Next Generation (advancement)', kind: 'advancement', url: '/es/advancements/the-next-generation/', keywords: 'dragon egg collect torch piston trophy' },
    { name: 'You Need a Mint (advancement)', kind: 'advancement', url: '/es/advancements/you-need-a-mint/', keywords: 'dragons breath bottle lingering potion collect' },
    { name: 'The City at the End of the Game (advancement)', kind: 'advancement', url: '/es/advancements/the-city-at-the-end-of-the-game/', keywords: 'end city gateway pearl outer islands' },
    { name: 'Voluntary Exile (advancement)', kind: 'advancement', url: '/es/advancements/voluntary-exile/', keywords: 'raid captain kill ominous bottle bad omen hidden' },
    { name: 'Monsters Hunted (advancement)', kind: 'advancement', url: '/es/advancements/monsters-hunted/', keywords: 'kill every hostile monster 41 warden breeze list' },
    { name: 'Adventuring Time (advancement)', kind: 'advancement', url: '/es/advancements/adventuring-time/', keywords: 'visit every biome 56 explore elytra 500 xp' },
    { name: 'Postmortal (advancement)', kind: 'advancement', url: '/es/advancements/postmortal/', keywords: 'totem of undying evoker cheat death use' },
    { name: 'Very Very Frightening (advancement)', kind: 'advancement', url: '/es/advancements/very-very-frightening/', keywords: 'lightning villager channeling trident thunderstorm witch' },
    { name: 'Bullseye (advancement)', kind: 'advancement', url: '/es/advancements/bullseye/', keywords: 'target block bullseye 30 blocks arrow redstone' },
    { name: 'A Complete Catalogue (advancement)', kind: 'advancement', url: '/es/advancements/a-complete-catalogue/', keywords: 'tame all cat variants 11 village swamp hut' },
    { name: 'Best Friends Forever (advancement)', kind: 'advancement', url: '/es/advancements/best-friends-forever/', keywords: 'tame animal wolf bones cat fish' },
    { name: 'A Balanced Diet (advancement)', kind: 'advancement', url: '/es/advancements/a-balanced-diet/', keywords: 'eat every food 40 suspicious stew pufferfish' },
    { name: 'Cómo crear un servidor de Minecraft', kind: 'guía', url: '/es/servidores/make-a-server/', keywords: 'crear servidor paper port forwarding 25565 playit whitelist eula make server' },
    { name: 'Hosting gratis para servidores', kind: 'guía', url: '/es/servidores/free-hosting/', keywords: 'aternos hosting gratis servidor java bedrock free' },
    { name: 'Plugins esenciales para servidores', kind: 'guía', url: '/es/servidores/plugins/', keywords: 'luckperms essentialsx geysermc viaversion coreprotect plugins paper' }
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}
