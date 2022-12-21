var arrayInfoInstances = new Array();
var arrayEntity = new Array();
var arrayUrl = new Array();
var arrayPort = new Array();
var arrayImplementer = new Array();
var arrayEstatus = new Array();
var arrayMunicipios = new Array();
var seleccionadoInstance = [];
var seleccionadoMap = [];
var mymap;
var enlace;
var puerto;

$(document).ready(async function(){
    console.log(`Ready Main`)
    mymap = paintMap();
    var endPointHomeMap = '/edcapi/homePage/0';

    loadData(endPointHomeMap).then((data) =>{
        // console.log('### INICIO - loadData DATA:'+JSON.stringify(data));
        if(data !== undefined){
            arrayInfoInstances = data;
            //Llenar filtros
            arrayInfoInstances.forEach(instancia => {
                // console.log('### INSTANCIA - DATA:'+ JSON.stringify(instancia.data[0]));
                //Llenar Ejercicio
                if(!arrayUrl.includes(instancia.data[8].url)){
                    enlace = instancia.data[8].url;
                }
                if(!arrayPort.includes(instancia.data[9].port)){
                    puerto = instancia.data[9].port;
                }
                llenaYearProjects(enlace, puerto);
                //Llenar Entidad Federativa
                if(arrayEntity.length > 0){
                    if(!arrayEntity.includes(instancia.data[7].entity)){
                        arrayEntity.push(instancia.data[7].entity);
                        $('#entityFilter').append(`<option> ${instancia.data[7].entity} </option>`); 
                    }
                }else{
                    arrayEntity.push(instancia.data[7].entity);
                    $('#entityFilter').append(`<option> ${instancia.data[7].entity} </option>`); 
                }
                //Llenar implementador
                arrayImplementer.push({implementer:instancia.data[6].implementer,entity:instancia.data[7].entity});
                //Llenar Estatus
                instancia.data[0].forEach(proyecto => {
                    if (arrayEstatus.length > 0) {
                        if(!arrayEstatus.includes(proyecto.status)){
                            arrayEstatus.push(proyecto.status);
                            $('#statusFilter').append(`<option> ${proyecto.status} </option>`); 
                            ordenarSelect('statusFilter');
                        }
                    }else{
                        arrayEstatus.push(proyecto.status);
                        $('#statusFilter').append(`<option> ${proyecto.status} </option>`); 
                    }
                });
                //Llenar municipio
                instancia.data[0].forEach(proyecto => {
                    if (arrayMunicipios.length > 0) {
                        if(!arrayMunicipios.includes(proyecto.locality)){
                            arrayMunicipios.push(proyecto.locality);
                            $('#municipioFilter').append(`<option> ${proyecto.locality} </option>`); 
                            ordenarSelect('municipioFilter');
                        }
                    }else{
                        arrayMunicipios.push(proyecto.locality);
                        $('#municipioFilter').append(`<option> ${proyecto.locality} </option>`); 
                    }
                });
            });
            //Llenar combo implementador
            arrayImplementer.forEach(implementador => {
                $('#implementatorFilter').append(`<option> ${implementador.implementer} </option>`);
            });
            //ordenar selects
            
            // ordenarSelect1('yearFilter'); -------------------
            ordenarSelect('entityFilter');
            ordenarSelect('implementatorFilter');
            ordenarSelect('statusFilter');
            //Pintar sitio
            if($('#year').val() == 0 && $('#entity').val() == 0 && $('#implementer').val() == 0){
                //Pintar numeralia y llenar mapa
                reprintNumbers(arrayInfoInstances,mymap);
            }else{
                //filtrar si trae parametros
                $('#yearFilter').val($('#year').val());
                $('#entityFilter').val($('#entity').val());
                $('#implementatorFilter').val($('#implementer').val());
                filtrarEjercicio();
            }
        }
    })
});

//Filtrar por año
function filtrarEjercicio(){
    console.log(`filtrarEjercicio ${$('#yearFilter').val()}`)
    var yearParam = $('#yearFilter').val();
    var endPointHomeMap = `/edcapi/homePage/${yearParam}`;
    arrayInfoInstances = [];
    resetNumbers();
    removeMarkers(mymap);
    loadData(endPointHomeMap).then((data) =>{
        if(data !== undefined){
            arrayInfoInstances = data;
            reprintNumbers(arrayInfoInstances,mymap);
            const entityValue = $('#entityFilter').val();
            const implementerValue = $('#implementatorFilter').val();
            if(entityValue != 0)
            filtrarEntidad();

            $('#implementatorFilter').val(implementerValue);
            if(implementerValue != 0)
            filtrarImplementador();

            if(implementerValue == 0 && entityValue == 0){
                //filtrar mapa
                actualizaSeleccionadoMap();
                buscar();
            }
        }
    })
}

