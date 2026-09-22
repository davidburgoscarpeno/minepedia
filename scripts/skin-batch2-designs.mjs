// Batch 2: 48 more original designs, drawn with the shared helpers.
const DESIGNS = [];
const T = {
  fantasy: 'Fantasy & Adventure', prof: 'Professions', style: 'Styles',
  animal: 'Animals', sport: 'Sports'
};
// skin tones and hair colors to vary across designs
const SKINS = ['#f2c9a4', '#e0ac82', '#c98a5e', '#a06a42', '#7b4b2a', '#f7d7b5'];
const HAIRS = ['#4a3b2a', '#1d1a16', '#8a5a2b', '#c9a15a', '#7a2e1d', '#5b5b66', '#2f4d2a', '#e8e8ec'];

function D(slug, name, category, tags, desc, base, extra) {
  DESIGNS.push({ slug, name, category, tags, desc, draw() { const S = person(base); if (extra) extra(S); return S; } });
}
const hx = h => hex(h);

// ---------- Fantasy & Adventure ----------
D('barbarian', 'Frost Barbarian', T.fantasy, ['barbarian', 'viking', 'warrior'], 'A rugged barbarian with fur straps, war paint and a horned helm. Made for snowy raids and tundra camps.',
  { skin: SKINS[0], hair: 'long', hairC: HAIRS[4], shirt: '#7a5c3d', sleeves: '#6b4f33', pants: '#4a3a28', shoes: '#2e2418' },
  S => { horns(S, hx('#e8e2d5')); belt(S, hx('#3a2c1c'), hx('#b8b0a0')); S.frect('head', 'front', 0, 3, 1, 1, hx('#2a4d8f')); S.frect('head', 'front', 7, 3, 1, 1, hx('#2a4d8f')); hands(S, hx('#5c4630')); });
D('elf-archer', 'Elf Archer', T.fantasy, ['elf', 'archer', 'bow', 'forest'], 'A forest elf in leaf-green leather with a quiver strap and hood. For players who live in the treetops.',
  { skin: SKINS[5], hair: 'long', hairC: HAIRS[6], shirt: '#3d6b35', sleeves: '#3d6b35', pants: '#2e4a28', shoes: '#22331e' },
  S => { hood(S, hx('#2e5527')); chestStrap(S, hx('#8a6a3d')); belt(S, hx('#543f24')); });
D('dwarf-miner', 'Dwarf Miner', T.fantasy, ['dwarf', 'miner', 'underground'], 'A stout dwarf miner with a beard, iron helm and heavy boots. Born for deepslate and diamonds.',
  { skin: SKINS[1], hair: 'buzz', hairC: HAIRS[4], shirt: '#7a4a2e', sleeves: '#7a4a2e', pants: '#4f3a2a', shoes: '#2a2019' },
  S => { hatBox(S, hx('#8d949c')); S.frect('head', 'front', 2, 5, 4, 3, hx('#a03d20')); S.frect('hat', 'front', 1, 3, 6, 1, hx('#23272e')); belt(S, hx('#332619'), hx('#ffd166')); });
D('necromancer', 'Necromancer', T.fantasy, ['necromancer', 'dark', 'magic', 'skeleton'], 'A hooded necromancer in bone-white and midnight purple, skull sigil on the chest. Soul sand valley approved.',
  { skin: SKINS[4], hair: 'bald', shirt: '#2a2136', sleeves: '#2a2136', pants: '#1c1626', shoes: '#120e1a' },
  S => { robe(S, hx('#2a2136'), hx('#6d28d9')); hood(S, hx('#221a2e')); emblemSkull(S, hx('#e8e2d5')); });
D('paladin', 'Paladin of Dawn', T.fantasy, ['paladin', 'holy', 'knight', 'light'], 'A shining paladin in white and gold plate with a sun emblem. Smite first, ask questions later.',
  { skin: SKINS[0], hair: 'short', hairC: HAIRS[3], shirt: '#e8e6df', sleeves: '#d9d5c9', pants: '#8d8571', shoes: '#4a463c' },
  S => { emblemStar(S, hx('#ffd166')); belt(S, hx('#6b6455'), hx('#ffd166')); hatBox(S, hx('#d9d5c9')); S.frect('hat', 'front', 1, 3, 6, 1, hx('#23272e')); S.frect('hat', 'top', 3, 2, 2, 5, hx('#ffd166')); });
