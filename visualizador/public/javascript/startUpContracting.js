var arrayInfoInstances = new Array();
var arrayEntity = new Array();
var arrayUrl = new Array();
var arrayPort = new Array();
var arrayImplementer = new Array();
var seleccionadoInstance = [];
var endPointContractings = '/edcapi/contractings/0';
var pageNumber = 1; 
var pageSize = 5;
var pageCont = 0;
var pagination = [];
var arrayPaginado = [];
var enlace;
var puerto;

$(document).ready(function(){
    console.log(`Ready Contracting`);
    $("#contractings_active").addClass("active");
    loadData(endPointContractings).then((data) =>{
        // console.log('DATA CONTRATACION - loadData DATA:'+JSON.stringify(data));
        if(data !== undefined){
            arrayInfoInstances = data;
            limpiarListas();
            arrayInfoInstances.forEach(contratista => {
                agrupacionContratistas(contratista.data[4], contratista.data[10].prefixOCID);
            });
            paginar(arrayInfoInstances,pageSize);
            initBubble('vis',arrayPaginado);
            transformarCifras(arrayInfoInstances); // Cifra 1 y 2
            reprintCifra3(arrayInfoInstances); // Cifra 3
            arrayInfoInstances.forEach(instancia => {
                // console.log('### INSTANCIA - DATA:'+ JSON.stringify(instancia.data[0]));
                // console.log('### INSTANCIA - DATA:'+ JSON.stringify(instancia.data[1]));
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
                // console.log('arrayImplementer', arrayImplementer)
            });
            //Llenar combo implementador
            arrayImplementer.forEach(implementador => {
                $('#implementatorFilter').append(`<option> ${implementador.implementer} </option>`);
            });
            //Ordenar selects
            ordenarSelect('entityFilter');
            ordenarSelect('implementatorFilter');
            
            $('#page_1').addClass('active');
            //Pintar sitio
            if(
                ($('#year').text() == 0 || $('#year').text() == undefined) && 
                ($('#entity').text() == 0 || $('#entity').text() == undefined) && 
                ($('#implementer').text() == 0 || $('#implementer').text() == undefined)
                ){
                    $('#yearFilter').val(0);
                    $('#entityFilter').val(0);
                    $('#implementatorFilter').val(0);
            }else{
                //filtrar si trae parametros
                $('#yearFilter').val($('#year').text());
                $('#entityFilter').val($('#entity').text());
                $('#implementatorFilter').val($('#implementer').text());
                filtrarEjercicio();
            }
        }
    })
});   

function agrupacionContratistas(contratistas, prefixOCID) {
    arrayInfoInstances.forEach(instancia => {
        instancia.data[3].forEach(contratacion => {
            if(prefixOCID == contratacion.prefijoocid){
                var arrayContrataciones = [];
                contratistas.forEach(contratista => {
                    if(contratista.contractingprocess_id == contratacion.contractingProcessId){
                        arrayContrataciones.push(contratista);
                    }
                });
                contratacion.contratistas = arrayContrataciones;
            }
        });
        // console.log('instancia.data[3]',instancia.data[3])
    });
}

function filtrarEjercicio(){
    console.log(`filtrarEjercicio`)
    endPointContractings = `/edcapi/contractings/${$('#yearFilter').val()}`;
    console.log(`${endPointContractings}`);
    arrayInfoInstances = [];
    limpiarListas();
    resetNumbers();
    loadData(endPointContractings).then((data) =>{
        if(data !== undefined){
            //guarda la información de las instancias
            arrayInfoInstances = data;
            arrayInfoInstances.forEach(contratista => {
                agrupacionContratistas(contratista.data[4], contratista.data[10].prefixOCID);
            });
            //Paginar 
            arrayPaginado = [];
            paginar(arrayInfoInstances,pageSize);
            $('#page_1').addClass('active');
            //pinta las cifras
            transformarCifras(arrayInfoInstances);
            reprintCifra3(arrayInfoInstances);
            
            //recuperar valores de los combos
            const entityValue = $('#entityFilter').val();
            const implementerValue = $('#implementatorFilter').val();
            //filtra entidad si existe una opción seleccionada
            if(entityValue != 0 && implementerValue == 0){
                filtrarEntidad();
            }
            //filtra implementador si existe una opción seleccionada{}
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
                initBubble('vis',arrayPaginado);
            }
        }
    })
}

function filtrarEntidad(){
    console.log(`filtrarEntidad ${$('#entityFilter').val()}`)
    var seleccionadoEntidad = [];
    arrayPaginado = [];
    limpiarListas();
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
            console.log(`seleccionadoInstance.length > 0 LENGHT ${seleccionadoInstance.length}`)
            transformarCifras(seleccionadoInstance);
            reprintCifra3(seleccionadoInstance);
            // Llenar listas
            limpiarListas();
            paginar(seleccionadoInstance,pageSize);
            initBubble('vis',arrayPaginado);
            $('#page_1').addClass('active');
        }
    }else{
        console.log(`seleccionadoEntidad.length > 0 ELSE`)
        $('#implementatorFilter').empty();
        $('#implementatorFilter').append(`<option value='0'> - Publicador </option>`);
        $("implementatorFilter").attr('disabled', 'disabled');
        seleccionadoInstance = [];
        filtrarEjercicio();
    }
}

