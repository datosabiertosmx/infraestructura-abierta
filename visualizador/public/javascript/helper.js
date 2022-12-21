var ejerciciosUnicos = new Array();

const loadData = async (endpoint) => {
    // console.log(`ENDPOINT ${endpoint}`)
    try {
        await asyncForEach(sites,async site => {
            const res = await fetch(`${site.url}:${site.port}${endpoint}`);
            const info = await res.json();
            info.data.push({implementer:site.implementer});
            info.data.push({entity:site.entity});    
            info.data.push({url:site.url});
            info.data.push({port:site.port});
            info.data.push({prefixOC4ID:site.prefixOC4ID});
            info.data.push({prefixOCID:site.prefixOCID});
            arrayInfoInstances.push(info);
            // console.log(`info ${JSON.stringify(info)}`)
        });
        return arrayInfoInstances;
    } catch (error) {
        console.error(`ERROR loadData - ${error}`);
    }
};

const loadDataDetails = async (prefixOC4ID,prefixOCID,endpoint) => {
    // console.log(`loadDataDetails prefixOC4ID - ${prefixOC4ID} - prefixOCID - ${prefixOCID} endpoint - ${endpoint}`);
    var banderaProyecto = false;
    var instanciaSeleccionada;
    if(prefixOC4ID != null){
        // quiere buscar proyectos
        banderaProyecto = true;
    }
    sites.forEach(sitio => {
        if(banderaProyecto){
            if(sitio.prefixOC4ID == prefixOC4ID){
                instanciaSeleccionada = sitio;
            }
        }else{
            if(sitio.prefixOCID == prefixOCID){
                instanciaSeleccionada = sitio;
            }
        }
    });

    try {
        const res = await fetch(`${instanciaSeleccionada.url}:${instanciaSeleccionada.port}${endpoint}`);
        const info = await res.json();
        info.data.push({implementer:instanciaSeleccionada.implementer});
        info.data.push({entity:instanciaSeleccionada.entity});    
        info.data.push({url:instanciaSeleccionada.url});
        info.data.push({port:instanciaSeleccionada.port});
        info.data.push({prefixOC4ID:instanciaSeleccionada.prefixOC4ID});
        info.data.push({prefixOCID:instanciaSeleccionada.prefixOCID});
        return info;
    } catch (error) {
        console.error(`ERROR loadDataDetails - ${error}`);
    }
};

function llenaYearProjects(enlace,puerto) {
    var uri = `${enlace}`;
    var port = `${puerto}`;
    var endPointFiscalYear = '/edca/fiscalYears';
    var yearsProjects = [];
    $.ajax({
        url: `${uri}:${port}${endPointFiscalYear}`,
        type: 'GET',
        success: function(data){
            data.fiscalYears.forEach(element => {
                yearsProjects.push(element.year)
                cleanYears(yearsProjects);
            });
        },
        error: function(data) {
            $('#yearFilter').append('<option value=""> Not Found </option>');
        }
    });

    function cleanYears(yearsProjects){
        yearsProjects.forEach(year => {
            if(!ejerciciosUnicos.includes(year)){
                ejerciciosUnicos.push(year);
                // console.log('year', year)
                // console.log('ejerciciosUnicos', ejerciciosUnicos)
                $('#yearFilter').append(`<option> ${year}</option>`);
            }
        });
    }
}

// function ordenarSelect1(id_componente){  ----------------------------------
//     console.log('id_componente1111', id_componente)
//     const numeros = ejerciciosUnicos;

//     numeros.sort(function(a, b){return a - b});
//     console.log('numeros', numeros)
// }

function translateMedios(submissionmethod){
    // console.log(`translateCriterios`)
    var submissionmethodESP = "";
        switch (submissionmethod) {
            case 'electronicSubmission':
                submissionmethodESP = `Electrónica`;
                break;
            case 'written':
                submissionmethodESP = `Mixto`;
                break;
            case 'inPerson':
                submissionmethodESP = `Presencial`;
                break;
            case 'electronicAuction':
                submissionmethodESP = `Subasta eletrónica`;
                break;
        }
        return submissionmethodESP;
    }

function translateCriterios(awardcriteria){
    // console.log(`translateCriterios`)
    var awardcriteriaESP = "";
        switch (awardcriteria) {
            case 'priceOnly':
                awardcriteriaESP = `Binario`;
                break;
            case 'bestValueToGovernment':
                awardcriteriaESP = `Costo beneficio`;
                break;
            case 'ratedCriteria':
                awardcriteriaESP = `Puntos y porcentajes`;
                break;
            case 'singleBidOnly':
                awardcriteriaESP = `Única oferta`;
                break;
        }
        return awardcriteriaESP;
    }

function translateSolicitudes(hasenquiries){
    // console.log(`translateSolicitudes`)
    var hasenquiriesESP = "";
        switch (hasenquiries) {
            case true:
                hasenquiriesESP = `Si`;
                break;
            case false:
                hasenquiriesESP = `No`;
                break;
        }
        return hasenquiriesESP;
    }

function translateCategoria(mainprocurementcategory){
    // console.log(`translateCategoria`)
    var mainprocurementcategoryESP = "";
        switch (mainprocurementcategory) {
            case 'goods':
                mainprocurementcategoryESP = `Bienes`;
                break;
            case 'services':
                mainprocurementcategoryESP = `Servicios`;
                break;
            case 'works':
                mainprocurementcategoryESP = `Obra pública`;
                break;
        }
        return mainprocurementcategoryESP;
    }

function translateMetodo(procurementmethod){
    // console.log(`translateMetodo`)
    var procurementmethodESP = "";
        switch (procurementmethod) {
            case 'direct':
                procurementmethodESP = `Directa`;
                break;
            case 'open':
                procurementmethodESP = `Abierta`;
                break;
            case 'selective':
                procurementmethodESP = `Selectiva`;
                break;
        }
        return procurementmethodESP;
    }

function translateSectorEsp(sector){
    var sectorEsp = "";
        switch (sector) {
            case 'waterAndWaste':
                sectorEsp = `Agua`;
                break;
            case 'communications':
                sectorEsp = `Comunicaciones`;
                break;
            case 'cultureSportsAndRecreation':
                sectorEsp = `Cultura`;
                break;
            case 'sports':
                sectorEsp = `Deportes`;
                break;
            case 'economy':
                sectorEsp = `Economía`;
                break;
            case 'education':
                sectorEsp = `Educación`;
                break;
            case 'energy':
                sectorEsp = `Energía`;
                break;
            case 'governance':
                sectorEsp = `Gobernancia`;
                break;
            case 'socialHousing':
                sectorEsp = `Habitacional`;
                break;
            case 'recreation':
                sectorEsp = `Recreación`;
                break;
            case 'waste':
                sectorEsp = `Residuos`;
                break;
            case 'health':
                sectorEsp = `Salud`;
                break;
            case 'transport':
                sectorEsp = `Transporte`;
                break;
            case 'transport.air':
                sectorEsp = `Transporte aéreo`;
                break;
            case 'transport.road':
                sectorEsp = `Transporte carretero`;
                break;
            case 'transport.rail':
                sectorEsp = `Transporte ferroviario`;
                break;
            case 'transport.water':
                sectorEsp = `Transporte marítimo`;
                break;
            case 'transport.urban':
                sectorEsp = `Transporte urbano`;
                break;
            case 'security':
                sectorEsp = `Seguridad`;
                break;
            }
        return sectorEsp;
    }

function translateSectorEng(sector){
    var sectorEng = "";
        switch (sector) {
            case 'Agua':
                sectorEng = `waterAndWaste`;
                break;
            case 'Comunicaciones':
                sectorEng = `communications`;
                break;
            case 'Cultura':
                sectorEng = `cultureSportsAndRecreation`;
                break;
            case 'Deportes':
                sectorEng = `sports`;
                break;
            case 'Economía':
                sectorEng = `economy`;
                break;
            case 'Educación':
                sectorEng = `education`;
                break;
            case 'Energía':
                sectorEng = `energy`;
                break;
            case 'Gobernancia':
                sectorEng = `governance`;
                break;
            case 'Habitacional':
                sectorEng = `socialHousing`;
                break;
            case 'Recreación':
                sectorEng = `recreation`;
                break;
            case 'Residuos':
                sectorEng = `waste`;
                break;
            case 'Salud':
                sectorEng = `health`;
                break;
            case 'Transporte':
                sectorEng = `transport`;
                break;
            case 'Transporte aéreo':
                sectorEng = `transport.air`;
                break;
            case 'Transporte carretero':
                sectorEng = `transport.road`;
                break;
            case 'Transporte ferroviario':
                sectorEng = `transport.rail`;
                break;
            case 'Transporte marítimo':
                sectorEng = `transport.water`;
                break;
            case 'Transporte urbano':
                sectorEng = `transport.urban`;
                break;
            case 'Seguridad':
                sectorEng = `security`;
                break;
            }
        return sectorEng;
    }

function translateSector(arraySector){
    // console.log(`translateSector`)
    var sectoresESP = [];
    arraySector.forEach(sector => {
        switch (sector) {
            case 'waterAndWaste':
                sectoresESP.push('Agua')
                break;
            case 'communications':
                sectoresESP.push('Comunicaciones')
                break;
            case 'cultureSportsAndRecreation':
                sectoresESP.push('Cultura')
                break;
            case 'sports':
                sectoresESP.push('Deportes')
                break;
            case 'economy':
                sectoresESP.push('Economía')
                break;
            case 'education':
                sectoresESP.push('Educación')
                break;
            case 'energy':
                sectoresESP.push('Energía')
                break;
            case 'governance':
                sectoresESP.push('Gobernancia')
                break;
            case 'socialHousing':
                sectoresESP.push('Habitacional')
                break;
            case 'recreation':
                sectoresESP.push('Recreación')
                break;
            case 'waste':
                sectoresESP.push('Residuos')
                break;
            case 'health':
                sectoresESP.push('Salud')
                break;
            case 'transport':
                sectoresESP.push('Transporte')
                break;
            case 'transport.air':
                sectoresESP.push('Transporte aéreo')
                break;
            case 'transport.road':
                sectoresESP.push('Transporte carretero')
                break;
            case 'transport.rail':
                sectoresESP.push('Transporte ferroviario')
                break;
            case 'transport.water':
                sectoresESP.push('Transporte marítimo')
                break;
            case 'transport.urban':
                sectoresESP.push('Transporte urbano')
                break;
            case 'security':
                sectoresESP.push('Seguridad')
                break;
            default:
                break;
        }
    });
    return sectoresESP;
}

