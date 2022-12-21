var mymap;
var info;
var pageSize = 5;
var pageCont = 0;
var pageNumber = 1; 
var pagination = [];
var arrayPaginado = [];
var pageSizeContratista = 5;
var pageContContratista = 0;
var pageNumberContratista = 1; 
var paginationContratista = [];
var arrayPaginadoContratista = [];
var pageSizeProyectos = 5;
var pageContProyectos = 0;
var pageNumberProyectos = 1; 
var paginationProyectos = [];
var arrayPaginadoProyectos = [];
var arrayProcurementmethod = [];
var perfilCA = [];

$(document).ready(function(){
    console.log(`Ready Project Details`);  
    $("#project_active").addClass("active");
    mymap = paintMap();
    var prefixOC4ID = $("#prefixOC4ID").val();
    var prefixOCID = $("#prefixOCID").val();
    var identifier = $("#identifier").val();
    var endpoint = `/edcapi/proyect/${identifier}`;
    
    loadDataDetails(prefixOC4ID,prefixOCID,endpoint).then((data) =>{
        //  console.log('····· DATA ' + JSON.stringify(data))
        if(data.data != undefined){
            perfilCA = data;
            info = data;
            llenarBanner(data);
            llenarInformacionGeneral(data);
            llenarUbicaciones(data,mymap);
            agrupacionContratistas(perfilCA.data[3]);
            awardsCountValue(perfilCA.data[11]);
            paginarContrataciones(data.data,pageSize);
            initBubble('vis',arrayPaginado);
            paginarContratistas(data.data,pageSizeContratista);
            // initBubble('visContratista',arrayPaginadoContratista);
            paginarProyectosRelacionados(data.data,pageSizeProyectos);
            llenarProcurementMethod(data.data);
            llenarFasesProyecto(data);
            llenarAvance(data);
        }
        
    });
});

function agrupacionContratistas(contratistas) {
    perfilCA.data[2].forEach(contratacion => {
        let arrayContrataciones = [];
        contratistas.forEach(contratista => {
            if(contratista.cp_id == contratacion.contractingProcessId){
                arrayContrataciones.push(contratista);
            }
        });
        contratacion.contratistas = arrayContrataciones;
    });
}

function awardsCountValue(adjudicaciones) {
    perfilCA.data[3].forEach(award => {
        let arrayAdjudicaciones = [];
        adjudicaciones.forEach(adjudicacion => {
            if(adjudicacion.rfc == award.rfc){
                arrayAdjudicaciones.push(adjudicacion);
            }
        });
        award.adjudicaciones = arrayAdjudicaciones;
    });
}

function llenarBanner(info){
    limpiarCifras();
    var prefixOC4ID = $("#prefixOC4ID").val();
    $('#_cifra_1').text(`$ ${redondearCifras(parseFloat(info.data[0].monto))}`);
    $('#_cifra_2').text(`$ ${redondearCifras(parseFloat(info.data[0].monto_ejercido))}`);
    $('#_cifra_3').text(info.data[0].cuenta_contrataciones);
    $('#_fecha_actualizacion').text(moment(info.data[0].updated).format('DD/MM/yyyy'));
    $('#_title').text(info.data[0].title);
    $('#_titlebreadcrum').text(info.data[0].title);
    $('#_datos').append(`<strong>Institución:</strong> `);
    $('#_datos').append(`<span><a class="hipervinculo_contratista texto_movil" href="/institucion/${prefixOC4ID}&${info.data[0].rfc}">${info.data[0].public_authority}</a></span>`);
}

function llenarInformacionGeneral(info){
    if(info.data[0].sector.length > 0){
        var sectorImages = translateSectorToImage(info.data[0].sector,40);
        var sectorImagesM = translateSectorToImage(info.data[0].sector,80);
    }
    $('#_descripcionGeneral').text(info.data[0].description);
    $('#_sector').append(`${sectorImages}`);
    $('#_sectorMobile').append(`${sectorImagesM}`);
    $('#_tipo').append(`${translateTypeToImage(info.data[0].type,40)}`)
    $('#_tipoMobile').append(`${translateTypeToImage(info.data[0].type,80)}`)
    $('#_startDate').text(moment(info.data[0].startDate).format('DD/MM/yyyy'));
    $('#_endDate').text(moment(info.data[0].endDate).format('DD/MM/yyyy'));
    $('#_durationInDays').text(info.data[0].durationInDays);
    $('#_estatus').append(translateProjectStatusToImage(info.data[0].status,40));
    $('#_estatusMobile').append(translateProjectStatusToImage(info.data[0].status,80));
    $('#_tipo_text').text(info.data[0].type)
    $('#_estatus_text').text(info.data[0].status);
}

