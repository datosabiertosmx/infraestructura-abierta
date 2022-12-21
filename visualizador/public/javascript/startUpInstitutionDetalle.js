
var pageSize = 5;
var pageCont = 0;
var pageNumber = 1; 
var pagination = [];
var arrayPaginado = [];
var perfilCA = [];

$(document).ready(function(){
    console.log(`ReadyAuthorityPublic Details`);
    $("#institutions_active").addClass("active");

    var prefixOC4ID = $("#prefixOC4ID").val();
    var partyid = $("#partyid").val();
    var endpoint = `/edcapi/institution/${partyid}`;

    loadDataDetails(prefixOC4ID,null,endpoint).then((data) => {
        //console.log('++++++ DATA Institucion' + JSON.stringify(data))
        if(data.data != undefined){
            perfilCA = data;
            llenarBanner(data);
            graficaInstitucion(data);
            agrupacionContratistas(perfilCA.data[3], perfilCA.data[9].prefixOCID);
            paginarContrataciones(data.data,pageSize);
        }
    });
});

function agrupacionContratistas(contratistas, prefixOCID) {
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
    var direccion = ''.concat((info.data[0].streetAddress === null ? '' : info.data[0].streetAddress.concat(comaSepara)), 
                              (info.data[0].locality === null ? '' : info.data[0].locality.concat(comaSepara)), 
                              (info.data[0].region === null ? '' : info.data[0].region.concat(comaSepara)), 
                              (info.data[0].postalCode === null ? '' : info.data[0].postalCode.concat(comaSepara)), 
                              (info.data[0].countryName === null ? '' : info.data[0].countryName));
    $('#_identificador_banner').text(info.data[0].identifier);
    $('#_cifra_1').text(`$ ${redondearCifras(parseFloat(info.data[0].montocontratado))}`);
    $('#_cifra_2').text(info.data[0].totalprojects);
    $('#_cifra_3').text(info.data[0].totalcontrataciones);
    $('#_title').text(info.data[0].legalName);
    $('#_titlebreadcrum').text(info.data[0].legalName);
    $('#_legalname').text(info.data[0].legalName);
    $('#_contacto').text(info.data[0].name);
    $('#_direccion').append(direccion);
    if(info.data[0].email != null){
        $('#_email').text(`
            ${info.data[0].email}
        `);
    } else {
        $('#_email').text(`
            Sin dato registrado
        `);
    }
    if(info.data[0].telephone != null){
        $('#_telephone').text(`
            ${info.data[0].telephone}
        `);
    } else {
        $('#_telephone').text(`
            Sin dato registrado
        `);
    }
    if(info.data[0].url != null){
        $('#_url').append(`
            <a class="linkListas" href="${info.data[0].url}" target="_blank">${info.data[0].url}</a>
        `);
    } else {
        $('#_url').append(`
        <p>Sin dato registrado</p>
        `);
    }
}

