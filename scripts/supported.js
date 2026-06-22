'use strict';

const MODRINTH_PROJECT_CACHE_KEY = 'geoModrinthProjectsV1';
const MODRINTH_PROJECT_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const MODRINTH_BATCH_SIZE = 50;

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

  const description = document.createElement('span');
  description.className = 'mod-description';
  description.textContent = entry.name === 'Vanilla'
    ? 'Built-in Minecraft ores'
    : (slug && modrinthProjects[slug]?.description) || 'Included in the supported texture list';
  copy.appendChild(description);
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
