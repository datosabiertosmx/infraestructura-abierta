var pageSizeProyectos = 5;
var pageContProyectos = 0;
var pageNumberProyectos = 1; 
var paginationProyectos = [];
var arrayPaginadoProyectos = [];
var perfilCA = {};

$(document).ready(function(){
    console.log(`ReadyContracting Details`);
    $("#contractings_active").addClass("active");

    var prefixOCID = $("#prefixOCID").val();
    var ocid = $("#ocid").val();
    var endpoint = `/edcapi/contratacion/${ocid}`;

    loadDataDetails(null,prefixOCID,endpoint).then((data) => {
        // console.log('++++++ DATA' + JSON.stringify(data))
        if(data.data != undefined){
            perfilCA = data;
            agrupacionContratistas(perfilCA.data[14]);
            agrupacionDocumentos(perfilCA.data[11]);
            agrupacionItems(perfilCA.data[16]);
            agrupacionDocContratos(perfilCA.data[17]);
            agrupacionModificaciones(perfilCA.data[20]);
            agrupacionTransacciones(perfilCA.data[18]);
            agrupacionDocTransacciones(perfilCA.data[19]);
            llenarBanner(perfilCA);
            llenarInformacionGeneral(perfilCA);
            llenarEtapaPlaneacion(perfilCA);
            llenarEtapaLicitacion(perfilCA);
            llenarEtapaAdjudicacion(perfilCA);
            llenarEtapaContratacion(perfilCA);
            llenarEtapaEjecucion(perfilCA);
            paginarProyectos(perfilCA.data,pageSizeProyectos);
        }
    });
});

function llenarBanner(info){
    var prefixOCID = $("#prefixOCID").val();
    limpiarCifras();
    $('#_cifra_1').text(`$ ${redondearCifras(parseFloat(info.data[0].monto))}`);
    $('#_cifra_2').text(info.data[0].contratos);
    $('#_cifra_3').text(info.data[0].numberoftenderers);
    $('#_fecha_actualizacion').text(moment(info.data[0].updated_date).format('DD/MM/yyyy'));
    $('#_title').text(info.data[0].title_contratacion);
    $('#_titlebreadcrum').text(info.data[0].title_contratacion);
    $('#_datos').append(`<strong>Contratista(s):</strong> `);
    if (info.data[1].length > 0) { 
        info.data[1].forEach(contratista => {
            $('#_datos').append(`<span><a class="hipervinculo_contratista texto_movil" href="/contratista/${prefixOCID}&${contratista.partyid}">${contratista.contratista}</a></span>; `);
        });
    } else {
        $('#_datos').append(`<span>Sin contratista</span>`);
    }
}

function llenarInformacionGeneral(info){
    $('#_entidadCompradora').text(info.data[0].name_buyer);
    $('#_entidadContratante').text(info.data[0].name_procuringentity);
    $('#_fechaInicio').text(info.data[0].tenderperiod_startdate === null ? '--/--/----': moment(info.data[0].tenderperiod_startdate).format('DD/MM/yyyy'));
    $('#_fechaTermino').text(info.data[0].tenderperiod_enddate === null ? '--/--/----': moment(info.data[0].tenderperiod_enddate).format('DD/MM/yyyy'));
    $('#_descripcion').text(info.data[0].description);
}

function llenarEtapaPlaneacion(info){
    $('#_tituloProyecto').text(info.data[0].title_proyecto);
    $('#_conteoDocumentos').text(info.data[3].totaldocumentosplaneacion);
    if(info.data[2].length > 0) {
        var indice = 0;
        info.data[2].forEach(documento => {
            indice = indice + 1;
            $('#_documentos').append(`
                <div class="row sizeFontGeneral">
                    <div class="col-lg-6 col-md-12">
                        <div class="row">
                            <div class="col-lg-1 col-md-1"><img class="iconoSize" src="/images/iconos/documentacion.svg"></div>
                            <div class="col-lg-11 col-md-11"><strong>${documento.title}</strong></div>
                        </div>
                        <div id="descripcion_div${indice}" class="col-12 pad espacioCol">${documento.description}</div>
                    </div>
                    <div class="col-lg-2 col-md-6 maxFormato espacioCol">
                        <img class="tam_list_icono sizeIcono" src="/images/iconos/versionRojo.svg"> <strong>Formato</strong><br> ${documento.format}
                    </div>
                    <div class="col-lg-2 col-md-6 maxFecha espacioCol">
                        <img class="tam_list_icono sizeIcono" src="/images/iconos/periodoRojo.svg"> <strong>Fecha de publicación</strong><br> ${documento.date_published === null ? '--/--/----': moment(documento.date_published).format('DD/MM/yyyy')}
                    </div>
                    <div class="col-lg-2 col-md-6 maxFecha">
                        <img class="tam_list_icono sizeIcono" src="/images/iconos/periodoRojo.svg"> <strong>Fecha de modificación</strong><br> ${documento.date_modified === null ? '--/--/----': moment(documento.date_modified).format('DD/MM/yyyy')}
                    </div>
                    <div class="col-lg-2 col-md-6 ubicaBoton maxBoton">
                        <a href="${documento.url}" target="_blank"><button type="button" class="btn btn-lg sizeFontGeneral">Descargar</button></a>
                    </div>
                </div>
                <br>
                <hr class="linea">
                `);
        })
    } else {
        $('#_documentos').append(`
            <div>
                <a class="paddingCuadros sizeFontGeneral">Sin documentos registrados</a>
            </div>
        `);
    };
}

    var texto_original = '';
    function gestionarTexto(div) {
        //aquí valoramos si hay que expandir o contraer el texto, en función de lo que ponga en el <DIV>
        if(div.innerHTML == 'Volver') {   
            contraer();div.innerHTML='Leer más';
        } else {
            expandir();div.innerHTML='Volver'
        }
    }
    function contraer() {
        //vamos a limitar el texto a 50 caracteres y guardamos el texto original
        texto_original = document.getElementById('descripcion_div1').innerHTML;
        document.getElementById('descripcion_div1').innerHTML = texto_original.substring(0,150) + '...';
    }
    function expandir() {
        document.getElementById('descripcion_div1').innerHTML=texto_original;
    }

