var arrayInfoInstances = new Array();
var endPointInstitutions = '/edcapi/institutions/0';
var pageSizeInstituciones = 5;
var pageContInstituciones = 0;
var pageNumberInstituciones = 1; 
var paginationInstituciones = [];
var arrayPaginadoInstituciones = [];

$(document).ready(function(){
    console.log(`Ready Instituciones`);
    $("#institutions_active").addClass("active");
    loadData(endPointInstitutions).then((data) =>{
        // console.log('### Institución - loadData DATA:'+JSON.stringify(data));
        if(data !== undefined){
            arrayInfoInstances = data;
            limpiarListas();
            llenarPromedios(arrayInfoInstances);
            paginarInstituciones(arrayInfoInstances,pageSizeInstituciones);
            reprintCifra1(arrayInfoInstances);
            $('#page_1Instituciones').addClass('active');
            distribucionInstituciones(data);
        }
    })
});

function distribucionInstituciones(arrayInfoInstances) {
    // console.log('info', JSON.stringify(arrayInfoInstances))
    arrayInfoInstances.forEach(autoridad => {
        autoridad.data[3].forEach(element => {
            $('#institucionesName').append(`
                <div class="row">
                    <div class="col-8" style="padding-right: 0px; padding-left: 0px;"><span class="ia_color1" ></span> <strong><a class ="colorTextgra" href="/institucion/${element.prefixOC4ID}-${element.publicauthority}">${element.name}</a></strong> </div>
                    <div class="col-4" style="padding-right: 0px; padding-left: 0px;"><span>($ </span>${(separarCifras(element.montoejercido))}<span>) </span></div>
                </div>
            `)
        });
    });

    /* Set color step */
    function am4themes_myTheme(target) {
        if (target instanceof am4core.ColorSet) {
          target.list = [
            am4core.color("#a73321"),
            am4core.color("#c63823"),
            am4core.color("#db4b36"),
            am4core.color("#f16752"),
            am4core.color("#F4A89C"),
            am4core.color("#f6c6be"),
            am4core.color("#ffe9e5")
          ];
        }
      }

    am4core.useTheme(am4themes_myTheme);

    /* Create chart */
    var chart = am4core.create("chartdiv2", am4charts.TreeMap);
    var datosGrafica = [];
    arrayInfoInstances.forEach(autoridad => {
        autoridad.data[3].forEach(element => {
            var datoGrafica = {"name": element.name, "value": element.montoejercido};
            datosGrafica.push(datoGrafica);
        });
    });

    /* Define data fields */
    chart.dataFields.value = "value";
    chart.dataFields.name = "name";

    /* Add a lagend */
    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.text = "[bold]{name}[/] (${value})";
    
    chart.data = datosGrafica;
}

function buscarDelay(){
    delay(function(){
        buscarPalabra();
    }, 500 );
};