function graficaInstitucion(info){
    if(info.data[2].length > 0){
        var nombreInstitucion = "";
        var proyectos = [];
        var contrataciones = [];
        var contratistas = [];
        
        info.data[2].forEach(autoridadPublica=> {
            if(autoridadPublica.institucionname) {
                //console.log("Name proye: " + autoridadPublica.proyectoname);
                var existProyect = false;
                    proyectos.forEach(nameP=>{ 
                        if (autoridadPublica.proyectoname == nameP.name){
                            existProyect = true;
                        }
                    });

                var existHijoProyecto = false;
                    contrataciones.forEach(hijoP=>{
                        if (autoridadPublica.contratacionname == hijoP.name){
                            existHijoProyecto = true;
                            let hijoPr = {
                                "name":autoridadPublica.contratacionname,
                                "hijo":hijoP.hijo +"::" + autoridadPublica.proyectoname
                            }
                            contrataciones.push(hijoPr);
                        }
                    });

                    if (!existHijoProyecto){
                        let hijoP = {
                            "name": autoridadPublica.contratacionname,
                            "hijo": autoridadPublica.proyectoname
                        }
                        contrataciones.push(hijoP);
                    }

                var existHijoContratacion = false;
                    contratistas.forEach(hijoP=>{
                        if (autoridadPublica.contratistaname == hijoP.name){
                            existHijoContratacion = true;
                            let hijoPr = {
                                "name":autoridadPublica.contratistaname,
                                "hijo":hijoP.hijo +"::" + autoridadPublica.contratacionname
                            }
                            contratistas.push(hijoPr);
                        }
                    });

                    if (!existHijoContratacion){
                        let hijoP = {
                            "name": autoridadPublica.contratistaname,
                            "hijo": autoridadPublica.contratacionname
                        }
                        contratistas.push(hijoP);
                    }

                    if (!existProyect){
                        let proyectoname = {
                            "link":[],
                            value: 60,
                            "name":autoridadPublica.proyectoname,
                            "children":[],
                            nodeSettings: {
                                fill: am5.color(0xF16752)
                              }
                        }
                        proyectos.push(proyectoname);
                    }

                nombreInstitucion = autoridadPublica.institucionname;
                
            }
        });

        for (i = 0; i < contrataciones.length ; i++){
            var linkN = [];
            var childsThisContratacion = [];
            contratistas.forEach(contratista=>{
                if (contratista.hijo.includes(contrataciones[i].name)){
                    if (contratista.hijo.includes("::"+contrataciones[i].name)){      
                        var hasChildThis = false;
                        for (j = 0; j < childsThisContratacion.length; j++){
                            if (contratista.name == childsThisContratacion[j].name){
                                hasChildThis = true;
                            }
                        }                      
                        if (!hasChildThis)
                            linkN.push(contratista.name);

                    }else{

                        var hasChildThis = false;
                        for (j = 0; j < childsThisContratacion.length; j++){
                            if (contratista.name == childsThisContratacion[j].name){
                                hasChildThis = true;
                            }
                        }                      
                        if (hasChildThis){
                            linkN.push(contratista.name);
                        }else{

                            let contratacionchild = {
                                "name":contratista.name
                            }
                            childsThisContratacion.push(contratacionchild);
                        }
                    }
                }
            });
            contrataciones[i].link = linkN;
            contrataciones[i].children = childsThisContratacion;
        }

        for (i = 0; i < proyectos.length ; i++){
            var linkN = [];
            var childsThisProyect = [];
            contrataciones.forEach(contratacion=>{
                if (contratacion.hijo.includes(proyectos[i].name)){
                    if (contratacion.hijo.includes("::"+proyectos[i].name)){
                        var hasChildThis = false;
                        for (j = 0; j < childsThisProyect.length; j++){
                            if (contratacion.name == childsThisProyect[j].name){
                                hasChildThis = true;
                            }
                        }                      
                        if (!hasChildThis)
                            linkN.push(contratacion.name);
                    }else{

                        var hasChildThis = false;
                        for (j = 0; j < childsThisProyect.length; j++){
                            if (contratacion.name == childsThisProyect[j].name){
                                hasChildThis = true;
                            }
                        }                      
                        if (hasChildThis){
                            linkN.push(contratacion.name);
                        }else{

                            let proyectochild = {
                                "name":contratacion.name,
                                value: 40,
                                "children":contratacion.children,
                                "link":contratacion.link,
                                nodeSettings: {
                                    fill: am5.color(0xdb4b36)
                                  }
                            }
                            childsThisProyect.push(proyectochild);
                        }
                    }
                }
            });
            proyectos[i].link = linkN;
            proyectos[i].children = childsThisProyect;
        }

        am5.ready(function() {

            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("chartInstitucion");
            
            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
            am5themes_Animated.new(root)
            ]);
        
            var data = {
                name: nombreInstitucion,
                children: [
                  {
                    name: nombreInstitucion,
                    children: proyectos
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

        // Ocultar los anillos de los nodos padre
        series.outerCircles.template.set("forceHidden", true);

        // series.labels.template.setAll({
        //     fontSize: 20,
        //     fill: am5.color(0x550000),
        //     text: "{category}"
        //   });
        // series.labels.template.setAll({
        //     text: "{category}: [bold]{sum}[/]",
        //     fontSize: 14
        //   });

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
    //console.log(`PAGINAR CONTRATACIONES ${JSON.stringify(arreglo)}`)
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
            unidad.prefixOC4ID = prefixOC4ID;
            unidad.prefixOCID = prefixOCID;
            arrayPaginado.push(unidad);
            // console.log(`+++ arrayPaginado ${JSON.stringify(arrayPaginadoContrataciones)}`)
        });
    }
    // console.log(`tamaño registros ${arrayPaginado.length}`)
    pageCont = Math.ceil(arrayPaginado.length/tamanio);
    showListasContrataciones(arrayPaginado,pageNumber,tamanio,pageCont); 
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
    pageCont = 0;
    pageNumber = 1; 
    arrayPaginado = [];
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
        paginarContrataciones(perfilCA.data,pageSize);
        // initBubble('vis',arrayPaginado);
        $('#page_1').addClass('active');
    }
    if(seleccionadoTemporal.length > 0){
        // Listar y mostrar burbujas
        limpiarListasBurbujas();
        pageCont = Math.ceil(seleccionadoTemporal.length/pageSize);
        showListasContrataciones(seleccionadoTemporal,pageNumber,pageSize,pageCont); 
        // initBubble('vis',seleccionadoTemporal);
        $('#page_1').addClass('active');
    }
    if(seleccionadoTemporal.length == 0 && arrayPaginado.length == 0){
        limpiarListasBurbujas();
    }
}

function limpiarListasBurbujas(){
    // console.log('--- limpiarListasBurbujas')
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