//Filtrar por entidad
function filtrarEntidad(){
    console.log(`filtrarEntidad ${$('#entityFilter').val()}`)
    var seleccionadoEntidad = [];
    arrayMunicipios = [];

    $('#municipioFilter').empty();
    $('#municipioFilter').append(`<option value='0'> - Municipio </option>`);
    $('#implementatorFilter').empty();
    $('#implementatorFilter').append(`<option value='0'> - Publicador </option>`);
    
    if($('#entityFilter').val() != 0){
        arrayInfoInstances.forEach(element1 => {
            element1.data.forEach(element => {
                if(element instanceof Array == false){
                    if(element.entity == $('#entityFilter').val()){
                        seleccionadoEntidad.push(element1);
                    }
                }
            });
        });
        //Llenar filtro implementador
        if (arrayImplementer.length > 0) {
            $('#implementatorFilter').empty();
            $('#implementatorFilter').append(`<option value='0'> - Implementador </option>`);
            arrayImplementer.forEach(implementador => {
                if(implementador.entity ==  $('#entityFilter').val()){
                    $('#implementatorFilter').append(`<option> ${implementador.implementer} </option>`);
                }
            });
            $('#implementatorFilter').removeAttr('disabled');
        }
        //Llenar filtro municipio
        seleccionadoEntidad.forEach(proyectosEntidad => {
            proyectosEntidad.data.forEach(proyectos => {
                if(proyectos instanceof Array){
                    proyectos.forEach(proyecto => {
                        if (arrayMunicipios.length > 0) {
                            if(!arrayMunicipios.includes(proyecto.locality)){
                                arrayMunicipios.push(proyecto.locality);
                                $('#municipioFilter').append(`<option> ${proyecto.locality} </option>`); 
                            }
                        }else{
                            arrayMunicipios.push(proyecto.locality);
                            $('#municipioFilter').append(`<option> ${proyecto.locality} </option>`); 
                        }
                    });
                }
            });
        });
        if(seleccionadoEntidad.length > 0){
            seleccionadoInstance = [];
            seleccionadoInstance = seleccionadoEntidad;
            reprintNumbers(seleccionadoEntidad,mymap);
            //filtrar mapa
            actualizaSeleccionadoMap();
            buscar();
        }
        ordenarSelect('municipioFilter');
    }else{
        $('#implementatorFilter').empty();
        $('#implementatorFilter').append(`<option value='0'> - Implementador </option>`);
        $("implementatorFilter").attr('disabled', 'disabled');
        seleccionadoInstance = [];
        filtrarEjercicio();
    }
    
}

//Filtrar por implementador
function filtrarImplementador(){
    console.log(`filtrarImplementador ${$('#implementatorFilter').val()}`)
    var seleccionadoImplementador = [];
    if($('#implementatorFilter').val() != 0){
        arrayInfoInstances.forEach(element1 => {
            element1.data.forEach(element => {
                if(element instanceof Array == false){
                    if(element.implementer == $('#implementatorFilter').val()){
                        seleccionadoImplementador.push(element1);
                    }
                }
            });
        });
    }else{
        filtrarEntidad();
    }
    if(seleccionadoImplementador.length > 0){
        seleccionadoInstance = [];
        seleccionadoInstance = seleccionadoImplementador;
        reprintNumbers(seleccionadoImplementador,mymap);
        //filtra mapa
        actualizaSeleccionadoMap();
        buscar();
    }
}

function reprintNumbers(info,map){
    // console.log(`#### reprintNumbers` )
    resetNumbers();
    removeMarkers(map);
    info.forEach(element => {
        $('#proyectosTotal').text(parseFloat($('#proyectosTotal').text()) + parseFloat(element.data[1].totalprojects));
        $('#contratacionesTotal').text(parseFloat($('#contratacionesTotal').text()) + parseFloat(element.data[2].totalcontractingprocess));
        $('#contratistasTotal').text(parseFloat($('#contratistasTotal').text()) + parseFloat(element.data[3].totalsuppliers));
        $('#licitantesTotal').text(parseFloat($('#licitantesTotal').text()) + parseFloat(element.data[4].totaltenderers));
        $('#institucionesTotal').text(parseFloat($('#institucionesTotal').text()) + parseFloat(element.data[5].totalinstitutes));
        paintMakers(element.data[0],map);
    });
}

function reprintMarkers(info,map){
    console.log(`#### reprintMarkers` )
    removeMarkers(map);
    paintMakers(info,map);
}