D('druid', 'Wild Druid', T.fantasy, ['druid', 'nature', 'forest', 'magic'], 'A druid in bark and moss tones with a flower crown and vine wraps. Speaks fluent oak.',
  { skin: SKINS[1], hair: 'long', hairC: HAIRS[0], shirt: '#5b6e3a', sleeves: '#52632f', pants: '#3d4a26', shoes: '#2c3519' },
  S => { emblemFlower(S, hx('#e8a0c0')); crown(S); S.frect('hat', 'top', 0, 0, 2, 2, hx('#7aa05a')); S.frect('hat', 'top', 6, 0, 2, 2, hx('#e8a0c0')); });
D('samurai', 'Crimson Samurai', T.fantasy, ['samurai', 'japan', 'warrior', 'katana'], 'A samurai in crimson lamellar armor with a dark kabuto helm. Honor, discipline, and a very sharp katana.',
  { skin: SKINS[1], hair: 'buzz', hairC: HAIRS[1], shirt: '#a02030', sleeves: '#8f1c2b', pants: '#33272a', shoes: '#1d1517' },
  S => { belt(S, hx('#1d1517'), hx('#ffd166')); hatBox(S, hx('#2a2226')); horns(S, hx('#d9d5c9')); S.frect('hat', 'front', 1, 3, 6, 1, hx('#0f0c0e')); });
D('viking', 'Norse Viking', T.fantasy, ['viking', 'norse', 'raid', 'axe'], 'A Norse raider with a braided beard, fur cloak and round-shield colors on the chest. For longboat crews.',
  { skin: SKINS[0], hair: 'long', hairC: HAIRS[2], shirt: '#4a5d6b', sleeves: '#4a5d6b', pants: '#37424b', shoes: '#252d33' },
  S => { S.frect('head', 'front', 2, 5, 4, 3, HAIRS[2] ? hx(HAIRS[2]) : hx('#8a5a2b')); belt(S, hx('#2c343a'), hx('#b8b0a0')); hood(S, hx('#5c4630')); emblemStar(S, hx('#c9c2b4')); });
D('monk', 'Mountain Monk', T.fantasy, ['monk', 'robe', 'peaceful'], 'A calm mountain monk in saffron robes with a prayer sash. Punches trees with enlightened fists.',
  { skin: SKINS[2], hair: 'bald', shirt: '#d98a2b', sleeves: '#c97e24', pants: '#a86420', shoes: '#5c3c14' },
  S => { robe(S, hx('#d98a2b'), hx('#8f1c2b')); });
D('frost-mage', 'Frost Mage', T.fantasy, ['mage', 'ice', 'frost', 'magic'], 'An ice mage in glacier blues with a snowflake sigil and frosted hood. Powder snow optional but encouraged.',
  { skin: SKINS[5], hair: 'short', hairC: HAIRS[7], shirt: '#3a6ea8', sleeves: '#34649a', pants: '#29496e', shoes: '#1d3349' },
  S => { robe(S, hx('#3a6ea8'), hx('#cfe8f5')); hood(S, hx('#2e5680')); emblemStar(S, hx('#cfe8f5')); });

// ---------- Professions ----------
D('miner', 'Cave Miner', T.prof, ['miner', 'cave', 'torch', 'diamonds'], 'A hard-working cave miner with a torch-lit helm and dust-stained overalls. Always digs straight down anyway.',
  { skin: SKINS[1], hair: 'buzz', hairC: HAIRS[0], shirt: '#7a6a4a', sleeves: '#7a6a4a', pants: '#4a5568', shoes: '#2a2f38' },
  S => { hatBox(S, hx('#c9a13a')); S.frect('hat', 'front', 3, 3, 2, 2, hx('#fff3b0')); belt(S, hx('#33302a')); });
D('blacksmith', 'Village Blacksmith', T.prof, ['blacksmith', 'anvil', 'smith', 'village'], 'A burly blacksmith with a leather apron and sooty gloves. Smithing templates sold separately.',
  { skin: SKINS[2], hair: 'buzz', hairC: HAIRS[1], shirt: '#5c5148', sleeves: '#5c5148', pants: '#3e3833', shoes: '#26221f' },
  S => { apron(S, hx('#7a5c3d')); hands(S, hx('#3a342f')); belt(S, hx('#2c2825')); });
