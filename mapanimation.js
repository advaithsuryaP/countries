const API_URL = 'https://countriesnow.space/api/v0.1';
const ACCESS_TOKEN = 'pk.eyJ1IjoiYWR2YWl0aHN1cnlhIiwiYSI6ImNsMWpyb3R0NDB6bGkzb281cndvcGsxMXIifQ.5dmjitz1sTeyc4E5wziDnQ';
const INITIAL_COORDINATES = [77,20];

// Add access token
mapboxgl.accessToken = ACCESS_TOKEN;

// This is the map instance
let map = new mapboxgl.Map({
  container: 'map', // element on the page where the map should live
  style: 'mapbox://styles/mapbox/dark-v10', // style URL for the map style
  center: INITIAL_COORDINATES, // the initial centerpoint of the map in [longitude, latitude] format.
  zoom: 3, // the initial zoom level of the map.
});
let marker = new mapboxgl.Marker({color: 'red'}).setLngLat(INITIAL_COORDINATES).addTo(map);

// Request Country Information from CountryLayer
async function getCountryInformation() {
  const country = document.getElementById('countryInput').value;
  const payload = { country: country };
  const url = `${API_URL}/countries/positions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await response.json();
  console.log(json);
  if(json.error) {
    document.getElementById('alert').classList.remove('d-none');
    document.getElementById('alert').classList.add('d-block');
    document.getElementById('errMsg').innerText = json.msg;
  } else {
    document.getElementById('alert').classList.add('d-none');
    flyTo(json.data.long, json.data.lat);  
  }
}

function flyTo(longitude, latitude) {
  map.flyTo({
    center: [longitude, latitude],
    essential: true
  });
  marker.setLngLat([longitude, latitude]).addTo(map);
}

function clearInput() {
  document.getElementById('countryInput').value = null;
  flyTo(INITIAL_COORDINATES[0], INITIAL_COORDINATES[1]);
}