function resetNumbers(){
    $('#proyectosTotal').text(parseFloat(0));
    $('#contratacionesTotal').text(parseFloat(0));
    $('#contratistasTotal').text(parseFloat(0));
    $('#licitantesTotal').text(parseFloat(0));
    $('#institucionesTotal').text(parseFloat(0));
}

function buscarPalabra(){
    var seleccionadoTemporal = [];
    var banderaSector;
    var banderaCoincide; 
    if($('#palabra_clave').val()){
        arrayInfoInstances.forEach(element1 => {
            element1.data.forEach(element => {
                if(element instanceof Array){
                    element.forEach(project => {
                        banderaCoincide = false;
                        banderaSector = false;

                        if( project.title.toLowerCase().includes($('#palabra_clave').val().toLowerCase()) ) {
                            banderaCoincide = true;
                        }

                        if(project.type.toLowerCase().startsWith($('#palabra_clave').val().toLowerCase())){
                            banderaCoincide = true;
                        }

                        if(project.locality.toLowerCase().includes($('#palabra_clave').val().toLowerCase())){
                            banderaCoincide = true;
                        }
                        
                        if(project.sector.length > 0){
                            translateSector(project.sector).forEach(sector => {
                                if(sector.toLowerCase().includes($('#palabra_clave').val())){
                                    banderaSector = true;
                                }
                            });

                            if(banderaSector)
                            banderaCoincide = true;
                        }   

                        if(banderaCoincide)
                        seleccionadoTemporal.push(project);
                    });
                }
            });
        });
    }else{
        seleccionadoInstance = [];
        filtrarEjercicio();
    }
    if(seleccionadoTemporal.length > 0){
        reprintMarkers(seleccionadoTemporal,mymap);
    }else{
        removeMarkers(mymap);
    }
}

function buscar(){
    console.log(`buscar`)
    var seleccionadoTemporal = [];
    var arraySector = new Array();
    var arrayType = new Array();
    var municipio = undefined;
    var status = undefined;
    var banderaSector = false;
    var banderaMunicipio = false;
    var banderaTipo = false;
    var banderaEstatus = false;
    if(seleccionadoInstance.length == 0){
        actualizaSeleccionadoMap();
    }
    $('input:checkbox[name=typeFilter]:checked').each(function(){
        if(typeof this.value == 'string')
            arrayType.push(this.value)
    });
    $('input:checkbox[name=sectorFilter]:checked').each(function(){        
        if(typeof this.value == 'string')
            arraySector.push(this.value)
    });
    if($('#statusFilter').val() != '0'){
        status = $('#statusFilter').val();
    }
    if($('#municipioFilter').val() != '0'){
        municipio = $('#municipioFilter').val();
    }
    
    seleccionadoMap.forEach(project => {
        banderaSector = false;
        banderaMunicipio = false;
        banderaTipo = false;
        banderaEstatus = false;

        if(status != undefined){
            if(project.status == status)
            banderaEstatus = true;
        }else{
            banderaEstatus = true;
        }

        if(municipio != undefined){
            if(project.locality == municipio)
            banderaMunicipio = true;
            
        }else{
            banderaMunicipio = true;
        }

        if(arraySector.length > 0){
            arraySector.forEach(sector => {
                if(project.sector.includes(sector)){
                    banderaSector = true;
                }    
            });

        }else{
            banderaSector = true;
        }

        if(arrayType.length > 0){
            arrayType.forEach(tipo => {
                if(project.type == tipo){
                    banderaTipo = true;
                }
            });

        }else{
            banderaTipo = true;
        }
        if(banderaSector && banderaMunicipio && banderaTipo && banderaEstatus)
        seleccionadoTemporal.push(project);
    });

    if(seleccionadoTemporal.length > 0){
        reprintMarkers(seleccionadoTemporal,mymap);
    }else{
        removeMarkers(mymap);
    }
}

function actualizaSeleccionadoMap(){
    console.log(`actualizaSeleccionadoMap`)
    var array;
    seleccionadoMap = [];

    if(seleccionadoInstance.length > 0){
        array = seleccionadoInstance;
    }else{
        array = arrayInfoInstances;
    }

    array.forEach(element1 => {
        element1.data.forEach(element => {
            if(element instanceof Array){
                element.forEach(project => {
                    seleccionadoMap.push(project);
                });
            }
        });
    });
}

// Puntos suspensivos limitados a 120 caracteres para las secciones Perfiles
function ellipsis_box(elemento, max_chars){
    limite_text = $(elemento).text();
    if (limite_text.length > max_chars)
        {
            limite = limite_text.substr(0, max_chars)+" ...";
            $(elemento).text(limite);
        }
    }
$(function()
    {
    ellipsis_box(".limitado", 120);
    });