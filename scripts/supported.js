'use strict';

const MODRINTH_PROJECT_CACHE_KEY = 'geoModrinthProjectsV2';
const MODRINTH_PROJECT_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const MODRINTH_BATCH_SIZE = 50;

const CURSEFORGE_DESCRIPTIONS = Object.freeze({
  "All The Modium": "Adds powerful endgame ores, gear, and items.",
  "All The Ores": "Unifies common ores to reduce overlap between mods.",
  "Armamentarium": "Adds more than 40 mythical weapons with unique abilities and progression.",
  "Astral Dimension": "Adds two magical dimensions shaped by a multidimensional being.",
  "Basic End Ores": "Spawns vanilla and modded ores throughout the End.",
  "BBL Utility": "Adds utility blocks for automation, fluids, and resource generation.",
  "Better End Potato Edition": "Expands the End with new biomes, structures, and bug fixes.",
  "Bexla's Enhanced Ores": "An ore expansion mod succeeded by Orevolution.",
  "Bigger Reactors": "Continues Big Reactors with large multiblock power systems.",
  "Celestisynth: Wishes and Hells": "Adds celestial weapons with powerful abilities and striking visuals.",
  "ChinjufuMod +JapaneseBlock": "Adds Japanese-inspired blocks, furniture, crops, and food.",
  "Clanging Howl": "Adds extraterrestrial technology and terrifying techno-flesh creatures.",
  "Clustore": "Adds a new ore that drops random items.",
  "Craft Spawn Eggs & Spawners": "Makes spawn eggs, spawners, and trial spawners craftable.",
  "Dungeons And Combat": "Expands adventure and RPG gameplay with combat-focused content.",
  "Easy Steel & More": "Adds vanilla-friendly metals and gear between stone and diamond.",
  "End Ores": "Adds vanilla ores to the Nether and the End.",
  "Epic Paladins": "Adds powerful armour, tools, bosses, and custom 3D models.",
  "ExtraResources": "Adds a mixture of technological and fantastical resources.",
  "Feywild": "Adds a magical realm inhabited by fey creatures.",
  "FTB Materials": "Provides a broad collection of configurable resources and materials.",
  "Gems & Jewels": "Adds many gems, ores, equipment, crystals, and villager features.",
  "GeOre": "Reworks resource gathering around geode-style ore generation.",
  "Gobber [NeoForge/Forge]": "Adds powerful ores for high-end gear and special items.",
  "Gobber [Fabric]": "Adds powerful ores for high-end gear and special items.",
  "Good Night's Sleep": "Adds dream dimensions that can be explored while sleeping.",
  "Hazen 'N Stuff": "Adds armour, curios, and equipment for Iron's Spells 'n Spellbooks.",
  "Horrrs Pvz": "Adds Plants vs. Zombies-inspired plants, enemies, and gameplay.",
  "Iter RPG": "Adds RPG progression, enemies, equipment, and adventure content.",
  "Laudividni's Discs": "Adds original music discs created by Laudividni.",
  "Levia's Beryls": "Adds aquamarine, heliodor, morganite, goshenite, and red beryl.",
  "Levia's Corundums": "Adds rubies, sapphires, and armour with special powers.",
  "Levia's Garnets": "Adds six varieties of garnet as mineable minerals.",
  "Levia's Metals": "Adds aluminium, platinum, titanium, chromium, and tungsten.",
  "Levia's Quartzes": "Adds six quartz varieties as shards and geodes.",
  "Macabre - Call of False Prophets": "Adds a gruesome dimension with difficult enemies and valuable rewards.",
  "Maiden's Marvelous Materials": "Adds decorative building blocks and colourful new trees.",
  "MC-Extended: Vanilla+": "Adds new gear tiers, foods, entities, and other vanilla-style content.",
  "Minestuck": "Brings Homestuck-inspired mechanics and content to Minecraft.",
  "Mofu's better end / Mofu's Broken Constellation": "Adds story-driven dimensions that expand Minecraft lore and progression.",
  "More Gems": "Adds ten gem-based equipment sets, enchantments, weapons, and more.",
  "More Metals II": "Adds additional metals and gives them practical uses.",
  "mOres Reloaded": "Adds vanilla-style ores, tools, weapons, shields, and armour.",
  "Mythical Metals": "Adds six metals with unique effects and uses.",
  "Nether Ores Plus+": "Adds ore variants for netherrack, basalt, and blackstone.",
  "Netherific": "Expands the Nether with new mechanics, blocks, items, and mobs.",
  "Ores Above Diamonds": "Adds rare, configurable amethyst and black opal ores.",
  "Ores and Metals": "Adds RuneScape-inspired ores, metals, tools, and armour.",
  "Phayriosis Parasite Infection": "Adds a large horror-themed infection and zombie-apocalypse experience.",
  "Potassium & Sulfur's Gunpowder": "Adds vanilla-friendly gunpowder crafting and new uses for gunpowder.",
  "Project Red - Exploration": "Adds exploration-focused content for the Project Red series.",
  "Psychedelic Drug Chemistry": "Adds chemistry-themed psychedelic content and resource processing.",
  "RandomOre": "Adds an ore that drops a random item when mined.",
  "Riordan Craft (Percy Jackson)": "Adds content inspired by the Percy Jackson series.",
  "Roost 2: Flying Higher": "Adds an ancient bird mount for travelling through the world.",
  "Silent Gear Compat": "Adds Silent Gear compatibility and unique materials for other mods.",
  "Simple Metals: Aluminum": "Adds straightforward aluminium ore generation.",
  "Simple Metals: Platinum": "Adds straightforward platinum ore generation.",
  "Simple Metals: Tin": "Adds straightforward tin ore generation.",
  "Solar Craft": "Adds magic progression based around harnessing the power of nature.",
  "Spelunking Master": "Adds compatibility between Mining Master and Spelunkery.",
  "Tech Reborn": "Adds machines, tools, resource processing, and extensive technology progression.",
  "The Indigo": "Adds an alien dimension with new biomes, structures, and exploration.",
  "The Twilight Forest": "Adds a mysterious adventure dimension filled with creatures and bosses.",
  "The Vault Mod (Standalone)": "Adds vault exploration, loot progression, bosses, and collectible artifacts.",
  "Tierify Ores": "Adds Tierify materials to natural ore generation.",
  "Treasure2": "Adds treasure chests, keys, loot, and exploration-focused world generation.",
  "Unearthed": "Adds configurable underground stone, ore generation, and improved caves.",
  "Voidscape": "Adds a dangerous dimension deep within the Void.",
  "Warriors of Past Epoch": "Adds themed armour, mobs, structures, and unique equipment properties.",
  "ZYCraft": "Recreates the style and features of XyCraft for modern Minecraft."
});

