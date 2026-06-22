'use strict';

const GEO_PLATFORM_STORAGE_KEY = 'geoPreferredPlatform';
const GEO_PLATFORMS = {
  curseforge: { dataKey: 'CurseForge', label: 'CurseForge' },
  modrinth: { dataKey: 'Modrinth', label: 'Modrinth' }
};

function readStoredPlatform() {
  try {
    const stored = window.localStorage.getItem(GEO_PLATFORM_STORAGE_KEY);
    return Object.hasOwn(GEO_PLATFORMS, stored) ? stored : null;
  } catch {
    return null;
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

function savePlatform(platform) {
  try {
    window.localStorage.setItem(GEO_PLATFORM_STORAGE_KEY, platform);
  } catch {
    // The page still works when storage is blocked.
  }
}

let currentPlatform = detectPlatformFromReferrer() || readStoredPlatform() || 'curseforge';

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

function updateDataModLinks() {
  document.querySelectorAll('a[data-mod]').forEach((link) => {
    const details = getPreferredLinkDetails(ModLinks[link.dataset.mod]);

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

function choosePlatform(platform) {
  if (!Object.hasOwn(GEO_PLATFORMS, platform) || platform === currentPlatform) {
    return;
  }

  currentPlatform = platform;
  savePlatform(platform);
  updatePlatformButtons();
  updateDataModLinks();
  window.dispatchEvent(new CustomEvent('geo:platformchange', {
    detail: { platform }
  }));
}

document.querySelectorAll('.platform-button').forEach((button) => {
  button.addEventListener('click', () => choosePlatform(button.dataset.platform));
});

updatePlatformButtons();
updateDataModLinks();
savePlatform(currentPlatform);

window.GeoSite = Object.freeze({
  getCurrentPlatform: () => currentPlatform,
  getPreferredLinkDetails,
  choosePlatform
});