function llenarEtapaLicitacion(info){
    $('#_titletender').text(info.data[0].title_contratacion);
    $('#_idcontratacion').text(info.data[0].tenderid);
    if(translateLicitacionEstatus(info.data[0].status) != 'Fallido') {
        $('#_status').append(`<span class="botonStyleColorA formatoTextValor">${translateLicitacionEstatus(info.data[0].status)}</span>`)
    } else {
        $('#_status').append(`<span class="botonStyleColorG formatoTextValor">${translateLicitacionEstatus(info.data[0].status)}</span>`)
    }
    if(translateLicitacionEstatus(info.data[0].status) != 'Fallido') {
        $('#_statusMobile').append(`<span class="botonStyleColorA formatoTextValor">${translateLicitacionEstatus(info.data[0].status)}</span>`)
    } else {
        $('#_statusMobile').append(`<span class="botonStyleColorG formatoTextValor">${translateLicitacionEstatus(info.data[0].status)}</span>`)
    }
    $('#_objetoProcedimiento').text(info.data[0].rationale);
    $('#_valorEstimado').text(separarCifras(info.data[0].value_amount));
    $('#_valorCurrency').text(info.data[0].value_currency);
    $('#_entidadCL').text(info.data[0].name_procuringentity);
    $('#_conteoItems').text(info.data[5].totalitems);
    if(info.data[4].length > 0) {
        $('#_items').append(`
            <table class="table tableMobile styleTab tituloMargen">
                <thead>
                    <tr class="colorandfont">
                        <th class="col-lg-2 col-md-3 widthitems_8"><img class="tam_list_icono iconoFases" src="/images/iconos/identificadorBlanco.svg"> ID</th>
                        <th class="col-lg-4 col-md-3"><img class="tam_list_icono iconoFases" src="/images/iconos/descripcionBlanco.svg"> Descripción</th>
                        <th class="col-lg-2 col-md-3"><img class="tam_list_icono iconoFases" src="/images/iconos/rfcBlanco.svg"> Clasificación aplicable al bien, servicio u obra pública</th>
                        <th class="col-lg-2 col-md-3 widthitems_10"><img class="tam_list_icono iconoFases" src="/images/iconos/cantidadBlanco.svg"> Cantidad</th>
                        <th class="col-lg-2 col-md-3 widthitems_10"><img class="tam_list_icono iconoFases medidaIcono" src="/images/iconos/unidaddemedidaBlanco.svg"> Unidad de medida</th>
                        <th class="col-lg-2 col-md-3 widthitems_14"><img class="tam_list_icono iconoFases" src="/images/iconos/montoBlanco.svg"> Monto</th>
                    </tr>
                </thead>
            </table>`);
        info.data[4].forEach(item => {
            $('#_items').append(`
                <table class="table tableMobile styleTab">
                    <tbody class="interlinea">
                        <tr>
                            <td class="col-lg-2 col-md-3 widthitems_8">${item.classification_id}</td>
                            <td class="col-lg-4 col-md-3">${item.classification_description}</td>
                            <td class="col-lg-2 col-md-3">${item.classification_scheme}</td>
                            <td class="col-lg-2 col-md-3 widthitems_10">${item.quantity}</td>
                            <td class="col-lg-2 col-md-3 widthitems_10">${item.unit_name}</td>
                            <td class="col-lg-2 col-md-3 widthitems_14">$ ${separarCifras(item.unit_value_amount)} ${item.unit_value_currency}</td>
                        </tr>
                    </tbody>
                </table>`);
        })
    } else {
        $('#_items').append(`
            <div>
                <a class="paddingCuadros sizeFontGeneral">Sin ítems registrados</a>
            </div>
        `);
    };
    $('#_metodoContratacion').text(translateMetodo(info.data[0].procurementmethod));
    $('#_detalleMetodo').text(info.data[0].procurementmethod_details);
    $('#_categoriaContratacion').text(translateCategoria(info.data[0].mainprocurementcategory));
    $('#_justificacionContratacion').text(info.data[0].procurementmethod_rationale);
    $('#_criterioEvaluacion').text(translateCriterios(info.data[0].awardcriteria));
    $('#_criterioProposiciones').text(info.data[0].awardcriteria_details);
    $('#_criterioElegibilidad').text(info.data[0].eligibilitycriteria);
    $('#_inicioFechaP').text(info.data[0].tenderperiod_startdate === null ? '--/--/----': moment(info.data[0].tenderperiod_startdate).format('DD/MM/yyyy'));
    $('#_cierreFechaP').text(info.data[0].tenderperiod_enddate === null ? '--/--/----': moment(info.data[0].tenderperiod_enddate).format('DD/MM/yyyy'));
    $('#_mediosRecepcion').text(translateMedios(info.data[0].submissionmethod));
    $('#_descripcionMediosRecepcion').text(info.data[0].submissionmethod_details);
    $('#_inicioFechaS').text(info.data[0].enquiryperiod_startdate === null ? '--/--/----': moment(info.data[0].enquiryperiod_startdate).format('DD/MM/yyyy'));
    $('#_cierreFechaS').text(info.data[0].enquiryperiod_enddate === null ? '--/--/----': moment(info.data[0].enquiryperiod_enddate).format('DD/MM/yyyy'));
    $('#_huboCotizaciones').text(translateSolicitudes(info.data[0].hasenquiries));
    $('#_inicioFechaEA').text(info.data[0].awardperiod_startdate === null ? '--/--/----': moment(info.data[0].awardperiod_startdate).format('DD/MM/yyyy'));
    $('#_cierreFechaEA').text(info.data[0].awardperiod_enddate === null ? '--/--/----': moment(info.data[0].awardperiod_enddate).format('DD/MM/yyyy'));
    $('#_conteoLicitantes').text(info.data[0].numberoftenderers);
    if(info.data[6].length > 0) {
        $('#_tenderers').append(`
            <table class="table tableMobile2 styleTab tituloMargen">
                <thead>
                    <tr class="colorandfont">
                        <th class="col-lg-8 col-md-8"><img class="tam_list_icono iconoFases" src="/images/iconos/nombreorazonsocialBlanco.svg"> Nombre o razón social</th>
                        <th class="col-lg-6 col-md-6"><img class="tam_list_icono iconoFases" src="/images/iconos/rfcBlanco.svg"> RFC</th>
                    </tr>
                </thead>
            </table>`);
        info.data[6].forEach(licitante => {
            $('#_tenderers').append(`
                <table class="table tableMobile2 styleTab">
                    <tbody class="interlinea">
                        <tr>
                            <td class="col-lg-8 col-md-8">${licitante.licitante}</td>
                            <td class="col-lg-6 col-md-6">${licitante.identificadorlicitante}</td>
                        </tr>
                    </tbody>
                </table>`);
        })
    } else {
        $('#_tenderers').append(`
            <div>
                <a class="paddingCuadros sizeFontGeneral">Sin licitantes registrados</a>
            </div>
        `);
    };
    $('#_conteoDocumentosLicitantes').text(info.data[7].totaldocumentoslicitacion);
    if(info.data[8].length > 0) {
        info.data[8].forEach(documento => {
            $('#_documentosLicitacion').append(`
                <div class="row sizeFontGeneral">
                    <div class="col-lg-6 col-md-12">
                        <div class="row">
                            <div class="col-lg-1 col-md-1"><img class="iconoSize" src="/images/iconos/documentacion.svg"></div>
                            <div class="col-lg-11 col-md-11"><strong>${documento.title}</strong></div>
                        </div>
                    <div class="col-12 pad espacioCol">${documento.description}</div>
                </div>
                <div class="col-lg-2 col-md-6 maxFormato espacioCol">
                    <img class="tam_list_icono sizeIcono" src="/images/iconos/versionRojo.svg"> <strong>Formato</strong><br> ${documento.format}
                </div>
                <div class="col-lg-2 col-md-6 maxFecha espacioCol">
                    <img class="tam_list_icono sizeIcono" src="/images/iconos/periodoRojo.svg"> <strong>Fecha de publicación</strong><br> ${documento.date_published === null ? '--/--/----': moment(documento.date_published).format('DD/MM/yyyy')}
                </div>
                <div class="col-lg-2 col-md-6 maxFecha">
                    <img class="tam_list_icono sizeIcono" src="/images/iconos/periodoRojo.svg"> <strong>Fecha de modificación</strong><br> ${documento.date_modified === null ? '--/--/----': moment(documento.date_modified).format('DD/MM/yyyy')}
                </div>
                <div class="col-lg-2 col-md-6 ubicaBoton maxBoton">
                    <a href="${documento.url}" target="_blank"><button type="button" class="btn btn-lg sizeFontGeneral">Descargar</button></a>
                </div>
            </div>
            <br>
            <hr class="linea">
            <br>`);
        })
    } else {
        $('#_documentosLicitacion').append(`
            <div>
                <a class="paddingCuadros sizeFontGeneral">Sin documentos registrados</a>
            </div>
        `);
    };
    $('#_conteoHitos').text(info.data[9].totalhitosl);
    if(info.data[10].length > 0) {
            $('#_hitos').append(`
            <table class="table tableMobile styleTab tituloMargen">
                <thead>
                    <tr class="colorandfont">
                        <th class="col-2"><img class="tam_list_icono iconoFases" src="/images/iconos/descripcionBlanco.svg"> Título</th>
                        <th class="col-2 widthitems_12"><img class="tam_list_icono iconoFases" src="/images/iconos/identificadorBlanco.svg"> Tipo</th>
                        <th class="col-4"><img class="tam_list_icono iconoFases" src="/images/iconos/fuenteBlanco.svg"> Descripción</th>
                        <th class="col-2 widthitems_10"><img class="tam_list_icono iconoFases" src="/images/iconos/periodoBlanco.svg"> Fecha de vencimiento</th>
                        <th class="col-2 widthitems_10"><img class="tam_list_icono iconoFases" src="/images/iconos/periodoBlanco.svg"> Fecha de modificación</th>
                        <th class="col-2 widthitems_12"><img class="tam_list_icono iconoFases" src="/images/iconos/estatusBlanco.svg"> Estatus</th>
                    </tr>
                </thead>
            </table>`);
        info.data[10].forEach(hito => {
            $('#_hitos').append(`
                <table class="table tableMobile styleTab">
                    <tbody class="interlinea">
                        <tr>
                            <td class="col-2">${hito.title}</td>
                            <td class="col-2 widthitems_12">${translateHitosTipo(hito.type)}</td>
                            <td class="col-4">${hito.description}</td>
                            <td class="col-2 widthitems_10">${hito.duedate === null ? '--/--/----': moment(hito.duedate).format('DD/MM/yyyy')}</td>
                            <td class="col-2 widthitems_10">${hito.date_modified=== null ? '--/--/----': moment(hito.date_modified).format('DD/MM/yyyy')}</td>
                            <td class="col-2 widthitems_12">${translateHitosEstatus(hito.status)}</td>
                        </tr>
                    </tbody>
                </table>`);
        })
    } else {
        $('#_hitos').append(`
            <div>
                <a class="paddingCuadros sizeFontGeneral">Sin hitos registrados</a>
            </div>
        `);
    };
}

