
var pageSizeContratista = 5;
var pageContContratista = 0;
var pageNumberContratista = 1; 
var paginationContratista = [];
var arrayPaginadoContratista = [];
var perfilCA = [];

$(document).ready(function(){
    console.log(`ReadySuppliers Details`);
    $("#contractors_active").addClass("active");

    var prefixOCID = $("#prefixOCID").val();
    var partyid = $("#partyid").val();
    var endpoint = `/edcapi/contratista/${partyid}`;

    loadDataDetails(null,prefixOCID,endpoint).then((data) => {
        // console.log('++++++ DATA' + JSON.stringify(data))
        if(data.data != undefined){
            perfilCA = data;
            llenarBanner(data);
            graficaContratista(data);
            agrupacionContratistas(perfilCA.data[3], perfilCA.data[9].prefixOCID);
            paginarContrataciones(data.data,pageSizeContratista);
        }
    });
});

function agrupacionContratistas(contratistas, prefixOCID) {
    // console.log('contratistas',contratistas)
    // console.log('prefixOCID',prefixOCID)
    perfilCA.data[1].forEach(contratacion => {
        if(prefixOCID == contratacion.prefijoocid){
            let arrayContrataciones = [];
            contratistas.forEach(contratista => {
                if(contratista.contractingprocess_id == contratacion.contractingProcessId){
                    arrayContrataciones.push(contratista);
                }
            });
            contratacion.contratistas = arrayContrataciones;
        }
    });
}

function llenarBanner(info){
    var comaSepara = ', ';
    var direccion = ''.concat(info.data[0].address_streetaddress === '- Seleccionar -' ? '' : info.data[0].address_streetaddress.concat(comaSepara), 
                              info.data[0].address_locality === '- Seleccionar -' ? '' : info.data[0].address_locality.trimEnd().concat(comaSepara), 
                              info.data[0].address_region === '- Seleccionar -' ? '' : info.data[0].address_region.trimEnd().concat(comaSepara), 
                              info.data[0].address_postalcode === '- Seleccionar -' ? '' : info.data[0].address_postalcode.concat(comaSepara), 
                              info.data[0].address_countryname === '- Seleccionar -' ? '' : info.data[0].address_countryname);
    if(info.data[0].sector ){
        var sectoresESP = translateSectorToImageBanner(info.data[0].sector.split(','),30);
        var sectoresESPmovil = translateSectorToImageBanner(info.data[0].sector.split(','),80);
    }
    $('#_identificador_banner').text(info.data[0].identifier_id);
    $('#_cifra_2').text(`$ ${redondearCifras(parseFloat(info.data[0].montorecibido))}`);
    $('#_cifra_3').text(info.data[0].contratosparticipa);
    $('#_title').text(info.data[0].personamoral);
    $('#_titlebreadcrum').text(info.data[0].personamoral);
    $('#_contacto').text(info.data[0].contactpoint_name);
    $('#_direccion').append(direccion);
    $('#_sector').append(sectoresESP);
    $('#_sectormovil').append(sectoresESPmovil);
    if(info.data[0].contactpoint_email != ''){
        $('#_email').text(`
            ${info.data[0].contactpoint_email}
        `);
    } else {
        $('#_email').text(`
            Sin dato registrado
        `);
    }
    if(info.data[0].contactpoint_telephone != ''){
        $('#_telephone').text(`
            ${info.data[0].contactpoint_telephone}
        `);
    } else {
        $('#_telephone').text(`
            Sin dato registrado
        `);
    }
    if(info.data[0].contactpoint_url != ''){
        $('#_url').append(`
            <a class="linkListas" href="${info.data[0].contactpoint_url}" target="_blank">${info.data[0].contactpoint_url}</a>
        `);
    } else {
        $('#_url').append(`
        <p>Sin dato registrado</p>
        `);
    }
}

