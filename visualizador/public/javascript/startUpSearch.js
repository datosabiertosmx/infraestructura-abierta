var arrayInfoInstances = new Array();
var seleccionadoInstance = [];

var pageSizeProyectos = 5;
var pageContProyectos = 0;
var pageNumberProyectos = 1;
var arrayPaginadoProyectos = [];

$(document).ready(function(){    
    console.log(`Ready Search`)
    var endSearchGeneral = '/edcapi/searchGeneral/0';
    loadData(endSearchGeneral).then((data) =>{
        // console.log('### SEARCH - loadData:'+JSON.stringify(data));
        if(data !== undefined){
            arrayInfoInstances = data;
        }
    })
});

// BÚSQUEDA GENERAL EN LISTAS DE PROYECTOS - Títulos de Proyectos
function buscarDelayGral(){
    delay(function(){
        buscarPalabraGral();
    }, 600 );
};

function buscarPalabraGral(){
    var seleccionadoTemporal = [];
    limpiarListasProyectosGral();
    imprimeTexto();
    var banderaCoincide; 
    if($('#palabra_clave_gral').val()){
        arrayInfoInstances.forEach(element1 => {
            element1.data.forEach(element => {
                if(element instanceof Array){
                    element.forEach(project => {
                        if(project.monto !== undefined){
                            banderaCoincide = false;
                            
                            if( project.title.toLowerCase().includes($('#palabra_clave_gral').val().toLowerCase()) ) {
                                // console.log(project.id + 'COINCIDIO CON title')
                                banderaCoincide = true;
                                loadPage();
                                paginarProyectosGral(arrayInfoInstances,pageSizeProyectos);
                            }
                            
                            if(banderaCoincide){
                                console.log('banderacoincide', banderaCoincide)
                                if(seleccionadoTemporal.length > 0){
                                    if(!seleccionadoTemporal.includes(project.title)){
                                        seleccionadoTemporal.push(project);
                                    }
                                }else{
                                    seleccionadoTemporal.push(project);
                                }
                                
                            }
                            if(banderaCoincide == false){
                                console.log('no coincide')
                                loadPageMensaje();
                            }
                        }
                    });
                } 
            });
        });
    }else{
        seleccionadoInstance = [];
    }
    if(seleccionadoTemporal.length > 0){
        // Listar
        arrayPaginadoProyectos = seleccionadoTemporal;
        limpiarListasProyectosGral();
        pageContProyectos = Math.ceil(seleccionadoTemporal.length/pageSizeProyectos);
        showListasProyectos(seleccionadoTemporal,pageNumberProyectos,pageSizeProyectos,pageContProyectos); 
        $('#page_1Proyectos').addClass('active');
    }else{
        $('#lista_proyectos_gral').empty();
        $('#paginas_lista_proyectos').empty();
    }
}

function limpiarListasProyectosGral(){
    pageNumberProyectos = 1; 
    pageSizeProyectos = 5;
    pageContProyectos = 0;
    $('#lista_proyectos_gral').empty();
    $('#paginas_lista_proyectos').empty();
}

// Mostrar resultados de búsqueda general
function loadPage() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "none") {
        x.style.display = "block";
    }
    var oculta = document.getElementById("paginaSeccion");
    if (oculta.style.display === "block") {
        oculta.style.display = "none";
    }
    var sinr = document.getElementById("myDIVsr");
    if (sinr.style.display === "block") {
        sinr.style.display = "none";
    }
}

function loadPageMensaje() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "none") {
        x.style.display = "block";
    }
    var oculta = document.getElementById("paginaSeccion");
    if (oculta.style.display === "block") {
        oculta.style.display = "none";
    }
    var sinr = document.getElementById("myDIVsr");
    if (sinr.style.display === "none") {
        sinr.style.display = "block";
    }
}

function imprimeTexto(){
    var textoregistrado = document.getElementById('palabra_clave_gral').value;
    document.getElementById('textoresultado').value= textoregistrado;
}

function cierraL() {
    document.getElementById("palabra_clave_gral").value = "";
    var x = document.getElementById("myDIV");
    if (x.style.display === "block") {
        x.style.display = "none";
    }
    var muestraPagina = document.getElementById("paginaSeccion");
    if (muestraPagina.style.display === "none") {
        muestraPagina.style.display = "block";
    }
    $.getScript("/javascript/startUpMain.js", function(){
    });
    document.getElementById("yearFilter").disabled = false;
    document.getElementById("yearFilter").style.backgroundColor = "#c63823";
    document.getElementById("entityFilter").disabled = false;
    document.getElementById("entityFilter").style.backgroundColor = "#c63823";
    document.getElementById("implementatorFilter").disabled = false;
    document.getElementById("implementatorFilter").style.backgroundColor = "#c63823";
}

// Paginar Lista de proyectos resultado de búsqueda general
function paginarProyectosGral(arreglo,tamanio){
    arreglo.forEach(element => {
        var implementer = element.data[1].implementer;
        var entity = element.data[2].entity;
        var url = element.data[3].url;
        var port = element.data[4].port;
        var prefixOC4ID = element.data[5].prefixOC4ID;
        var prefixOCID = element.data[6].prefixOCID;
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