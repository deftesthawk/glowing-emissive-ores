'use strict';

const GEO_PLATFORM_STORAGE_KEY = 'geoPreferredPlatform';
const GEO_VARIANT_STORAGE_KEY = 'geoPreferredVariant';

const GEO_PLATFORMS = {
  curseforge: { dataKey: 'CurseForge', label: 'CurseForge' },
  modrinth: { dataKey: 'Modrinth', label: 'Modrinth' }
};

const GEO_VARIANTS = {
  'resource-pack': { label: 'Resource Pack' },
  mod: { label: 'Mod' }
};

function readStoredValue(storageKey, allowedValues) {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return Object.hasOwn(allowedValues, stored) ? stored : null;
  } catch {
    return null;
  }
}

function saveStoredValue(storageKey, value) {
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    // The page still works for the current visit when storage is blocked.
  }
}

function detectPlatformFromReferrer() {
  if (!document.referrer) {
    return null;
  }

  try {
    const hostname = new URL(document.referrer).hostname.toLowerCase();

    if (hostname === 'modrinth.com' || hostname.endsWith('.modrinth.com')) {
      return 'modrinth';
    }

    if (hostname === 'curseforge.com' || hostname.endsWith('.curseforge.com')) {
      return 'curseforge';
    }
  } catch {
    // Ignore malformed or unavailable referrer values.
  }

  return null;
}

function detectVariantFromReferrer() {
  if (!document.referrer) {
    return null;
  }

  try {
    const referrer = new URL(document.referrer);
    const hostname = referrer.hostname.toLowerCase();
    const pathname = referrer.pathname.toLowerCase();
    const isCurseForge = hostname === 'curseforge.com' || hostname.endsWith('.curseforge.com');
    const isModrinth = hostname === 'modrinth.com' || hostname.endsWith('.modrinth.com');

    if ((isCurseForge && pathname.includes('/minecraft/mc-mods/')) ||
        (isModrinth && pathname.startsWith('/mod/'))) {
      return 'mod';
    }

    if ((isCurseForge && pathname.includes('/minecraft/texture-packs/')) ||
        (isModrinth && pathname.startsWith('/resourcepack/'))) {
      return 'resource-pack';
    }
  } catch {
    // Ignore malformed or unavailable referrer values.
  }

  return null;
}

function readVariantFromUrl() {
  const url = new URL(window.location.href);
  const requestedVariant = url.searchParams.get('variant');

  if (!Object.hasOwn(GEO_VARIANTS, requestedVariant)) {
    return null;
  }

  url.searchParams.delete('variant');
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  return requestedVariant;
}

let currentPlatform = detectPlatformFromReferrer() ||
  readStoredValue(GEO_PLATFORM_STORAGE_KEY, GEO_PLATFORMS) ||
  'curseforge';

let currentVariant = document.documentElement.dataset.geoVariant ||
  readVariantFromUrl() ||
  readStoredValue(GEO_VARIANT_STORAGE_KEY, GEO_VARIANTS) ||
  detectVariantFromReferrer() ||
  'resource-pack';

function getPreferredLinkDetails(linkRecord) {
  if (!linkRecord) {
    return null;
  }

  const preferred = GEO_PLATFORMS[currentPlatform];
  if (preferred && linkRecord[preferred.dataKey]) {
    return {
      url: linkRecord[preferred.dataKey],
      platform: currentPlatform,
      label: preferred.label
    };
  }

  for (const [platform, config] of Object.entries(GEO_PLATFORMS)) {
    if (linkRecord[config.dataKey]) {
      return {
        url: linkRecord[config.dataKey],
        platform,
        label: config.label
      };
    }
  }

  return null;
}

function updatePlatformButtons() {
  document.querySelectorAll('.platform-button').forEach((button) => {
    const active = button.dataset.platform === currentPlatform;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function updateVariantButtons() {
  document.querySelectorAll('.variant-button').forEach((button) => {
    const active = button.dataset.variant === currentVariant;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function getLinkRecordName(link) {
  if (currentVariant === 'mod' && link.dataset.modMod) {
    return link.dataset.modMod;
  }

  if (currentVariant === 'resource-pack' && link.dataset.modResourcePack) {
    return link.dataset.modResourcePack;
  }

  return link.dataset.mod || null;
}

function updateDataModLinks() {
  document.querySelectorAll('a[data-mod], a[data-mod-resource-pack], a[data-mod-mod]').forEach((link) => {
    const recordName = getLinkRecordName(link);
    const details = getPreferredLinkDetails(recordName ? ModLinks[recordName] : null);

    if (!details) {
      link.removeAttribute('href');
      link.removeAttribute('target');
      link.setAttribute('aria-disabled', 'true');
      link.classList.add('unavailable-link');
      return;
    }

    link.href = details.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.removeAttribute('aria-disabled');
    link.classList.remove('unavailable-link');
  });
}

function updateVariantLinks() {
  document.querySelectorAll('[data-resource-pack-href][data-mod-href]').forEach((link) => {
    const href = currentVariant === 'mod'
      ? link.dataset.modHref
      : link.dataset.resourcePackHref;

    if (href) {
      link.href = href;
    }
  });
}

function choosePlatform(platform) {
  if (!Object.hasOwn(GEO_PLATFORMS, platform) || platform === currentPlatform) {
    return;
  }

  currentPlatform = platform;
  saveStoredValue(GEO_PLATFORM_STORAGE_KEY, platform);
  updatePlatformButtons();
  updateDataModLinks();
  window.dispatchEvent(new CustomEvent('geo:platformchange', {
    detail: { platform }
  }));
}

function chooseVariant(variant) {
  if (!Object.hasOwn(GEO_VARIANTS, variant) || variant === currentVariant) {
    return;
  }

  currentVariant = variant;
  document.documentElement.dataset.geoVariant = variant;
  saveStoredValue(GEO_VARIANT_STORAGE_KEY, variant);

  if (variant === 'mod' && document.body.dataset.page === 'requirements') {
    window.location.replace('../supported/?variant=mod');
    return;
  }

  updateVariantButtons();
  updateDataModLinks();
  updateVariantLinks();
  window.dispatchEvent(new CustomEvent('geo:variantchange', {
    detail: { variant }
  }));
}

document.querySelectorAll('.platform-button').forEach((button) => {
  button.addEventListener('click', () => choosePlatform(button.dataset.platform));
});

document.querySelectorAll('.variant-button').forEach((button) => {
  button.addEventListener('click', () => chooseVariant(button.dataset.variant));
});

document.documentElement.dataset.geoVariant = currentVariant;
updatePlatformButtons();
updateVariantButtons();
updateDataModLinks();
updateVariantLinks();
saveStoredValue(GEO_PLATFORM_STORAGE_KEY, currentPlatform);
saveStoredValue(GEO_VARIANT_STORAGE_KEY, currentVariant);

window.GeoSite = Object.freeze({
  getCurrentPlatform: () => currentPlatform,
  getCurrentVariant: () => currentVariant,
  getPreferredLinkDetails,
  choosePlatform,
  chooseVariant
});