function graficaContratista(info){
    if(info.data[2].length > 0){
        var nombreProveedor = "";
        var contrataciones = [];
        var proyectos = [];
        var instituciones = [];
        
        info.data[2].forEach(proveedorPerfil=> {
            if(proveedorPerfil.contratistaname) {

                var existContracting = false;
                    contrataciones.forEach(nameP=>{ 
                        if (proveedorPerfil.contratacionname == nameP.name){
                            existContracting = true;
                        }
                    });
                
                var existHijoContracting = false;
                    proyectos.forEach(hijoP=>{
                        if (proveedorPerfil.proyectoname == hijoP.name){
                            existHijoContracting = true;
                            let hijoPr = {
                                "name":proveedorPerfil.proyectoname,
                                "hijo":hijoP.hijo +"::" + proveedorPerfil.contratacionname
                            }
                            proyectos.push(hijoPr);
                        }
                    });

                    if (!existHijoContracting){
                        let hijoP = {
                            "name": proveedorPerfil.proyectoname,
                            "hijo": proveedorPerfil.contratacionname
                        }
                        proyectos.push(hijoP);
                    }

                var existHijoProyecto = false;
                    instituciones.forEach(hijoP=>{
                        if (proveedorPerfil.institucionname == hijoP.name){
                            existHijoProyecto = true;
                            let hijoPr = {
                                "name":proveedorPerfil.institucionname,
                                "hijo":hijoP.hijo +"::" + proveedorPerfil.proyectoname
                            }
                            instituciones.push(hijoPr);
                        }
                    });

                    if (!existHijoProyecto){
                        let hijoP = {
                            "name": proveedorPerfil.institucionname,
                            "hijo": proveedorPerfil.proyectoname
                        }
                        instituciones.push(hijoP);
                    }

                    if (!existContracting){
                        let contratacionname = {
                            "link":[],
                            value: 60,
                            "name":proveedorPerfil.contratacionname,
                            "children":[],
                            nodeSettings: {
                                fill: am5.color(0xF16752)
                              }
                        }
                        contrataciones.push(contratacionname);
                    }
    
                    nombreProveedor = proveedorPerfil.contratistaname;

            }
        });

        for (i = 0; i < proyectos.length ; i++){
            var linkN = [];
            var childsThisProyecto = [];
            instituciones.forEach(institucion=>{
                if (institucion.hijo.includes(proyectos[i].name)){
                    if (institucion.hijo.includes("::"+proyectos[i].name)){
                        var hasChildThis = false;
                        for (j = 0; j < childsThisProyecto.length; j++){
                            if (institucion.name == childsThisProyecto[j].name){
                                hasChildThis = true;
                            }
                        }                      
                        if (!hasChildThis)
                            linkN.push(institucion.name);

                    }else{

                        var hasChildThis = false;
                        for (j = 0; j < childsThisProyecto.length; j++){
                            if (institucion.name == childsThisProyecto[j].name){
                                hasChildThis = true;
                            }
                        }                      
                        if (hasChildThis){
                            linkN.push(institucion.name);
                        }else{

                            let proyectochild = {
                                "name":institucion.name
                            }
                            childsThisProyecto.push(proyectochild);
                        }
                    }
                }
            });
            proyectos[i].link = linkN;
            proyectos[i].children = childsThisProyecto;
        }

        for (i = 0; i < contrataciones.length ; i++){
            var linkN = [];
            var childsThisContracting = [];
            proyectos.forEach(proyecto=>{
                if (proyecto.hijo.includes(contrataciones[i].name)){
                    if (proyecto.hijo.includes("::"+contrataciones[i].name)){
                        var hasChildThis = false;
                        for (j = 0; j < childsThisContracting.length; j++){
                            if (proyecto.name == childsThisContracting[j].name){
                                hasChildThis = true;
                            }
                        }                      
                        if (!hasChildThis)
                            linkN.push(proyecto.name);
                    }else{

                        var hasChildThis = false;
                        for (j = 0; j < childsThisContracting.length; j++){
                            if (proyecto.name == childsThisContracting[j].name){
                                hasChildThis = true;
                            }
                        }                      
                        if (hasChildThis){
                            linkN.push(proyecto.name);
                        }else{

                            let contratacionchild = {
                                "name":proyecto.name,
                                value: 40,
                                "children":proyecto.children,
                                "link":proyecto.link,
                                nodeSettings: {
                                    fill: am5.color(0xdb4b36)
                                  }
                            }
                            childsThisContracting.push(contratacionchild);
                        }
                    }
                }
            });
            contrataciones[i].link = linkN;
            contrataciones[i].children = childsThisContracting;
        }

        
        am5.ready(function() {

            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("chartdiv");
            
            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
            am5themes_Animated.new(root)
            ]);
        
            var data = {
                name: nombreProveedor,
                children: [
                  {
                    name: nombreProveedor,
                    children: contrataciones
                  }
                ]
              };
        
            // console.log(JSON.stringify(data));
        
        // Create wrapper container
        var container = root.container.children.push(
          am5.Container.new(root, {
            width: am5.percent(100),
            height: am5.percent(100),
            layout: root.verticalLayout
          })
        );
        
        // Create series
        // https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
        var series = container.children.push(
          am5hierarchy.ForceDirected.new(root, {
            singleBranchOnly: false,
            downDepth: 1,
            topDepth: 1,
            // maxRadius: 60,
            minRadius: 20,
            valueField: "value",
            categoryField: "name",
            childDataField: "children",
            idField: "name",
            linkWithStrength: 0.3,
            linkWithField: "link",
            manyBodyStrength: -15,
            centerStrength: 0.5
          })
        );

        series.get("colors").set("colors", [
            am5.color(0xC63823)
          ]);
        
        series.circles.template.setAll({
            templateField: "nodeSettings"
        });

        // Desactivar el movimiento de los nodos
        series.nodes.template.setAll({
            draggable: false
          });

        // Desactivar con click ocultar o mostrar nodos hijos
        series.nodes.template.setAll({
            toggleKey: "none",
            cursorOverStyle: "default"
          });

        // Ocultar los anillos
        series.outerCircles.template.set("forceHidden", true);

        series.labels.template.set("forceHidden", true);
        
        series.nodes.template.set("tooltipText", "[fontSize: 20px #ffffff]{category}");

        series.data.setAll([data]);
        series.set("selectedDataItem", series.dataItems[0]);
        
        // Make stuff animate on load
        series.appear(1000, 100);
        
        }); // end am5.ready()
    }
}

