const helper = require('../common/helper');
const contratacionCtrl = {};

// CONTRATACIONES
contratacionCtrl.getInfo = (req, res) => {
    console.log(`### getInfo value: ${JSON.stringify(req.params)}`)
    var contrataciones = new Array();
    var contratacion = new Object({
        //Lista de contrataciones
        identificador: 'ocds-7wj9x5-LO-919009986-E9-2018-v001',
        icono_date: '/images/iconos/hacexmesesRojo.svg',
        fecha: '09/04/2021',
        icono_lista_1 : '/images/iconos/contratacionesrojo.svg',
        nombre_contratacion: 'Proyecto de Infraestructura social para la sustitución por obra nueva y equipamiento del Hospital General de Montemorelos',
        implementador: 'Secretaría de infraestructura',
        icono_lista_2: '/images/iconos/completadoRojo.svg',
        estatus: 'Terminado',
        icono_proyecto: '/images/iconos/proyectorojo.svg',
        proyecto: 'Proyecto de infraestructura social para la sustitución por obra nueva y equipamiento del Hospital General de Montemorelos, en el municipio de Montemorelos del Estado de Nuevo León',
        icono_contratista: '/images/iconos/contratistarojo.svg',
        contratista: 'DESARROLLO Y CONSTRUCCIONES URBANAS, S.A. DE C.V.',
        monto: '$214,017,134'
    });

    contrataciones.push(contratacion);

    res.render('contrataciones',{
        // Banner 
        paramYear : (req.params.year === undefined ? 0 : req.params.year),
        paramEntity : (req.params.entity === undefined ? 0 : req.params.entity),
        paramImplementer : (req.params.implementer === undefined ? 0 : req.params.implementer),
        texto_identificador: '',
        identificador_banner: '',
        texto_fecha_actualizacion: '',
        icono_fecha_actualizacion: '',
        fecha_actualizacion: '',
        title: 'Contrataciones públicas',
        description: 'Cada obra, remodelación, ampliación y/o mantenimiento requiere generar uno o varios contratos. Aquí encontrarás las contrataciones relacionadas a cada proyecto de infraestructura publicado en esta plataforma.',
        dato_1: '',
        dato_2: '',
        icono_1 : '/images/iconos/proyectos1/dinerosimbolo_blanco.svg',
        icono_2 : '/images/iconos/proyectos1/dinerosimbolo_blanco.svg',
        icono_3 : '/images/iconos/contratacionesblanco.svg',
        cifra_1: '0',
        cifra_2: '0',
        cifra_3: '0',
        texto_1: 'Monto contratado (MXN)',
        texto_2: 'Monto ejercido (MXN)',
        texto_3: 'Contrataciones',

        //Mostrar Filtros en barra de menú
        valor: '1',

        //Lista de contrataciones
        contrataciones: contrataciones
    });
}

