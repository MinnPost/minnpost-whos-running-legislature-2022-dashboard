<script>

  export let district;

	import L from 'leaflet';

  const mapDefaults = {
    zoom: 10,
    center: [44.9800, -93.2636],
    trackResize: true,
    zoomControl: false,
    minZoom:6,
    maxZoom:12
  };

  const layerOptions = {
    tileSize: 512,
    zoomOffset: -1,
    attribution: '&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }

  const districtStyle = {  
    stroke: true,
    color: '#af8dc3',
    weight: 1.5,
    opacity: 0.9,
    fill: true,
    fillColor: '#af8dc3',
    fillOpacity: 0.2,
    clickable: false
  }


  let map;

  async function createMap(container) {
    map = new L.Map(container, mapDefaults);
    map.addControl(new L.Control.Zoom({ position: 'topright' }));
    map.attributionControl.setPrefix(false);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlubnBvc3QiLCJhIjoicUlOUkpvWSJ9.djE93rNktev9eWRJVav6xA', layerOptions).addTo(map);

    let url = 'https://represent-minnesota.herokuapp.com/boundaries/'

    if (district.includes("A") || district.includes("B")) {
      url += "state-house-districts-2022/" + district.toLowerCase() + "/simple_shape"
    } else {
      url += "state-senate-districts-2022/" + district + "/simple_shape"
    }

    let response =  await fetch(`` + url);
    let boundary = await response.json();
    let layer = L.geoJson(boundary);
    layer.setStyle(districtStyle);
    map.addLayer(layer);
    map.fitBounds(layer.getBounds());
  
  }

  function resizeMap() {
	  if(map) { map.invalidateSize(); }
  }

</script>

<style>
  .map {
    height: 100%;
    width: 100%;
  }
</style>
<link href='https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.css' rel='stylesheet' />

<svelte:window on:resize={resizeMap} />

<div class="map" use:createMap></div>