function llenarUbicaciones(info,map){
    removeMarkers(map);
    paintMakers(info.data[1],map);
    if(info.data[1].length > 0){
        info.data[1].forEach(ubicacion => {
            $('#_ubicaciones').append(`<span>${ubicacion.streetAddress}, ${ubicacion.postalCode}, ${ubicacion.locality}, ${ubicacion.region}, ${ubicacion.countryName}.</span> <br>`);
        });
    }
}

function llenarFasesProyecto(info){
    $('#_propositoproyecto').text(info.data[0].propositoproyecto);
    $('#_montoPresupuestado').text(`$ ${separarCifras(parseFloat(info.data[0].monto))}`);
    $('#_fechaAprobacion').text(moment(info.data[0].approvalDate).format('DD/MM/yyyy'));
    $('#_desglosePresupuestario').append(`
            <table class="table styleTab">
                <thead>
                    <tr class="colorandfont titulosDesglose">
                        <th class="col-lg-6 col-md-4"><img class="iconoPestanaDesglose" src="/images/iconos/clavepresupuestariaBlanco.svg"> Clave presupuestaria</th>
                        <th class="col-lg-3 col-md-4"><img class="iconoPestanaDesglose" src="/images/iconos/fuenteBlanco.svg"> Actor fuente</th>
                        <th class="col-lg-3 col-md-4"><img class="iconoPestanaDesglose" src="/images/iconos/montoBlanco.svg"> Monto</th>
                    </tr>
                </thead>
            </table>`);
    info.data[5].forEach(desglose => {
        $('#_desglosePresupuestario').append(`
            <table class="table styleTab">
                <tbody class="interlinea titulosDesglose">
                    <tr>
                        <td class="col-lg-6 col-md-4">${desglose.clavepresupuestaria}</td>
                        <td class="col-lg-3 col-md-4">${desglose.name}</td>
                        <td class="col-lg-3 col-md-4">$ ${separarCifras(desglose.amount)} ${desglose.currency}</td>
                    </tr>
                </tbody>
            </table>
            <hr>`);
    });
    if(info.data[6].length > 0) {
        var indice = 0;
        info.data[6].forEach(documento=> {
            var value;
            if(documento.documentType) {
                switch (documento.documentType) {
                    case 'environmentalImpact':
                        value = '#_documentacion1';
                        break;
                    case 'feasibilityStudy':
                        value = '#_documentacion2';
                        break;
                    case 'landAndSettlementEvaluation':
                        value = '#_documentacion3';
                        break;
                    case 'landAndSettlementImpact':
                        value = '#_documentacion4';
                        break;
                    case 'projectApprovalOpinion':
                        value = '#_documentacion5';
                        break;
                    case 'projectPlan':
                        value = '#_documentacion6';
                        break;
                    case 'projectPlanUpdate':
                        value = '#_documentacion7';
                        break;
                    case 'executiveContractReport':
                        value = '#_documentacion8';
                        break;
                    case 'progressionReport':
                        value = '#_documentacion9';
                        break;
                    case 'socialEnvironmentalImpactAssessment':
                        value = '#_documentacion10';
                        break;
                    case 'completionCertificate':
                        value = '#_documentacion11';
                        break;
                    case 'evaluationReport':
                        value = '#_documentacion12';
                        break;
                    case 'finalAudit':
                        value = '#_documentacion13';
                        break;
                    case 'compensationAndRelocationPlan':
                        value = '#_documentacion14';
                        break;
                    case 'termination':
                        value = '#_documentacion15';
                        break;
                    case 'evaluationReports':
                        value = '#_documentacion16';
                        break;
                }
                indice = indice + 1;
                
                $(value).append(`
                    <div class="row sizeFontGeneral">
                        <div class="col-lg-6 col-md-12">
                            <div class="row">
                                <div class="col-lg-1 col-md-1 iconAlinea"><img class="iconoSize" src="/images/iconos/documentacion.svg"></div>
                                <div class="col-lg-11 col-md-11"><strong>${documento.title}</strong></div>
                            </div>
                            <div class="col-12 pad">${documento.description}</div>
                        </div>
                        <div class="col-lg-2 col-md-6 maxFormatoDP">
                            <img class="tam_list_icono sizeIcono" src="/images/iconos/versionRojo.svg"> <strong>Formato</strong><br> ${documento.format}
                        </div>
                        <div class="col-lg-2 col-md-6 maxFechaDP">
                            <img class="tam_list_icono sizeIcono" src="/images/iconos/periodoRojo.svg"> <strong>Fecha de publicación</strong><br> ${documento.datePublished === null ? '--/--/----': moment(documento.datePublished).format('DD/MM/yyyy')}
                        </div>
                        <div class="col-lg-2 col-md-6 maxFechaDP">
                            <img class="tam_list_icono sizeIcono" src="/images/iconos/periodoRojo.svg"> <strong>Fecha de modificación</strong><br> ${documento.dateModified === null ? '--/--/----': moment(documento.dateModified).format('DD/MM/yyyy')}
                        </div>
                        <div class="col-lg-2 col-md-6 ubicaBoton maxBotonDP">
                            <a href="${documento.url}" target="_blank"><button type="button" class="btn btn-success btn-lg sizeFontGeneral">Descargar</button></a>
                        </div>
                    </div>
                <hr>`);
                
                if(value == '#_documentacion1') {
                    document.getElementById('_documentacion1a').style.display = 'none';
                }
                if(value == '#_documentacion2') {
                    document.getElementById('_documentacion2a').style.display = 'none';
                }
                if(value == '#_documentacion3') {
                    document.getElementById('_documentacion3a').style.display = 'none';
                }
                if(value == '#_documentacion4') {
                    document.getElementById('_documentacion4a').style.display = 'none';
                }
                if(value == '#_documentacion5') {
                    document.getElementById('_documentacion5a').style.display = 'none';
                }
                if(value == '#_documentacion6') {
                    document.getElementById('_documentacion6a').style.display = 'none';
                }
                if(value == '#_documentacion7') {
                    document.getElementById('_documentacion7a').style.display = 'none';
                }
                if(value == '#_documentacion8') {
                    document.getElementById('_documentacion8a').style.display = 'none';
                }
                if(value == '#_documentacion9') {
                    document.getElementById('_documentacion9a').style.display = 'none';
                }
                if(value == '#_documentacion10') {
                    document.getElementById('_documentacion10a').style.display = 'none';
                }
                if(value == '#_documentacion11') {
                    document.getElementById('_documentacion11a').style.display = 'none';
                }
                if(value == '#_documentacion12') {
                    document.getElementById('_documentacion12a').style.display = 'none';
                }
                if(value == '#_documentacion13') {
                    document.getElementById('_documentacion13a').style.display = 'none';
                }
                if(value == '#_documentacion14') {
                    document.getElementById('_documentacion14a').style.display = 'none';
                }
                if(value == '#_documentacion15') {
                    document.getElementById('_documentacion15a').style.display = 'none';
                }
                if(value == '#_documentacion16') {
                    document.getElementById('_documentacion16a').style.display = 'none';
                }
            } 
        });
    }
    $('#_montoFinal').text(`$ ${info.data[0].montoterminacion === null ? 0 : separarCifras(parseFloat(info.data[0].montoterminacion))}`);
    $('#_fechaTerminacion').text(info.data[0].dateterminacion === null ? '--/--/----' : moment(info.data[0].dateterminacion).format('DD/MM/yyyy'));
}

