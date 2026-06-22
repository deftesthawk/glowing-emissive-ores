'use strict';

const MOD_LOADERS = ['fabric', 'forge', 'neoforge'];

const minecraftVersions = [
  '26.2',
  '26.1.2', '26.1.1', '26.1',
  '1.21.11', '1.21.10', '1.21.9', '1.21.8', '1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3', '1.21.2', '1.21.1', '1.21',
  '1.20.6', '1.20.5', '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20',
  '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19',
  '1.18.2', '1.18.1', '1.18',
  '1.17.1', '1.17',
  '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1', '1.16',
  '1.15.2', '1.15.1', '1.15',
  '1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14',
  '1.13.2', '1.13.1', '1.13',
  '1.12.2', '1.12.1', '1.12'
];

const resultConditions = [
  {
    id: 'continuityFabricResult',
    loader: 'fabric',
    versions: [
      '1.21.11', '1.21.10', '1.21.8', '1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3', '1.21.1', '1.21',
      '1.20.6', '1.20.5', '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20',
      '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19', '1.18.2'
    ]
  },
  { id: 'continuityForgeResult', loader: 'forge', versions: ['1.20.1'] },
  { id: 'continuityNeoForgeResult', loader: 'neoforge', versions: ['1.21.1', '1.21'] },
  {
    id: 'moreMCMetaFabricResult',
    loader: 'fabric',
    versions: ['1.21.1', '1.21', '1.20.6', '1.20.4', '1.20.2', '1.20.1', '1.19.4', '1.19.2', '1.18.2', '1.17.1', '1.16.5']
  },
  {
    id: 'moreMCMetaForgeResult',
    loader: 'forge',
    versions: ['1.21.1', '1.21', '1.20.6', '1.20.4', '1.20.2', '1.20.1', '1.19.4', '1.19.2', '1.18.2', '1.17.1', '1.16.5']
  },
  { id: 'connectednessForgeResult', loader: 'forge', versions: ['1.19.2', '1.18.2'] },
  {
    id: 'fusionFabricResult',
    loader: 'fabric',
    versions: [
      '26.2', '26.1.2', '26.1.1', '26.1',
      '1.21.11', '1.21.10', '1.21.9', '1.21.8', '1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3', '1.21.2', '1.21.1', '1.21',
      '1.20.6', '1.20.5', '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20',
      '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19', '1.18.2', '1.18.1', '1.18'
    ]
  },
  {
    id: 'fusionForgeResult',
    loader: 'forge',
    versions: [
      '26.2', '26.1.2', '26.1.1', '26.1',
      '1.21.11', '1.21.10', '1.21.9', '1.21.8', '1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3', '1.21.2', '1.21.1', '1.21',
      '1.20.6', '1.20.5', '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20',
      '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19', '1.18.2', '1.18.1', '1.18',
      '1.17.1', '1.17',
      '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1', '1.16',
      '1.15.2', '1.15.1', '1.15',
      '1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14',
      '1.12.2', '1.12.1', '1.12'
    ]
  },
  {
    id: 'fusionNeoForgeResult',
    loader: 'neoforge',
    versions: [
      '26.2', '26.1.2', '26.1.1', '26.1',
      '1.21.11', '1.21.10', '1.21.9', '1.21.8', '1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3', '1.21.2', '1.21.1', '1.21',
      '1.20.6', '1.20.5', '1.20.4', '1.20.3'
    ]
  },
  {
    id: 'optifineFabricResult',
    loader: 'fabric',
    versions: [
      '1.20.4', '1.20.2', '1.20.1', '1.20',
      '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19',
      '1.18.2', '1.18.1', '1.18',
      '1.17.1', '1.17',
      '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1',
      '1.15.2', '1.14.4', '1.14.3', '1.14.2'
    ]
  },
  {
    id: 'optifineForgeResult',
    loader: 'forge',
    versions: [
      '26.1.2',
      '1.21.11', '1.21.10', '1.21.9', '1.21.8', '1.21.7', '1.21.6', '1.21.4', '1.21.3', '1.21.1', '1.21',
      '1.20.6', '1.20.4', '1.20.2', '1.20.1', '1.20',
      '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19',
      '1.18.2', '1.18.1', '1.18',
      '1.17.1', '1.17',
      '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1',
      '1.15.2', '1.14.4', '1.14.3', '1.14.2',
      '1.13.2', '1.13.1', '1.13', '1.12.2', '1.12.1', '1.12'
    ]
  }
];

const modLoaderSelect = document.getElementById('modLoader');
const minecraftVersionSelect = document.getElementById('minecraftVersion');
const noResults = document.getElementById('noResults');
const noResultsMessage = document.getElementById('noResultsMessage');

function readValidParameter(name, allowedValues, fallback) {
  const value = new URL(window.location.href).searchParams.get(name);
  return allowedValues.includes(value) ? value : fallback;
}

function populateMinecraftVersions() {
  const fragment = document.createDocumentFragment();
  minecraftVersions.forEach((version) => {
    const option = document.createElement('option');
    option.value = version;
    option.textContent = version;
    fragment.appendChild(option);
  });
  minecraftVersionSelect.replaceChildren(fragment);
}

function updateShareableUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set('loader', modLoaderSelect.value);
  url.searchParams.set('version', minecraftVersionSelect.value);
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

function formatLoader(loader) {
  return loader === 'neoforge'
    ? 'NeoForge'
    : loader.charAt(0).toUpperCase() + loader.slice(1);
}

function filterRequirements(updateUrl = true) {
  const selectedLoader = modLoaderSelect.value;
  const selectedVersion = minecraftVersionSelect.value;
  let visibleCount = 0;

  resultConditions.forEach((condition) => {
    const result = document.getElementById(condition.id);
    if (!result) {
      return;
    }

    const visible = condition.loader === selectedLoader && condition.versions.includes(selectedVersion);
    result.hidden = !visible;
    if (visible) {
      visibleCount += 1;
    }
  });

  const nothingAvailable = visibleCount === 0;
  noResults.hidden = !nothingAvailable;
  if (nothingAvailable) {
    noResultsMessage.textContent = `No requirement options are available for ${formatLoader(selectedLoader)} ${selectedVersion}.`;
  }

  if (updateUrl) {
    updateShareableUrl();
  }
}

function applyUrlState() {
  modLoaderSelect.value = readValidParameter('loader', MOD_LOADERS, 'fabric');
  minecraftVersionSelect.value = readValidParameter('version', minecraftVersions, minecraftVersions[0]);
  filterRequirements(false);
}

populateMinecraftVersions();
applyUrlState();

modLoaderSelect.addEventListener('change', () => filterRequirements());
minecraftVersionSelect.addEventListener('change', () => filterRequirements());
window.addEventListener('popstate', applyUrlState);