function llenarEtapaAdjudicacion(info){
    if(info.data[12].length > 0) {
        var indice = 0;
        info.data[12].forEach(awards => {
            // console.log('awards', JSON.stringify(awards))
            if(awards.id_award != null){
                indice = indice + 1;
                var colorEstatusA = '';
                if(translateAdjudicacionEstatus(awards.estatus_award) != 'Fallido') {
                    colorEstatusA = `<span class="botonStyleColorV formatoTextValor">${translateAdjudicacionEstatus(awards.estatus_award)}</span>`;
                } else {
                    colorEstatusA = `<span class="botonStyleColorG formatoTextValor">${translateAdjudicacionEstatus(awards.estatus_award)}</span>`;
                }
                
                $('#adjudicacion').append(`
                    <div id="_adjudicacion">
                        <button class="btn btn-link colorCard botonMovil" data-toggle="collapse" data-target="#collapseadjudicacion${indice}" aria-expanded="true" aria-controls="collapseadjudicacion${indice}">
                            Adjudicación <span class="ocultaIndice">${indice}</span> <span id="_idawardTitulo">${awards.id_award}</span>
                        </button>
                        <br><br>
                        <div class="card card_sinBorde">
                        <div id="collapseadjudicacion${indice}" class="collapse" aria-labelledby="headingOne" data-parent="#_adjudicacion">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-lg-2 col-md-12 ubicaBotonEstatus tablet mobile">
                                        <div id="_statusAwardMobile"> ${colorEstatusA}</div>
                                    </div>
                                    <div class="col-lg-9">
                                        <p id="_titleaward" class="styleName formatoTextTitulo">${awards.title_award}</p>
                                        <div class="col-lg-4 col-md-6 styleID formatoTextValor">
                                            <span>ID: </span><span id="_idaward">${awards.id_award}</span>
                                        </div>
                                    </div>
                                    <div class="col-lg-3 col-md-12 ubicaBotonEstatus no-mobile">
                                        <div id="_statusAward"> ${colorEstatusA}</div>
                                    </div>
                                </div>
                                <br><br>
                                <div class="row">
                                    <div class="col-12 textJustify formatoTextValor">
                                        <strong>Descripción:</strong> <span id="_descripcionProcedimiento"> ${awards.description_award}</span>
                                    </div>
                                </div>
                                <br><br>
                                <div class="row ubicaBoton">
                                    <div class="col-6">
                                        <strong class="formatoTextTitulo">Monto adjudicado</strong>
                                        <div class="textStyle formatoTextValor">
                                            <span>$</span> <span id="_montoAdjudicado">${awards.monto_award === null ? '' : separarCifras(awards.monto_award)} </span> <span id="_valorCurrencyAward"> ${awards.currency_award} </span>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <strong class="formatoTextTitulo">Fecha de la adjudicación</strong>
                                        <p id="_fechaAdjudicacion" class="textStyle formatoTextValor">${awards.date_award === null ? '--/--/----': moment(awards.date_award).add(1, 'days').format('DD/MM/yyyy')}</p>
                                    </div>
                                </div>
                                <hr>
                                <br>
                                <div id="awardContratistasArrow">
                                    <div onclick="flechitaBoton(award_contratistas_${indice})" id="award_contratistas_${indice}" class="flechisabajo">
                                        <button class="collapsed btn colorBoton botonMovil" role="button" data-toggle="collapse" data-parent="#awardContratistasArrow" href="#collapseContratistasAdjudicacion${indice}" aria-expanded="true" aria-controls="collapseContratistasAdjudicacion${indice}">
                                            Contratistas (<span id="_conteoContratistasA">${awards.totalcontratistaslicitacion}</span>) <div class="flechita"><a></a></div>
                                        </button>
                                    </div>
                                    <div class="hscroll">
                                        <div id="collapseContratistasAdjudicacion${indice}" class="panel-collapse collapse space">
                                            <br>
                                            <table class="table tableMobile2 styleTab">
                                                <thead>
                                                    <tr class="colorandfont">
                                                        <th class="col-8"><img class="tam_list_icono iconoFases" src="/images/iconos/nombreorazonsocialBlanco.svg"> Nombre o razón Social</th>
                                                        <th class="col-4"><img class="tam_list_icono iconoFases" src="/images/iconos/rfcBlanco.svg"> Identificador</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            <div id="suppliers_${awards.id_award.replace(/\//g,'')}"></div>
                                        </div>
                                    </div>
                                </div>
                                <hr>
                                <br>
                                <div id="awardPeriodoArrow">
                                    <div onclick="flechitaBoton(award_periodo_${indice})" id="award_periodo_${indice}" class="flechisabajo">
                                        <button class="collapsed btn colorBoton botonMovil" role="button" data-toggle="collapse" data-parent="#awardPeriodoArrow" href="#collapsePCAdjudicacion${indice}" aria-expanded="true" aria-controls="collapsePCAdjudicacion${indice}">
                                            Período del contrato <div class="flechita"><a></a></div>
                                        </button>
                                    </div>
                                    <div class="collapse" id="collapsePCAdjudicacion${indice}">
                                        <div class="card card-body card_sinBorde">
                                            <div class="row center-text space">
                                                <div class="col-6">
                                                    <p class="formatTextI formatoTextTitulo">Fecha de inicio</p>
                                                    <p id="_inicioFechaApc" class="text18 formatoTextValor">${awards.fechainicio_award === null ? '--/--/----': moment(awards.fechainicio_award).add(1, 'days').format('DD/MM/yyyy')}</p>
                                                    <p><img class="icono_size" src="/images/iconos/fechadeinicio.svg" /></p>
                                                </div>
                                                <div class="col-6">
                                                    <p class="formatTextI formatoTextTitulo">Fecha de cierre</p>
                                                    <p id="_cierreFechaApc" class="text18 formatoTextValor">${awards.fechafin_award === null ? '--/--/----': moment(awards.fechafin_award).add(1, 'days').format('DD/MM/yyyy')}</p>
                                                    <p><img class="icono_size" src="/images/iconos/fechadefin.svg" /></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr>
                                <br>
                                <div id="awardDocumentoArrow">
                                    <div onclick="flechitaBoton(award_documento_${indice})" id="award_documento_${indice}" class="flechisabajo">
                                        <button class="collapsed btn colorBoton botonMovil" role="button" data-toggle="collapse" data-parent="#awardDocumentoArrow" href="#collapseDOCAdjudicacion${indice}" aria-expanded="true" aria-controls="collapseDOCAdjudicacion${indice}">
                                            Documentos (<span id="_conteoDocumentosAwards">${awards.totaldocumentosaward}</span>) <div class="flechita"><a></a></div>
                                        </button>
                                    </div>
                                    <div class="space collapse" id="collapseDOCAdjudicacion${indice}">
                                        <div class="sizeFontGeneral" id="documentosAward_${awards.id_award.replace(/\//g,'')}"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <hr>`);

                if(awards.contratistas.length > 0) {
                    awards.contratistas.forEach(contratista => {
                        // console.log('contratistas', contratista)
                        let id = '#suppliers_' + contratista.id_award.replace(/\//g,'');
                        $(id).append(`
                            <table class="table styleTab">
                                <tbody class="interlinea">
                                    <tr>
                                    <td class="col-8">${contratista.contratista}</td>
                                        <td class="col-4">${contratista.partyid}</td>
                                    </tr>
                                </tbody>
                            </table>
                        `);
                    })
                } else {
                    let id = '#suppliers_' + awards.id_award.replace(/\//g,'');
                    $(id).append(`
                        <div>
                            <a class="paddingCuadros sizeFontGeneral">Sin contratistas registrados</a>
                        </div>
                    `);
                }
                
                if(awards.documentos.length > 0){
                    awards.documentos.forEach(documento => {
                        let id = '#documentosAward_' + documento.awardid.replace(/\//g,'');
                    
                        $(id).append(`
                            <div class="row sizeFontGeneral">
                                <div class="col-lg-6 col-md-12">
                                    <div class="row">
                                        <div class="col-lg-1 col-md-1"><img class="iconoSize" src="/images/iconos/documentacion.svg"></div>
                                        <div class="col-lg-11 col-md-11"><strong>${documento.title}</strong></div>
                                    </div>
                                    <div class="col-12 pad espacioCol">${documento.description}</div>
                                </div>
                                <div class="col-lg-2 col-md-6 maxFormato espacioCol">
                                    <img class="tam_list_icono sizeIcono" src="/images/iconos/versionRojo.svg"> <strong>Formato</strong><br> ${documento.format}
                                </div>
                                <div class="col-lg-2 col-md-6 maxFecha espacioCol">
                                    <img class="tam_list_icono sizeIcono" src="/images/iconos/periodoRojo.svg"> <strong>Fecha de publicación</strong><br> ${documento.date_published === null ? '--/--/----': moment(documento.date_published).format('DD/MM/yyyy')}
                                </div>
                                <div class="col-lg-2 col-md-6 maxFecha">
                                    <img class="tam_list_icono sizeIcono" src="/images/iconos/periodoRojo.svg"> <strong>Fecha de modificación</strong><br> ${documento.date_modified === null ? '--/--/----': moment(documento.date_modified).format('DD/MM/yyyy')}
                                </div>
                                <div class="col-lg-2 col-md-6 ubicaBoton maxBoton">
                                    <a href="${documento.url}" target="_blank"><button type="button" class="btn btn-lg sizeFontGeneral">Descargar</button></a>
                                </div>
                            </div>
                            <br>
                            <hr class="linea">
                        `)
                    })
                } else {
                    // console.log('entra al else de documentos')
                    let id = '#documentosAward_' + awards.id_award.replace(/\//g,'');
                    $(id).append(`
                        <div>
                            <a class="paddingCuadros sizeFontGeneral">Sin documentos registrados</a>
                        </div>
                    `);
                }
            } else {
                $('#adjudicacion').append(`
                <div id="_adjudicacion" class="sinRegistro formatoTextValor">
                    <a class="paddingCuadros sizeFontGeneral">Sin registro de adjudicaciones</a>
                </div>`);
            }
        });
    }
}

function agrupacionContratistas(contratistas) {
    perfilCA.data[12].forEach(adjudicacion => {
        let arrayContratistas = [];
        contratistas.forEach(contratista => { 
            if(contratista.id_award == adjudicacion.id_award){
                arrayContratistas.push(contratista);
            }
        });
        adjudicacion.contratistas = arrayContratistas;
    });
}
function agrupacionDocumentos(documentos) {
    perfilCA.data[12].forEach(adjudicacion => {
        let arrayDocumentos = [];
        documentos.forEach(documento => { 
            if(documento.awardid == adjudicacion.id_award){
                arrayDocumentos.push(documento);
            }
        });
        adjudicacion.documentos = arrayDocumentos;
    });
}

function llenarEtapaContratacion(info){
    if(info.data[15].length > 0) {
        var indice = 0;
        info.data[15].forEach(contract => {
            if(contract.contractid != null){
                indice = indice + 1;
                var colorEstatusC = '';
                    if(translateContratacionEstatus(contract.status) == 'Fallido') {
                        colorEstatusC = `<span class="botonStyleColorG formatoTextValor">${translateContratacionEstatus(contract.status)}</span>`;
                    } if(translateContratacionEstatus(contract.status) == 'En contratación') {
                        colorEstatusC = `<span class="botonStyleColorAZ formatoTextValor">${translateContratacionEstatus(contract.status)}</span>`;
                    } if(translateContratacionEstatus(contract.status) == 'Terminado') {
                        colorEstatusC = `<span class="botonStyleColorAZF formatoTextValor">${translateContratacionEstatus(contract.status)}</span>`;
                    }

                $('#contratacion').append(`
                <div id="_contratacion">
                    <button class="btn btn-link colorCard botonMovil" data-toggle="collapse" data-target="#collapsecontratacion${indice}" aria-expanded="true" aria-controls="collapsecontratacion${indice}">
                        Contratación <span class="ocultaIndice">${indice}</span> <span id="_idcontractTitulo">${contract.contractid}</span>
                    </button>
                    <br><br>
                    <div class="card card_sinBorde">
                    <div id="collapsecontratacion${indice}" class="collapse" aria-labelledby="headingOne" data-parent="#_contratacion">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-3 col-md-12 ubicaBotonEstatus tablet mobile">
                                    <div id="_statuscontract">${colorEstatusC}</div>
                                </div>
                                <div class="col-lg-9">
                                    <p id="_titlecontract" class="styleName formatoTextTitulo">${contract.title}</p>
                                    <div class="col-lg-4 col-md-6 styleID formatoTextValor">
                                        <span>ID: </span><span id="_idcontract">${contract.contractid}</span>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-12 ubicaBotonEstatus no-mobile">
                                    <div id="_statuscontract">${colorEstatusC}</div>
                                </div>
                            </div>
                            <br><br>
                            <div class="row">
                                <div class="col-12 textJustify sizeFontDescripcion">
                                    <strong>Descripción:</strong> <span id="_descripcioncontract"> ${contract.description}</span>
                                </div>
                            </div>
                            <br><br>
                            <div class="row ubicaBoton">
                                <div class="col-6">
                                    <strong class="formatoTextTitulo">Monto del contrato</strong>
                                    <div class="textStyle formatoTextValor">
                                        <span>$</span> <span id="_montocontract">${separarCifras(contract.exchangerate_amount)} </span> <span id="_valorCurrencycontract"> ${contract.exchangerate_currency} </span>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <strong class="formatoTextTitulo">Fecha de firma del contrato</strong>
                                    <p id="_fechacontract" class="textStyle formatoTextValor">${contract.datesigned === null ? '--/--/----': moment(contract.datesigned).add(1, 'days').format('DD/MM/yyyy')}</p>
                                </div>
                            </div>
                            <div class="row center-text space">
                                <div class="col-6">
                                    <p class="formatTextI formatoTextTitulo">Fecha de inicio</p>
                                    <p id="_inicioFechacontract" class="text18 formatoTextValor">${contract.period_startdate === null ? '--/--/----': moment(contract.period_startdate).add(1, 'days').format('DD/MM/yyyy')}</p>
                                    <p><img class="icono_size" src="/images/iconos/fechadeinicio.svg" /></p>
                                </div>
                                <div class="col-6">
                                    <p class="formatTextI formatoTextTitulo">Fecha de cierre</p>
                                    <p id="_cierreFechacontract" class="text18 formatoTextValor">${contract.period_enddate === null ? '--/--/----': moment(contract.period_enddate).add(1, 'days').format('DD/MM/yyyy')}</p>
                                    <p><img class="icono_size" src="/images/iconos/fechadefin.svg" /></p>
                                </div>
                            </div>
                            <hr>
                            <br>
                            <div id="contractItemArrow">
                                <div onclick="flechitaBoton(contract_item_${indice})" id="contract_item_${indice}" class="flechisabajo">
                                    <button class="collapsed btn colorBoton botonMovil" role="button" data-toggle="collapse" data-parent="#contractItemArrow" href="#collapseItemsContrato${indice}" aria-expanded="true" aria-controls="collapseItemsContrato${indice}">
                                        Ítems del contrato (<span id="_conteoItemsC">${contract.totalitems}</span>) <div class="flechita"><a></a></div>
                                    </button>
                                </div>
                                <div class="hscroll">
                                    <div class="space collapse" id="collapseItemsContrato${indice}">
                                        <br>
                                        <table class="table tableMobile styleTab tituloMargen">
                                            <thead>
                                                <tr class="colorandfont">
                                                    <th class="col-2"><img class="tam_list_icono" src="/images/iconos/identificadorBlanco.svg"> ID</th>
                                                    <th class="col-3"><img class="tam_list_icono" src="/images/iconos/descripcionBlanco.svg"> Descripción</th>
                                                    <th class="col-2"><img class="tam_list_icono" src="/images/iconos/cantidadBlanco.svg"> Cantidad</th>
                                                    <th class="col-3"><img class="tam_list_icono medidaIcono" src="/images/iconos/unidaddemedidaBlanco.svg"> Unidad de medida</th>
                                                    <th class="col-2"><img class="tam_list_icono" src="/images/iconos/montoBlanco.svg"> Monto</th>
                                                </tr>
                                            </thead>
                                        </table>
                                        <div id="itemsContract_${contract.id}" class="hscroll"></div>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <br>
                            <div id="contractDocumentoArrow">
                                <div onclick="flechitaBoton(contract_documento_${indice})" id="contract_documento_${indice}" class="flechisabajo">
                                    <button class="collapsed btn colorBoton botonMovil" role="button" data-toggle="collapse" data-parent="#contractDocumentoArrow" href="#collapseDOCContratacion${indice}" aria-expanded="true" aria-controls="collapseDOCContratacion${indice}">
                                        Documentos (<span id="_conteoDocumentosContracts">${contract.totaldocumentoscontract}</span>) <div class="flechita"><a></a></div>
                                    </button>
                                </div>
                                <div class="space collapse" id="collapseDOCContratacion${indice}">
                                    <div id="documentosContract_${contract.id}"></div>
                                </div>
                            </div>
                            <hr>
                            <br>
                            <div id="contractModificacionArrow">
                                <div onclick="flechitaBoton(contract_modificacion_${indice})" id="contract_modificacion_${indice}" class="flechisabajo">
                                    <button class="collapsed btn colorBoton botonMovil" role="button" data-toggle="collapse" data-parent="#contractModificacionArrow" href="#collapseModificacionContratacion${indice}" aria-expanded="true" aria-controls="collapseModificacionContratacion${indice}">
                                        Modificaciones (<span id="_conteoModificacionesContracts">${contract.totalmodificaciones}</span>) <div class="flechita"><a></a></div>
                                    </button>
                                </div>
                                <div class="hscroll">
                                    <div class="space collapse" id="collapseModificacionContratacion${indice}">
                                        <br>
                                        <table class="table tableMobile2 styleTab tituloMargen">
                                            <thead>
                                                <tr class="colorandfont">
                                                    <th class="col-3"><img class="tam_list_icono" src="/images/iconos/identificadorBlanco.svg"> ID</th>
                                                    <th class="col-3"><img class="tam_list_icono" src="/images/iconos/descripcionBlanco.svg"> Justificación</th>
                                                    <th class="col-3"><img class="tam_list_icono" src="/images/iconos/descripcionBlanco.svg"> Descripción</th>
                                                    <th class="col-3"><img class="tam_list_icono" src="/images/iconos/periodoBlanco.svg"> Fecha de modificación</th>
                                                </tr>
                                            </thead>
                                        </table>
                                        <div class="hscroll" id="modificacionesContract_${contract.id}"></div>
                                    </div>
                                </div>
                            </div>
                            <hr>
                        </div>
                    </div>
                </div>
                <hr>`);

                if(contract.items.length > 0) {
                    contract.items.forEach(item => {
                        let id = '#itemsContract_' + item.itemid;

                        $(id).append(`
                            <table class="table tableMobile styleTab">
                                <tbody class="interlinea">
                                    <tr>
                                        <td class="col-2">${item.classification_id}</td>
                                        <td class="col-3">${item.classification_description}</td>
                                        <td class="col-2">${item.quantity}</td>
                                        <td class="col-3">${item.unit_name}</td>
                                        <td class="col-2">$ ${separarCifras(item.unit_value_amount)} ${item.unit_value_currency}</td>
                                    </tr>
                                </tbody>
                            </table>
                        `);
                    })
                } else {
                    let id = '#itemsContract_' + contract.id;
                    $(id).append(`
                        <div>
                            <a class="paddingCuadros sizeFontGeneral">Sin ítems registrados</a>
                        </div>
                    `);
                }

                if(contract.documentos.length > 0) {
                    contract.documentos.forEach(documento => {
                        let id = '#documentosContract_' + documento.documentid;
                        $(id).append(`
                            <div class="row sizeFontGeneral">
                                <div class="col-lg-6 col-md-12">
                                    <div class="row">
                                        <div class="col-lg-1 col-md-1"><img class="iconoSize" src="/images/iconos/documentacion.svg"></div>
                                        <div class="col-lg-11 col-md-11"><strong>${documento.title}</strong></div>
                                    </div>
                                    <div class="col-12 pad espacioCol">${documento.description}</div>
                                </div>
                                <div class="col-lg-2 col-md-6 maxFormato espacioCol">
                                    <img class="tam_list_icono sizeIcono" src="/images/iconos/versionRojo.svg"> <strong>Formato</strong><br> ${documento.format}
                                </div>
                                <div class="col-lg-2 col-md-6 maxFecha espacioCol">
                                    <img class="tam_list_icono sizeIcono" src="/images/iconos/periodoRojo.svg"> <strong>Fecha de publicación</strong><br> ${documento.date_published === null ? '--/--/----': moment(documento.date_published).format('DD/MM/yyyy')}
                                </div>
                                <div class="col-lg-2 col-md-6 maxFecha">
                                    <img class="tam_list_icono sizeIcono" src="/images/iconos/periodoRojo.svg"> <strong>Fecha de modificación</strong><br> ${documento.date_modified === null ? '--/--/----': moment(documento.date_modified).format('DD/MM/yyyy')}
                                </div>
                                <div class="col-lg-2 col-md-6 ubicaBoton maxBoton">
                                    <a href="${documento.url}" target="_blank"><button type="button" class="btn btn-lg sizeFontGeneral">Descargar</button></a>
                                </div>
                            </div>
                            <br>
                            <hr class="linea">
                        `);
                    })
                } else {
                    let id = '#documentosContract_' + contract.id;
                    $(id).append(`
                        <div>
                            <a class="paddingCuadros sizeFontGeneral">Sin documentos registrados</a>
                        </div>
                    `);
                }

                if(contract.modificaciones.length > 0) {
                    contract.modificaciones.forEach(modificacion => {
                        let id = '#modificacionesContract_' + modificacion.amendmentid;
                        $(id).append(`
                            <table class="table tableMobile2 styleTab">
                                <tbody class="interlinea">
                                    <tr>
                                        <td class="col-3">${modificacion.amendments_id}</td>
                                        <td class="col-3">${modificacion.amendments_rationale}</td>
                                        <td class="col-3">${modificacion.amendments_description}</td>
                                        <td class="col-3">${modificacion.amendments_date === null ? '--/--/----': moment(modificacion.amendments_date).format('DD/MM/yyyy')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        `);
                    })
                } else {
                    let id = '#modificacionesContract_' + contract.id;
                    $(id).append(`
                        <div>
                            <a class="paddingCuadros sizeFontGeneral">Sin modificaciones registradas</a>
                        </div>
                    `);
                }

            } else {
                $('#contratacion').append(`
                <div id="_contratacion" class="sinRegistro formatoTextValor">
                    <a class="paddingCuadros sizeFontGeneral">Sin registro de contrataciones</a>
                </div>`);
            }
        });
    }
}

function agrupacionItems(items) {
    perfilCA.data[15].forEach(contratacion => {
        let arrayItems = [];
        items.forEach(item => { 
            if(item.itemid == contratacion.id){
                arrayItems.push(item);
            }
        });
        contratacion.items = arrayItems;
    });
}
function agrupacionDocContratos(documentos) {
    perfilCA.data[15].forEach(contratacion => {
        let arrayDocumentos = [];
        documentos.forEach(documento => { 
            if(documento.documentid == contratacion.id){
                arrayDocumentos.push(documento);
            }
        });
        contratacion.documentos = arrayDocumentos;
    });
}
function agrupacionModificaciones(modificaciones) {
    perfilCA.data[15].forEach(contratacion => {
        let arrayModificaciones = [];
        modificaciones.forEach(modificacion => { 
            if(modificacion.amendmentid == contratacion.id){
                arrayModificaciones.push(modificacion);
            }
        });
        contratacion.modificaciones = arrayModificaciones;
    });
}

function llenarEtapaEjecucion(info){
    if(info.data[15].length > 0) {
        var indice = 0;
        info.data[15].forEach(implementation => {
            if(implementation.contractid != null){
                indice = indice + 1;
                var colorEstatusE = '';
                    if(translateImplementacionEstatus(implementation.statusimplementation) != 'Terminado') {
                        colorEstatusE = `<span class="botonStyleColorR formatoTextValor">${translateImplementacionEstatus(implementation.statusimplementation)}</span>`;
                    } else {
                        colorEstatusE = `<span class="botonStyleColorG formatoTextValor">${translateImplementacionEstatus(implementation.statusimplementation)}</span>`;
                    }

                $('#ejecucion').append(`
                <div id="_ejecucion">
                    <button class="btn btn-link colorCard botonMovil" data-toggle="collapse" data-target="#collapseimplementation${indice}" aria-expanded="true" aria-controls="collapseimplementation${indice}">
                        Ejecución <span class="ocultaIndice">${indice}</span> <span id="_idcontractTitulo">${implementation.contractid}</span>
                    </button>
                    <br><br>
                    <div class="card card_sinBorde">
                    <div id="collapseimplementation${indice}" class="collapse" aria-labelledby="headingOne" data-parent="#_ejecucion">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-2 col-md-12 ubicaBotonEstatus tablet mobile">
                                    <div id="_statuscontract">${colorEstatusE}</div>
                                </div>
                                <div class="col-lg-10">
                                    <p id="_titlecontract" class="styleName formatoTextTitulo">${implementation.title}</p>
                                    <div class="col-lg-4 col-md-6 styleID formatoTextValor">
                                        <span>ID: </span><span id="_idcontract">${implementation.contractid}</span>
                                    </div>
                                </div>
                                <div class="col-lg-2 col-md-12 ubicaBotonEstatus no-mobile">
                                    <div id="_statuscontract">${colorEstatusE}</div>
                                </div>
                            </div>
                            <hr>
                            <br>
                            <div id="transactionTRPArrow">
                                <div onclick="flechitaBoton(transaction_trp_${indice})" id="transaction_trp_${indice}" class="flechisabajo">
                                    <button class="collapsed btn colorBoton botonMovil" role="button" data-toggle="collapse" data-parent="#transactionTRPArrow" href="#collapseEjecucion${indice}" aria-expanded="true" aria-controls="collapseEjecucion${indice}">
                                        Transacciones relacionadas con los pagos (<span id="_conteoTransacciones">${implementation.totaltransactions}</span>) <div class="flechita"><a></a></div>
                                    </button>
                                </div>
                                <div class="hscroll">
                                    <div class="space collapse" id="collapseEjecucion${indice}">
                                        <table class="table tableMobile styleTab tituloMargen">
                                            <thead>
                                                <tr class="colorandfont">
                                                    <th class="col-2 widthitems_12"><img class="tam_list_icono" src="/images/iconos/economiaBlanco.svg"> Beneficiario</th>
                                                    <th class="col-2 widthitems_12"><img class="tam_list_icono" src="/images/iconos/descripcionBlanco.svg"> Identificador del beneficiario</th>
                                                    <th class="col-2 widthitems_10"><img class="tam_list_icono" src="/images/iconos/montoBlanco.svg"> Monto</th>
                                                    <th class="col-2 widthitems_8"><img class="tam_list_icono" src="/images/iconos/periodoBlanco.svg"> Fecha de transacción</th>
                                                    <th class="col-2 widthitems_12"><img class="tam_list_icono" src="/images/iconos/nombreorazonsocialBlanco.svg"> Pagador</th>
                                                    <th class="col-2 widthitems_12"><img class="tam_list_icono" src="/images/iconos/nombreorazonsocialBlanco.svg"> Identificador del pagador</th>
                                                </tr>
                                            </thead>
                                        </table>
                                        <div id="transacciones_${implementation.id}" class="hscroll"></div>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <br>
                            <div id="transactionDocumentoArrow">
                                <div onclick="flechitaBoton(transaction_documento_${indice})" id="transaction_documento_${indice}" class="flechisabajo">
                                    <button class="collapsed btn colorBoton botonMovil" role="button" data-toggle="collapse" data-parent="#transactionDocumentoArrow" href="#collapseDOCImplementation${indice}" aria-expanded="true" aria-controls="collapseDOCImplementation${indice}">
                                        Documentos (<span id="_conteoDocumentosImplementation">${implementation.totaldocumentosimplementation}</span>) <div class="flechita"><a></a></div>
                                    </button>
                                </div>
                                <div class="space collapse" id="collapseDOCImplementation${indice}">
                                    <div id="documentosImplementation_${implementation.id}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>`);
            
                if(implementation.transacciones.length > 0) {
                    implementation.transacciones.forEach(transaccion => {
                        let id = '#transacciones_' + transaccion.idtransaction;
                        $(id).append(`
                            <table class="table tableMobile styleTab">
                                <tbody class="interlinea">
                                    <tr>
                                        <td class="col-2 widthitems_12">${transaccion.payee_name}</td>
                                        <td class="col-2 widthitems_12">${transaccion.payee_id}</td>
                                        <td class="col-2 widthitems_10">$ ${separarCifras(transaccion.value_amount)} ${transaccion.value_currency}</td>
                                        <td class="col-2 widthitems_8">${transaccion.implementation_date === null ? '--/--/----': moment(transaccion.implementation_date).format('DD/MM/yyyy')}</td></td>
                                        <td class="col-2 widthitems_12">${transaccion.payer_name}</td>
                                        <td class="col-2 widthitems_12">${transaccion.payer_id}</td>
                                    </tr>
                                </tbody>
                            </table>
                        `);
                    })
                } else {
                    let id = '#transacciones_' + implementation.id;
                    $(id).append(`
                        <div>
                            <a class="paddingCuadros sizeFontGeneral">Sin transacciones registradas</a>
                        </div>
                    `);
                }

                if(implementation.documentos.length > 0) {
                    implementation.documentos.forEach(documento => {
                        let id = '#documentosImplementation_' + documento.documentid;
                        $(id).append(`
                            <div class="row sizeFontGeneral">
                                <div class="col-lg-6 col-md-12">
                                    <div class="row">
                                        <div class="col-lg-1 col-md-1"><img class="iconoSize" src="/images/iconos/documentacion.svg"></div>
                                        <div class="col-lg-11 col-md-11"><strong>${documento.title}</strong></div>
                                    </div>
                                    <div class="col-12 pad espacioCol">${documento.description}</div>
                                </div>
                                <div class="col-lg-2 col-md-6 maxFormato espacioCol">
                                    <img class="tam_list_icono sizeIcono" src="/images/iconos/versionRojo.svg"> <strong>Formato</strong><br> ${documento.format}
                                </div>
                                <div class="col-lg-2 col-md-6 maxFecha espacioCol">
                                    <img class="tam_list_icono sizeIcono" src="/images/iconos/periodoRojo.svg"> <strong>Fecha de publicación</strong><br> ${documento.date_published === null ? '--/--/----': moment(documento.date_published).format('DD/MM/yyyy')}
                                </div>
                                <div class="col-lg-2 col-md-6 maxFecha">
                                    <img class="tam_list_icono sizeIcono" src="/images/iconos/periodoRojo.svg"> <strong>Fecha de modificación</strong><br> ${documento.date_modified === null ? '--/--/----': moment(documento.date_modified).format('DD/MM/yyyy')}
                                </div>
                                <div class="col-lg-2 col-md-6 ubicaBoton maxBoton">
                                    <a href="${documento.url}" target="_blank"><button type="button" class="btn btn-lg sizeFontGeneral">Descargar</button></a>
                                </div>
                            </div>
                            <br>
                            <hr class="linea">
                        `);
                    })
                } else {
                    let id = '#documentosImplementation_' + implementation.id;
                    $(id).append(`
                        <div>
                            <a class="paddingCuadros sizeFontGeneral">Sin documentos registrados</a>
                        </div>
                    `);
                }
            
            } else {
                $('#ejecucion').append(`
                <div id="_ejecucion" class="sinRegistro formatoTextValor">
                    <a class="paddingCuadros sizeFontGeneral">Sin registro de implementaciones</a>
                </div>`);
            }
        });
    }
}

function agrupacionTransacciones(transacciones) {
    // console.log('faaaaaaaaaaaf' + JSON.stringify(transacciones));
    perfilCA.data[15].forEach(implementacion => {
        let arrayTransacciones = [];
        transacciones.forEach(transaccion => { 
            if(transaccion.idtransaction == implementacion.id){
                arrayTransacciones.push(transaccion);
            }
        });
        implementacion.transacciones = arrayTransacciones;
    });
    // console.log('oooooooooooooooooo' + JSON.stringify(perfilCA.data[15]));
}

function agrupacionDocTransacciones(documentos) {
    perfilCA.data[15].forEach(implementacion => {
        let arrayDocumentos = [];
        documentos.forEach(documento => { 
            if(documento.documentid == implementacion.id){
                arrayDocumentos.push(documento);
            }
        });
        implementacion.documentos = arrayDocumentos;
    });
}

function limpiarCifras(){
    $('#_cifra_1').text('');
    $('#_cifra_2').text('');
    $('#_cifra_3').text('');
}

function paginarProyectos(arreglo,tamanio){
    // console.log(`PAGINAR ${arreglo.length}`)
    var implementer = arreglo[21].implementer;
    var entity = arreglo[22].entity;
    var url = arreglo[23].url;
    var port = arreglo[24].port;
    var prefixOC4ID = arreglo[25].prefixOC4ID;
    var prefixOCID = arreglo[26].prefixOCID;

    var arrayProyecto = new Array;
    arrayProyecto.push(arreglo[13]);

    if(arrayProyecto.length > 0){
        arrayProyecto.forEach(unidad => {
            unidad.url = url;
            unidad.port = port;
            unidad.entity = entity;
            unidad.implementer = implementer;
            unidad.prefixOC4ID = prefixOC4ID;
            unidad.prefixOCID = prefixOCID;
            arrayPaginadoProyectos.push(unidad);
            // console.log(`+++ arrayPaginadoContratista ${JSON.stringify(arrayPaginadoContratista)}`)
        });
    }
    // console.log(`tamaño registros ${arrayPaginado.length}`)
    pageContProyectos = Math.ceil(arrayPaginadoProyectos.length/tamanio);
    showListasProyectos(arrayPaginadoProyectos,pageNumberProyectos,tamanio,pageContProyectos); 
    $('#page_1Proyectos').addClass('active');
}

function flechitaBoton(identificador){
    if($(identificador).hasClass("flechisabajo")) {
        $(identificador).removeClass("flechisabajo");         
        $(identificador).addClass("flechisarriba");
    } else {
        $(identificador).removeClass("flechisarriba");         
        $(identificador).addClass("flechisabajo");
    }
}