function llenarAvance(info){
    $('#_estatusProyecto').append(translateProyectoEstatus(info.data[7].status));
    $('#_estatusProyectoIcono').append(translateProyectoEstatusIcono(info.data[7].status,60));
    $('#_estatusProyectoIconoMovil').append(translateProyectoEstatusIcono(info.data[7].status,80));
    $('#_startDateAvance').text(info.data[7].startDate === null ? '--/--/----': moment(info.data[7].startDate).format('DD/MM/yyyy'));
    $('#_titleProyecto').text(info.data[7].title)
    $('#_approvalDate').text(info.data[7].approvalDate === null ? '--/--/----': moment(info.data[7].approvalDate).format('DD/MM/yyyy'));
    $('#_montoAprobado').text(separarCifras(info.data[7].montobudget));
    $('#_montoCurrency').text(info.data[7].currencybudget);
    info.data[8].forEach(tenderLinea => {
        $('#_tendersLineaTiempo').append(`
            <td class="col-md-3">
                <div class="center-text">
                    <p class="col-md-12 fechaSinEspacio"><img class="iconoSizeCalendario" src="/images/iconos/periodoRojo.svg" /> ${tenderLinea.tenderstartdate === null ? '--/--/----': moment(tenderLinea.tenderstartdate).format('DD/MM/yyyy')} </p>
                    <p class="lineTime"></p>
                </div>
                <div class="card styleCard">
                    <div class="card-body lineaAvance fontMovilLinea">
                        <h5 class="card-title faMovil">Se inicia una licitación</h5>
                        <p class="card-text">${tenderLinea.titletender}</p>
                        <p>Licitantes: <span>${tenderLinea.numberoftenderers}</span></p>
                        <br>
                        <hr>
                        <div class="row">
                            <img class="iconoSizeBase col-md-3" src="/images/iconos/planeacionRojo.svg" />
                            <p class="negritas salt col-md-9">Inicio de licitación</p>
                        </div>
                    </div>
                </div>
            </td>
        `);
    });
    info.data[9].forEach(awardLinea => {
        $('#_awardsLineaTiempo').append(`
            <td class="col-md-3">
                <div class="center-text">
                    <p class="col-md-12 fechaSinEspacio"><img class="iconoSizeCalendario" src="/images/iconos/periodoRojo.svg" /> ${awardLinea.award_date === null ? '--/--/----': moment(awardLinea.award_date).format('DD/MM/yyyy')} </p>
                    <p class="lineTime"></p>
                </div>
                <div class="card styleCard">
                    <div class="card-body lineaAvance fontMovilLinea">
                        <h5 class="card-title faMovil">Se adjudica a un contratista</h5>
                        <p class="card-text">${awardLinea.suppliersaward}</p>
                        <strong>$ ${separarCifras(awardLinea.value_amount)}</strong> <span>${awardLinea.value_currency}</span>
                        <br>
                        <hr>
                        <div class="row">
                            <img class="iconoSizeBase col-md-3" src="/images/iconos/adjudicacionRojo.svg" />
                            <p class="negritas salt col-md-9">Adjudicación de contratista</p>
                        </div>
                    </div>
                </div>
            </td>
        `);
    });
    info.data[10].forEach(contractLinea => {
        $('#_contractsLineaTiempo').append(`
            <td class="col-md-3">
                <div class="center-text">
                    <p class="col-md-12 fechaSinEspacio"><img class="iconoSizeCalendario" src="/images/iconos/periodoRojo.svg" /> ${contractLinea.datesigned === null ? '--/--/----': moment(contractLinea.datesigned).format('DD/MM/yyyy')} </p>
                    <p class="lineTime"></p>
                </div>
                <div class="card styleCard">
                    <div class="card-body lineaAvance fontMovilLinea">
                        <h5 class="card-title faMovil">Se firma un contrato</h5>
                        <p class="card-text">${contractLinea.titlecontrato}</p>
                        <p class="card-text">${contractLinea.suppliersaward}</p>
                        <strong>$ ${separarCifras(contractLinea.montocontrato)}</strong> <span>${contractLinea.currencycontrato}</span>
                        <br>
                        <hr>
                        <div class="row">
                            <img class="iconoSizeBase col-md-3" src="/images/iconos/contratacionRojo.svg" />
                            <p class="negritas salt col-md-9">Firma de contrato</p>
                        </div>
                    </div>
                </div>
            </td>
        `);
    });
    if(info.data[7].enddatecompletion != null) {
        $('#_implementationLineaTiempo').append(`
            <td class="col-md-3">
                <div class="center-text">
                    <p class="col-md-12 fechaSinEspacio"><img class="iconoSizeCalendario" src="/images/iconos/periodoRojo.svg" /> 
                        <span>${moment(info.data[7].enddatecompletion).format('DD/MM/yyyy')}</span>
                    </p>
                    <p class="lineTime"></p>
                </div>
                <div class="card styleCard">
                    <div class="card-body lineaAvance">
                        <h5 class="card-title faMovil">Se termina el proyecto</h5>
                        <p class="card-text">${info.data[7].title}</p>
                        <strong><span>$</span> <span>${info.data[7].amountcompletion}</span></strong> <span>${info.data[7].currencycompletion}</span>
                        <br>
                        <hr>
                        <div class="row">
                            <img class="iconoSizeBase col-md-3" src="/images/iconos/terminacionestimadaRojo.svg" />
                            <p class="negritas salt col-md-9">Terminación del proyecto</p>
                        </div>
                    </div>
                </div>
            </td>
        `);
    }
}