const supportedSearch = document.getElementById('supportedSearch');
const supportedCount = document.getElementById('supportedCount');
const supportedList = document.querySelector('.supported-list');
const supportedEmpty = document.getElementById('supportedEmpty');

let modrinthProjects = readProjectCache();
let iconRefreshStarted = false;

function getInitials(name) {
  const words = name
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return '?';
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function getModrinthSlug(linkRecord) {
  if (!linkRecord?.Modrinth) {
    return null;
  }

  try {
    const url = new URL(linkRecord.Modrinth);
    const parts = url.pathname.split('/').filter(Boolean);
    return parts.at(-1)?.toLowerCase() || null;
  } catch {
    return null;
  }
}

function readProjectCache() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(MODRINTH_PROJECT_CACHE_KEY));
    if (!parsed || typeof parsed.projects !== 'object') {
      return {};
    }
    return parsed.projects;
  } catch {
    return {};
  }
}

function writeProjectCache() {
  try {
    window.localStorage.setItem(MODRINTH_PROJECT_CACHE_KEY, JSON.stringify({
      updatedAt: Date.now(),
      projects: modrinthProjects
    }));
  } catch {
    // Project details still work for the current page when storage is blocked.
  }
}

function cacheNeedsRefresh() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(MODRINTH_PROJECT_CACHE_KEY));
    return !parsed?.updatedAt || Date.now() - parsed.updatedAt > MODRINTH_PROJECT_CACHE_MAX_AGE;
  } catch {
    return true;
  }
}

