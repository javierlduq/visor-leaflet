var mapa = new L.map('mi-mapa', {
    center: [-0.46761, -76.988345],
    minZoom:8,
    maxZoom: 20,
    zoom: 8,

   fullscrrenControl:true,
    fullscreenOptions:{
    position:'bottomright'
}
});
var capaOSM = new L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png');
var capaRelieve = new L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',{


});
//var capaOrellana = new L.tileLayer('https://geo.gporellana.gob.ec/geoinfo/extern/wms');

capaOSM.addTo(mapa);
capaRelieve.addTo(mapa);


var provincia = L.tileLayer.wms("https://geo.gporellana.gob.ec/geoinfo/extern/wms",{
layers:'demarcacion_provincia',
    format:'image/png',
    transparent:true,
    attribution:"GAD Orellana",
    maxZoom:12,
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