D('fisher', 'River Fisher', T.prof, ['fisher', 'fishing', 'river', 'boat'], 'A patient fisher in waders and a bucket hat. Has strong opinions about lure enchantments.',
  { skin: SKINS[1], hair: 'short', hairC: HAIRS[7], shirt: '#4a6b5c', sleeves: '#4a6b5c', pants: '#374f44', shoes: '#25352d' },
  S => { beanie(S, hx('#c9a15a')); vest(S, hx('#8a6a3d')); });
D('baker', 'Village Baker', T.prof, ['baker', 'bread', 'food', 'village'], 'A cheerful baker dusted with flour, rolling pin at the ready. Bread for the whole village.',
  { skin: SKINS[0], hair: 'ponytail', hairC: HAIRS[2], shirt: '#f1ede4', sleeves: '#f1ede4', pants: '#7a6a55', shoes: '#4a4034' },
  S => { apron(S, hx('#e0d8c8')); beanie(S, hx('#f5f2ea')); emblemHeart(S, hx('#c9a15a')); });
D('librarian', 'Librarian', T.prof, ['librarian', 'books', 'enchanting', 'glasses'], 'A quiet librarian in tweed with round glasses. Knows every enchantment by heart.',
  { skin: SKINS[3], hair: 'short', hairC: HAIRS[5], shirt: '#6b5a45', sleeves: '#6b5a45', pants: '#453b2e', shoes: '#2c251d' },
  S => { glasses(S, hx('#2a2118')); collar(S, hx('#e8e2d5')); tie(S, hx('#8f1c2b')); });
D('beekeeper', 'Beekeeper', T.prof, ['beekeeper', 'bees', 'honey', 'farm'], 'A careful beekeeper in a cream veil suit with honey-gold boots. The bees love them. Mostly.',
  { skin: SKINS[1], hair: 'buzz', hairC: HAIRS[3], shirt: '#efe8d8', sleeves: '#efe8d8', pants: '#d9d0bc', shoes: '#c9a13a' },
  S => { hatBox(S, hx('#f5f1e6')); S.frect('hat', 'front', 1, 2, 6, 4, hx('#d9d2c0')); belt(S, hx('#8a6a3d')); });
D('sailor', 'Ocean Sailor', T.prof, ['sailor', 'sea', 'ocean', 'navy'], 'A seasoned sailor in navy stripes with an anchor on the chest. Sunken ships fear them.',
  { skin: SKINS[0], hair: 'buzz', hairC: HAIRS[1], shirt: '#f1f3f6', sleeves: '#f1f3f6', pants: '#2a4d8f', shoes: '#1d2f55' },
  S => { for (let y = 2; y < 9; y += 2) S.frect('body', 'front', 0, y, 8, 1, hx('#2a4d8f')); cap(S, hx('#2a4d8f')); emblemStar(S, hx('#2a4d8f')); });
D('detective', 'Village Detective', T.prof, ['detective', 'mystery', 'coat'], 'A sharp-eyed detective in a long coat and flat cap. Solved the case of the missing emeralds.',
  { skin: SKINS[2], hair: 'buzz', hairC: HAIRS[1], shirt: '#5c4a38', sleeves: '#5c4a38', pants: '#3e3328', shoes: '#262019' },
  S => { cap(S, hx('#6b5a45')); collar(S, hx('#e8e2d5')); tie(S, hx('#4a3b2a')); belt(S, hx('#2c251d')); });
D('mail-carrier', 'Mail Carrier', T.prof, ['mail', 'post', 'delivery'], 'A speedy mail carrier with a satchel strap and red cap. Delivers cross-dimension, rain or shine.',
  { skin: SKINS[3], hair: 'short', hairC: HAIRS[1], shirt: '#3a6ea8', sleeves: '#3a6ea8', pants: '#2b3a4a', shoes: '#1c2630' },
  S => { cap(S, hx('#c1121f')); chestStrap(S, hx('#8a6a3d')); emblemStar(S, hx('#f1f3f6')); });