// CONTRATACION DETALLE
contratacionCtrl.getInfoDetalle = (req, res) => {
    // console.log(`### getInfoDetalle value: ${JSON.stringify(req.body)}`)
    var contrataciones = new Array();
    var contratacion = new Object({
        identificador: 'ocd4ids-gx3fo2-000007',
        icono_date: '/images/iconos/proyectos2/hacexmeses.svg',
        fecha: '09/04/2021',
        icono_lista_1: '/images/iconos/perfildeproyectos1/proyectosmorado.svg',
        nombre_proyect: 'Proyecto de infraestructura social para la sustitución por obra nueva y equipamiento del Hospital General de Montemorelos, en el municipio de Montemorelos del Estado de Nuevo León',
        implementador: 'INAI',
        icono_lista_2: '/images/iconos/proyectos1/fases/construccion.svg',
        estatus: 'Terminado',
        icono_sector: '/images/iconos/proyectos2/sector/salud',
        sector: 'Salud',
        icono_tipo: '/images/iconos/proyectos2/tipo/tipoconstruccionmorado.svg',
        tipo: 'Construcción',
        icono_periodo: '/images/iconos/proyectos2/periodomorado.svg',
        periodo: '30/1/2012 - 31/12/2020',
        monto: '$100,000,000'
    });

    contrataciones.push(contratacion);

    var proyectos = new Array();
    var proyecto = new Object({
        // Lista de proyectos
        identificador: 'ocd4ids-gx3fo2-000007',
        icono_date: '/images/iconos/hacexmesesRojo.svg',
        fecha: '09/04/2021',
        icono_lista_1: '/images/iconos/proyectorojo.svg',
        nombre_proyect: 'Proyecto de infraestructura social para la sustitución por obra nueva y equipamiento del Hospital General de Montemorelos, en el municipio de Montemorelos del Estado de Nuevo León',
        implementador: 'INAI',
        icono_lista_2: '/images/iconos/construccion.svg',
        estatus: 'Terminado',
        icono_sector: '/images/iconos/SaludRojo',
        sector: 'Salud',
        icono_tipo: '/images/iconos/tipoconstruccionRojo.svg',
        tipo: 'Construcción',
        icono_periodo: '/images/iconos/periodoRojo.svg',
        periodo: '30/1/2012 - 31/12/2020',
        monto: '$100,000,000'
    });

    proyectos.push(proyecto);

    res.render('contratacion',{
        //Banner
        prefixOCID: req.params.prefixOCID,
        ocid: req.params.ocid,
        
        texto_identificador: 'Identificador:',
        identificador_banner: `${req.params.prefixOCID}-${req.params.ocid}`,
        texto_fecha_actualizacion: 'Fecha de actualización:',
        icono_fecha_actualizacion: 'fas fa-clock fa-1x',
        fecha_actualizacion: '--/--/----',
        title: '',
        texto_description: '',
        description: '',
        // texto_dato_1: '',
        // // dato_1: '',
        // texto_dato_2: '',
        // // dato_2: '',
        // texto_dato_3: 'Contratista(s):',
        // // dato_3: '',
        icono_1 : '/images/iconos/proyectos1/dinerosimbolo_blanco.svg',
        icono_2 : '/images/iconos/contratacionesblanco.svg',
        icono_3 : '/images/iconos/contratistablanco.svg',
        cifra_1: '$ 0',
        cifra_2: '0',
        cifra_3: '0',
        texto_1: 'Monto contratado (MXN)',
        texto_2: 'Número de contratos',
        texto_3: 'Número de licitantes',

        //Mostrar Filtros en barra de menú
        valor: '0',

        //Cifras destacadas
        icon_contratacionD_1: '/images/iconos/entidadcompradora.svg',
        icon_contratacionD_2: '/images/iconos/entidadcontratante.svg',
        icon_contratacionD_3: '/images/iconos/fechadeinicio.svg',
        icon_contratacionD_4: '/images/iconos/fechadefin.svg',
        entidadCompradora: '',
        entidadContratante: '',
        fechaInicio: '--/--/----',
        fechaTermino: '--/--/----',
        descripcion: '',

        //Etapas
            //Planeación
            tituloProyecto: '',
            conteoDocumentos: '0',
            //Licitación
            titletender: '',
            idContratacion: '',
            statusContratacion: '',
            objetoProcedimiento: '',
            valorEstimado: '0',
            valorCurrency: '',
            entidadCL: '',
            conteoItems: '0',
            metodoContratacion: '',
            detalleMetodo: '',
            categoriaContratacion: '',
            justificacionContratacion: '',
            icon_metodoC: '/images/iconos/contratacionesrojo.svg',
            icon_detalleC: '/images/iconos/contratacionesrojo.svg',
            icon_categoriaC: '/images/iconos/categoriaRojo.svg',
            criterioEvaluacion: '',
            criterioProposiciones: '',
            criterioElegibilidad: '',
            icon_criterioE: '/images/iconos/fechadeaperturaRojo.svg',
            inicioFechaP: '--/--/----',
            cierreFechaP: '--/--/----',
            icon_inicioP: '/images/iconos/fechadeinicio.svg',
            icon_cierreP: '/images/iconos/fechadefin.svg',
            mediosRecepcion: '',
            descripcionMediosRecepcion: '',
            inicioFechaS: '--/--/----',
            cierreFechaS: '--/--/----',
            icon_inicioS: '/images/iconos/fechadeinicio.svg',
            icon_cierreS: '/images/iconos/fechadefin.svg',
            huboCotizaciones: '',
            inicioFechaEA: '--/--/----',
            cierreFechaEA: '--/--/----',
            icon_inicioEA: '/images/iconos/fechadeinicio.svg',
            icon_cierreEA: '/images/iconos/fechadefin.svg',
            conteoLicitantes:'0',
            conteoDocumentosLicitacion: '0',
            conteoHitos: '0',
            //Adjudicación
            titleaward: '',
            idAward: '',
            statusAward: '',
            descripcionProcedimiento: '',
            montoAdjudicado: '0',
            valorCurrencyAward: '',
            fechaAdjudicacion: '--/--/----',
            conteoContratistasAward: '0',
            inicioFechaApc: '--/--/----',
            cierreFechaApc: '--/--/----',
            icon_inicioApc: '/images/iconos/fechadeinicio.svg',
            icon_cierreApc: '/images/iconos/fechadefin.svg',
            conteoDocumentosAward: '0',


            //Contratación
            idContrato: '1804003',
            objetoContrato: 'Proyecto de Infraestructura social para la sustitución por obra nueva y equipamiento del Hospital General de Montemorelos',
            montoContrato: '214,017,134',
            fechaContrato: '18/4/2018',
            inicioFechaCon: '7/5/2018',
            finFechaCon: '1/5/2019',
            extensionCon: '29/2/2020',
            duracionCon: '663',
            icon_inicioCon: 'far fa-play-circle fa-1x',
            icon_finCon: 'far fa-play-circle fa-1x',
            icon_extensionCon: 'far fa-play-circle fa-1x',
            icon_duracionCon: 'far fa-play-circle fa-1x',
            numItemsContrato: '23',
            numDocumentosContrato: '4',
            //Ejecución
            numTransaccion: '81',
            numDocumentosEjecucion: '8',

        //Lista de proyectos relacionados
        id_Proyecto: '',
        fechaActualizacion_Proyecto: ''

    });
}

module.exports = contratacionCtrl;