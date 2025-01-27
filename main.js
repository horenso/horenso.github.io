// Global variables
let currentCategory = "all";
let markers = [];
let map = null;
let categoryIcons = new Map();

const categorySelect = document.getElementById("category-select");

async function initMap() {
    map = L.map("map").setView([48.20169735458342, 16.346863966424817], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const categories = {
        "Stores & Shops": "stores_shops.png",
        "Events & Pop-Ups": "events_and_popups.png",
        "Recycling & Collection Points": "recycling_and_collection_points.png",
        "Educational & Awareness Spaces":
            "educational_and_awareness_spaces.png",
        "Collaborative Spaces": "collaborative_spaces.png",
        "Local Initiatives & Collaborations":
            "local_spaces_and_collaborations.png",
    };

    // Populate the dropdown
    Object.entries(categories).forEach(([category, fileName]) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
        categoryIcons.set(
            category,
            L.icon({
                iconUrl: `/icons/${fileName}`,
                iconSize: [24, 33],
                iconAnchor: [11, 31],
                popupAnchor: [0, -32],
            })
        );
    });

    // Fetch data and add markers
    const data = await (await fetch("/data.json")).json();
    data.forEach((item) => {
        const color = categories[item.category] || "gray";

        const icon = categoryIcons.get(item.category);
        if (icon === undefined) {
            console.error(`Icon ${item.category} is not found`);
        }

        const marker = L.marker([item.latitude, item.longitude], {
            icon: categoryIcons.get(item.category),
        })
            .addTo(map)
            .bindPopup(
                `<b>${item.name}</b><br>${item.address}<br>${item.opening_hours}<br><a href="${item.google_maps_link}" target="_blank">Google Maps</a>`
            );

        marker.category = item.category;
        markers.push(marker);
    });

    categorySelect.addEventListener("change", (e) => {
        currentCategory = e.target.value;
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