D('builder', 'Master Builder', T.prof, ['builder', 'construction', 'helmet'], 'A master builder with a hi-vis vest and hard hat. Measures twice, places once.',
  { skin: SKINS[1], hair: 'buzz', hairC: HAIRS[0], shirt: '#e8e2d5', sleeves: '#e8e2d5', pants: '#4a4f57', shoes: '#2f3339' },
  S => { vest(S, hx('#e8930c')); hatBox(S, hx('#ffd166')); belt(S, hx('#33302a')); });

// ---------- Styles ----------
D('streetwear', 'Streetwear Kid', T.style, ['streetwear', 'urban', 'sneakers', 'cap'], 'Fresh streetwear: oversized hoodie, crisp sneakers and a backwards cap. Spawn-point swagger.',
  { skin: SKINS[2], hair: 'buzz', hairC: HAIRS[1], shirt: '#e8e2d5', sleeves: '#e8e2d5', pants: '#2a2f38', shoes: '#f1f3f6' },
  S => { hood(S, hx('#d9d2c4')); cap(S, hx('#c1121f')); emblemBolt(S, hx('#2a2f38')); });
D('skater', 'Skater', T.style, ['skater', 'skate', 'casual'], 'A laid-back skater with a checked shirt, beanie and worn sneakers. Kickflips over fences.',
  { skin: SKINS[0], hair: 'short', hairC: HAIRS[4], shirt: '#8f1c2b', sleeves: '#8f1c2b', pants: '#3d4450', shoes: '#e8e2d5' },
  S => { beanie(S, hx('#2a2f38')); legStripes(S, hx('#f1f3f6')); });
D('goth', 'Goth', T.style, ['goth', 'dark', 'black'], 'All black everything, silver studs and a streak of violet hair. Listens to discs 11 and 13 on repeat.',
  { skin: SKINS[5], hair: 'long', hairC: HAIRS[1], shirt: '#1c1a20', sleeves: '#1c1a20', pants: '#141218', shoes: '#0e0d11' },
  S => { S.frect('head', 'front', 0, 0, 2, 8, hx('#6d28d9')); emblemSkull(S, hx('#b8b0c0')); belt(S, hx('#3a3642'), hx('#b8b0c0')); });
D('cyberpunk', 'Cyberpunk', T.style, ['cyberpunk', 'neon', 'future', 'tech'], 'Neon visor, circuit jacket and glow stripes. Hacked the mainframe, then the crafting table.',
  { skin: SKINS[1], hair: 'mohawk', hairC: hx ? '#22d3ee' : '#22d3ee', shirt: '#22262e', sleeves: '#22262e', pants: '#191c22', shoes: '#101216' },
  S => { S.frect('head', 'front', 1, 3, 6, 1, hx('#22d3ee')); legStripes(S, hx('#e935c1')); emblemBolt(S, hx('#22d3ee')); });
D('pastel', 'Pastel Dream', T.style, ['pastel', 'cute', 'soft', 'kawaii'], 'Soft pastel hoodie, star pin and comfy joggers. Builds only in cherry groves.',
  { skin: SKINS[5], hair: 'long', hairC: hx('#e8a0c0'), shirt: '#f5d5e8', sleeves: '#f5d5e8', pants: '#cfe0f5', shoes: '#f1f3f6' },
  S => { hood(S, hx('#eec7df')); emblemStar(S, hx('#8ab4e8')); ears(S, hx('#f5d5e8')); });
D('vintage', 'Vintage Explorer', T.style, ['vintage', 'retro', 'classic'], 'Sepia tones, rolled sleeves and a flat cap. Keeps a paper map even with /locate available.',
  { skin: SKINS[1], hair: 'short', hairC: HAIRS[0], shirt: '#c9b896', sleeves: '#c9b896', pants: '#6b5a45', shoes: '#453b2e' },
  S => { cap(S, hx('#8a7a5c')); scarf(S, hx('#8f1c2b')); belt(S, hx('#4a3f31')); });
D('hiphop', 'Hip-Hop Artist', T.style, ['hiphop', 'music', 'gold', 'urban'], 'Track jacket, gold chain and headphones around the neck. Drops bars, then beats.',
  { skin: SKINS[3], hair: 'buzz', hairC: HAIRS[1], shirt: '#2a2f38', sleeves: '#2a2f38', pants: '#1c2026', shoes: '#f1f3f6' },
  S => { headphones(S, hx('#ffd166')); S.frect('body', 'front', 3, 2, 2, 1, hx('#ffd166')); legStripes(S, hx('#f1f3f6')); });
