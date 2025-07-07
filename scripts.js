// Function to switch between tabs
function switchTab(event, tabName) {
    // Hide all tab contents
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => {
      tab.classList.remove('active');
    });
  
    // Remove active class from all tab links
    const allLinks = document.querySelectorAll('.tab-link');
    allLinks.forEach(link => {
      link.classList.remove('active');
    });
  
    // Show the selected tab content
    const selectedTab = document.getElementById(tabName);
    selectedTab.classList.add('active');
  
    // Add active class to the clicked tab link
    event.currentTarget.classList.add('active');
}

function showFullList() {
    document.getElementById('fullRequirementsView').style.display = 'block';
    document.getElementById('filteredRequirementsView').style.display = 'none';
    document.getElementById('fullListBtn').classList.add('active-view');
    document.getElementById('filteredBtn').classList.remove('active-view');
}

function showFiltered() {
    document.getElementById('fullRequirementsView').style.display = 'none';
    document.getElementById('filteredRequirementsView').style.display = 'block';
    document.getElementById('filteredBtn').classList.add('active-view');
    document.getElementById('fullListBtn').classList.remove('active-view');
}
  
  
// === Predefined Minecraft Versions ===
const minecraftVersions = [
    "1.21.7", "1.21.6", "1.21.5", "1.21.4", "1.21.3", "1.21.2", "1.21.1", "1.21", 
    "1.20.6", "1.20.5", "1.20.4", "1.20.3", "1.20.2", "1.20.1", "1.20", 
    "1.19.4", "1.19.3", "1.19.2", "1.19.1", "1.19", 
    "1.18.2", "1.18.1", "1.18", 
    "1.17.1", "1.17", 
    "1.16.5", "1.16.4", "1.16.3", "1.16.2", "1.16.1", "1.16", 
    "1.15.2", "1.15.1", "1.15", 
    "1.14.4", "1.14.3", "1.14.2", "1.14.1", "1.14", 
    "1.13.2", "1.13.1", "1.13", 
    "1.12.2", "1.12.1", "1.12"
];


// Result definitions
const resultConditions = [
    {
        id: 'continuityFabricResult',
        loader: 'fabric',
        versions: [
        '1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3', '1.21.1', '1.21',
        '1.20.6', '1.20.5', '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20',
        '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19',
        '1.18.2',
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
    },
    {
        id: 'continuityForgeResult',
        loader: 'forge',
        versions: [
        '1.20.1',
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
    },
    {
        id: 'continuityNeoForgeResult',
        loader: 'neoforge',
        versions: [
        '1.21.1', '1.21',
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
    },
    {
        id: 'moreMCMetaFabricResult',
        loader: 'fabric',
        versions: [
        '1.21.1', '1.21',
        '1.20.6', '1.20.4', '1.20.2', '1.20.1',
        '1.19.4', '1.19.2',
        '1.18.2',
        '1.17.1',
        '1.16.5',
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
    },
    {
        id: 'moreMCMetaForgeResult',
        loader: 'forge',
        versions: [
        '1.21.1', '1.21',
        '1.20.6', '1.20.4', '1.20.2', '1.20.1',
        '1.19.4', '1.19.2',
        '1.18.2',
        '1.17.1',
        '1.16.5',
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
    },
    {
        id: 'connectednessForgeResult',
        loader: 'forge',
        versions: [
        '1.19.2',
        '1.18.2',
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
    },
    {
        id: 'fusionFabricResult',
        loader: 'fabric',
        versions: [
        '1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3', '1.21.2', '1.21.1', '1.21',
        '1.20.6', '1.20.5', '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20',
        '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19',
        '1.18.2', '1.18.1', '1.18',
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
    },
    {
        id: 'fusionForgeResult',
        loader: 'forge',
        versions: [
        '1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3', '1.21.2', '1.21.1', '1.21',
        '1.20.6', '1.20.5', '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20',
        '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19',
        '1.18.2', '1.18.1', '1.18',
        '1.17.1', '1.17',
        '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1', '1.16',
        '1.15.2', '1.15.1', '1.15',
        '1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14',
        '1.12.2', '1.12.1', '1.12'
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
    },
    {
        id: 'fusionNeoForgeResult',
        loader: 'neoforge',
        versions: [
        '1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3', '1.21.2', '1.21.1', '1.21',
        '1.20.6', '1.20.5', '1.20.4', '1.20.3',
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
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
        '1.15.2',
        '1.14.4', '1.14.3', '1.14.2',
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
    },
    {
        id: 'optifineForgeResult',
        loader: 'forge',
        versions: [
        '1.21.4', '1.21.3', '1.21.1', '1.21',
        '1.20.6', '1.20.4', '1.20.2', '1.20.1', '1.20',
        '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19',
        '1.18.2', '1.18.1', '1.18',
        '1.17.1', '1.17',
        '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1',
        '1.15.2',
        '1.14.4', '1.14.3', '1.14.2',
        '1.13.2', '1.13.1', '1.13',
        '1.12.2', '1.12.1', '1.12',
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
    },
    {
        id: 'noFabricResult',
        loader: 'fabric',
        versions: [
        '1.16',
        '1.15.1', '1.15',
        '1.14.1', '1.14',
        '1.13.2', '1.13.1', '1.13',
        '1.12.2', '1.12.1', '1.12',
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
    },
    {
        id: 'noForgeResult',
        loader: 'forge',
        versions: [
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
    },
    {
        id: 'noNeoForgeResult',
        loader: 'neoforge',
        versions: [
        '1.20.2', '1.20.1', '1.20',
        '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19',
        '1.18.2', '1.18.1', '1.18',
        '1.17.1', '1.17',
        '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1', '1.16',
        '1.15.2', '1.15.1', '1.15',
        '1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14',
        '1.13.2', '1.13.1', '1.13',
        '1.12.2', '1.12.1', '1.12'
        ],
        show: function (version) {
        return this.versions.includes(version);
        }
    },
    // Add more result conditions here as needed
];

const modLoaderSelect = document.getElementById('modLoader');
const minecraftVersionSelect = document.getElementById('minecraftVersion');
const resultsContainer = document.getElementById('results-container');

// Initialize Minecraft Version dropdown
function updateMinecraftVersionOptions() {
    minecraftVersionSelect.innerHTML = "";
    minecraftVersions.forEach(version => {
        const option = document.createElement('option');
        option.value = version;
        option.textContent = version;
        minecraftVersionSelect.appendChild(option);
    });
}

// Filter and display the results based on selected loader and version
function filterResults() {
    const selectedLoader = modLoaderSelect.value;
    const selectedVersion = minecraftVersionSelect.value;

    resultConditions.forEach(result => {
        const resultBox = document.getElementById(result.id);
        if (
        (selectedLoader === "" || result.loader === selectedLoader) &&
        result.show(selectedVersion)
        ) {
        resultBox.style.display = 'block'; // Show the result box
        } else {
        resultBox.style.display = 'none'; // Hide the result box
        }
    });
}

// Event listeners for dropdown changes
modLoaderSelect.addEventListener('change', filterResults);
minecraftVersionSelect.addEventListener('change', filterResults);

// Initialize page
updateMinecraftVersionOptions();
filterResults(); // Initial filter on page load
