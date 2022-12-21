const helper = require('../common/helper');
var db_conf = require('../../captura/db_conf');
const proyectoCtrl = {};

// PROYECTOS
proyectoCtrl.getInfo = (req, res) => {
    console.log(`### getInfo PROYECTO value: ${JSON.stringify(req.params)}`)
    db_conf.edca_db.task(function (t) {
        return this.batch([
            this.manyOrNone('SELECT * FROM public.edcapi_project_sectors;'), 
            this.manyOrNone('SELECT * FROM public.edcapi_project_statuses;'), 
            this.manyOrNone('SELECT * FROM public.edcapi_project_types;')
        ]);
    }).then(function (data) {
        res.render('proyectos',{
            //Banner
            paramYear : (req.params.year === undefined ? 0 : req.params.year),
            paramEntity : (req.params.entity === undefined ? 0 : req.params.entity),
            paramImplementer : (req.params.implementer === undefined ? 0 : req.params.implementer),
            texto_identificador: '',
            identificador_banner: '',
            texto_fecha_actualizacion: '',
            icono_fecha_actualizacion: '',
            fecha_actualizacion: '',
            title: 'Proyectos de infraestructura',
            description: 'Son las distintas obras, remodelaciones y ampliaciones que realizan las instituciones públicas.',
            dato_1: '',
            dato_2: '',
            icono_1: '/images/iconos/proyectos1/dinerosimbolo_blanco.svg',
            icono_2: '/images/iconos/proyectoblanco.svg',
            icono_3: '/images/iconos/proyectos1/contrataciones.svg',
            cifra_1: '0',
            cifra_2: '0',
            cifra_3: '0',
            texto_1: 'Monto total programado (MXN)',
            texto_2: 'Proyectos de infraestructura',
            texto_3: 'Promedio de contratos',
    
            //Mostrar Filtros en barra de menú
            valor: '1',
    
            //Lista de proyectos
            // proyectos: proyectos
            sectors : data[0],
            statuses : data[1],
            types : data[2]
        });
    }).catch(function (error) {
        console.log("ERROR: ", error);
        return res.status(404).json({
            status: 404,
            message: `No se encontrarón resultados`
        })
    });
}

// PROYECTOS DETALLE
proyectoCtrl.getInfoDetalle = (req, res) => {
    console.log(`### getInfoDetalle value: ${JSON.stringify(req.body)}`)
    var proyectos = new Array();
    var proyecto = new Object({
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

    var contratistas = new Array();
    var contratista = new Object({
        //Lista de contratistas
        identificador: 'MOGJ801124B41',
        nombre_contratista: 'VIAS Y DESARROLLOS, S.A. DE C.V.',
        icono_lista_1: '/images/iconos/contratistarojo.svg',
        cantidad: 3,
        metodo: 'Adjudicaciones',
        icono_url: '/images/iconos/urlRojo',
        url: 'http://www.vydsa.com/',
        localidad: 'Monterrey 64750',
        sector: 'Transporte urbano',
        monto: '$214,017,134'
    });

    contratistas.push(contratista);

    res.render('proyecto',{
        title: 'Proyectos',
        //Banner
        prefixOC4ID: req.params.prefixOC4ID,
        identifier: req.params.identifier,
        
        texto_identificador: 'Identificador:',
        identificador_banner: `${req.params.prefixOC4ID}-${req.params.identifier}`,
        texto_fecha_actualizacion: 'Fecha de actualización:',
        icono_fecha_actualizacion: 'fas fa-clock fa-1x',
        fecha_actualizacion: '--/--/----',
        title: '',
        texto_description: '',
        description: '',
        // texto_dato_1: '',
        // dato_1: '',
        // texto_dato_2: '',
        // dato_2: '',
        // texto_dato_3: '',
        // dato_3: '',
        icono_1 : '/images/iconos/proyectos1/dinerosimbolo_blanco.svg',
        icono_2 : '/images/iconos/proyectos1/dinerosimbolo_blanco.svg',
        icono_3 : '/images/iconos/contratacionesblanco.svg',
        cifra_1: '$ 0',
        cifra_2: '$ 0',
        cifra_3: '0',
        texto_1: 'Monto presupuestado (MXN)',
        texto_2: 'Monto ejercido (MXN)',
        texto_3: 'Contrataciones',
        icono_periodo: '/images/iconos/periodoRojo.svg',
        //Mostrar Filtros en barra de menú
        valor: '0',

        //Lista de contrataciones
        contrataciones:contrataciones,

        //Lista de contrataciones
        contratistas:contratistas,

        //Lista de proyectos relacionados
        proyectos: proyectos,

        //Información general
        sector_info: 'Salud',
        //tipo_info: 'Construcción',
        periodo_info: '30/1/2012 - 31/12/2020',
        duracion_info: 'Duración en días: 3258',
        //estatus_info: 'Ejecución',
        icon_infgen_1: 'fas fa-tools fa-3x',
        icon_infgen_2: 'fas fa-tools fa-3x',
        icon_infgen_3: 'fas fa-tools fa-3x',

        //Fases del Proyecto
            icono_diseno: '/images/iconos/designBlanco.svg',
            icono_construccion: '/images/iconos/construccionBlanco.svg',
            icono_terminacion: '/images/iconos/terminacionBlanco.svg',
            //Diseño
            icon_diseF_1: '/images/iconos/dineroRojo.svg',
            icon_diseF_2: '/images/iconos/periodoRojo.svg',
            monto_diseno: '0',
            //Terminación
            icon_terminF_1: 'far fa-calendar-alt fa-3x',
            monto_term: '$99,721,617',
            fecha_term: '30/03/2020',

        //Avance
        icon_avance: 'fas fa-tools fa-2x',
        fecha_avance: 'Terminado',
        icono_date: '/images/iconos/proyectos2/hacexmeses.svg',
        fecha_LT: '09/04/2021',
            //Linea de tiempo
            iconoCalendario: '/images/iconos/periodoRojo.svg',
            iconoInicioProyecto: '/images/iconos/fechadeinicio.svg',
            montoAprobado: '0',
            montoCurrency: '',
            iconoAprobadoMonto: '/images/iconos/dineroRojo.svg',
            iconoLicitacion: '/images/iconos/planeacionRojo.svg',
            num_licitante: '0',
            montoFinalCompletion: '0',
            currencyFinalCompletion: '',
            iconoTerminacionProyecto: '/images/iconos/terminacionestimadaRojo.svg'
    });
}

module.exports = proyectoCtrl;