D('emo', 'Emo Kid', T.style, ['emo', 'dark', 'stripes'], 'Side-swept hair, striped sleeves and skinny jeans. Feels the rain of the plains biome deeply.',
  { skin: SKINS[5], hair: 'long', hairC: HAIRS[1], shirt: '#22262e', sleeves: '#22262e', pants: '#191c22', shoes: '#0e0d11' },
  S => { S.frect('head', 'front', 0, 0, 4, 4, HAIRS[1] ? hx(HAIRS[1]) : hx('#1d1a16')); for (let y = 2; y < 9; y += 2) { S.frect('rarm', 'front', 0, y, 4, 1, hx('#8f1c2b')); S.frect('larm', 'front', 0, y, 4, 1, hx('#8f1c2b')); } });
D('preppy', 'Preppy Student', T.style, ['preppy', 'school', 'smart'], 'Crisp collar, knitted vest and loafers. Top of the class in redstone engineering.',
  { skin: SKINS[0], hair: 'short', hairC: HAIRS[2], shirt: '#e8e2d5', sleeves: '#e8e2d5', pants: '#37424b', shoes: '#5c4630' },
  S => { vest(S, hx('#2a4d6b')); collar(S, hx('#f5f2ea')); tie(S, hx('#8f1c2b')); });
D('rocker', 'Rocker', T.style, ['rock', 'music', 'leather', 'band'], 'Leather jacket, band tee and studded belt. Plays note-block solos at max volume.',
  { skin: SKINS[1], hair: 'mohawk', hairC: hx('#c1121f'), shirt: '#1c1a20', sleeves: '#1c1a20', pants: '#22262e', shoes: '#0e0d11' },
  S => { emblemBolt(S, hx('#e8e2d5')); belt(S, hx('#3a3642'), hx('#b8b0c0')); hands(S, hx('#1c1a20')); });

// ---------- Animals ----------
D('fox-hoodie', 'Fox Hoodie', T.animal, ['fox', 'hoodie', 'orange', 'cute'], 'A cozy orange fox hoodie with ears, white belly and a fluffy tail-back. Taiga approved.',
  { skin: SKINS[1], hair: 'buzz', hairC: HAIRS[2], shirt: '#e8763a', sleeves: '#e8763a', pants: '#c9612c', shoes: '#f1ede4' },
  S => { hood(S, hx('#d96a30')); ears(S, hx('#e8763a')); S.frect('body', 'front', 2, 2, 4, 7, hx('#f5efe4')); });
D('panda-onesie', 'Panda Onesie', T.animal, ['panda', 'onesie', 'cute', 'bamboo'], 'A full panda onesie: black ears, white belly, maximum cozy. Jungle pyjama party ready.',
  { skin: SKINS[5], hair: 'buzz', hairC: HAIRS[3], shirt: '#f1f3f6', sleeves: '#2a2a2e', pants: '#f1f3f6', shoes: '#2a2a2e' },
  S => { hood(S, hx('#f1f3f6')); ears(S, hx('#2a2a2e')); S.frect('body', 'front', 2, 2, 4, 7, hx('#f8f9fb')); hands(S, hx('#2a2a2e')); });
D('cat-hoodie', 'Cat Hoodie', T.animal, ['cat', 'hoodie', 'cute', 'pet'], 'A grey tabby cat hoodie with ears and whisker stripes. Purrs near fireplaces, hisses at creepers.',
  { skin: SKINS[0], hair: 'short', hairC: HAIRS[5], shirt: '#8d8d96', sleeves: '#8d8d96', pants: '#6e6e78', shoes: '#f1ede4' },
  S => { hood(S, hx('#7e7e88')); ears(S, hx('#8d8d96')); S.frect('body', 'front', 2, 2, 4, 7, hx('#d9d9de')); });
D('frog-onesie', 'Frog Onesie', T.animal, ['frog', 'onesie', 'swamp', 'cute'], 'A bright green frog onesie with big eyes on the hood. Swamp jumps not included.',
  { skin: SKINS[1], hair: 'buzz', hairC: HAIRS[1], shirt: '#5aa843', sleeves: '#5aa843', pants: '#4a8f36', shoes: '#3d7329' },
  S => { hood(S, hx('#4f9c3a')); S.frect('hat', 'top', 1, 1, 2, 2, hx('#f1f3f6')); S.frect('hat', 'top', 5, 1, 2, 2, hx('#f1f3f6')); S.frect('body', 'front', 2, 2, 4, 7, hx('#cfe8a8')); });