function limpiarCifras(){
    $('#_cifra_1').text('');
    $('#_cifra_2').text('');
    $('#_cifra_3').text('');
}

function paginarContrataciones(arreglo,tamanio){
    // console.log(`PAGINAR CONTRATACIONES Lista relacionadas ${JSON.stringify(arreglo)}`)
    var implementer = arreglo[12].implementer;
    var entity = arreglo[13].entity;
    var url = arreglo[14].url;
    var port = arreglo[15].port;
    var prefixOC4ID = arreglo[16].prefixOC4ID;
    var prefixOCID = arreglo[17].prefixOCID;

    if(arreglo[2].length > 0){
        arreglo[2].forEach(unidad => {
            unidad.url = url;
            unidad.port = port;
            unidad.entity = entity;
            unidad.implementer = implementer;
            unidad.prefixOCID = prefixOCID;
            unidad.prefixOC4ID = prefixOC4ID;
            arrayPaginado.push(unidad);
            // console.log(`+++ arrayPaginado ${JSON.stringify(arrayPaginado)}`)
        });
    }
    // console.log(`tamaño registros ${arrayPaginado.length}`)
    pageCont = Math.ceil(arrayPaginado.length/tamanio);
    showListasContratacionesRelacionadas(arrayPaginado,pageNumber,tamanio,pageCont); 
    $('#page_1').addClass('active');
}