function buscarPalabra(){
    var seleccionadoTemporal = [];
    limpiarListas();
    // $('#vis').empty();
    var banderaCoincide; 
    if($('#palabra_clave').val()){
        arrayInfoInstances.forEach(element1 => {
            element1.data.forEach(element => {
                if(element instanceof Array){
                    element.forEach(institute => {
                        banderaCoincide = false;
                        
                        if(institute.publicauthority !== null){
                            if( institute.publicauthority.toLowerCase().includes($('#palabra_clave').val().toLowerCase()) ) {
                                console.log(institute.publicauthority + 'COINCIDIO CON rfc')
                                banderaCoincide = true;
                            }
                        }
                        
                        if(institute.name !== null){
                            if(institute.name.toLowerCase().includes($('#palabra_clave').val().toLowerCase())){
                                console.log(institute.name + 'COINCIDIO CON name')
                                banderaCoincide = true;
                            }
                        }
                        
                        if(banderaCoincide){
                            if(seleccionadoTemporal.length > 0){
                                if(!seleccionadoTemporal.includes(institute.name)){
                                    seleccionadoTemporal.push(institute);
                                    limpiarListas();
                                }
                            }else{
                                seleccionadoTemporal.push(institute);
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
        // Listar
        arrayPaginadoInstituciones = seleccionadoTemporal;
        limpiarListas();
        pageContInstituciones = Math.ceil(seleccionadoTemporal.length/pageSizeInstituciones);
        // $('#vis').empty();
        showListasInstituciones(seleccionadoTemporal,pageNumberInstituciones,pageSizeInstituciones,pageContInstituciones); 
        $('#page_1Instituciones').addClass('active');
        // initBubble();
    }
}

function reloadInfo(){
    arrayPaginadoInstituciones = [];
    paginarInstituciones(arrayInfoInstances,pageSizeInstituciones);
    $('#page_1Instituciones').addClass('active');
}
function resetNumbers(){
    $('#cifra_1').text(parseFloat(0));
    $('#cifra_2').text(parseFloat(0));
    $('#cifra_3').text(parseFloat(0));
}

function llenarPromedios(arrayInfoInstances){
    $('#cifra_2').text(0);
    if(arrayInfoInstances.length > 0){
        var totalinstitutes = 0;
        var totalprojects = 0;
        arrayInfoInstances.forEach(instancia => {
            instancia.data.forEach(info => {
                totalprojects = parseFloat(totalprojects) + parseFloat((info.totalprojects === undefined ? 0 : info.totalprojects));
                totalinstitutes = parseFloat(totalinstitutes) + parseFloat((info.totalinstitutes === undefined ? 0 : info.totalinstitutes));
            });
        });
        
        if(totalinstitutes != 0 && totalprojects != 0){
            var resultado = totalprojects/totalinstitutes;
            resultado = resultado.toString();
            $('#cifra_2').text(resultado.substring(0,resultado.indexOf(".")+3));
        }
    }
    $('#cifra_3').text(0);
    if(arrayInfoInstances.length > 0){
        var totalinstitutes = 0;
        var totalcontractingprocess = 0;
        arrayInfoInstances.forEach(instancia => {
            instancia.data.forEach(info => {
                totalcontractingprocess = parseFloat(totalcontractingprocess) + parseFloat((info.totalcontractingprocess === undefined ? 0 : info.totalcontractingprocess));
                totalinstitutes = parseFloat(totalinstitutes) + parseFloat((info.totalinstitutes === undefined ? 0 : info.totalinstitutes));
            });
        });
        
        if(totalcontractingprocess != 0 && totalinstitutes != 0){
            var resultado = totalcontractingprocess/totalinstitutes;
            resultado = resultado.toString();
            $('#cifra_3').text(resultado.substring(0,resultado.indexOf(".")+2));
        }
    }
}

function reprintCifra1(arrayEntityInstances){
    var totalInstituciones = 0;
    $('#cifra_1').text(0);
    arrayEntityInstances.forEach(instancia => {
        instancia.data.forEach(info => {
            if(info.totalinstitutes != null && info.totalinstitutes != undefined)
            totalInstituciones = totalInstituciones + parseFloat(info.totalinstitutes);
        });
    });
    $('#cifra_1').text(totalInstituciones);
}

function limpiarListas(){
    pageNumber = 1; 
    pageSize = 5;
    pageCont = 0;
    $('#lista_instituciones').empty();
    $('#paginas_lista_instituciones').empty();
}

function downloadProyectos(url,port,rfc,tipo){
    console.log(`downloadProyectos ${url} ${port} ${rfc} `)
    var endPointGetProjectPackage = '/edcapi/projectPackage';
    var endPointGetProjectforRFC = '/edcapi/projectAuthorityJson';
    var arrayReleasesProjectJsons = [];

    $.ajax({
        url: `${url}:${port}${endPointGetProjectforRFC}/${rfc}`,
        type: 'GET',
        success: function(data){
            data.data.forEach(proyectos => {
                proyectos.forEach(proyecto => {
                    $.ajax({
                        url: `${url}:${port}${endPointGetProjectPackage}/${proyecto.id}`,
                        type: 'GET',
                        async: false,
                        success: function(data){
                            arrayReleasesProjectJsons.push(data);
                            if (parseFloat(data)){
                                return false;
                            } else { 
                                return true; 
                            }
                        },
                        error: function(data) {
                            alert(`Proyecto no encontrado.`)
                        }
                    });
                });
            });
            downloadZipJSONFile(arrayReleasesProjectJsons, tipo);
        },
        error: function(data) {
            alert(`Proceso de contratación no encontrado.`)
        }
    });
}

function paginarInstituciones(arreglo,tamanio){
    // console.log(`PAGINAR INSTITUCIONES`)
    arreglo.forEach(element => {
        // console.log(`element.data` + JSON.stringify(element.data));
        var implementer = element.data[4].implementer;
        var entity = element.data[5].entity;
        var url = element.data[6].url;
        var port = element.data[7].port;
        var prefixOC4ID = element.data[8].prefixOC4ID;
        var prefixOCID = element.data[9].prefixOCID;
        element.data.forEach(data => {
            if(data instanceof Array){
                data.forEach(unidad => {
                    // console.log('unidad', unidad)
                    if(unidad.name != undefined && unidad.publicauthority != undefined ){
                        unidad.url = url;
                        unidad.port = port;
                        unidad.entity = entity;
                        unidad.implementer = implementer;
                        unidad.prefixOCID = prefixOCID;
                        unidad.prefixOC4ID = prefixOC4ID;
                        //console.log('################ '+JSON.stringify(unidad))
                        arrayPaginadoInstituciones.push(unidad);
                    }
                });
            }
        });
    });
    pageContInstituciones = Math.ceil(arrayPaginadoInstituciones.length/tamanio);
    showListasInstituciones(arrayPaginadoInstituciones,pageNumberInstituciones,tamanio,pageContInstituciones); 
    $('#page_1Instituciones').addClass('active'); 
}