function createIcon(name, slug) {
  const frame = document.createElement('span');
  frame.className = 'mod-icon-frame';
  frame.setAttribute('aria-hidden', 'true');

  const fallback = document.createElement('span');
  fallback.className = 'mod-icon-fallback';
  fallback.textContent = getInitials(name);
  frame.appendChild(fallback);

  const iconUrl = (slug && modrinthProjects[slug]?.iconUrl)
    || window.CurseForgeIcons?.[name]
    || null;
  if (iconUrl) {
    const image = document.createElement('img');
    image.className = 'mod-icon-image';
    image.src = iconUrl;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.referrerPolicy = 'no-referrer';
    image.addEventListener('error', () => image.remove(), { once: true });
    frame.appendChild(image);
  }

  return frame;
}

function createSupportedCard(entry) {
  const item = document.createElement('li');
  item.className = 'mod-card';

  const details = window.GeoSite.getPreferredLinkDetails(entry.links);
  const container = document.createElement(details ? 'a' : 'div');
  container.className = details ? 'mod-card-link' : 'mod-card-static';

  if (details) {
    container.href = details.url;
    container.target = '_blank';
    container.rel = 'noopener noreferrer';
    container.setAttribute('aria-label', `${entry.name}, open on ${details.label}`);
  }

  const slug = getModrinthSlug(entry.links);
  container.appendChild(createIcon(entry.name, slug));

  const copy = document.createElement('span');
  copy.className = 'mod-card-copy';

  const title = document.createElement('span');
  title.className = 'mod-name';
  title.textContent = entry.name;
  copy.appendChild(title);

  const descriptionText = entry.name === 'Vanilla'
    ? 'Built-in Minecraft ores'
    : (slug && modrinthProjects[slug]?.description)
      || CURSEFORGE_DESCRIPTIONS[entry.name]
      || '';

  if (descriptionText) {
    const description = document.createElement('span');
    description.className = 'mod-description';
    description.textContent = descriptionText;
    copy.appendChild(description);
  }
  container.appendChild(copy);

  if (details) {
    const source = document.createElement('span');
    source.className = 'mod-source';
    source.textContent = details.label;
    container.appendChild(source);
  }

  item.appendChild(container);
  return item;
}

function renderSupportedMods() {
  const searchTerm = supportedSearch.value.trim().toLocaleLowerCase();
  const entries = [
    { name: 'Vanilla', links: null },
    ...Object.entries(SupportedMods).map(([name, links]) => ({ name, links }))
  ].filter((entry) => entry.name.toLocaleLowerCase().includes(searchTerm));

  const fragment = document.createDocumentFragment();
  entries.forEach((entry) => fragment.appendChild(createSupportedCard(entry)));
  supportedList.replaceChildren(fragment);

  const total = Object.keys(SupportedMods).length + 1;
  supportedCount.textContent = searchTerm
    ? `${entries.length} of ${total} entries`
    : `${total} supported entries`;
  supportedEmpty.hidden = entries.length !== 0;

  if (!iconRefreshStarted) {
    iconRefreshStarted = true;
    refreshModrinthIcons();
  }
}

async function fetchIconBatch(slugs) {
  const params = new URLSearchParams({ ids: JSON.stringify(slugs) });
  const response = await fetch(`https://api.modrinth.com/v2/projects?${params}`, {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Modrinth thumbnail request failed with ${response.status}`);
  }

  return response.json();
}

async function refreshModrinthIcons() {
  const slugs = [...new Set(
    Object.values(SupportedMods)
      .map(getModrinthSlug)
      .filter(Boolean)
  )];

  const missingSlugs = cacheNeedsRefresh()
    ? slugs
    : slugs.filter((slug) => !modrinthProjects[slug]);

  if (missingSlugs.length === 0) {
    return;
  }

  const batches = [];
  for (let index = 0; index < missingSlugs.length; index += MODRINTH_BATCH_SIZE) {
    batches.push(missingSlugs.slice(index, index + MODRINTH_BATCH_SIZE));
  }

  const results = await Promise.allSettled(batches.map(fetchIconBatch));
  let changed = false;

  results.forEach((result) => {
    if (result.status !== 'fulfilled') {
      return;
    }

    result.value.forEach((project) => {
      if (project.slug) {
        modrinthProjects[project.slug.toLowerCase()] = {
          iconUrl: project.icon_url || null,
          description: project.description || ''
        };
        changed = true;
      }
    });
  });

  if (changed) {
    writeProjectCache();
    renderSupportedMods();
  }
}

supportedSearch.addEventListener('input', renderSupportedMods);
window.addEventListener('geo:platformchange', renderSupportedMods);
renderSupportedMods();
