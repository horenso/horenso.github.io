async function initMap() {
    const map = L.map("map").setView([48.2081, 16.3713], 13);
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

    const categorySelect = document.getElementById("category-select");
    const markers = [];

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

    // Filter markers on category change
    let currentCategory = null;
    categorySelect.addEventListener("change", (e) => {
        currentCategory = e.target.value === "all" ? null : e.target.value;
        markers.forEach((marker) => {
            if (!currentCategory || marker.category === currentCategory) {
                marker.addTo(map);
            } else {
                marker.remove();
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", initMap);
window.addEventListener("resize", () => {
    map.invalidateSize();
});
