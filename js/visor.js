//creacion del mapa
var mapa = new L.map('mi-mapa', {
    center: [-0.46761, -76.988345],
    minZoom:8,
    maxZoom: 20,
    zoom: 8,
    scrollWheelZoom:false,
   fullscreenControl:true,
    fullscreenControlOptions:{
    position:'topleft'
}
});
//capas base
var capaOSM = new L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png');
var capaRelieve = new L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',{
});
//var capaOrellana = new L.tileLayer('https://geo.gporellana.gob.ec/geoinfo/extern/wms');

capaRelieve.addTo(mapa);
//wms provincia de Orellana
var provincia = L.tileLayer.wms("https://geo.gporellana.gob.ec/geoinfo/extern/wms",{
layers:'demarcacion_provincia',
    format:'image/png',
    transparent:true,
    attribution:"GAD Orellana",
    maxZoom:12,
});
//WFS GADPO
var owsrootUrl ='http://geo.gporellana.gob.ec/geoinfo/gadpo/wfs';
//WFS Estaciones Meteorologicas
var paramMeteo = {
          service: 'WFS',
          version: '2.0.0',
          request: 'GetFeature',
    typeName: 'gadpo:clima_estacion',
    outputFormat: 'application/json',
    format_options:'callback:getJson',
    SrsName:'EPSG:4326',
};
//WFS sitios turisticos
var paramSitio = {
          service: 'WFS',
          version: '2.0.0',
          request: 'GetFeature',
    typeName: 'gadpo:sitio_turistico',
    outputFormat: 'application/json',
    format_options:'callback:getJson',
    SrsName:'EPSG:4326',
};
//WFS Meteo a GeoJSON
var parametresMeteo = L.Util.extend(paramMeteo);
var URLmeteo = owsrootUrl + L.Util.getParamString(parametresMeteo);
console.log(URLmeteo);
var meteo = $.ajax({
  jsonp:false,
  url:URLmeteo,
  dataType: 'json',
  success:handleJsonMeteo
});
//WFS Sitio a GeoJSON
var parametresSitio = L.Util.extend(paramSitio);
var URLsitio = owsrootUrl + L.Util.getParamString(parametresSitio);
console.log(URLsitio);
var sitio = $.ajax({
  jsonp:false,
  url:URLsitio,
  dataType: 'json',
  success:handleJsonSitio
});
var groupMeteo = new L.featureGroup();//.addTo(mapa);
var groupSitio = new L.featureGroup();//.addTo(mapa);
var geojsonlayerMeteo;
var geojsonlayerSitio;
function handleJsonMeteo(){
  geojsonlayerMeteo = L.geoJson(meteo.responseJSON,myLayerOptions,{
   //popup por cada marcador
    onEachFeature:function(feature, layer){
      popupOptions ={maxWidth: 200};
      layer.bindPopup("<span style='color: green'>Estación Meteorológica</span> " + feature.properties.nam, popupOptions);
    }
  }).addTo(groupMeteo);
//zoom a un grupo
//  mapa.fitBounds(groupMeteo.getBounds()); hace zoom
}

function handleJsonSitio(){
  geojsonlayerSitio = L.geoJson(sitio.responseJSON,myLayerOptionsSitio,{
   //popup por cada marcador
    onEachFeature:function(feature, layer){
      popupOptions ={maxWidth: 200};
      layer.bindPopup("<span style='color: green'>Sitio</span> " + feature.properties.nam, popupOptions);
    }
  }).addTo(groupSitio);
//zoom a un grupo
//  mapa.fitBounds(groupMeteo.getBounds()); hace zoom
}

var capasBase = {
 "<span style='color: gray'>OpenStreetMap</span>": capaOSM,
"Relieve": capaRelieve,
};
provincia.addTo(mapa);
var groupedOverlays={
   "<span style='color: green'>Límites Administrativos</span>":{
    "Provincia de Orellana":provincia,
   },
    "<span style='color: green'>Monitoreo del Clima</span>":{
    "Estaciones Meteorológicas":groupMeteo,
   },
   "<span style='color: green'>Turismo</span>":{
   "Sitio Turístico":groupSitio,
  },
};
var selectorCapas =  new L.control.groupedLayers(capasBase,groupedOverlays,{
  position:'topright',
collapsed:true,
    sortLayers:true,
});
selectorCapas.addTo(mapa);

//crea marcadores cuadrados
function createCustomIcon(feature, latlng){
  var redMarker = L.AwesomeMarkers.icon({
  icon:'cloud',
   prefix: 'glyphicon',
  markerColor:'purple',
  spin:false,
  iconColor:'white',
  className:'awesome-marker awesome-marker-square',
});
  return L.marker(latlng,{icon:redMarker}).bindPopup(feature.properties.nam+"<br>"+"<a href='https://geo.gporellana.gob.ec/apps/meteo/"+feature.properties.web+"'>Ver Medidas</a>");
}
function createCustomIconSitio(feature, latlng){
  var redMarker = L.AwesomeMarkers.icon({
  icon:'leaf',
   prefix: 'fa',
  markerColor:'blue',
  spin:false,
  iconColor:'white',
  className:'awesome-marker awesome-marker-square',
});
  return L.marker(latlng,{icon:redMarker}).bindPopup("Sitio "+ feature.properties.nam);
}
var myLayerOptions = {
  pointToLayer:createCustomIcon
}
var myLayerOptionsSitio = {
  pointToLayer:createCustomIconSitio
}
var otherMarker = L.AwesomeMarkers.icon({
icon:'bolt',
 prefix: 'fa',
markerColor:'blue',
spin:true,
iconColor:'green',
className:'awesome-marker awesome-marker-square',
});
