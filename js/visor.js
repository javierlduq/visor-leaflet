<<<<<<< current
//creacion del mapa
var mapa = new L.map('mi-mapa', {
    //home:true,
    center: [-0.46761, -76.988345],
    minZoom:8,
    maxZoom: 20,
    zoom: 8,
    scrollWheelZoom:true,
    touchZoom:false,
    doubleClickZoom:false,
    zoomControl:false,
    fullscreenControl:true,
    fullscreenControlOptions:{
    position:'topleft'
}
});
var zoomHome = L.Control.zoomHome({position: 'topleft'});
zoomHome.addTo(mapa);

//capas base
var capaOSM = new L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png');
var capaRelieve = new L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',{
});
var  bingmap = new L.BingLayer("At6__Fz8jLBV8hEVl-mdbobHBnjPVIfjYbdddIlhhHQZjyX5PBVSpChCP06EKL8Y",{type:'Road'});
// var google = new L.Google('ROADMAP');
//var capaOrellana = new L.tileLayer('https://geo.gporellana.gob.ec/geoinfo/extern/wms');
var mousePosition=L.control.mousePosition({
  position:'bottomright',
  separator:' | ',

}).addTo(mapa);
bingmap.addTo(mapa);
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
var paramMeteo =  {
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
    //onEachFeature:function(feature, layer){
  //    popupOptions ={maxWidth: 200};
    //  layer.bindPopup("<span style='color: green'>Sitio</span> " + feature.properties.nam, popupOptions);
  //  }
  }).addTo(groupSitio);
//zoom a un grupo
//  mapa.fitBounds(groupMeteo.getBounds()); hace zoom
}
var capasBase = {
//  "<span style='color: green'>Capas Base</span>":{
 "Mapa OpenStreetMap": capaOSM,
"Mapa Relieve": capaRelieve,
"Mapa Bing":bingmap,
//"Mapa Google":google,
 //},
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
collapsed:false,
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
markerColor:'yellow',
spin:true,
iconColor:'green',
className:'awesome-marker awesome-marker-square',
});
=======
var mapa = new L.map('mi-mapa', {
    center: [-0.46761, -76.988345],
    zoom: 8,
   fullscrrenControl:true,
    fullscreenOptions:{
    position:'bottomright'
}
});
var capaOSM = new L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png');
var capaRelieve = new L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',{
maxZoom: 10,
});
//var capaOrellana = new L.tileLayer('https://geo.gporellana.gob.ec/geoinfo/extern/wms');

capaOSM.addTo(mapa);
capaRelieve.addTo(mapa);


var provincia = L.tileLayer.wms("https://geo.gporellana.gob.ec/geoinfo/extern/wms",{
layers:'demarcacion_provincia',
    format:'image/png',
    transparent:true,
    attribution:"GAD Orellana",
    maxZoom:10,
});

var estacion = L.tileLayer.wms("https://geo.gporellana.gob.ec/geoinfo/datoslibres/wms",{
layers:'clima_estacion',
    format:'image/png',
    transparent:true,
    attribution:"GAD Orellana",
    maxZoom:10,
});



var owsrootUrl ='http://geo.gporellana.gob.ec/geoinfo/gadpo/wfs';
var defaultParameters = {
          service: 'WFS',
          version: '2.0.0',
          request: 'GetFeature',
    typeName: 'gadpo:clima_estacion',
    outputFormat: 'application/json',
    format_options:'callback:getJson',
    SrsName:'EPSG:4326'     
};
var parametres = L.Util.extend(defaultParameters);
var URL = owsrootUrl + L.Util.getParamString(parametres);
var WFSLayer =null;
var ajax = $.ajax({
    url:URL,
    dataType:'json',
    jsonpCallback:'getJson',
    success: function(response){
       WFSLayer = L.geoJson(response,{
            style:function(feature){
                return {
                    stroke:true,
                    fillColor:'FFFFFF',
                    fillOpacity:0
                };
            },
            onEachFeature: function (feature, layer){
                popupOptions = {maxWidth: 200};
                layer.bindPopup("<span style='color: green'>Estación Meteorológica</span> " + feature.properties.nam, popupOptions);
            }
        }).addTo(mapa);
    }
   
});
//var pointsGroup = L.layerGroup([estacion,WFSLayer]);

let myLayer = L.layerGroup()//.addTo(mapa)
function addMyData (feature, layer){
    myLayer.addLayer(layer)
    // some other code can go here, like adding a popup with layer.bindPopup("Hello")
    popupOptions = {maxWidth: 200};
    layer.bindPopup("<span style='color: green'>Estación Meteorológica</span> " + feature.properties.nam, popupOptions);
}
// create an options object that specifies which function to call on each feature
let myLayerOptions = {
    onEachFeature:addMyData
}
// create the GeoJSON layer from myLayerData
L.geoJSON(WFSLayer,myLayerOptions).addTo(mapa)
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
    "Estaciones Meteorológicas":myLayer,
   },
};

var selectorCapas =  new L.control.groupedLayers(capasBase,groupedOverlays,{
  position:'topright',
collapsed:true,
    sortLayers:true,

});

selectorCapas.addTo(mapa);
//capaRelieve.addTo(mapa);
//capaOSM.addTo(mapa);
var redMarker = L.AwesomeMarkers.icon({
icon:'bolt',
 prefix: 'fa',
markerColor:'purple',

spin:true,
iconColor:'yellow',


className:'awesome-marker awesome-marker-square',

});
var otherMarker = L.AwesomeMarkers.icon({
icon:'bolt',
 prefix: 'fa',
markerColor:'blue',
spin:true,
iconColor:'green',


className:'awesome-marker awesome-marker-square',

});
var marcador = L.marker([-0.46, -76.98], {
icon: redMarker,
title: "Estación Meteorológica",
}).addTo(mapa);
var marcador = L.marker([-0.10, -76.98], {
icon: otherMarker,
title: "Estación Meteorológica",
}).addTo(mapa);

>>>>>>> before discard