D('penguin-onesie', 'Penguin Onesie', T.animal, ['penguin', 'onesie', 'ice', 'cute'], 'A tuxedo-sharp penguin onesie with orange feet. Slide across frozen oceans in style.',
  { skin: SKINS[2], hair: 'buzz', hairC: HAIRS[1], shirt: '#2a2f38', sleeves: '#2a2f38', pants: '#22262e', shoes: '#e8930c' },
  S => { hood(S, hx('#22262e')); S.frect('body', 'front', 2, 2, 4, 8, hx('#f1f3f6')); S.frect('hat', 'front', 3, 3, 2, 1, hx('#e8930c')); });
D('bee-hoodie', 'Bee Hoodie', T.animal, ['bee', 'hoodie', 'honey', 'stripes'], 'A fuzzy bee hoodie with stripes, wings on the back and little antennae. Buzz responsibly.',
  { skin: SKINS[0], hair: 'buzz', hairC: HAIRS[3], shirt: '#f5c93a', sleeves: '#f5c93a', pants: '#2a2a2e', shoes: '#1c1c20' },
  S => { for (let y = 2; y < 10; y += 3) S.frect('body', 'front', 0, y, 8, 1, hx('#2a2a2e')); antennae(S, hx('#2a2a2e')); S.frect('jacket', 'back', 2, 2, 4, 4, hx('#cfe8f5')); });
D('creeper-hoodie', 'Creeper Hoodie', T.animal, ['creeper', 'hoodie', 'green', 'mob'], 'A creeper-green hoodie with the classic face on the chest. Ssssshould not be worn near flint and steel.',
  { skin: SKINS[1], hair: 'buzz', hairC: HAIRS[0], shirt: '#4a8f36', sleeves: '#4a8f36', pants: '#374f2c', shoes: '#26401f' },
  S => { hood(S, hx('#3d7329')); emblemCreeper(S, hx('#1c2b16')); });
D('wolf-hoodie', 'Wolf Hoodie', T.animal, ['wolf', 'hoodie', 'dog', 'pet'], 'A loyal wolf hoodie in taiga grey with a red collar tag. Bones not included.',
  { skin: SKINS[1], hair: 'short', hairC: HAIRS[0], shirt: '#9aa0a8', sleeves: '#9aa0a8', pants: '#7d838c', shoes: '#5c6169' },
  S => { hood(S, hx('#8a9098')); ears(S, hx('#9aa0a8')); S.frect('body', 'front', 2, 2, 4, 7, hx('#e8e2d5')); S.frect('body', 'front', 0, 1, 8, 1, hx('#c1121f')); });

// ---------- Sports ----------
D('soccer', 'Soccer Striker', T.sport, ['soccer', 'football', 'striker', 'team'], 'Classic striker kit in red and white, number 9 on the chest. Screams GOL at every goal.',
  { skin: SKINS[2], hair: 'short', hairC: HAIRS[1], shirt: '#c1121f', sleeves: '#c1121f', pants: '#f1f3f6', shoes: '#1c1c20' },
  S => { jerseyNumber(S, 9, hx('#f1f3f6')); legStripes(S, hx('#c1121f')); });
D('basketball', 'Basketball Guard', T.sport, ['basketball', 'nba', 'jersey', 'sport'], 'A purple-and-gold jersey with high socks and court shoes. Alley-oops over ravines.',
  { skin: SKINS[3], hair: 'buzz', hairC: HAIRS[1], shirt: '#6d28d9', sleeves: '#6d28d9', pants: '#6d28d9', shoes: '#f1f3f6' },
  S => { jerseyNumber(S, 23, hx('#ffd166')); legStripes(S, hx('#ffd166')); });
D('tennis', 'Tennis Player', T.sport, ['tennis', 'sport', 'white'], 'All-whites tennis kit with a sweatband and grass-court shoes. Serves at 200 km/h.',
  { skin: SKINS[0], hair: 'ponytail', hairC: HAIRS[3], shirt: '#f5f2ea', sleeves: '#f5f2ea', pants: '#f5f2ea', shoes: '#e8e2d5' },
  S => { S.frect('head', 'front', 0, 1, 8, 1, hx('#5aa843')); legStripes(S, hx('#5aa843')); });