function translateSectorToImage(arraySector,tam){
    // console.log(`translateSectorToImage`)
    var sectoresImg = new Array();
    arraySector.forEach(sector => {
        switch (sector) {
            case 'waterAndWaste':
                sectoresImg.push(`<img src="/images/iconos/AguaRojo.svg" width="${tam}px" title="Agua">`) //Agua
                break;
            case 'communications':
                sectoresImg.push(`<img src="/images/iconos/ComunicacionesRojo.svg" width="${tam}px" title="Comunicaciones">`) //Comunicaciones
                break;
            case 'cultureSportsAndRecreation':
                sectoresImg.push(`<img src="/images/iconos/CulturaRojo.svg" width="${tam}px" title="Cultura">`) //Cultura
                break;
            case 'sports':
                sectoresImg.push(`<img src="/images/iconos/DeporteRojo.svg" width="${tam}px" title="Deportes">`) //Deportes
                break;
            case 'economy':
                sectoresImg.push(`<img src="/images/iconos/EconomiaRojo.svg" width="${tam}px" title="Economía">`) //Economía
                break;
            case 'education':
                sectoresImg.push(`<img src="/images/iconos/EducacionRojo.svg" width="${tam}px" title="Educación">`) //Educación
                break;
            case 'energy':
                sectoresImg.push(`<img src="/images/iconos/EnergiaRojo.svg" width="${tam}px" title="Energía">`) //Energía
                break;
            case 'governance':
                sectoresImg.push(`<img src="/images/iconos/GobernanciaRojo.svg" width="${tam}px" title="Gobernanza">`) //Gobernanza
                break;
            case 'socialHousing':
                sectoresImg.push(`<img src="/images/iconos/HabitacionalRojo.svg" width="${tam}px" title="Habitacional">`) //Habitacional
                break;
            case 'recreation':
                sectoresImg.push(`<img src="/images/iconos/RecreacionRojo.svg" width="${tam}px" title="Recreación">`) //Recreación
                break;
            case 'waste':
                sectoresImg.push(`<img src="/images/iconos/ResiduosRojo.svg" width="${tam}px" title="Residuos">`) //Residuos
                break;
            case 'health':
                sectoresImg.push(`<img src="/images/iconos/SaludRojo.svg" width="${tam}px" title="Salud">`) //Salud
                break;
            case 'transport':
                sectoresImg.push(`<img src="/images/iconos/TransportesRojo.svg" width="${tam}px" title="Transporte">`) //Transporte
                break;
            case 'transport.air':
                sectoresImg.push(`<img src="/images/iconos/TransporteAereoRojo.svg" width="${tam}px" title="Transporte aéreo">`) //Transporte aéreo
                break;
            case 'transport.road':
                sectoresImg.push(`<img src="/images/iconos/TransporteTerrestreRojo.svg" width="${tam}px" title="Transporte carretero">`) //Transporte carretero
                break;
            case 'transport.rail':
                sectoresImg.push(`<img src="/images/iconos/TransporteFerroviarioRojo.svg" width="${tam}px" title="Transporte ferroviario">`) //Transporte ferroviario
                break;
            case 'transport.water':
                sectoresImg.push(`<img src="/images/iconos/TransporteMaritimoRojo.svg" width="${tam}px" title="Transporte marítimo">`) //Transporte marítimo
                break;
            case 'transport.urban':
                sectoresImg.push(`<img src="/images/iconos/TransporteUrbanoRojo.svg" width="${tam}px" title="Transporte urbano">`) //Transporte urbano
                break;
            case 'security':
                sectoresImg.push(`<img src="/images/iconos/SeguridadRojo.svg" width="${tam}px" title="Seguridad">`) //Seguridad
                break;
        
            default:
                break;
        }
    });
    return sectoresImg;
}

function translateSectorToImageBanner(arraySector,tam){
    // console.log(`translateSectorToImageBanner`)
    var sectoresImg = new Array();
    arraySector.forEach(sector => {
        switch (sector) {
            case 'waterAndWaste':
                sectoresImg.push(`<img src="/images/iconos/AguaBlanco.svg" width="${tam}px" title="Agua"> `) //Agua
                break;
            case 'communications':
                sectoresImg.push(`<img src="/images/iconos/ComunicacionesBlanco.svg" width="${tam}px" title="Comunicaciones"> `) //Comunicaciones
                break;
            case 'cultureSportsAndRecreation':
                sectoresImg.push(`<img src="/images/iconos/CulturaBlanco.svg" width="${tam}px" title="Cultura"> `) //Cultura
                break;
            case 'sports':
                sectoresImg.push(`<img src="/images/iconos/DeporteBlanco.svg" width="${tam}px" title="Deportes"> `) //Deportes
                break;
            case 'economy':
                sectoresImg.push(`<img src="/images/iconos/EconomiaBlanco.svg" width="${tam}px" title="Economía"> `) //Economía
                break;
            case 'education':
                sectoresImg.push(`<img src="/images/iconos/EducacionBlanco.svg" width="${tam}px" title="Educación"> `) //Educación
                break;
            case 'energy':
                sectoresImg.push(`<img src="/images/iconos/EnergiaBlanco.svg" width="${tam}px" title="Energía"> `) //Energía
                break;
            case 'governance':
                sectoresImg.push(`<img src="/images/iconos/GobernanciaBlanco.svg" width="${tam}px" title="Gobernanza"> `) //Gobernanza
                break;
            case 'socialHousing':
                sectoresImg.push(`<img src="/images/iconos/HabitacionalBlanco.svg" width="${tam}px" title="Habitacional"> `) //Habitacional
                break;
            case 'recreation':
                sectoresImg.push(`<img src="/images/iconos/RecreacionBlanco.svg" width="${tam}px" title="Recreación"> `) //Recreación
                break;
            case 'waste':
                sectoresImg.push(`<img src="/images/iconos/ResiduosBlanco.svg" width="${tam}px" title="Residuos"> `) //Residuos
                break;
            case 'health':
                sectoresImg.push(`<img src="/images/iconos/SaludBlanco.svg" width="${tam}px" title="Salud"> `) //Salud
                break;
            case 'transport':
                sectoresImg.push(`<img src="/images/iconos/TransportesBlanco.svg" width="${tam}px" title="Transporte"> `) //Transporte
                break;
            case 'transport.air':
                sectoresImg.push(`<img src="/images/iconos/TransporteAereoBlanco.svg" width="${tam}px" title="Transporte aéreo"> `) //Transporte aéreo
                break;
            case 'transport.road':
                sectoresImg.push(`<img src="/images/iconos/TransporteTerrestreBlanco.svg" width="${tam}px" title="Transporte carretero"> `) //Transporte carretero
                break;
            case 'transport.rail':
                sectoresImg.push(`<img src="/images/iconos/TransporteFerroviarioBlanco.svg" width="${tam}px" title="Transporte ferroviario"> `) //Transporte ferroviario
                break;
            case 'transport.water':
                sectoresImg.push(`<img src="/images/iconos/TransporteMaritimoBlanco.svg" width="${tam}px" title="Transporte marítimo"> `) //Transporte marítimo
                break;
            case 'transport.urban':
                sectoresImg.push(`<img src="/images/iconos/TransporteUrbanoBlanco.svg" width="${tam}px" title="Transporte urbano"> `) //Transporte urbano
                break;
            case 'security':
                sectoresImg.push(`<img src="/images/iconos/SeguridadBlanco.svg" width="${tam}px" title="Seguridad"> `) //Seguridad
                break;
        
            default:
                break;
        }
    });
    return sectoresImg;
}

function translateProjectStatusToImage(status,tam){
    var ruta = "";
    // console.log(`translateProjectStatusToImage`)
        switch (status) {
            case 'Terminado':
                ruta = `<img src="/images/iconos/TerminadoRojo.svg" width="${tam}px" title="Terminado">`;
                break;
            case 'Terminación':
                ruta = `<img src="/images/iconos/TerminadoRojo.svg" width="${tam}px" title="Terminación">`;
                break;
            case 'Identificación':
                ruta = `<img src="/images/iconos/IdentificacionRojo.svg" width="${tam}px" title="Identificación">`;
                break;
            case 'Implementación':
                ruta = `<img src="/images/iconos/ImplementacionRojo.svg" width="${tam}px" title="Implementación">`;
                break;
            case 'Cancelado':
                ruta = `<img src="/images/iconos/CanceladoRojo.svg" width="${tam}px" title="Cancelado">`;
                break;
            case 'Preparación':
                ruta = `<img src="/images/iconos/PreparationRojo.svg" width="${tam}px" title="Preparación">`;
                break;
        
            default:
                break;
        }
    return ruta;
}

function translateLicitacionEstatus(status){
    // console.log(`translateLicitacionEstatus`)
    var estatusESP = "";
        switch (status) {
            case 'planning':
            case 'planned':
            case 'active':
                estatusESP = `En licitación`;
                break;
            case 'cancelled':
            case 'unsuccessful':
            case 'withdrawn':
                estatusESP = `Fallido`;
                break;
            case 'complete':
                estatusESP = `Licitada`;
                break;
        }
        return estatusESP;
    }

function translateAdjudicacionEstatus(status){
    // console.log(`translateAdjudicacionEstatus`)
    var estatusESP = "";
        switch (status) {
            case 'pending':
            case 'active':
                estatusESP = `En adjudicación`;
                break;
            case 'cancelled':
            case 'unsuccessful':
                estatusESP = `Fallido`;
                break;
        }
        return estatusESP;
    }

function translateContratacionEstatus(status){
    // console.log(`translateContratacionEstatus`)
    var estatusESP = "";
        switch (status) {
            case 'pending':
            case 'active':
                estatusESP = `En contratación`;
                break;
            case 'terminated':
                estatusESP = `Terminado`;
                break;
            case 'cancelled':
                estatusESP = `Fallido`;
                break;
        }
        return estatusESP;
    }

function translateImplementacionEstatus(status){
    // console.log(`translateContratacionEstatus`)
    var estatusESP = "";
        switch (status) {
            case 'planning':
            case 'ongoing':
                estatusESP = `En ejecución`;
                break;
            case 'concluded':
                estatusESP = `Terminado`;
                break;
        }
        return estatusESP;
    }

function translateHitosTipo(type){
    var tipoESP = ""
        switch (type) {
            case 'approval':
                tipoESP = `Hitos de aprobación`;
                break;
            case 'assessment':
                tipoESP = `Hitos de evaluación`;
                break;
            case 'delivery':
                tipoESP = `Hitos de entrega`;
                break;
            case 'engagement':
                tipoESP = `Hitos de involucramiento`;
                break;
            case 'financing':
                tipoESP = `Hitos de financiamiento`;
                break;
            case 'preProcurement':
                tipoESP = `Hitos previos a la contratación`;
                break;
            case 'publicNotices':
                tipoESP = `Avisos a la población`;
                break;
            case 'reporting':
                tipoESP = `Hitos de reporte`;
                break;
        }
        return tipoESP;
}
function translateHitosEstatus(status){
    // console.log(`translateHitosEstatus`)
    var estatusESP = "";
        switch (status) {
            case 'met':
                estatusESP = `Cumplido`;
                break;
            case 'notMet':
                estatusESP = `No cumplido`;
                break;
            case 'partiallyMet':
                estatusESP = `Parcialmente cumplido`;
                break;
            case 'scheduled':
                estatusESP = `Programado`;
                break;
        }
        return estatusESP;
    }

