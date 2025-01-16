// Global variables
let currentCategory = "all";
let markers = [];
let map = null;

const categorySelect = document.getElementById("category-select");

async function initMap() {
    map = L.map("map").setView([48.2081, 16.3713], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const categories = {
        "Stores & Shops": "red",
        "Flea Markets": "purple",
        "Events & Pop-Ups": "green",
        "Recycling & Collection Points": "blue",
        "Educational & Awareness Spaces": "pink",
        "Collaborative Spaces": "orange",
        "Local Initiatives & Collaborations": "darkgreen",
    };

    // Populate the dropdown
    Object.keys(categories).forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        categorySelect.appendChild(option);
    });

    // Fetch data and add markers
    const data = await (await fetch("/data.json")).json();
    data.forEach((item) => {
        const color = categories[item.category] || "gray";
        const icon = L.AwesomeMarkers.icon({
            icon: "info-sign",
            markerColor: color,
            prefix: "glyphicon",
        });

        const marker = L.marker([item.latitude, item.longitude], { icon })
            .addTo(map)
            .bindPopup(
                `<b>${item.name}</b><br>${item.address}<br>${item.opening_hours}<br><a href="${item.google_maps_link}" target="_blank">Google Maps</a>`
            );

        marker.category = item.category;
        markers.push(marker);
    });

    categorySelect.addEventListener("change", (e) => {
        currentCategory = e.target.value === "all" ? null : e.target.value;
        filterByCategory();
    });

    window.addEventListener("resize", () => {
        map.invalidateSize();
    });
}

function filterByCategory() {
    markers.forEach((marker) => {
        if (currentCategory === "all" || marker.category === currentCategory) {
            marker.addTo(map);
        } else {
            marker.remove();
        }
    });
}

function clearCategoryFilter() {
    currentCategory = "all";
    categorySelect.value = "all";
    filterByCategory();
}

document.addEventListener("DOMContentLoaded", initMap);
