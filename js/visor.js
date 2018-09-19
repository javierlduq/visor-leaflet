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

var capasBase = {
 "<span style='color: gray'>OpenStreetMap</span>": capaOSM,
"Relieve": capaRelieve,
};
var groupedOverlays={
   "<span style='color: green'>Límites Administrativos</span>":{
    "Provincia de Orellana":provincia,
    
   },
    "<span style='color: green'>Monitoreo del Clima</span>":{
    "Estaciones Meteorológicas":estacion,
   },
};
var selectorCapas =  new L.control.groupedLayers(capasBase,groupedOverlays,{
  position:'topright',
collapsed:false,
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
var owsrootUrl ='https://geo.gporellana.gob.ec/geoinfo/gadpo/wfs';
var defaultParameters = {
          service: 'WFS',
          version: '2.0.0',
          request: 'GetFeature',
          typeName: 'gadpo:clima_estacion',
         outputFormat: 'application/json'
};
var parametres = L.Util.extend(defaultParameters);
var URL = owsrootUrl + L.Util.getParamString(parametres);
$.ajax({
    url:URL,
    username:'gadpo',
    password:'V2VHw6EDtjFLd785jh3wV6onM7G',
    success: function(data){
        var geojson = new L.geoJson(data,{
            style: {"color":"#2ECCFA","weight":2},
            onEachFeature: function(feature, layer){
                layer.bindPopup(feature.nam);
            }
        }).addTo(mapa);
    }
})