function translateProyectoEstatus(status){
    // console.log(`translateProyectoEstatus`)
    var estatusESP = "";
        switch (status) {
            case 'completion':
                estatusESP = `Terminación`;
                break;
            case 'cancelled':
                estatusESP = `Cancelado`;
                break;
            case 'implementation':
                estatusESP = `Implementación`;
                break;
            case 'identification':
                estatusESP = `Identificación`;
                break;
            case 'completed':
                estatusESP = `Terminado`;
                break;
            case 'preparation':
                estatusESP = `Preparación`;
                break;
        }
        return estatusESP;
    }

function translateProyectoEstatusIcono(status,tam){
    // console.log(`translateProyectoEstatusIcono`)
    var estatusIcono = "";
        switch (status) {
            case 'completion':
                estatusIcono = `<img src="/images/iconos/TerminadoRojo.svg" width="${tam}px">`;
                break;
            case 'cancelled':
                estatusIcono = `<img src="/images/iconos/CanceladoRojo.svg" width="${tam}px">`;
                break;
            case 'implementation':
                estatusIcono = `<img src="/images/iconos/ImplementacionRojo.svg" width="${tam}px">`;
                break;
            case 'identification':
                estatusIcono = `<img src="/images/iconos/IdentificacionRojo.svg" width="${tam}px">`;
                break;
            case 'completed':
                estatusIcono = `<img src="/images/iconos/TerminadoRojo.svg" width="${tam}px">`;
                break;
            case 'preparation':
                estatusIcono = `<img src="/images/iconos/PreparationRojo.svg" width="${tam}px">`;
                break;
        }
        return estatusIcono;
    }

function translateTypeToImage(type,tam){
    var ruta = "";
    // console.log(`translateTypeToImage ${type}`)
        switch (type) {
            case 'Construcción':
                ruta = `<img src="/images/iconos/ConstruccionRojo.svg" width="${tam}px" title="Construcción">`;
                break;
            case 'Rehabilitación':
                ruta = `<img src="/images/iconos/RehabilitacionRojo.svg" width="${tam}px" title="Rehabilitación">`;
                break;
            case 'Reemplazo':
                ruta = `<img src="/images/iconos/ReemplazoRojo.svg" width="${tam}px" title="Reemplazo">`;
                break;
            case 'Expansión':
                ruta = `<img src="/images/iconos/ExpansionRojo.svg" width="${tam}px" title="Expansión">`;
                break;
        
            default:
                break;
        }
    return ruta;
}

function ordenarSelect(id_componente){
    var selectToSort = jQuery('#' + id_componente);
    var optionActual = selectToSort.val();
    selectToSort.html(selectToSort.children('option').sort(function (a, b) {
        return a.text === b.text ? 0 : a.text < b.text ? -1 : 1;
    })).val(optionActual);
}

function redondearCifras(cifra){
    // var test = cifra.toString().split('.');
    // console.log('/* cifra */ ' + cifra);
    var caracteres = Array.from(cifra.toString());
    // console.log('/* caracteres */ ' + caracteres);
    if(caracteres.length > 3 && caracteres.length < 7){
        var str = cifra.toString().split(".");
        str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return str.join(".");    
    }
    if(caracteres.length > 6){
        var str = cifra.toString().split(".");
        str[0] = str[0].replace(/\B(?=(\d{6})+(?!\d))/g, ".");
        str[0] = str[0].replace(/\B(?=(\d{5})+(?!\d))/g, " M");
        return str[0].substring(0,str[0].indexOf("M")+1);
    }
    return cifra;
}

function separarCifras(cifra){
    var caracteres = Array.from(cifra.toString());
    if(caracteres.length > 3 ){
        var str = cifra.toString().split(".");
        str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return str.join(".");    
    }
    return cifra;
}

function closeTooltip(){
    $('#buubleContent').hide();
}

var delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);   
    };
})();

// Puntos suspensivos limitados a 120 caracteres para las secciones Perfiles
function ellipsis_box(elemento, max_chars){
    limite_text = $(elemento).text();
    if (limite_text.length > max_chars)
        {
            limite = limite_text.substr(0, max_chars)+" ...";
            $(elemento).text(limite);
        }
    }
$(function(){ellipsis_box(".limitado", 120);});

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

function downloadContracting(url,port,cp_id){
    var endPointGetContractingProcess = '/edca/cp';
    $.ajax({
        url: `${url}:${port}${endPointGetContractingProcess}/${cp_id}`,
        type: 'GET',
        success: function(data){ 
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent((JSON.stringify(data,null,4)));
            var dlAnchorElem = document.getElementById('downloadAnchorElem');
            dlAnchorElem.setAttribute("href",dataStr);
            dlAnchorElem.setAttribute("download", `${cp_id}.json`);
            dlAnchorElem.click();
        },
        error: function(data) {
            alert(`Proceso de contratación no encontrado.`)
        }
    });
}

function downloadContrataciones(url,port,rfc,tipo){
    var endPointGetContractingProcess = '/edca/cp';
    var endPointGetCpIdsforRFC = '/edca/cpjson';
    var arrayReleasesJsons = [];

    $.ajax({
        url: `${url}:${port}${endPointGetCpIdsforRFC}/${rfc}`,
        type: 'GET',
        success: function(data){
            data.data.forEach(contrataciones => {
                contrataciones.forEach(contratacion => {
                    $.ajax({
                        url: `${url}:${port}${endPointGetContractingProcess}/${contratacion.cp_id}`,
                        type: 'GET',
                        async: false,
                        success: function(data){
                            arrayReleasesJsons.push(data);
                            if (parseFloat(data)){
                                return false;
                            } else { 
                                return true; 
                            }
                        },
                        error: function(data) {
                            alert(`Proceso de contratación no encontrado.`)
                        }
                    });
                });
            });
            downloadZipJSONFile(arrayReleasesJsons, tipo);
        },
        error: function(data) {
            alert(`Proceso de contratación no encontrado.`)
        }
    });
}

function downloadZipJSONFile(arrayFilesJSON, tipo) {
    console.log('downloadZipJSONFile', arrayFilesJSON)
    if (arrayFilesJSON.length !== 0) {
        var zip = new JSZip();
        var jsons = zip.folder("jsons");
        arrayFilesJSON.forEach(file => {
            if( tipo === 'contratacion'){
                var nombre = file.arrayReleasePackage[0].releases[0].ocid + '.json';
            } else {
                var nombre = file.projects[0].id + '.json';
            }
            jsons.file(nombre, JSON.stringify(file,null,4));
        });
        zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, `${new Date().getTime()}_JSON.zip`);
            });
    }else{
        alert('No se encontraron registros.')
    }
}

async function  downloadProjectPackage(url,port,id){
    console.log(`downloadProjectPackage ${id} ${url} ${port}`)
    const res = await fetch(`${url}:${port}/edcapi/projectPackage/${id}`);
    const info = await res.json();// validar si viene vacio
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent((JSON.stringify(info,null,4)));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",dataStr);
    dlAnchorElem.setAttribute("download", url+":"+port+"ProjectPackage"+id+".json");
    dlAnchorElem.click();
}

///////////////////   LISTA DE CONTRATACIONES   //////////////////

function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
function nextPage(){
    pageNumber ++;
    var page_id = '#page_'+pageNumber;
    showListasContrataciones(arrayPaginado,pageNumber,pageSize,pageCont)
    $(`${page_id}`).addClass('active');
}
function previusPage(){
    pageNumber --;
    var page_id = '#page_'+pageNumber;
    showListasContrataciones(arrayPaginado,pageNumber,pageSize,pageCont)
    $(`${page_id}`).addClass('active');
}
function selectedPage(page_number){
    pageNumber = page_number;
    var page_id = '#page_'+page_number;
    showListasContrataciones(arrayPaginado,page_number,pageSize,pageCont)
    $(`${page_id}`).addClass('active');
}