D('boxer', 'Boxer', T.sport, ['boxing', 'fighter', 'sport', 'gloves'], 'Ring-ready boxer with gloves up and a champion belt. Float like a phantom, sting like a bee nest.',
  { skin: SKINS[3], hair: 'buzz', hairC: HAIRS[1], shirt: '#8f1c2b', sleeves: '#8f1c2b', pants: '#1c1c20', shoes: '#f1f3f6' },
  S => { hands(S, hx('#c1121f')); belt(S, hx('#ffd166'), hx('#f1f3f6')); });
D('swimmer', 'Swimmer', T.sport, ['swim', 'pool', 'sport', 'goggles'], 'Streamlined swim kit with goggles and cap. Dolphin\'s Grace not required but appreciated.',
  { skin: SKINS[1], hair: 'bald', shirt: '#2a6b8f', sleeves: '#2a6b8f', pants: '#1d4a64', shoes: '#2a6b8f' },
  S => { glasses(S, hx('#22d3ee')); beanie(S, hx('#1d4a64')); legStripes(S, hx('#22d3ee')); });
D('cyclist', 'Cyclist', T.sport, ['cycling', 'bike', 'sport', 'race'], 'Aero jersey, race number and padded shorts. Beats any minecart on flat ground.',
  { skin: SKINS[0], hair: 'buzz', hairC: HAIRS[2], shirt: '#e8930c', sleeves: '#e8930c', pants: '#1c1c20', shoes: '#f1f3f6' },
  S => { hatBox(S, hx('#2a2f38')); jerseyNumber(S, 7, hx('#1c1c20')); legStripes(S, hx('#e8930c')); });
D('skier', 'Skier', T.sport, ['ski', 'snow', 'winter', 'sport'], 'Insulated ski suit, goggles and a pom beanie. Shreds powder snow without sinking.',
  { skin: SKINS[5], hair: 'short', hairC: HAIRS[3], shirt: '#3a6ea8', sleeves: '#3a6ea8', pants: '#2a4d6b', shoes: '#1c2f42' },
  S => { beanie(S, hx('#c1121f')); glasses(S, hx('#22d3ee')); scarf(S, hx('#f1f3f6')); });
D('runner', 'Marathon Runner', T.sport, ['running', 'marathon', 'sport'], 'Featherlight singlet, race bib and split shorts. Outruns phantoms at dawn.',
  { skin: SKINS[4], hair: 'buzz', hairC: HAIRS[1], shirt: '#22b8a0', sleeves: '#22b8a0', pants: '#1c1c20', shoes: '#f1f3f6' },
  S => { jerseyNumber(S, 42, hx('#f1f3f6')); legStripes(S, hx('#22b8a0')); });
D('goalkeeper', 'Goalkeeper', T.sport, ['goalkeeper', 'soccer', 'gloves', 'sport'], 'High-vis keeper kit with padded elbows and grippy gloves. Nothing gets past. Nothing.',
  { skin: SKINS[2], hair: 'short', hairC: HAIRS[0], shirt: '#e8e80c', sleeves: '#e8e80c', pants: '#1c1c20', shoes: '#f1f3f6' },
  S => { hands(S, hx('#c9c9cf')); jerseyNumber(S, 1, hx('#1c1c20')); });
D('baseball', 'Baseball Slugger', T.sport, ['baseball', 'sport', 'cap', 'team'], 'Pinstripe jersey, team cap and high socks. Hits slimeballs out of the stadium.',
  { skin: SKINS[1], hair: 'buzz', hairC: HAIRS[1], shirt: '#f1f3f6', sleeves: '#f1f3f6', pants: '#f1f3f6', shoes: '#1c1c20' },
  S => { for (let x = 1; x < 8; x += 2) S.frect('body', 'front', x, 1, 1, 9, hx('#2a4d8f')); cap(S, hx('#2a4d8f')); legStripes(S, hx('#2a4d8f')); });

function vest(S, c) { S.frect('body', 'front', 0, 1, 2, 8, c); S.frect('body', 'front', 6, 1, 2, 8, c); S.frect('body', 'back', 0, 1, 8, 8, mul(c, 0.85)); }
