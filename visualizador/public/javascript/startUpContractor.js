var arrayInfoInstances = new Array();
var endPointContractors = '/edcapi/contractors/0';
var pageNumberContratistas = 1; 
var pageSizeContratistas = 5;
var pageContContratistas = 0;
var paginationContratistas = [];
var arrayPaginadoContratistas = [];

$(document).ready(function(){
    console.log(`Ready Supplier`);
    $("#contractors_active").addClass("active");
    loadData(endPointContractors).then((data) =>{
        //  console.log('### CONTRATISTA - loadData DATA:'+JSON.stringify(data));
        if(data !== undefined){
            arrayInfoInstances = data;
            limpiarListas();
            arrayInfoInstances.forEach(adjudicacion => {
                awardsCountValue(adjudicacion.data[3], adjudicacion.data[9].prefixOCID);
            });
            paginarContratistas(arrayInfoInstances,pageSizeContratistas);
            initBubble('vis',arrayPaginadoContratistas);
            reprintCifra2(arrayInfoInstances); // cifra 2
            reprintCifra3(arrayInfoInstances); // cifra 3
            $('#page_1Contratistas').addClass('active');
        }
    })
});

function awardsCountValue(adjudicaciones, prefixOCID) {
    arrayInfoInstances.forEach(instancia => {
        instancia.data[2].forEach(award => {
            if(prefixOCID == award.prefijoocid){
                let arrayAdjudicaciones = [];
                adjudicaciones.forEach(adjudicacion => {
                    if(adjudicacion.rfc == award.rfc){
                        arrayAdjudicaciones.push(adjudicacion);
                    }
                });
                award.adjudicaciones = arrayAdjudicaciones;
                // console.log('arrayAdjudicaciones', arrayAdjudicaciones)
            }
            // console.log('instancia.data[2]', instancia.data[2])
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
                    element.forEach(supplier => {
                        if(supplier.cp_id !== undefined && supplier.name !== undefined){

                            banderaCoincide = false;
                            
                            if(supplier.rfc !== null){
                                if( supplier.rfc.toLowerCase().includes($('#palabra_clave').val().toLowerCase()) ) {
                                    console.log(supplier.id + 'COINCIDIO CON rfc')
                                    banderaCoincide = true;
                                }
                            }
                            
                            if(supplier.name !== null){
                                if(supplier.name.toLowerCase().includes($('#palabra_clave').val().toLowerCase())){
                                    console.log(supplier.id + 'COINCIDIO CON name')
                                    banderaCoincide = true;
                                }
                            }
                            
                            if(banderaCoincide){
                                if(seleccionadoTemporal.length > 0){
                                    if(!seleccionadoTemporal.includes(supplier.name)){
                                        seleccionadoTemporal.push(supplier);
                                    }
                                }else{
                                    seleccionadoTemporal.push(supplier);
                                }   
                            }
                        }
                    });
                }
            });
        });
    }else{
        seleccionadoTemporal = [];
        reloadInfo();
    }
    if(seleccionadoTemporal.length > 0){
        // Listar y mostrar burbujas
        arrayPaginadoContratistas = seleccionadoTemporal;
        limpiarListas();
        pageContContratistas = Math.ceil(seleccionadoTemporal.length/pageSizeContratistas);
        $('#vis').empty();
        showListasContratistas(seleccionadoTemporal,pageNumberContratistas,pageSizeContratistas,pageContContratistas); 
        $('#page_1Contratistas').addClass('active');
        initBubble('vis',arrayPaginadoContratistas);
    }
}

function reloadInfo(){
    arrayPaginadoContratistas = [];
    limpiarListas();
    paginarContratistas(arrayInfoInstances,pageSizeContratistas);
    initBubble('vis',arrayPaginadoContratistas);
    reprintCifra2(arrayInfoInstances); // cifra 2
    reprintCifra3(arrayInfoInstances); // cifra 3
    $('#page_1Contratistas').addClass('active');
}

function resetNumbers(){
    $('#cifra_2').text(parseFloat(0));
    $('#cifra_3').text(parseFloat(0));
}

function reprintCifra2(arrayEntityInstances){
    var totalContratistas = 0;
    $('#cifra_2').text(0);
    arrayEntityInstances.forEach(instancia => {
        instancia.data.forEach(info => {
            if(info.totalsuppliers != null && info.totalsuppliers != undefined)
            totalContratistas = totalContratistas + parseFloat(info.totalsuppliers);
        });
    });
    $('#cifra_2').text(totalContratistas);
}

function reprintCifra3(arrayEntityInstances){
    var totalLicitantes = 0;
    $('#cifra_3').text(0);
    arrayEntityInstances.forEach(instancia => {
        instancia.data.forEach(info => {
            if(info.totaltenderers != null && info.totaltenderers != undefined)
            totalLicitantes = totalLicitantes + parseFloat(info.totaltenderers);
        });
    });
    $('#cifra_3').text(totalLicitantes);
}

function limpiarListas(){
    pageNumber = 1; 
    pageSize = 5;
    pageCont = 0;
    $('#lista_contratistas').empty();
    $('#paginas_lista_contratistas').empty();
}

function paginarContratistas(arreglo,tamanio){
    // console.log(`PAGINAR Contratistas`, arreglo)
    arreglo.forEach(element => {
        // console.log(`ELEMENT` + JSON.stringify(element));
        var implementer = element.data[4].implementer;
        var entity = element.data[5].entity;
        var url = element.data[6].url;
        var port = element.data[7].port;
        var prefixOC4ID = element.data[8].prefixOC4ID;
        var prefixOCID = element.data[9].prefixOCID;
        element.data.forEach(data => {
            if(data instanceof Array){
                data.forEach(unidad => {
                    // console.log('unidad',unidad)
                    if(unidad.cp_id != undefined && unidad.name != undefined ){
                        unidad.url = url;
                        unidad.port = port;
                        unidad.entity = entity;
                        unidad.implementer = implementer;
                        unidad.prefixOCID = prefixOCID;
                        unidad.prefixOC4ID = prefixOC4ID;
                        unidad.seccion = 'contratista';
                        arrayPaginadoContratistas.push(unidad);
                        // console.log('arrayPaginadoContratistas', arrayPaginadoContratistas)
                    }
                });
            }
        });
    });
    pageContContratistas = Math.ceil(arrayPaginadoContratistas.length/tamanio);
    showListasContratistas(arrayPaginadoContratistas,pageNumberContratistas,tamanio,pageContContratistas);
    $('#page_1Contratistas').addClass('active'); 
}