function paginarContratistas(arreglo,tamanio){
    // console.log(`PAGINAR contratistas relacionados ${arreglo.length}`)
    var implementer = arreglo[12].implementer;
    var entity = arreglo[13].entity;
    var url = arreglo[14].url;
    var port = arreglo[15].port;
    var prefixOC4ID = arreglo[16].prefixOC4ID;
    var prefixOCID = arreglo[17].prefixOCID;

    if(arreglo[3].length > 0){
        arreglo[3].forEach(unidad => {
            unidad.url = url;
            unidad.port = port;
            unidad.entity = entity;
            unidad.implementer = implementer;
            unidad.prefixOCID = prefixOCID;
            unidad.prefixOC4ID = prefixOC4ID;
            unidad.seccion = 'contratista';
            arrayPaginadoContratista.push(unidad);
            // console.log(`+++ arrayPaginadoContratista ${JSON.stringify(arrayPaginadoContratista)}`)
        });
    }
    // console.log(`tamaño registros ${arrayPaginado.length}`)
    pageContContratista = Math.ceil(arrayPaginadoContratista.length/tamanio);
    showListasContratistaRelacionados(arrayPaginadoContratista,pageNumberContratista,tamanio,pageContContratista); 
    $('#page_1Contratista').addClass('active');
}

function paginarProyectosRelacionados(arreglo,tamanio){
    // console.log(`PAGINAR ${arreglo.length}`)
    var implementer = arreglo[11].implementer;
    var entity = arreglo[12].entity;
    var url = arreglo[13].url;
    var port = arreglo[14].port;
    var prefixOC4ID = arreglo[15].prefixOC4ID;
    var prefixOCID = arreglo[16].prefixOCID;

    if(arreglo[4].length > 0){
        arreglo[4].forEach(unidad => {
            unidad.url = url;
            unidad.port = port;
            unidad.entity = entity;
            unidad.implementer = implementer;
            unidad.prefixOCID = prefixOCID;
            unidad.prefixOC4ID = prefixOC4ID;
            arrayPaginadoProyectos.push(unidad);
            // console.log(`+++ arrayPaginadoContratista ${JSON.stringify(arrayPaginadoContratista)}`)
        });
    }
    // console.log(`tamaño registros ${arrayPaginado.length}`)
    pageContProyectos = Math.ceil(arrayPaginadoProyectos.length/tamanio);
    showListasProyectosRelacionados(arrayPaginadoProyectos,pageNumberProyectos,tamanio,pageContProyectos); 
    $('#page_1Proyectos').addClass('active');
}

function llenarProcurementMethod(arreglo){
    if(arreglo[2].length > 0){
        arreglo[2].forEach(unidad => {
            //  console.log(`+++++ unidad ${JSON.stringify(unidad.procurementmethod)}`)
             var procurementmethodESP =  translateMetodo(unidad.procurementmethod);
            if (arrayProcurementmethod.length > 0) {
                if(!arrayProcurementmethod.includes(procurementmethodESP)){
                    arrayProcurementmethod.push(procurementmethodESP);
                    $('#procurementMethodFilter').append(`<option> ${procurementmethodESP} </option>`); 
                    ordenarSelect('procurementMethodFilter');
                }
            }else{
                arrayProcurementmethod.push(procurementmethodESP);
                $('#procurementMethodFilter').append(`<option> ${procurementmethodESP} </option>`); 
            }
        });
    }
}