function filtrarImplementador(){
    console.log(`filtrarImplementador`)
    var seleccionadoImplementador = [];
    limpiarListas();
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
        transformarCifras(seleccionadoInstance);
        reprintCifra3(seleccionadoInstance);
        // Llenar burbujas y listas
        arrayPaginado = [];
        limpiarListas();
        $('#palabra_clave').val("")
        paginar(seleccionadoInstance,pageSize);
        initBubble('vis',arrayPaginado);
        $('#page_1').addClass('active');
    }
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
                    element.forEach(contract => {
                        console.log('coooooontract', contract)
                        if(contract.identificadorproyecto !== undefined && contract.monto !== undefined){
                            banderaCoincide = false;

                            if(contract.title_contratacion !== null){
                                if( contract.title_contratacion.toLowerCase().includes($('#palabra_clave').val().toLowerCase()) ) {
                                    console.log(contract.id + 'COINCIDIO CON title')
                                    banderaCoincide = true;
                                }
                            }
                            
                            if(contract.title_proyectos !== null){
                                if( contract.title_proyectos.toLowerCase().includes($('#palabra_clave').val().toLowerCase()) ) {
                                    console.log(contract.id + 'COINCIDIO CON title_proyectos')
                                    banderaCoincide = true;
                                }
                            }
                            
                            if(contract.ocid !== null){
                                if( contract.ocid.toLowerCase().includes($('#palabra_clave').val().toLowerCase()) ) {
                                    console.log(contract.id + 'COINCIDIO CON ocid')
                                    banderaCoincide = true;
                                }
                            }
                            
                            if(contract.name_buyer !== null){
                                if(contract.name_buyer.toLowerCase().includes($('#palabra_clave').val().toLowerCase())){
                                    console.log(contract.id + 'COINCIDIO CON name_buyer')
                                    banderaCoincide = true;
                                }
                            }
                            contract.contratistas.forEach(contratista => {
                                if(contratista.name !== null){
                                    if(contratista.name.toLowerCase().includes($('#palabra_clave').val().toLowerCase())){
                                        console.log( 'COINCIDIO CON name')
                                        banderaCoincide = true;
                                    }
                                }
                            });
                            
                            if(banderaCoincide){
                                if(seleccionadoTemporal.length > 0){
                                    if(!seleccionadoTemporal.includes(contract.title_proyectos)){
                                        seleccionadoTemporal.push(contract);
                                    }
                                }else{
                                    seleccionadoTemporal.push(contract);
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
        arrayPaginado = seleccionadoTemporal;
        limpiarListas();
        pageCont = Math.ceil(seleccionadoTemporal.length/pageSize);
        $('#vis').empty();
        showListasContrataciones(seleccionadoTemporal,pageNumber,pageSize,pageCont); 
        $('#page_1').addClass('active');
        initBubble('vis',arrayPaginado);
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

function transformarCifras(arrayInfoInstances){
    $('#cifra_1').text('$ 0');
    $('#cifra_2').text('$ 0');
    if(arrayInfoInstances.length > 0){
        var montoContratadoProyectos = 0;
        var montoEjercidoProyectos = 0; 
        arrayInfoInstances.forEach(instancia => {
            instancia.data.forEach(info => {
                if(info.monto_contratado != null && info.monto_contratado != undefined)
                montoContratadoProyectos = montoContratadoProyectos + parseFloat(info.monto_contratado);

                if(info.monto_ejercido != null && info.monto_ejercido != undefined)
                montoEjercidoProyectos = montoEjercidoProyectos + parseFloat(info.monto_ejercido);
            });
        });
        if(montoContratadoProyectos != 0){
            // console.log(`Monto contratado ` + montoContratadoProyectos);
            $('#cifra_1').text(`$ ${redondearCifras(montoContratadoProyectos)}`);
        }

        if(montoEjercidoProyectos != 0){
            // console.log(`Monto ejercido ` + montoEjercidoProyectos);
            $('#cifra_2').text(`$ ${redondearCifras(montoEjercidoProyectos)}`);
        }
        
    }
}

function reprintCifra3(arrayEntityInstances){
    var totalContrataciones = 0;
    $('#cifra_3').text(0);
    arrayEntityInstances.forEach(instancia => {
        instancia.data.forEach(info => {
            if(info.totalcontractingprocess != null && info.totalcontractingprocess != undefined)
            totalContrataciones = totalContrataciones + parseFloat(info.totalcontractingprocess);
        });
    });
    $('#cifra_3').text(totalContrataciones);
}

function limpiarListas(){
    pageNumber = 1; 
    pageSize = 5;
    pageCont = 0;
    $('#lista_contrataciones').empty();
    $('#paginas_lista_contrataciones').empty();
}

function paginar(arreglo,tamanio){
    // console.log(`ARREGLO`, arreglo)
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
                    // console.log('unidad',unidad)
                    if(unidad.identificadorproyecto !== undefined && unidad.monto !== undefined){
                        unidad.url = url;
                        unidad.port = port;
                        unidad.entity = entity;
                        unidad.implementer = implementer;
                        unidad.prefixOCID = prefixOCID;
                        unidad.prefixOC4ID = prefixOC4ID;
                        arrayPaginado.push(unidad);
                        // console.log('arrayPaginado', arrayPaginado)
                    }
                });
            }
        });
    });
    // console.log(`tamño registros ${arrayPaginado.length}`)
    // console.log(`registros ${JSON.stringify(arrayPaginado)}`)
    pageCont = Math.ceil(arrayPaginado.length/tamanio);
    showListasContrataciones(arrayPaginado,pageNumber,tamanio,pageCont); 
}