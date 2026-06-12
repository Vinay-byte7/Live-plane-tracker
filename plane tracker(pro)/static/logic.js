const map = L.map("map").setView([20, 78], 4);
let searchMarkers = L.layerGroup().addTo(map);

L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png', {
    attribution: 'Imagery provided by NASA GIBS / Earthdata',
    maxNativeZoom: 8,
    maxZoom: 18
}).addTo(map);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18
}).addTo(map);

let marker = L.marker([51.5, -0.09]).addTo(map);

function createPlaneIcon(angle) {
  return L.divIcon({
    html: `<i class="fas fa-plane-up" style="transform: rotate(${angle}deg); color: #FF9F1C; font-size: 16px; -webkit-text-stroke: 1px black;"></i>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    className: 'plane-marker'
  });
}

const searchInput = document.getElementById('searchBox');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', async () => {
    let searchText = searchInput.value.trim();
    if (searchText !== "") {
        console.log("Searching for:", searchText);
        searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        searchButton.disabled = true;
        searchButton.style.cursor = 'wait';
        
        try {
            await searchResult(searchText); 
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            searchButton.innerHTML = '<i class="fas fa-search"></i>';
            searchButton.disabled = false;
            searchButton.style.cursor = 'pointer';
            console.log("done searching...");
        }

    } else {
        console.log("Please enter a callsign or country.");
    }
});
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click(); 
    }
});

async function searchResult(text) {
    let response = await fetch("/apiData");
    let data = await response.json();
    let PlaneCount = data.states.length;
    console.log("started to search...");

    searchMarkers.clearLayers();

    let searchTerm = text.toLowerCase().trim();
    let foundCount = 0; 
    let bounds = [];

    for(let i = 0; i < PlaneCount; i++){
        let lat = data.states[i][6];
        let log = data.states[i][5];
        let ang = data.states[i][10];
        let callsign = data.states[i][1];
        let altitude = data.states[i][7];
        let speed = data.states[i][9];
        let country = data.states[i][2];
        
        if (lat == null || log == null || ang == null) {
            continue;
        }
        
        let safeCountry = country ? country.toLowerCase().trim() : "";
        let safeCallsign = callsign ? callsign.toLowerCase().trim() : "";
        
        if(safeCountry === searchTerm || safeCallsign.includes(searchTerm)) {
            foundCount++;
            
            let marker1 = L.marker([lat, log], { icon : createPlaneIcon(ang)}).addTo(searchMarkers);
            marker1.bindPopup(`
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <strong style="color: #FF9F1C; font-size: 16px;">${callsign}</strong><br>
                    <hr style="margin: 5px 0;">
                    <b>Altitude:</b> ${altitude} m<br>
                    <b>Speed:</b> ${speed} m/s
                </div>
            `);
            bounds.push([lat, log]);
        }
    }
    
    console.log("Total planes found:", foundCount);
    
    if (foundCount > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    } else {
        alert("No active flights found for: " + text);
    }
}



const PlaneData = async() => {
    let response = await fetch("/apiData");
    let data = await response.json();
    let PlaneCount = data.states.length;
    map.getBounds();
    let north = map.getBounds()._northEast.lat;
    let south = map.getBounds()._southWest.lat;
    let east = map.getBounds()._northEast.lng;
    let west = map.getBounds()._southWest.lng;
    console.log("got bounds...");
    for(let i = 0; i<PlaneCount; i++){
        let lat = data.states[i][6];
        let log = data.states[i][5];
        let ang = data.states[i][10];
        let callsign = data.states[i][1];
        let altitude = data.states[i][7];
        let speed = data.states[i][9];
        
        if (lat == null || log == null || ang == null) {
            continue;
        }
        if (south <= lat && lat <= north) {
            if (west <= log && log <= east) {
                console.log(i + " => " + "lat: " + lat + " log: " + log + " ang: " + ang + "\n");
                let marker1 = L.marker([lat, log], { icon : createPlaneIcon(ang)}).addTo(map);
                marker1.bindPopup(`
                                    <div style="font-family: Arial, sans-serif; text-align: center;">
                                        <strong style="color: #FF9F1C; font-size: 16px;">${callsign}</strong><br>
                                        <hr style="margin: 5px 0;">
                                        <b>Altitude:</b> ${altitude} m<br>
                                        <b>Speed:</b> ${speed} m/s
                                    </div>
                                    `);
            }
        }
    }
    console.log("done with loop");
};


    // let latitude = planedata.states[i][6];
    // let longitude = planedata.states[i][5];
    // let planeCoun = planedata.states[i][2];
    // let altitude = planedata.states[i][13];
    // let velocity = planedata.states[i][9];
    // let direction = planedata.states[i][10];
    // let vertSpeed = planedata.states[i][11];