function filtrarProcurementMethod(){
    console.log('filtrarProcurementMethod ' + $('#procurementMethodFilter').val())
    pageCont = 0;
    pageNumber = 1; 
    arrayPaginado = [];
        info.data[2].forEach(unidad => {
            var procurementmethodESP =  translateMetodo(unidad.procurementmethod);
            if(procurementmethodESP == $('#procurementMethodFilter').val()){
                arrayPaginado.push(unidad);
            }
        });
        if(arrayPaginado.length > 0){
            limpiarListasBurbujas();
            pageCont = Math.ceil(arrayPaginado.length/pageSize);
            showListasContratacionesRelacionadas(arrayPaginado,pageNumber,pageSize,pageCont); 
            initBubble('vis',arrayPaginado);
            $('#page_1').addClass('active');
        }else{
            limpiarListasBurbujas();
            paginarContrataciones(info.data,pageSize);
            initBubble('vis',arrayPaginado);
            $('#page_1').addClass('active');
        }
    
}

function buscarDelayContratacion(){
    console.log(`/*/* buscarDelay`);
    delay(function(){
        buscarPalabraContratacion();
    }, 500 );
};

function buscarDelayContratistas(){
    console.log(`/*/* buscarDelayContratistas`);
    delay(function(){
        buscarPalabraContratista();
    }, 500 );
};

function buscarPalabraContratacion(){
    // console.log(`/*/* buscarPalabraContratacion ${$('#palabra_clave_contrataciones').val()}`);
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
                            console.log(`/*/* contract ${JSON.stringify(contract)}`)
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
        paginarContrataciones(info.data,pageSize);
        initBubble('vis',arrayPaginado);
        $('#page_1').addClass('active');
    }
    if(seleccionadoTemporal.length > 0){
        // Listar y mostrar burbujas
        limpiarListasBurbujas();
        pageCont = Math.ceil(seleccionadoTemporal.length/pageSize);
        showListasContratacionesRelacionadas(seleccionadoTemporal,pageNumber,pageSize,pageCont); 
        initBubble('vis',seleccionadoTemporal);
        $('#page_1').addClass('active');
    }
    if(seleccionadoTemporal.length == 0 && arrayPaginado.length == 0){
        limpiarListasBurbujas();
    }
}

function buscarPalabraContratista(){
    
    var seleccionadoTemporal = [];
    pageContContratista = 0;
    pageNumberContratista = 1; 
    arrayPaginadoContratista = [];
    var banderaCoincide; 
    if($('#palabra_clave_contratista').val()){


        info.data[3].forEach(supplier => {
            banderaCoincide = false;

            if(supplier.rfc !== null){
                if(supplier.rfc.toLowerCase().includes($('#palabra_clave_contratista').val().toLowerCase()) ) {
                    console.log(supplier.id + 'COINCIDIO CON rfc')
                    banderaCoincide = true;
                }
            }
            
            if(supplier.name !== null){
                if(supplier.name.toLowerCase().includes($('#palabra_clave_contratista').val().toLowerCase())){
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
        })
    }else{
        //reiniciar las listas
        limpiarListasContratistas();
        paginarContratistas(info.data,pageSizeContratista);
        $('#page_1Contratista').addClass('active');
    }
    if(seleccionadoTemporal.length > 0){
        // Listar
        limpiarListasContratistas();
        pageContContratista = Math.ceil(seleccionadoTemporal.length/pageSizeContratista);
        showListasContratistaRelacionados(seleccionadoTemporal,pageNumberContratista,pageSizeContratista,pageContContratista); 
        $('#page_1Contratista').addClass('active');
    }
    if(seleccionadoTemporal.length == 0 && arrayPaginadoContratista.length == 0){
        limpiarListasContratistas();
    }
}

function limpiarListasBurbujas(){
    console.log('--- limpiarListasBurbujas')
    $('#lista_contrataciones_relacionadas').empty();
    $('#paginas_lista_contrataciones').empty();
    $(`#vis`).empty();
}

function limpiarListasContratistas(){
    console.log('--- limpiarListasContratistas')
    $('#lista_contratistas_relacionados').empty();
    $('#paginas_lista_contratistas_relacionados').empty();
}