function paginarContrataciones(arreglo,tamanio){
    // console.log(`PAGINAR CONTRATACIONES ${JSON.stringify(arreglo)}`)
    var implementer = arreglo[4].implementer;
    var entity = arreglo[5].entity;
    var url = arreglo[6].url;
    var port = arreglo[7].port;
    var prefixOC4ID = arreglo[8].prefixOC4ID;
    var prefixOCID = arreglo[9].prefixOCID;

    if(arreglo[1].length > 0){
        arreglo[1].forEach(unidad => {
            unidad.url = url;
            unidad.port = port;
            unidad.entity = entity;
            unidad.implementer = implementer;
            unidad.prefixOCID = prefixOCID;
            unidad.prefixOC4ID = prefixOC4ID;
            arrayPaginadoContratista.push(unidad);
            // console.log(`+++ arrayPaginado ${JSON.stringify(arrayPaginado)}`)
        });
    }
    // console.log(`tamaño registros ${arrayPaginado.length}`)
    pageContContratista = Math.ceil(arrayPaginadoContratista.length/tamanio);
    showListasContrataciones(arrayPaginadoContratista,pageNumberContratista,tamanio,pageContContratista); 
    $('#page_1').addClass('active');
}

function buscarDelayContratacion(){
    console.log(`/*/* buscarDelay`);
    delay(function(){
        buscarPalabraContratacion();
    }, 500 );
};

function buscarPalabraContratacion(){
    var seleccionadoTemporal = [];
    pageContContratista = 0;
    pageNumberContratista = 1; 
    arrayPaginadoContratista = [];
    var banderaCoincide; 
    if($('#palabra_clave_contrataciones').val()){
        perfilCA.data.forEach(element => {
            if(element instanceof Array){
                element.forEach(contract => {
                    if(contract.title_contratacion !== undefined && contract.title_proyectos !== undefined){
                        // console.log(`/*/* contract ${JSON.stringify(contract)}`)
                        banderaCoincide = false;

                    if(contract.title_contratacion !== null){
                        if( contract.title_contratacion.toLowerCase().includes($('#palabra_clave_contrataciones').val().toLowerCase()) ) {
                            console.log(contract.id + 'COINCIDIO CON title')
                            banderaCoincide = true;
                        }
                    }
                    
                    if(contract.title_proyectos !== null){
                        if( contract.title_proyectos.toLowerCase().includes($('#palabra_clave_contrataciones').val().toLowerCase()) ) {
                            console.log(contract.id + 'COINCIDIO CON title_proyectos')
                            banderaCoincide = true;
                        }
                    }
                    
                    if(contract.ocid !== null){
                        if( contract.ocid.toLowerCase().includes($('#palabra_clave_contrataciones').val().toLowerCase()) ) {
                            console.log(contract.id + 'COINCIDIO CON ocid')
                            banderaCoincide = true;
                        }
                    }
        
                    if(contract.name_buyer !== null){
                        if(contract.name_buyer.toLowerCase().includes($('#palabra_clave_contrataciones').val().toLowerCase())){
                            console.log(contract.id + 'COINCIDIO CON name_buyer')
                            banderaCoincide = true;
                        }
                    }
            
                    contract.contratistas.forEach(contratista => {
                        if(contratista.name !== null){
                            if(contratista.name.toLowerCase().includes($('#palabra_clave_contrataciones').val().toLowerCase())){
                                console.log(contract.id +  'COINCIDIO CON name')
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
    }else{
        //reiniciar las burbujas y listas
        limpiarListasBurbujas();
        paginarContrataciones(perfilCA.data,pageSizeContratista);
        // initBubble('vis',arrayPaginado);
        $('#page_1').addClass('active');
    }
    if(seleccionadoTemporal.length > 0){
        // Listar y mostrar burbujas
        limpiarListasBurbujas();
        pageContContratista = Math.ceil(seleccionadoTemporal.length/pageSizeContratista);
        showListasContrataciones(seleccionadoTemporal,pageNumberContratista,pageSizeContratista,pageContContratista); 
        // initBubble('vis',seleccionadoTemporal);
        $('#page_1').addClass('active');
    }
    if(seleccionadoTemporal.length == 0 && arrayPaginadoContratista.length == 0){
        limpiarListasBurbujas();
    }
}

function limpiarListasBurbujas(){
    console.log('--- limpiarListasBurbujas')
    $('#lista_contrataciones').empty();
    $('#paginas_lista_contrataciones').empty();
    // $(`#vis`).empty();
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