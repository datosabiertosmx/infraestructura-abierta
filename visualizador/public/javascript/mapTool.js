var ubicaciones = [];
function paintMap(){
    // console.log(`### paintMap`)
    // var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    // Creates a leaflet map binded to an html <div> with id "map"
    // setView will set the initial map view to the location at coordinates
    // 13 represents the initial zoom level with higher values being more zoomed in
    var mymap = L.map('mapid').setView([25.0978, -102.0269], 5);
    // Adds the basemap tiles to your web map
    // Additional providers are available at: https://leaflet-extras.github.io/leaflet-providers/preview/
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 21
    }).addTo(mymap);
    //Quitar scroll rueda de mouse
    mymap.scrollWheelZoom.disable();
    return mymap;
}
function paintMakers(arrayLocationsProject,mymap){//ArrayLocationsProjects es un arreglo de projectos
    // console.log(`### paintMakers ${JSON.stringify(arrayLocationsProject)}`)
    // console.log(`### paintMakers`)
    
    // console.log(`### arrayLocationsProject ${JSON.stringify(arrayLocationsProject)}`)
    // Adds a popup marker to the webmap for GGL address
    if(arrayLocationsProject.length > 0){
        arrayLocationsProject.forEach(locationProject => {
            if(locationProject.title != undefined){
                var sectoresESP = translateSectorToImage(locationProject.sector,30);
                var sectoresESPmovil = translateSectorToImage(locationProject.sector,60);
                marker = new L.marker([locationProject.latitude, locationProject.longitude]).addTo(mymap)
                .bindPopup(
                    '<div class="row">' +
                        '<div class="col-lg-12">' +
                            '<h4 class="texto_maker">'+locationProject.title +'</h4>'+
                        '</div>' +
                        '<div class="col-6">' +
                            '<p><span class="sizePopUPMap">Monto programado</span>' + 
                            '<strong class="sizePopUPMapValue">$ '+redondearCifras(locationProject.amount)+'</strong></p>' +
                        '</div>' +
                        '<div class="col-6">' +
                            '<p><span class="sizePopUPMap">Estatus</span>' + 
                            '<strong class="sizePopUPMapValue">'+locationProject.status+'</strong></p>' +
                        '</div>' +
                        '<div class="col-6" style="Word-wrap: break-Word;">' +
                            '<p><span class="sizePopUPMap">Sector</span>' + 
                            '<span class="no-mobile"><strong class="sizePopUPMapValue colorComas">'+ sectoresESP + '</strong></span>' +
                            '<span class="tablet mobile"><strong class="sizePopUPMapValue colorComas">'+ sectoresESPmovil + '</strong></span></p>' +
                        '</div>' +
                        '<div class="col-6">' +
                            '<p><span class="sizePopUPMap">Tipo</span>' + 
                            '<strong class="sizePopUPMapValue">'+locationProject.type+'</strong></p>' +
                        '</div>' +
                        '<div class="col-lg-12">' +
                            '<a href="/proyecto/'+locationProject.prefix+'&'+locationProject.identifier+'" class="botonVerMap">Ver proyecto</a>' +
                        '</div>' +
                    '</div>',
                );
            }else{
                marker = new L.marker([locationProject.latitude, locationProject.longitude]).addTo(mymap)
                .bindPopup(
                    '<div class="row">' +
                        '<div class="col-12">' +
                            '<p><span class="textMakerDP">'+locationProject.streetAddress+', '+locationProject.postalCode+', '+locationProject.locality+', '+locationProject.region+', '+locationProject.countryName+'.</span>' + 
                        '</div>' +
                    '</div>',
                );
            }
            ubicaciones.push(marker);
        });
    }
}
function removeMarkers(mymap){
    if(ubicaciones.length > 0){
        ubicaciones.forEach(ubicacion => {
            mymap.removeLayer(ubicacion);    
        });
    }
}