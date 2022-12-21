var arrayInfoInstances = new Array();
var arrayEntity = new Array();
var arrayUrl = new Array();
var arrayPort = new Array();
var arrayImplementer = new Array();
var arraySector = new Array();
var arrayTipo = new Array();
var arrayEstatus = new Array();
var seleccionadoInstance = [];
var seleccionado = [];
var endPointProjects = '/edcapi/proyects/0';
var pageSizeProyectos = 5;
var pageContProyectos = 0;
var pageNumberProyectos = 1; 
var pagination = [];
var arrayPaginadoProyectos = [];
var enlace;
var puerto;

$(document).ready(function(){
    console.log(`Ready Project`);  
    $("#project_active").addClass("active");
    loadData(endPointProjects).then((data) =>{
        // console.log('### PROYECTOS - loadData DATA:'+JSON.stringify(data));
        if(data !== undefined){
            arrayInfoInstances = data;
            limpiarListas();
            paginar(arrayInfoInstances,pageSizeProyectos);
            initBubble('vis',arrayPaginadoProyectos);
            transformarCifras(arrayInfoInstances); // cifra 1
            reprintCifra2(arrayInfoInstances); // cifra 2
            llenarPromedios(arrayInfoInstances); // cifra 3
            llenarNumeralia(arrayInfoInstances); 
            arrayInfoInstances.forEach(instancia => {
                // console.log('### INSTANCIA - DATA:'+ JSON.stringify(instancia.data[0]));
                //Llenar Ejercicio
                if(!arrayUrl.includes(instancia.data[7].url)){
                    enlace = instancia.data[7].url;
                }
                if(!arrayPort.includes(instancia.data[8].port)){
                    puerto = instancia.data[8].port;
                }
                llenaYearProjects(enlace, puerto);
                //Llenar Entidad Federativa
                if(arrayEntity.length > 0){
                    if(!arrayEntity.includes(instancia.data[6].entity)){
                        arrayEntity.push(instancia.data[6].entity);
                        $('#entityFilter').append(`<option> ${instancia.data[6].entity} </option>`); 
                    }
                }else{
                    arrayEntity.push(instancia.data[6].entity);
                    $('#entityFilter').append(`<option> ${instancia.data[6].entity} </option>`); 
                }
                //Llenar implementador
                arrayImplementer.push({implementer:instancia.data[5].implementer,entity:instancia.data[6].entity});
                //Llenar Sector
                llenarSector(instancia);
                //Llenar Tipo
                llenarTipo(instancia);
                //Llenar Estatus
                llenarEstatus(instancia);
            });
            //Llenar combo implementador
            arrayImplementer.forEach(implementador => {
                $('#implementatorFilter').append(`<option> ${implementador.implementer} </option>`);
            });
            //ordenar selects
            // ordenarSelect('yearFilter'); --------------
            ordenarSelect('entityFilter');
            ordenarSelect('implementatorFilter');
            ordenarSelect('sectorFilter');
            ordenarSelect('typeFilter');
            ordenarSelect('statusFilter');
            $('#page_1Proyectos').addClass('active');
            //Pintar sitio
            if(($('#year').val() == 0 || $('#year').val() == undefined) && ($('#entity').val() == 0 || $('#entity').val() == undefined) && ( $('#implementer').val() == 0 || $('#implementer').val() == undefined)){
                //Pintar el sitio
                $('#yearFilter').val(0);
                $('#entityFilter').val(0);
                $('#implementatorFilter').val(0);
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


function filtrarEjercicio(){
    console.log(`filtrarEjercicio ${$('#yearFilter').val()}`)
    endPointProjects = `/edcapi/proyects/${$('#yearFilter').val()}`;
    console.log('endpoint filtrarejercicio', endPointProjects)
    arrayInfoInstances = [];
    console.log('esta en filtrar ejercicio', arrayInfoInstances)
    limpiarListas();
    resetNumbers();
    loadData(endPointProjects).then((data) =>{
        console.log('data', data)
        if(data !== undefined){
            //guarda la informacion de las instancias
            arrayInfoInstances = data;
            //Paginar 
            arrayPaginadoProyectos = [];
            paginar(arrayInfoInstances,pageSizeProyectos);
            $('#page_1Proyectos').addClass('active');
            //Pinta las cifras
            transformarCifras(arrayInfoInstances); // cifra 1
            reprintCifra2(arrayInfoInstances); // cifra 2
            llenarPromedios(arrayInfoInstances); // cifra 3
            llenarNumeralia(arrayInfoInstances); 
            //Recupera valores de los combos 
            const entityValue = $('#entityFilter').val();
            const implementerValue = $('#implementatorFilter').val();
            //Filtra entidad si existe una opcion seleccionada
            if(entityValue != 0 && implementerValue == 0){
                filtrarEntidad();
            }
            //Filtra implementador si existe una opcion seleccioanda
            $('#implementatorFilter').val(implementerValue);
            if(implementerValue != 0 && entityValue == 0){
                filtrarImplementador();
            }
            //Filtra si entidad e implementador vienen vacio
            if(implementerValue != 0 && entityValue != 0){
                filtrarImplementador();
            }
            if(implementerValue == 0 && entityValue == 0){
                //filtrar burbujas 
                //initBubble('vis',arrayPaginadoProyectos);
                actualizaSeleccionado();
                buscar();
            }
        }
    })
}

function filtrarEntidad(){
    console.log(`filtrarEntidad ${$('#entityFilter').val()}`)
    var seleccionadoEntidad = [];
    limpiarListas();
    $('#palabra_clave').val("")
    arrayPaginadoProyectos = [];
    $('#vis').empty();
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
            arrayImplementer.forEach(implementador => {
                if(implementador.entity ==  $('#entityFilter').val()){
                    $('#implementatorFilter').append(`<option> ${implementador.implementer} </option>`);
                }
            });
            $('#implementatorFilter').removeAttr('disabled');
        }
        if(seleccionadoEntidad.length > 0){
            seleccionadoInstance = [];
            seleccionadoInstance = seleccionadoEntidad;
            llenarPromedios(seleccionadoInstance);
            llenarNumeralia(seleccionadoInstance); 
            transformarCifras(seleccionadoInstance);
            reprintCifra2(seleccionadoInstance);
            // Llenar listas
            limpiarListas();
            paginar(seleccionadoInstance,pageSizeProyectos);
            // initBubble();
            $('#page_1Proyectos').addClass('active');
            $('#palabra_clave').val("")
            //buscar si tiene algun filtro secundario
            actualizaSeleccionado()
            buscar();
        }
    }else{
        $('#implementatorFilter').empty();
        $('#implementatorFilter').append(`<option value='0'> - Publicador </option>`);
        $("implementatorFilter").attr('disabled', 'disabled');
        seleccionadoInstance = [];
        filtrarEjercicio();
        $('#palabra_clave').val("")
        buscar();
    }
}

function filtrarImplementador(){
    console.log(`filtrarImplementador`)
    var seleccionadoImplementador = [];
    limpiarListas();
    $('#palabra_clave').val("");
    if($('#implementatorFilter').val()!=0){
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
        llenarPromedios(seleccionadoInstance);
        llenarNumeralia(seleccionadoInstance); 
        transformarCifras(seleccionadoInstance);
        reprintCifra2(seleccionadoInstance);
        // Llenar burbujas y listas
        arrayPaginadoProyectos = [];
        limpiarListas();
        $('#palabra_clave').val("")
        paginar(seleccionadoInstance,pageSizeProyectos);
        $('#page_1Proyectos').addClass('active');
        actualizaSeleccionado();
        buscar();
    }
}

function llenarSector(instancia){
    instancia.data[3].forEach(proyecto => {
        proyecto.sector.forEach(sector => {
            if (!arraySector.includes(sector)) {
                arraySector.push(sector);
                $('#sectorFilter').append(`<option> ${translateSectorEsp(sector)} </option>`); 
                ordenarSelect('sectorFilter');
            }
        });
    });
}

function llenarTipo(instancia){
    instancia.data[3].forEach(proyecto => {
        if (arrayTipo.length > 0) {
            if(!arrayTipo.includes(proyecto.type)){
                arrayTipo.push(proyecto.type);
                $('#typeFilter').append(`<option> ${proyecto.type} </option>`); 
                ordenarSelect('typeFilter');
            }
        }else{
            arrayTipo.push(proyecto.type);
            $('#typeFilter').append(`<option> ${proyecto.type} </option>`); 
        }
    });
}

function llenarEstatus(instancia){
    instancia.data[3].forEach(proyecto => {
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
}

function buscar(){
    console.log(`buscar`)

    var seleccionadoTemporal = [];
    var sector = undefined;
    var tipo = undefined;
    var status = undefined;
    var banderaSector = false;
    var banderaTipo = false;
    var banderaEstatus = false;
    

    if(seleccionadoInstance.length == 0){
        actualizaSeleccionado();
    } 
    if($('#typeFilter').val() != '0'){
        tipo = $('#typeFilter').val();
    }
    if($('#sectorFilter').val() != '0'){
        sector = $('#sectorFilter').val();
        if(sector != undefined){
            var sectorEng = "";
            sectorEng = sector;
        }
    }
    if($('#statusFilter').val() != '0'){
        status = $('#statusFilter').val();
    }
    
    seleccionado.forEach(project => {       
        banderaSector = false;
        banderaTipo = false;
        banderaEstatus = false;

        //Busca el estatus
        if(status != undefined){
            if(project.status == status)
            banderaEstatus = true;
        }else{
            banderaEstatus = true;
        }

        //Busca el sector
        if(sectorEng != undefined){
            var sectorEngLista = translateSectorEng(sectorEng);
            if(project.sector.includes(sectorEngLista)){
                banderaSector = true;
            }    
        }else{
            banderaSector = true;
        }

        //Busca el tipo
        if(tipo != undefined){
            if(project.type == tipo){
                banderaTipo = true;
            }
        }else{
            banderaTipo = true;
        }

        //Guarda el elemento si lo encuentra
        if(banderaSector && banderaTipo && banderaEstatus)
        seleccionadoTemporal.push(project);
    });

    if(seleccionadoTemporal.length > 0){
        // Listar y mostrar burbujas
        arrayPaginadoProyectos = seleccionadoTemporal;
        limpiarListas();
        pageContProyectos = Math.ceil(seleccionadoTemporal.length/pageSizeProyectos);
        $('#vis').empty();
        showListasProyectos(seleccionadoTemporal,pageNumberProyectos,pageSizeProyectos,pageContProyectos); 
        $('#page_1Proyectos').addClass('active');
        initBubble('vis',arrayPaginadoProyectos);
    }else{
        $('#vis').empty();
        $('#lista_proyectos').empty();
        $('#paginas_lista_proyectos').empty();
    }
}

function actualizaSeleccionado(){
    console.log(`actualizaSeleccionado`)
    var array;
    seleccionado = [];

    if(seleccionadoInstance.length > 0){
        array = seleccionadoInstance;
    }else{
        array = arrayInfoInstances;
    }

    array.forEach(element1 => {
        element1.data.forEach(element => {
            if(element instanceof Array){
                element.forEach(project => {
                    if(project.monto !== undefined)
                    seleccionado.push(project);
                });
            }
        });
    });
}

function buscarDelay(){
    delay(function(){
        buscarPalabra();
    }, 500 );
};

function buscarPalabra(){
    var seleccionadoTemporal = [];
    limpiarListas();
    $('#vis').empty();
    var banderaCoincide; 
    if($('#palabra_clave').val()){
        arrayInfoInstances.forEach(element1 => {
            element1.data.forEach(element => {
                if(element instanceof Array){
                    element.forEach(project => {
                        if(project.monto !== undefined){
                            banderaCoincide = false;

                        if( project.title.toLowerCase().includes($('#palabra_clave').val().toLowerCase()) ) {
                            // console.log(project.id + 'COINCIDIO CON title')
                            banderaCoincide = true;
                        }

                        if(project.id == Number($('#palabra_clave').val())){
                            // console.log(project.id + 'COINCIDIO CON id')
                            banderaCoincide = true;
                        }

                        if(project.publicauthority.toLowerCase().includes($('#palabra_clave').val().toLowerCase())){
                            // console.log(project.id + 'COINCIDIO CON publicauthority')
                            banderaCoincide = true;
                        }
                        
                        if(banderaCoincide){
                            if(seleccionadoTemporal.length > 0){
                                if(!seleccionadoTemporal.includes(project.title)){
                                    seleccionadoTemporal.push(project);
                                }
                            }else{
                                seleccionadoTemporal.push(project);
                            }
                            
                        }
                        }
                    });
                }
            });
        });
    }else{
        seleccionadoInstance = [];
        filtrarEjercicio();
    }
    if(seleccionadoTemporal.length > 0){
        // Listar y mostrar burbujas
        arrayPaginadoProyectos = seleccionadoTemporal;
        limpiarListas();
        pageContProyectos = Math.ceil(seleccionadoTemporal.length/pageSizeProyectos);
        $('#vis').empty();
        showListasProyectos(seleccionadoTemporal,pageNumberProyectos,pageSizeProyectos,pageContProyectos); 
        $('#page_1Proyectos').addClass('active');
        initBubble('vis',arrayPaginadoProyectos);
    }else{
        $('#vis').empty();
        $('#lista_proyectos').empty();
        $('#paginas_lista_proyectos').empty();
    }
}

function resetNumbers(){
    $('#cifra_1').text(parseFloat(0));
    $('#cifra_2').text(parseFloat(0));
    $('#cifra_3').text(parseFloat(0));
}

function llenarNumeralia(arrayInfoInstances){
    $('#proyectosIdentificacion').text(0);
    $('#proyectosPreparacion').text(0);
    $('#proyectosImplementacion').text(0);
    $('#proyectosTerminacion').text(0);
    $('#proyectosTerminados').text(0);
    $('#proyectosCancelados').text(0);
    if(arrayInfoInstances.length > 0){
        var proyectosIdentificacion = 0;
        var proyectosPreparacion = 0;
        var proyectosImplementacion = 0;
        var proyectosTerminacion = 0;
        var proyectosTerminados = 0;
        var proyectosCancelados = 0;
        arrayInfoInstances.forEach(instancia => {
            if(instancia.data[4].length > 0 && instancia.data[4] !== undefined){
                instancia.data[4].forEach(estatus => {
                    switch (estatus.status) {
                        case 'completion':
                            proyectosTerminacion = parseFloat(proyectosTerminacion) + parseFloat((estatus.total_estatus === undefined ? 0 : estatus.total_estatus));
                            break;
                        case 'cancelled':
                            proyectosCancelados = parseFloat(proyectosCancelados) + parseFloat((estatus.total_estatus === undefined ? 0 : estatus.total_estatus));
                            break;
                        case 'implementation':
                            proyectosImplementacion = parseFloat(proyectosImplementacion) + parseFloat((estatus.total_estatus === undefined ? 0 : estatus.total_estatus));
                            break;
                        case 'identification':
                            proyectosIdentificacion = parseFloat(proyectosIdentificacion) + parseFloat((estatus.total_estatus === undefined ? 0 : estatus.total_estatus));
                            break;
                        case 'completed':
                            proyectosTerminados = parseFloat(proyectosTerminados) + parseFloat((estatus.total_estatus === undefined ? 0 : estatus.total_estatus));
                            break;
                        case 'preparation':
                            proyectosPreparacion = parseFloat(proyectosPreparacion) + parseFloat((estatus.total_estatus === undefined ? 0 : estatus.total_estatus));
                            break;
                    
                        default:
                            break;
                    }
                    
                });
            }
        });
        
        $('#proyectosIdentificacion').text(proyectosIdentificacion);
        $('#proyectosPreparacion').text(proyectosPreparacion);
        $('#proyectosImplementacion').text(proyectosImplementacion);
        $('#proyectosTerminacion').text(proyectosTerminacion);
        $('#proyectosTerminados').text(proyectosTerminados);
        $('#proyectosCancelados').text(proyectosCancelados);
    }
}

function llenarPromedios(arrayInfoInstances){
    $('#cifra_3').text(0);

    if(arrayInfoInstances.length > 0){
        var totalcontractingprocess = 0;
        var totalprojects = 0;
        arrayInfoInstances.forEach(instancia => {
            instancia.data.forEach(info => {
                totalprojects = parseFloat(totalprojects) + parseFloat((info.totalprojects === undefined ? 0 : info.totalprojects));
                totalcontractingprocess = parseFloat(totalcontractingprocess) + parseFloat((info.totalcontractingprocess === undefined ? 0 : info.totalcontractingprocess));
            });
        });
        
        if(totalcontractingprocess != 0 && totalprojects != 0){
            var resultado = totalcontractingprocess/totalprojects;
            resultado = resultado.toString();
            $('#cifra_3').text(resultado.substring(0,resultado.indexOf(".")+2)); 
        }
    }
}

function transformarCifras(arrayInfoInstances){
    $('#cifra_1').text('$ 0');
    if(arrayInfoInstances.length > 0){
        var montototalProyectos = 0;        
        arrayInfoInstances.forEach(instancia => {
            instancia.data.forEach(info => {
                if(info.monto_total_proyectos != null && info.monto_total_proyectos != undefined)
                montototalProyectos = montototalProyectos + info.monto_total_proyectos;
            });
        });
        if(montototalProyectos != 0){
            $('#cifra_1').text(`$ ${redondearCifras(montototalProyectos)}`);
        }
    }
}

function reprintCifra2(arrayEntityInstances){
    var totalProyectos = 0;
    $('#cifra_2').text(0);
    arrayEntityInstances.forEach(instancia => {
        instancia.data.forEach(info => {
            if(info.totalprojects != null && info.totalprojects != undefined)
            totalProyectos = totalProyectos + parseFloat(info.totalprojects);
        });
    });
    $('#cifra_2').text(totalProyectos);
}

function limpiarListas(){
    pageNumberProyectos = 1; 
    pageSizeProyectos = 5;
    pageContProyectos = 0;
    $('#lista_proyectos').empty();
    $('#paginas_lista_proyectos').empty();
    
}

function paginar(arreglo,tamanio){
    arreglo.forEach(element => {
        var implementer = element.data[5].implementer;
        var entity = element.data[6].entity;
        var url = element.data[7].url;
        var port = element.data[8].port;
        var prefixOC4ID = element.data[9].prefixOC4ID;
        var prefixOCID = element.data[10].prefixOCID;
        element.data.forEach(data => {
            if(data instanceof Array){
                data.forEach(unidad => {
                    if(unidad.monto !== undefined){
                        unidad.url = url;
                        unidad.port = port;
                        unidad.entity = entity;
                        unidad.implementer = implementer;
                        unidad.prefixOC4ID = prefixOC4ID;
                        unidad.prefixOCID = prefixOCID;
                        arrayPaginadoProyectos.push(unidad);
                    }
                });
            }
        });
    });
    pageContProyectos = Math.ceil(arrayPaginadoProyectos.length/tamanio);
    showListasProyectos(arrayPaginadoProyectos,pageNumberProyectos,tamanio,pageContProyectos); 
    $('#page_1Proyectos').addClass('active'); 
}