function showListasContrataciones(elements,pageNumber,pageSize,pageCont){
    // console.log(JSON.stringify(`/*/* ELEMENTS SHOWLISTAS CONTRATACIONES` + JSON.stringify(elements)))
    $('#lista_contrataciones').empty();
    $('#paginas_lista_contrataciones').empty();
    pagination = paginate(elements,pageSize,pageNumber);
    
    pagination.forEach(contratacionElement => {
        // console.log('lllllllllll' + JSON.stringify(contratacionElement))
        if(contratacionElement.id > 0){
            var iconoEstatusContratacion = '';
            var status = '';
            if (contratacionElement.implementationstatus != null){
                // Colocar estatus correspondiente
                switch (contratacionElement.implementationstatus) {
                    case "concluded":
                        status = 'Terminado';
                        iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCompletadoRojo.svg">';
                        break;
                    case "terminated":
                        status = 'Terminado';
                        iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCompletadoRojo.svg">';
                        break;
                    case "ongoing":
                        status = 'En ejecución';
                        iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusEjecucionRojo.svg">';
                        break;
                    case "planning":
                        status = 'En ejecución';
                        iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusEjecucionRojo.svg">';
                        break; 
                    default:
                        break;
                }
            } else {
                if (contratacionElement.contractstatus != null){
                    // Colocar estatus correspondiente
                    switch (contratacionElement.contractstatus) {
                        case "cancelled":
                            status = 'Fallido';
                            iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCanceladoRojo.svg">';
                            break; 
                        case "terminated":
                            status = 'Terminado';
                            iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCompletadoRojo.svg">';
                            break;
                        case "active":
                            status = 'En contratación';
                            iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusAdjudicacionRojo.svg">';
                            break;
                        case "pending":
                            status = 'En contratación';
                            iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusAdjudicacionRojo.svg">';
                            break;
                        default:
                            break;
                    }
                } else {
                    if (contratacionElement.awardstatus != null){
                        // Colocar estatus correspondiente
                        switch (contratacionElement.awardstatus) {
                            case "unsuccessful":
                                status = 'Fallido';
                                iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCanceladoRojo.svg">';
                                break; 
                            case "cancelled":
                                status = 'Fallido';
                                iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCanceladoRojo.svg">';
                                break;
                            case "active":
                                status = 'En adjudicación';
                                iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusContratacionRojo.svg">';
                                break;
                            case "pending":
                                status = 'En adjudicación';
                                iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusContratacionRojo.svg">';
                                break;
                            default:
                                break;
                        }
                    } else {
                        if (contratacionElement.tenderstatus != null){
                            // Colocar estatus correspondiente
                            switch (contratacionElement.tenderstatus) {
                                case "withdrawn":
                                    status = 'Fallido';
                                    iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCanceladoRojo.svg">';
                                    break;
                                case "unsuccessful":
                                    status = 'Fallido';
                                    iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCanceladoRojo.svg">';
                                    break; 
                                case "cancelled":
                                    status = 'Fallido';
                                    iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCanceladoRojo.svg">';
                                    break;
                                case "active":
                                    status = 'En licitación';
                                    iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/planeacionRojo.svg">';
                                    break;
                                case "planned":
                                    status = 'En licitación';
                                    iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/planeacionRojo.svg">';
                                    break;
                                case "planning":
                                    status = 'En licitación';
                                    iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/planeacionRojo.svg">';
                                    break; 
                                case "complete":
                                    status = 'Licitado';
                                    iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/planeacionRojo.svg">';
                                    break; 
                                default:
                                    break;
                            }
                        } else {
                            if (contratacionElement.tenderstatus == null){
                            // vacio
                            status = 'No aplica';
                            iconoEstatusContratacion = '';
                            }
                        }
                    }
                }
            }
            var linkAP = '';
            if (contratacionElement.registroedcapi === false){
                linkAP = 'inactivalink';
            }

            $('#lista_contrataciones').append(`
            <div class="base_card">
                <div class="row alinea">
                    <div class="col-md-12 col-lg-9 px-0">
                        <p class="box_idtfch">
                            <span class="col-md-6 lista_movil_id box_id">Identificador: <strong>${contratacionElement.ocid}</strong></span>
                            <span class="col-md-4 col-sm-12"><img class="tam_list_icono" src="/images/iconos/hacexmesesRojo.svg" /> Fecha de publicación: ${moment(contratacionElement.updated_date).format('DD/MM/yyyy')}</span>
                        </p>
                        <div class="row alinea">
                            <div class="col-6 col-sm-6 col-md-6 col-lg-2 mb-4">
                                <div>
                                    <div class="box_icono">
                                        <img class="icono_size centro_icono" src="/images/iconos/contratacionesrojo.svg" />
                                    </div>
                                    <h5 class="label_item">Contratación</h5>
                                </div>
                            </div>
                            <div class="col-6 col-sm-6 col-md-6 col-lg-2 tablet mobile">
                                <div>
                                    <div class="box_icono">
                                        <span>
                                            <div>
                                                ${iconoEstatusContratacion}
                                            </div>
                                        </span>
                                    </div>
                                    <h5 class="label_item">${status}</h5>
                                </div>
                            </div>
                            <div class="col-md-12 col-lg-8 lista_movil">
                                <div class="text_justify">
                                    <h2>
                                        <a class="linkListas" href="/contratacion/${contratacionElement.prefixOCID}&${contratacionElement.tenderid}">
                                        ${contratacionElement.title_contratacion}</a>
                                    </h2>
                                </div>
                                <div class="separator bottom"></div>
                                <div class="text_justify">
                                    <h5 class="box_institucion">
                                        <a class="linkListas ${linkAP}" href="/institucion/${contratacionElement.prefixOC4ID}&${contratacionElement.rfc_buyer}">
                                            ${(contratacionElement.name_buyer === null ? '' : contratacionElement.name_buyer)}
                                        </a>
                                    </h5>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 list-12">
                                        <h6 class="label_box">PROYECTO</h6>
                                        <div class="text_justify">
                                            <p> 
                                                <img class="tam_list_icono" src="/images/iconos/proyectorojo.svg" />
                                                <span class="box_link">
                                                    <a class="linkListas" href="/proyecto/${contratacionElement.prefixOC4ID}&${contratacionElement.identificadorproyecto}">
                                                        ${contratacionElement.title_proyectos}
                                                    </a>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-md-6 list-12">
                                        <h6 class="label_box">CONTRATISTA</h6>
                                        <div class="text_justify">
                                            <img class="tam_list_icono" src="/images/iconos/contratistarojo.svg" />
                                            <span id="contratista_${contratacionElement.prefijoocid}_${contratacionElement.contractingProcessId}"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-2 mb-2 no-mobile">
                                <div class="box_icono">
                                    <span>
                                        <div>
                                            ${iconoEstatusContratacion}
                                        </div>
                                    </span>
                                </div>
                                <h5 class="label_item">${status}</h5>
                            </div>
                        </div>
                    </div>
                    <div class="col px-0 box_amount">
                        <p class="label_box title">MONTO CONTRATADO <br> (CON CONVENIOS)</p>
                        <h3>
                            $ ${redondearCifras(contratacionElement.monto)}
                            <span class="currency">MXN</span>
                        </h3>
                        <div class="download_json" style="cursor: pointer">
                            <p class="label_box download">Descargar</p>
                            <div class="box_download" onclick="downloadContracting('${contratacionElement.url}','${contratacionElement.port}',${contratacionElement.contractingProcessId})">
                                <a>JSON</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);

            contratacionElement.contratistas.forEach(contratista => {
                // console.log('Contratista para listas' + JSON.stringify(contratista))
                // console.log('contratacionElement.prefijoocid', contratacionElement.prefijoocid)
                let id = '#contratista_' + contratista.prefijoocid + '_' + contratista.contractingprocess_id;
                    $(id).append(`
                        <a class="linkListas" href="/contratista/${contratista.prefijoocid}&${contratista.partyid}">
                        <u class="colorLinea">${(contratista.name === null ? '' : contratista.name)}</u>
                        </a>
                    `);
            });
        }
    });
    if(pageNumber >1)
    $('#paginas_lista_contrataciones').append(`<li id="page_previo" class="page-item"><a class="page-link" style="cursor: pointer" onclick='previusPage()'> << </a></li>`);

    for (let index = 1; index <= pageCont; index++) {
        $('#paginas_lista_contrataciones').append(`<li id="page_${index}" class="page-item"><a class="page-link" style="cursor: pointer" onclick='selectedPage("${index}")'>${index}</a></li>`);
    }

    if(pageNumber < pageCont)
    $('#paginas_lista_contrataciones').append(`<li id="page_siguiente" class="page-item"><a class="page-link" style="cursor: pointer" onclick='nextPage()'> >> </a></li>`);

    
}


/////////////////////// LISTA DE CONTRATACIONES RELACIONADAS EN PROYECTOS   ///////////////////////

function paginateContratacionesRelacionadas(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
function nextPageContratacionesRelacionadas(){
    pageNumber ++;
    var page_id = '#page_'+pageNumber;
    showListasContratacionesRelacionadas(arrayPaginado,pageNumber,pageSize,pageCont)
    $(`${page_id}`).addClass('active');
}
function previusPageContratacionesRelacionadas(){
    pageNumber --;
    var page_id = '#page_'+pageNumber;
    showListasContratacionesRelacionadas(arrayPaginado,pageNumber,pageSize,pageCont)
    $(`${page_id}`).addClass('active');
}
function selectedPageContratacionesRelacionadas(page_number){
    pageNumber = page_number;
    var page_id = '#page_'+page_number;
    showListasContratacionesRelacionadas(arrayPaginado,page_number,pageSize,pageCont)
    $(`${page_id}`).addClass('active');
}

function showListasContratacionesRelacionadas(elements,pageNumber,pageSize,pageCont){
    // console.log(JSON.stringify(`/*/* ELEMENTS SHOWLISTAS CONTRATACIONES ${elements}`))
    $('#lista_contrataciones_relacionadas').empty();
    $('#paginas_lista_contrataciones_relacionadas').empty();
    pagination = paginate(elements,pageSize,pageNumber);
    
    pagination.forEach(contratacionElement => {
        // console.log(contratacionElement)
        var iconoEstatusContratacion = '';
        var status = '';
        if (contratacionElement.implementationstatus != null){
            // Colocar estatus correspondiente
            switch (contratacionElement.implementationstatus) {
                case "concluded":
                    status = 'Terminado';
                    iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCompletadoRojo.svg">';
                    break;
                case "terminated":
                    status = 'Terminado';
                    iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCompletadoRojo.svg">';
                    break;
                case "ongoing":
                    status = 'En ejecución';
                    iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusEjecucionRojo.svg">';
                    break;
                case "planning":
                    status = 'En ejecución';
                    iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusEjecucionRojo.svg">';
                    break; 
                default:
                    break;
            }
        } else {
            if (contratacionElement.contractstatus != null){
                // Colocar estatus correspondiente
                switch (contratacionElement.contractstatus) {
                    case "cancelled":
                        status = 'Fallido';
                        iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCanceladoRojo.svg">';
                        break; 
                    case "terminated":
                        status = 'Terminado';
                        iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCompletadoRojo.svg">';
                        break;
                    case "active":
                        status = 'En contratación';
                        iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusAdjudicacionRojo.svg">';
                        break;
                    case "pending":
                        status = 'En contratación';
                        iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusAdjudicacionRojo.svg">';
                        break;
                    default:
                        break;
                }
            } else {
                if (contratacionElement.awardstatus != null){
                    // Colocar estatus correspondiente
                    switch (contratacionElement.awardstatus) {
                        case "unsuccessful":
                            status = 'Fallido';
                            iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCanceladoRojo.svg">';
                            break; 
                        case "cancelled":
                            status = 'Fallido';
                            iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCanceladoRojo.svg">';
                            break;
                        case "active":
                            status = 'En adjudicación';
                            iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusContratacionRojo.svg">';
                            break;
                        case "pending":
                            status = 'En adjudicación';
                            iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusContratacionRojo.svg">';
                            break;
                        default:
                            break;
                    }
                } else {
                    if (contratacionElement.tenderstatus != null){
                        // Colocar estatus correspondiente
                        switch (contratacionElement.tenderstatus) {
                            case "withdrawn":
                                status = 'Fallido';
                                iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCanceladoRojo.svg">';
                                break;
                            case "unsuccessful":
                                status = 'Fallido';
                                iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCanceladoRojo.svg">';
                                break; 
                            case "cancelled":
                                status = 'Fallido';
                                iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/statusCanceladoRojo.svg">';
                                break;
                            case "active":
                                status = 'En licitación';
                                iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/planeacionRojo.svg">';
                                break;
                            case "planned":
                                status = 'En licitación';
                                iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/planeacionRojo.svg">';
                                break;
                            case "planning":
                                status = 'En licitación';
                                iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/planeacionRojo.svg">';
                                break; 
                            case "complete":
                                status = 'Licitado';
                                iconoEstatusContratacion = '<img class="iconoEstatusMovil" src="/images/iconos/planeacionRojo.svg">';
                                break; 
                            default:
                                break;
                        }
                    } else {
                        if (contratacionElement.tenderstatus == null){
                        // vacio
                        status = 'No aplica';
                        iconoEstatusContratacion = '';
                        }
                    }
                }
            }
        }
        var linkAP = '';
        if (contratacionElement.registroedcapi === false){
            linkAP = 'inactivalink';
        }

        $('#lista_contrataciones_relacionadas').append(`
        <div class="base_card">
            <div class="row alinea">
                <div class="col-md-12 col-lg-9 px-0">
                    <p class="box_idtfch">
                        <span class="col-md-6 lista_movil_id box_id">Identificador: <strong>${contratacionElement.ocid}</strong></span>
                        <span class="col-md-4 col-sm-12"><img class="tam_list_icono" src="/images/iconos/hacexmesesRojo.svg" /> Fecha de publicación: ${moment(contratacionElement.updated_date).format('DD/MM/yyyy')}</span>
                    </p>
                    <div class="row alinea">
                        <div class="col-6 col-sm-6 col-md-6 col-lg-2 mb-4">
                            <div>
                                <div class="box_icono">
                                    <img class="icono_size centro_icono" src="/images/iconos/contratacionesrojo.svg" />
                                </div>
                                <h5 class="label_item">Contratación</h5>
                            </div>
                        </div>
                        <div class="col-6 col-sm-6 col-md-6 col-lg-2 tablet mobile">
                            <div>
                                <div class="box_icono">
                                    <span>
                                        <div>
                                            ${iconoEstatusContratacion}
                                        </div>
                                    </span>
                                </div>
                                <h5 class="label_item">${status}</h5>
                            </div>
                        </div>
                        <div class="col-md-12 col-lg-8 lista_movil">
                            <div class="text_justify">
                                <h2>
                                    <a class="linkListas" href="/contratacion/${contratacionElement.prefixOCID}&${contratacionElement.tenderid}">
                                    ${contratacionElement.title_contratacion}</a>
                                </h2>
                            </div>
                            <div class="separator bottom"></div>
                            <div class="text_justify">
                                <h5 class="box_institucion">
                                    <a class="linkListas ${linkAP}" href="/institucion/${contratacionElement.prefixOC4ID}&${contratacionElement.rfc_buyer}">
                                        ${(contratacionElement.name_buyer === null ? '' : contratacionElement.name_buyer)}
                                    </a>
                                </h5>
                            </div>
                            <div class="row">
                                <div class="col-md-6 list-12">
                                    <h6 class="label_box">PROYECTO</h6>
                                    <div class="text_justify">
                                        <p> 
                                            <img class="tam_list_icono" src="/images/iconos/proyectorojo.svg" />
                                            <span class="box_link">
                                                <a class="linkListas" href="/proyecto/${contratacionElement.prefixOC4ID}&${contratacionElement.identifierproyecto}">
                                                    ${contratacionElement.title_proyectos}
                                                </a>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div class="col-md-6 list-12">
                                    <h6 class="label_box">CONTRATISTA</h6>
                                    <div class="text_justify">
                                            <img class="tam_list_icono" src="/images/iconos/contratistarojo.svg" />
                                            <span id="contratista_${contratacionElement.contractingProcessId}"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-2 mb-2 no-mobile">
                            <div class="box_icono">
                                <span>
                                    <div>
                                        ${iconoEstatusContratacion}
                                    </div>
                                </span>
                            </div>
                            <h5 class="label_item">${status}</h5>
                        </div>
                    </div>
                </div>
                <div class="col px-0 box_amount">
                    <p class="label_box title">MONTO CONTRATADO <br> (CON CONVENIOS)</p>
                    <h3>
                        $ ${redondearCifras(contratacionElement.monto)}
                        <span class="currency">MXN</span>
                    </h3>
                    <div class="download_json" style="cursor: pointer">
                        <p class="label_box download">Descargar</p>
                        <div class="box_download" onclick="downloadContracting('${contratacionElement.url}','${contratacionElement.port}',${contratacionElement.contractingProcessId})">
                            <a>JSON</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);

        contratacionElement.contratistas.forEach(contratista => {
            // console.log('seraaaaaaaa' + JSON.stringify(contratista))
            let id = '#contratista_' + contratista.cp_id;
            $(id).append(`
                <a class="linkListas" href="/contratista/${contratista.prefijoocid}&${contratista.rfc}">
                <u class="colorLinea">${(contratista.name === null ? '' : contratista.name)}</u>
                </a>
            `);
        });
    });
    if(pageNumber >1)
    $('#paginas_lista_contrataciones_relacionadas').append(`<li id="page_previo" class="page-item"><a class="page-link" style="cursor: pointer" onclick='previusPage()'> << </a></li>`);

    for (let index = 1; index <= pageCont; index++) {
        $('#paginas_lista_contrataciones_relacionadas').append(`<li id="page_${index}" class="page-item"><a class="page-link" style="cursor: pointer" onclick='selectedPage("${index}")'>${index}</a></li>`);
    }

    if(pageNumber < pageCont)
    $('#paginas_lista_contrataciones_relacionadas').append(`<li id="page_siguiente" class="page-item"><a class="page-link" style="cursor: pointer" onclick='nextPage()'> >> </a></li>`);
}

///////////////////////   LISTA DE CONTRATISTAS   /////////////////////////

function paginateContratistas(arrayContratistas, page_sizeContratistas, page_numberContratistas) {
    return arrayContratistas.slice((page_numberContratistas - 1) * page_sizeContratistas, page_numberContratistas * page_sizeContratistas);
}
function nextPageContratistas(){
    pageNumberContratistas ++;
    var page_idContratistas = '#page_'+pageNumberContratistas+'Contratistas';
    showListasContratistas(arrayPaginadoContratistas,pageNumberContratistas,pageSizeContratistas,pageContContratistas)
    $(`${page_idContratistas}`).addClass('active');
}
function previusPageContratistas(){
    pageNumberContratistas --;
    var page_idContratistas = '#page_'+pageNumberContratistas+'Contratistas';
    showListasContratistas(arrayPaginadoContratistas,pageNumberContratistas,pageSizeContratistas,pageContContratistas)
    $(`${page_idContratistas}`).addClass('active');
}
function selectedPageContratistas(page_numberContratistas){
    pageNumberContratistas = page_numberContratistas;
    var page_idContratistas = '#page_'+page_numberContratistas+'Contratistas';
    showListasContratistas(arrayPaginadoContratistas,page_numberContratistas,pageSizeContratistas,pageContContratistas)
    $(`${page_idContratistas}`).addClass('active');
}

function showListasContratistas(elementsContratistas,pageNumberContratistas,pageSizeContratistas,pageContContratistas){
    $('#lista_contratistas').empty();
    $('#paginas_lista_contratistas').empty();
    pagination = paginateContratistas(elementsContratistas,pageSizeContratistas,pageNumberContratistas);
    
    pagination.forEach(contratistaElement => {
        if(contratistaElement.id > 0){
        // console.log('contratistaElement', contratistaElement)
        var comaSepara = ', ';
        var concatena_address = ''.concat(contratistaElement.address_locality === '- Seleccionar -' ? '' : contratistaElement.address_locality.concat(comaSepara), contratistaElement.address_region === '- Seleccionar -' ? '' : contratistaElement.address_region.concat(comaSepara), contratistaElement.address_postalcode);
        
                $('#lista_contratistas').append(`
                <div class="base_card">
                    <div class="row alinea">
                        <div class="col-md-12 col-lg-9 px-0">
                            <p class="box_idtfch">
                                <span class="lista_movil_id col-md-6 box_id">Identificador: <strong>${contratistaElement.rfc}</strong></span>
                            </p>
                            <div class="row alinea">
                                <div class="col-6 col-sm-6 col-md-6 col-lg-2 mb-4">
                                    <div>
                                        <div class="box_icono">
                                            <img class="icono_size" src="/images/iconos/contratistarojo.svg" />
                                        </div>
                                        <h5 class="label_item">Contratista</h5>
                                    </div>
                                </div>
                                <div class="col-6 col-sm-6 col-md-6 col-lg-2 tablet mobile">
                                    <div>
                                        <div class="box_icono size_text">
                                            <span id="adjudicacionmobile_${contratistaElement.rfc}"></span>
                                        </div>
                                        <h5 class="label_item">Adjudicaciones</h5>
                                    </div>
                                </div>
                                <div class="col-md-12 col-lg-8 lista_movil">
                                    <div class="text_justify">
                                        <h2>
                                            <a class="linkListas" href="/contratista/${contratistaElement.prefixOCID}&${contratistaElement.rfc}">
                                            ${contratistaElement.name}</a>
                                        </h2>
                                    </div>
                                    <div class="separator bottom"></div>
                                    <div class="row">
                                        <div class="col-md-6 list-12">
                                            <h6 class="label_box">URL</h6>
                                            <div class="text_justify">
                                                <p>
                                                    <img class="tam_list_icono" id="iconURL" src="/images/iconos/urlRojo.svg" />
                                                    <a href="${contratistaElement.contactpoint_url}" target="_blank" class="box_link linkListas"> ${contratistaElement.contactpoint_url}</a>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="col-md-6 list-12">
                                            <h6 class="label_box">LOCALIDAD</h6>
                                            <div class="text_justify">
                                                <p>
                                                    <span class="box_link">
                                                        ${concatena_address}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-2 no-mobile">
                                        <p class="size_text">
                                            <span id="adjudicacion_${contratistaElement.rfc}"></span>
                                        </p>
                                    <h5 class="label_item">Adjudicaciones</h5>
                                </div>
                            </div>
                        </div>
                        <div class="col box_amount">
                            <p class="label_box title">MONTO ADJUDICADO</p>
                            <h3>
                                $ <span id="amount_${contratistaElement.rfc}"></span>
                                <span class="currency">MXN</span>
                            </h3>
                            <div class="download_json ancho_download" style="cursor: pointer">
                                <p class="label_box download">Descargar</p>
                                <div class="box_download" onclick="downloadContrataciones('${contratistaElement.url}','${contratistaElement.port}','${contratistaElement.rfc}', 'contratacion')">
                                    <a>JSON</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`);

                contratistaElement.adjudicaciones.forEach(adjudicacion => {
                    let id = '#adjudicacion_' + adjudicacion.rfc;
                    let idmobile = '#adjudicacionmobile_' + adjudicacion.rfc;
                    let ida = '#amount_' + adjudicacion.rfc;
                    $(id).append(`
                        ${adjudicacion.conteo}
                    `);
                    $(idmobile).append(`
                        ${adjudicacion.conteo}
                    `);
                    $(ida).append(`
                        ${redondearCifras(adjudicacion.monto)}
                    `);
                });
        }
    });
    if(pageNumberContratistas >1)
    $('#paginas_lista_contratistas').append(`<li id="page_previo" class="page-item"><a class="page-link" style="cursor: pointer" onclick='previusPageContratistas()'> << </a></li>`);

    for (let index = 1; index <= pageContContratistas; index++) {
        $('#paginas_lista_contratistas').append(`<li id="page_${index}Contratistas" class="page-item"><a class="page-link" style="cursor: pointer" onclick='selectedPageContratistas("${index}")'>${index}</a></li>`);
    }

    if(pageNumberContratistas < pageContContratistas)
    $('#paginas_lista_contratistas').append(`<li id="page_siguiente" class="page-item"><a class="page-link" style="cursor: pointer" onclick='nextPageContratistas()'> >> </a></li>`);
}

///////////////////////   LISTA DE CONTRATISTAS RELACIONADOS  /////////////////////////

function paginateContratistaRelacionados(arrayContratista, page_sizeContratista, page_numberContratista) {
    return arrayContratista.slice((page_numberContratista - 1) * page_sizeContratista, page_numberContratista * page_sizeContratista);
}
function nextPageContratistaRelacionados(){
    pageNumberContratista ++;
    var page_idContratista = '#page_'+pageNumberContratista+'Contratista';
    showListasContratistaRelacionados(arrayPaginadoContratista,pageNumberContratista,pageSizeContratista,pageContContratista)
    $(`${page_idContratista}`).addClass('active');
}
function previusPageContratistaRelacionados(){
    pageNumberContratista --;
    var page_idContratista = '#page_'+pageNumberContratista+'Contratista';
    showListasContratistaRelacionados(arrayPaginadoContratista,pageNumberContratista,pageSizeContratista,pageContContratista)
    $(`${page_idContratista}`).addClass('active');
}
function selectedPageContratistaRelacionados(page_numberContratista){
    pageNumberContratista = page_numberContratista;
    var page_idContratista = '#page_'+page_numberContratista+'Contratista';
    showListasContratistaRelacionados(arrayPaginadoContratista,page_numberContratista,pageSizeContratista,pageContContratista)
    $(`${page_idContratista}`).addClass('active');
}

function showListasContratistaRelacionados(elementsContratista,pageNumberContratista,pageSizeContratista,pageContContratista){
    $('#lista_contratistas_relacionados').empty();
    $('#paginas_lista_contratistas_relacionados').empty();
    pagination = paginateContratistas(elementsContratista,pageSizeContratista,pageNumberContratista);
    
    if(elementsContratista.length > 0){
        pagination.forEach(contratistaElement => {
            // console.log('ffffffffffffffffffffffff' + JSON.stringify(contratistaElement))
            var comaSepara = ', ';
            var concatena_address = ''.concat(contratistaElement.address_locality === '- Seleccionar -' ? '' : contratistaElement.address_locality.concat(comaSepara), contratistaElement.address_region === '- Seleccionar -' ? '' : contratistaElement.address_region.concat(comaSepara), contratistaElement.address_postalcode);

            $('#lista_contratistas_relacionados').append(`
            <div class="base_card">
                <div class="row alinea">
                    <div class="col-md-12 col-lg-9 px-0">
                        <p class="box_idtfch">
                            <span class="lista_movil_id col-md-6 box_id">Identificador: <strong>${contratistaElement.rfc}</strong></span>
                        </p>
                        <div class="row alinea">
                            <div class="col-6 col-sm-6 col-md-6 col-lg-2 mb-4">
                                <div>
                                    <div class="box_icono">
                                        <img class="icono_size" src="/images/iconos/contratistarojo.svg" />
                                    </div>
                                    <h5 class="label_item">Contratista</h5>
                                </div>
                            </div>
                            <div class="col-6 col-sm-6 col-md-6 col-lg-2 tablet mobile">
                                <div>
                                    <div class="box_icono size_text">
                                        <span id="adjudicacionPmobile_${contratistaElement.rfc}"></span>
                                    </div>
                                    <h5 class="label_item">Adjudicaciones</h5>
                                </div>
                            </div>
                            <div class="col-md-12 col-lg-8 lista_movil">
                                <div class="text_justify">
                                    <h2>
                                        <a class="linkListas" href="/contratista/${contratistaElement.prefijoocid}&${contratistaElement.rfc}">
                                        ${contratistaElement.name}
                                        </a>
                                    </h2>
                                </div>
                                <div class="separator bottom"></div>
                                <div class="row">
                                    <div class="col-md-6 list-12">
                                        <h6 class="label_box">URL</h6>
                                        <div class="text_justify">
                                            <p>
                                                <img class="tam_list_icono" id="iconURL" src="/images/iconos/urlRojo.svg" />
                                                <span class="box_link">
                                                    <a class="linkListas" href="${contratistaElement.contactpoint_url}" target="_blank"> ${contratistaElement.contactpoint_url}</a>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-md-6 list-12">
                                        <h6 class="label_box">LOCALIDAD</h6>
                                        <div class="text_justify">
                                            <p>
                                                <span class="box_link">
                                                    ${concatena_address}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-2 no-mobile">
                                    <p class="size_text">
                                        <span id="adjudicacionP_${contratistaElement.rfc}"></span>
                                    </p>
                                <h5 class="label_item">Adjudicaciones</h5>
                            </div>
                        </div>
                    </div>
                    <div class="col box_amount">
                        <p class="label_box title">MONTO ADJUDICADO</p>
                        <h3>
                        $ <span id="amountP_${contratistaElement.rfc}"></span>
                            <span class="currency">MXN</span>
                        </h3>
                        <div class="download_json ancho_download" style="cursor: pointer">
                            <p class="label_box download">Descargar</p>
                            <div class="box_download" onclick="downloadContrataciones('${contratistaElement.url}','${contratistaElement.port}','${contratistaElement.rfc}', 'contratacion')">
                                <a>JSON</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);

            contratistaElement.adjudicaciones.forEach(adjudicacion => {
                let id = '#adjudicacionP_' + adjudicacion.rfc;
                let idmobile = '#adjudicacionPmobile_' + adjudicacion.rfc;
                let ida = '#amountP_' + adjudicacion.rfc;
                $(id).append(`
                    ${adjudicacion.conteo}
                `);
                $(idmobile).append(`
                    ${adjudicacion.conteo}
                `);
                $(ida).append(`
                    ${redondearCifras(adjudicacion.monto)}
                `);
            });

        })
    } else {
        $('#lista_contratistas_relacionados').append(`
        <div>
            <p class="sinDatosPD">Sin contratistas</p>
        </div>`);
    };

    if(pageNumberContratista >1)
    $('#paginas_lista_contratistas_relacionados').append(`<li id="page_previo" class="page-item"><a class="page-link" style="cursor: pointer" onclick='previusPageContratista()'> << </a></li>`);

    for (let index = 1; index <= pageContContratista; index++) {
        $('#paginas_lista_contratistas_relacionados').append(`<li id="page_${index}Contratista" class="page-item"><a class="page-link" style="cursor: pointer" onclick='selectedPageContratista("${index}")'>${index}</a></li>`);
    }

    if(pageNumberContratista < pageContContratista)
    $('#paginas_lista_contratistas_relacionados').append(`<li id="page_siguiente" class="page-item"><a class="page-link" style="cursor: pointer" onclick='nextPageContratista()'> >> </a></li>`);
}

//////////////////   LISTA DE PROYECTOS   ////////////////////

function paginateProyectos(arrayProyectos, page_sizeProyectos, page_numberProyectos) {
    return arrayProyectos.slice((page_numberProyectos - 1) * page_sizeProyectos, page_numberProyectos * page_sizeProyectos);
}
function nextPageProyectos(){
    pageNumberProyectos ++;
    var page_idProyectos = '#page_'+pageNumberProyectos+'Proyectos';
    showListasProyectos(arrayPaginadoProyectos,pageNumberProyectos,pageSizeProyectos,pageContProyectos)
    $(`${page_idProyectos}`).addClass('active');
}
function previusPageProyectos(){
    pageNumberProyectos --;
    var page_idProyectos = '#page_'+pageNumberProyectos+'Proyectos';
    showListasProyectos(arrayPaginadoProyectos,pageNumberProyectos,pageSizeProyectos,pageContProyectos)
    $(`${page_idProyectos}`).addClass('active');
}
function selectedPageProyectos(page_numberProyectos){
    pageNumberProyectos = page_numberProyectos;
    var page_idProyectos = '#page_'+page_numberProyectos+'Proyectos';
    showListasProyectos(arrayPaginadoProyectos,page_numberProyectos,pageSizeProyectos,pageContProyectos)
    $(`${page_idProyectos}`).addClass('active');
}
function showListasProyectos(elementsProyectos,pageNumberProyectos,pageSizeProyectos,pageContProyectos){
    $('#lista_proyectos').empty();
    $('#lista_proyectos_gral').empty();
    $('#paginas_lista_proyectos').empty();
    pagination = paginateProyectos(elementsProyectos,pageSizeProyectos,pageNumberProyectos);
    
    if(elementsProyectos.length > 0){
        pagination.forEach(proyectoElement => {
            // console.log(proyectoElement)

            $('#lista_proyectos').append(`
            <div class="base_card">
                <div class="row alinea">
                    <div class="col-md-12 col-lg-9 px-0">
                        <p class="box_idtfch">
                            <span class="col-md-6 lista_movil_id box_id">Identificador: <strong>${proyectoElement.oc4ids}-${proyectoElement.identifier}</strong></span>
                            <span class="col-md-4 col-sm-12"><img class="tam_list_icono" src="/images/iconos/hacexmesesRojo.svg" /> Fecha de actualización: ${moment(proyectoElement.updated).format('DD/MM/yyyy')}</span>
                        </p>
                        <div class="row alinea">
                            <div class="col-6 col-sm-6 col-md-6 col-lg-2 mb-4">
                                <div>
                                    <div class="box_icono">
                                        <img class="icono_size" src="/images/iconos/proyectorojo.svg" />
                                    </div>
                                    <h5 class="label_item">Proyecto</h5>
                                </div>
                            </div>
                            <div class="col-6 col-sm-6 col-md-6 col-lg-2 tablet mobile">
                                <div>
                                    <div class="box_icono">
                                        <span>
                                            <div>
                                                ${translateProjectStatusToImage(proyectoElement.status,100)}
                                            </div>
                                        </span>
                                    </div>
                                    <h5 class="label_item">${proyectoElement.status}</h5>
                                </div>
                            </div>
                            <div class="col-md-12 col-lg-8 lista_movil">
                                <div class="text_justify">
                                    <h2>
                                        <a class="linkListas" href="/proyecto/${proyectoElement.prefixOC4ID}&${proyectoElement.identifier}">${proyectoElement.title}</a>
                                    </h2>
                                </div>
                                <div class="separator bottom"></div>
                                <div class="text_justify">
                                    <h5 class="box_institucion">
                                        <a class="linkListas" href="/institucion/${proyectoElement.prefixOC4ID}&${proyectoElement.rfc}">${proyectoElement.publicauthority}</a>
                                    </h5>
                                </div>
                                <div class="row">
                                    <div class="col-md-3 list-12">
                                        <h6 class="label_box">SECTOR</h6>
                                        <div class="tablet mobile" style="padding-bottom: 10px; color:#ffffff;">
                                            ${translateSectorToImage(proyectoElement.sector,80)}
                                        </div>
                                        <div class="no-mobile" style="padding-bottom: 10px; color:#ffffff;">
                                            ${translateSectorToImage(proyectoElement.sector,20)}
                                        </div>
                                    </div>
                                    <div class="col-md-4 list-12">
                                        <h6 class="label_box">TIPO</h6>
                                        <div class="tablet mobile" style="padding-bottom: 10px;">
                                        ${translateTypeToImage(proyectoElement.type,80)} <span class="box_link">${proyectoElement.type}
                                        </div>
                                        <div class="no-mobile">
                                        ${translateTypeToImage(proyectoElement.type,20)} <span class="box_link">${proyectoElement.type}
                                        </div>
                                    </div>
                                    <div class="col-md-5 list-12">
                                        <h6 class="label_box">PERÍODO</h6>
                                        <p>
                                            <img class="tam_list_icono" src="/images/iconos/periodoRojo.svg" /> <span class="box_link">${moment(proyectoElement.startDate).format('DD/MM/yyyy')} - ${moment(proyectoElement.endDate).format('DD/MM/yyyy')}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-2 mb-2 no-mobile">
                                <div class="box_icono">
                                    <span>
                                        <div>
                                            ${translateProjectStatusToImage(proyectoElement.status,50)}
                                        </div>
                                    </span>
                                </div>
                                <h5 class="label_item">${proyectoElement.status}</h5>
                            </div>
                        </div>
                    </div>
                    <div class="col px-0 box_amount">
                        <p class="label_box title">MONTO PRESUPUESTADO</p>
                        <h3>
                            $ ${redondearCifras(proyectoElement.monto)}
                            <span class="currency">${proyectoElement.moneda_budget}</span>
                        </h3>
                        <div class="download_json" style="cursor: pointer">
                            <p class="label_box download">Descargar</p>
                            <div class="box_download" onclick="downloadProjectPackage('${proyectoElement.url}','${proyectoElement.port}',${proyectoElement.id})">
                                <a>JSON</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);
            $('#lista_proyectos_gral').append(`
            <div class="base_card">
                <div class="row alinea">
                    <div class="col-md-12 col-lg-9 px-0">
                        <p class="box_idtfch">
                            <span class="col-md-6 lista_movil_id box_id">Identificador: <strong>${proyectoElement.oc4ids}-${proyectoElement.identifier}</strong></span>
                            <span class="col-md-4 col-sm-12"><img class="tam_list_icono" src="/images/iconos/hacexmesesRojo.svg" /> Fecha de actualización: ${moment(proyectoElement.updated).format('DD/MM/yyyy')}</span>
                        </p>
                        <div class="row alinea">
                            <div class="col-6 col-sm-6 col-md-6 col-lg-2 mb-4">
                                <div>
                                    <div class="box_icono">
                                        <img class="icono_size" src="/images/iconos/proyectorojo.svg" />
                                    </div>
                                    <h5 class="label_item">Proyecto</h5>
                                </div>
                            </div>
                            <div class="col-6 col-sm-6 col-md-6 col-lg-2 tablet mobile">
                                <div>
                                    <div class="box_icono">
                                        <span>
                                            <div>
                                                ${translateProjectStatusToImage(proyectoElement.status,100)}
                                            </div>
                                        </span>
                                    </div>
                                    <h5 class="label_item">${proyectoElement.status}</h5>
                                </div>
                            </div>
                            <div class="col-md-12 col-lg-8 lista_movil">
                                <div class="text_justify">
                                    <h2>
                                        <a class="linkListas" href="/proyecto/${proyectoElement.prefixOC4ID}&${proyectoElement.identifier}">${proyectoElement.title}</a>
                                    </h2>
                                </div>
                                <div class="separator bottom"></div>
                                <div class="text_justify">
                                    <h5 class="box_institucion">
                                        <a class="linkListas" href="/institucion/${proyectoElement.prefixOC4ID}&${proyectoElement.rfc}">${proyectoElement.publicauthority}</a>
                                    </h5>
                                </div>
                                <div class="row">
                                    <div class="col-md-3 list-12">
                                        <h6 class="label_box">SECTOR</h6>
                                        <div class="tablet mobile" style="padding-bottom: 10px; color:#ffffff;">
                                            ${translateSectorToImage(proyectoElement.sector,44)}
                                        </div>
                                        <div class="no-mobile" style="padding-bottom: 10px; color:#ffffff;">
                                            ${translateSectorToImage(proyectoElement.sector,20)}
                                        </div>
                                    </div>
                                    <div class="col-md-4 list-12">
                                        <h6 class="label_box">TIPO</h6>
                                        <div class="tablet mobile" style="padding-bottom: 10px;">
                                        ${translateTypeToImage(proyectoElement.type,40)} <span class="box_link">${proyectoElement.type}
                                        </div>
                                        <div class="no-mobile">
                                        ${translateTypeToImage(proyectoElement.type,20)} <span class="box_link">${proyectoElement.type}
                                        </div>
                                    </div>
                                    <div class="col-md-5 list-12">
                                        <h6 class="label_box">PERÍODO</h6>
                                        <p>
                                            <img class="tam_list_icono" src="/images/iconos/periodoRojo.svg" /> <span class="box_link">${moment(proyectoElement.startDate).format('DD/MM/yyyy')} - ${moment(proyectoElement.endDate).format('DD/MM/yyyy')}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-2 mb-2 no-mobile">
                                <div class="box_icono">
                                    <span>
                                        <div>
                                            ${translateProjectStatusToImage(proyectoElement.status,50)}
                                        </div>
                                    </span>
                                </div>
                                <h5 class="label_item">${proyectoElement.status}</h5>
                            </div>
                        </div>
                    </div>
                    <div class="col px-0 box_amount">
                        <p class="label_box title">MONTO PRESUPUESTADO</p>
                        <h3>
                            $ ${redondearCifras(proyectoElement.monto)}
                            <span class="currency">${proyectoElement.moneda_budget}</span>
                        </h3>
                        <div class="download_json" style="cursor: pointer">
                            <p class="label_box download">Descargar</p>
                            <div class="box_download" onclick="downloadProjectPackage('${proyectoElement.url}','${proyectoElement.port}',${proyectoElement.id})">
                                <a>JSON</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);
        })
    } else {
        $('#lista_proyectos').append(`
        <div>
            <p class="sinDatosPD">Sin proyectos relacionados</p>
        </div>`);
    };
    if(pageNumberProyectos >1)
    $('#paginas_lista_proyectos').append(`<li id="page_previo" class="page-item"><a class="page-link" style="cursor: pointer" onclick='previusPageProyectos()'> << </a></li>`);

    for (let index = 1; index <= pageContProyectos; index++) {
        $('#paginas_lista_proyectos').append(`<li id="page_${index}Proyectos" class="page-item"><a class="page-link" style="cursor: pointer" onclick='selectedPageProyectos("${index}")'>${index}</a></li>`);
    }

    if(pageNumberProyectos < pageContProyectos)
    $('#paginas_lista_proyectos').append(`<li id="page_siguiente" class="page-item"><a class="page-link" style="cursor: pointer" onclick='nextPageProyectos()'> >> </a></li>`);
}

//////////////////   LISTA DE PROYECTOS RELACIONADOS   ////////////////////

function paginateProyectosRelacionados(arrayProyectos, page_sizeProyectos, page_numberProyectos) {
    return arrayProyectos.slice((page_numberProyectos - 1) * page_sizeProyectos, page_numberProyectos * page_sizeProyectos);
}
function nextPageProyectosRelacionados(){
    pageNumberProyectos ++;
    var page_idProyectos = '#page_'+pageNumber+'Proyectos';
    showListasProyectosRelacionados(arrayPaginadoProyectos,pageNumberProyectos,pageSizeProyectos,pageContProyectos)
    $(`${page_idProyectos}`).addClass('active');
}
function previusPageProyectosRelacionados(){
    pageNumberProyectos --;
    var page_idProyectos = '#page_'+pageNumber+'Proyectos';
    showListasProyectoRelacionadoss(arrayPaginadoProyectos,pageNumberProyectos,pageSizeProyectos,pageContProyectos)
    $(`${page_idProyectos}`).addClass('active');
}
function selectedPageProyectosRelacionados(page_numberProyectos){
    pageNumberProyectos = page_numberProyectos;
    var page_idProyectos = '#page_'+page_numberProyectos+'Proyectos';
    showListasProyectoRelacionadoss(arrayPaginadoProyectos,page_numberProyectos,pageSizeProyectos,pageContProyectos)
    $(`${page_idProyectos}`).addClass('active');
}
function showListasProyectosRelacionados(elementsProyectos,pageNumberProyectos,pageSizeProyectos,pageContProyectos){
    $('#lista_proyectos_relacionados').empty();
    $('#paginas_lista_proyectos_relacionados').empty();
    pagination = paginateProyectosRelacionados(elementsProyectos,pageSizeProyectos,pageNumberProyectos);
    
    if(elementsProyectos.length > 0){
        pagination.forEach(proyectoElement => {
            console.log(proyectoElement)

            $('#lista_proyectos_relacionados').append(`
            <div class="base_card">
                <div class="row alinea">
                    <div class="col-md-12 col-lg-9 px-0">
                        <p class="box_idtfch">
                            <span class="col-md-6 lista_movil_id box_id">Identificador: <strong>${proyectoElement.oc4ids}-${proyectoElement.identifier}</strong></span>
                            <span class="col-md-4 col-sm-12"><img class="tam_list_icono" src="/images/iconos/hacexmesesRojo.svg" /> Fecha de actualización: ${moment(proyectoElement.updated).format('DD/MM/yyyy')}</span>
                        </p>
                        <div class="row alinea">
                            <div class="col-6 col-sm-6 col-md-6 col-lg-2 mb-4">
                                <div>
                                    <div class="box_icono">
                                        <img class="icono_size" src="/images/iconos/proyectorojo.svg" />
                                    </div>
                                    <h5 class="label_item">Proyecto</h5>
                                </div>
                            </div>
                            <div class="col-6 col-sm-6 col-md-6 col-lg-2 tablet mobile">
                                <div>
                                    <div class="box_icono">
                                        <span>
                                            <div>
                                                ${translateProjectStatusToImage(proyectoElement.status,100)}
                                            </div>
                                        </span>
                                    </div>
                                    <h5 class="label_item">${proyectoElement.status}</h5>
                                </div>
                            </div>
                            <div class="col-md-12 col-lg-8 lista_movil">
                                <div class="text_justify">
                                    <h2>
                                        <a class="linkListas" href="/proyecto/${proyectoElement.oc4ids}&${proyectoElement.identifier}">${proyectoElement.title}</a>
                                    </h2>
                                </div>
                                <div class="separator bottom"></div>
                                <div class="text_justify">
                                    <h5 class="box_institucion">
                                        <a class="linkListas" href="/institucion/${proyectoElement.oc4ids}&${proyectoElement.rfc}">${proyectoElement.publicauthority}</a>
                                    </h5>
                                </div>
                                <div class="row">
                                    <div class="col-md-3 list-12">
                                        <h6 class="label_box">SECTOR</h6>
                                        <div class="tablet mobile" style="padding-bottom: 10px; color:#ffffff;">
                                            ${translateSectorToImage(proyectoElement.sector,44)}
                                        </div>
                                        <div class="no-mobile" style="padding-bottom: 10px; color:#ffffff;">
                                            ${translateSectorToImage(proyectoElement.sector,20)}
                                        </div>
                                    </div>
                                    <div class="col-md-4 list-12">
                                        <h6 class="label_box">TIPO</h6>
                                        <div class="tablet mobile" style="padding-bottom: 10px;">
                                        ${translateTypeToImage(proyectoElement.type,40)} <span class="box_link">${proyectoElement.type}
                                        </div>
                                        <div class="no-mobile">
                                        ${translateTypeToImage(proyectoElement.type,20)} <span class="box_link">${proyectoElement.type}
                                        </div>
                                    </div>
                                    <div class="col-md-5 list-12">
                                        <h6 class="label_box">PERÍODO</h6>
                                        <p>
                                            <img class="tam_list_icono" src="/images/iconos/periodoRojo.svg" /> <span class="box_link">${moment(proyectoElement.startDate).format('DD/MM/yyyy')} - ${moment(proyectoElement.endDate).format('DD/MM/yyyy')}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-2 mb-2 no-mobile">
                                <div class="box_icono">
                                    <span>
                                        <div>
                                            ${translateProjectStatusToImage(proyectoElement.status,50)}
                                        </div>
                                    </span>
                                </div>
                                <h5 class="label_item">${proyectoElement.status}</h5>
                            </div>
                        </div>
                    </div>
                    <div class="col px-0 box_amount">
                        <p class="label_box title">MONTO PRESUPUESTADO</p>
                        <h3>
                            $ ${redondearCifras(proyectoElement.monto)}
                            <span class="currency">${proyectoElement.moneda_budget}</span>
                        </h3>
                        <div class="download_json" style="cursor: pointer">
                            <p class="label_box download">Descargar</p>
                            <div class="box_download" onclick="downloadProjectPackage('${proyectoElement.url}','${proyectoElement.port}',${proyectoElement.id})">
                                <a>JSON</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);
        })
    } else {
        $('#lista_proyectos_relacionados').append(`
        <div>
            <p class="sinDatosPD">Sin proyectos relacionados</p>
        </div>`);
    };
    if(pageNumberProyectos >1)
    $('#paginas_lista_proyectos_relacionados').append(`<li id="page_previo" class="page-item"><a class="page-link" style="cursor: pointer" onclick='previusPageProyectos()'> << </a></li>`);

    for (let index = 1; index <= pageContProyectos; index++) {
        $('#paginas_lista_proyectos_relacionados').append(`<li id="page_${index}Proyectos" class="page-item"><a class="page-link" style="cursor: pointer" onclick='selectedPageProyectos("${index}")'>${index}</a></li>`);
    }

    if(pageNumberProyectos < pageContProyectos)
    $('#paginas_lista_proyectos_relacionados').append(`<li id="page_siguiente" class="page-item"><a class="page-link" style="cursor: pointer" onclick='nextPageProyectos()'> >> </a></li>`);
}

//////////////   LISTA DE INSTITUCIONES   ////////////////////

function paginateInstituciones(arrayInstituciones, page_sizeInstituciones, page_numberInstituciones) {
    return arrayInstituciones.slice((page_numberInstituciones - 1) * page_sizeInstituciones, page_numberInstituciones * page_sizeInstituciones);
}
function nextPageInstituciones(){
    pageNumberInstituciones ++;
    var page_idInstituciones = '#page_'+pageNumberInstituciones+'Instituciones';
    showListasInstituciones(arrayPaginadoInstituciones,pageNumberInstituciones,pageSizeInstituciones,pageContInstituciones)
    $(`${page_idInstituciones}`).addClass('active');
}
function previusPageInstituciones(){
    pageNumberInstituciones --;
    var page_idInstituciones = '#page_'+pageNumberInstituciones+'Instituciones';
    showListasInstituciones(arrayPaginadoInstituciones,pageNumberInstituciones,pageSizeInstituciones,pageContInstituciones)
    $(`${page_idInstituciones}`).addClass('active');
}
function selectedPageInstituciones(page_numberInstituciones){
    pageNumberInstituciones = page_numberInstituciones;
    var page_idInstituciones = '#page_'+page_numberInstituciones+'Instituciones';
    showListasInstituciones(arrayPaginadoInstituciones,page_numberInstituciones,pageSizeInstituciones,pageContInstituciones)
    $(`${page_idInstituciones}`).addClass('active');
}

function showListasInstituciones(elementsInstituciones,pageNumberInstituciones,pageSizeInstituciones,pageContInstituciones){
    $('#lista_instituciones').empty();
    $('#paginas_lista_instituciones').empty();
    pagination = paginateInstituciones(elementsInstituciones,pageSizeInstituciones,pageNumberInstituciones);
    
    pagination.forEach(institucionElement => {
        // console.log(institucionElement)

        $('#lista_instituciones').append(`
        <div class="base_card">
            <div class="row alinea">
                <div class="col-md-12 col-lg-9 px-0">
                    <p class="box_idtfch">
                        <span class="col-md-6 lista_movil_id box_id">Identificador: <strong>${institucionElement.publicauthority}</strong></span>
                    </p>
                    <div class="row alinea">
                        <div class="col-6 col-sm-6 col-md-4 col-lg-2 mb-4">
                            <div>
                                <div class="box_icono">
                                    <img class="icono_size" src="/images/iconos/institucionespublicasrojo.svg" />
                                </div>
                                <h5 class="label_item">Institución</h5>
                            </div>
                        </div>
                        <div class="col-6 col-sm-6 col-md-8 col-lg-2 tablet mobile">
                            <div class="col-md-6" style="float: left;">
                                <div class="box_icono size_text">
                                    ${institucionElement.conteoproyectos}
                                </div>
                                <h5 class="label_item">Proyectos</h5>
                            </div>
                            <div class="col-md-6" style="float: right;">
                                <p class="size_text">
                                    ${(institucionElement.totalcontrataciones === null ? 0 : institucionElement.totalcontrataciones)}
                                </p>
                                <h5 class="label_item">Contrataciones</h5>
                            </div>
                        </div>
                        <div class="col-md-12 col-lg-6 lista_movil">
                            <div class="text_justify">
                                <h2>
                                    <a class="linkListas" href="/institucion/${institucionElement.prefixOC4ID}&${institucionElement.publicauthority}">
                                    ${institucionElement.name}</a>
                                </h2>
                            </div>
                            <div class="separator bottom"></div>
                            <div class="row">
                                <div class="col list-12">
                                    <h6 class="label_box">CONTACTO</h6>
                                    <div class="text_justify">
                                        <p>
                                            <img class="tam_list_icono" src="/images/iconos/contratistarojo.svg" />
                                            <span class="box_link">
                                                ${(institucionElement.contactname === null ? '' : institucionElement.contactname)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div class="col list-12">
                                    <h6 class="label_box">URL</h6>
                                    <div class="text_justify">
                                        <p>
                                            <img class="tam_list_icono" src="/images/iconos/urlRojo.svg" />
                                            <span class="box_link">
                                                <a class="linkListas" href="${institucionElement.contacturl}" target="_blank">
                                                    ${(institucionElement.contacturl === null ? '' : institucionElement.contacturl)}
                                                </a>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-2 no-mobile">
                            <p class="size_text">
                                ${institucionElement.conteoproyectos}
                            </p>
                            <h5 class="label_item">Proyectos</h5>
                        </div>
                        <div class="col-2 no-mobile">
                            <p class="size_text">
                            ${(institucionElement.totalcontrataciones === null ? 0 : institucionElement.totalcontrataciones)}
                            </p>
                            <h5 class="label_item">Contrataciones</h5>
                        </div>
                    </div>
                </div>
                <div class="col px-0 box_amount">
                    <p class="label_box title">MONTO EJERCIDO</p>
                    <h3>
                        $ ${redondearCifras(institucionElement.montoejercido)}
                        <span class="currency">MXN</span>
                    </h3>
                    <div class="download_json ancho_download" style="cursor: pointer">
                        <p class="label_box download">Descargar</p>
                        <div class="box_download" onclick="downloadProyectos('${institucionElement.url}','${institucionElement.port}','${institucionElement.publicauthority}', 'proyecto')">
                            <a>JSON</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`); 
    });
    if(pageNumberInstituciones >1)
    $('#paginas_lista_instituciones').append(`<li id="page_previo" class="page-item"><a class="page-link" style="cursor: pointer" onclick='previusPageInstituciones()'> << </a></li>`);

    for (let index = 1; index <= pageContInstituciones; index++) {
        $('#paginas_lista_instituciones').append(`<li id="page_${index}Instituciones" class="page-item"><a class="page-link" style="cursor: pointer" onclick='selectedPageInstituciones("${index}")'>${index}</a></li>`);
    }

    if(pageNumberInstituciones < pageContInstituciones)
    $('#paginas_lista_instituciones').append(`<li id="page_siguiente" class="page-item"><a class="page-link" style="cursor: pointer" onclick='nextPageInstituciones()'> >> </a></li>`);
}

function abreL(){
    $.getScript("/javascript/startUpSearch.js", function(){
    });
    document.getElementById("yearFilter").disabled = true;
    document.getElementById("yearFilter").style.backgroundColor = "#f16752";
    document.getElementById("entityFilter").disabled = true;
    document.getElementById("entityFilter").style.backgroundColor = "#f16752";
    document.getElementById("implementatorFilter").disabled = true;
    document.getElementById("implementatorFilter").style.backgroundColor = "#f16752";
}