const helper = require('../common/helper');
const contratistaCtrl = {};

// CONTRATISTAS
contratistaCtrl.getInfo = (req, res) => {
    console.log(`### getInfo value: ${JSON.stringify(req.params)}`)
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
        monto: '$214,017,134'
    });

    contratistas.push(contratista);

    res.render('contratistas',{
        //Banner 
        paramYear : req.params.year,
        paramEntity : req.params.entity,
        paramImplementer : req.params.implementer,
        texto_identificador: '',
        identificador_banner: '',
        texto_fecha_actualizacion: '',
        icono_fecha_actualizacion: '',
        fecha_actualizacion: '',
        title: 'Contratistas',
        description: 'Personas físicas o morales que fueron contratadas para la construcción o entrega de un servicio.',
        dato_1: '',
        dato_2: '',
        icono_1 : '',
        icono_2 : '/images/iconos/contratistablanco.svg',
        icono_3 : '/images/iconos/contratistablanco.svg',
        cifra_1: '',
        cifra_2: '0',
        cifra_3: '0',
        texto_1: '',
        texto_2: 'Contratistas',
        texto_3: 'Licitantes',

        //Mostrar Filtros en barra de menú
        valor: '0',

        //Lista de contratistas
        contratistas: contratistas
    });
}

// CONTRATISTAS DETALLE
contratistaCtrl.getInfoDetalle = (req, res) => {
    console.log(`### getInfoDetalle value: ${JSON.stringify(req.body)}`)
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

    res.render('contratista',{
        //Banner
        prefixOCID: req.params.prefixOCID,
        partyid: req.params.partyid,

        texto_identificador: 'RFC:',
        identificador_banner: '',
        texto_fecha_actualizacion: '',
        icono_fecha_actualizacion: '',
        fecha_actualizacion: '',
        title: '',
        texto_contacto: 'Contacto:',
        descriptionC: '',
        texto_direccion: 'Dirección:',
        descriptionD: '',
        texto_sector: 'Sector:',
        descriptionS: '',
        icono_1 : '',
        icono_2 : '/images/iconos/proyectos1/dinerosimbolo_blanco.svg',
        icono_3 : '/images/iconos/contratacionesblanco.svg',
        cifra_1: '',
        cifra_2: '$ 0',
        cifra_3: '0',
        texto_1: '',
        texto_2: 'Monto recibido (MXN)',
        texto_3: 'Contrataciones',

        //Mostrar Filtros en barra de menú
        valor: '0',

        //Datos de contacto
        emailDC: '',
        phoneDC: '',
        webDC: '',
        icon_email: '/images/iconos/correoelectronicoRojo.svg',
        icon_phone: '/images/iconos/telefonoRojo.svg',
        icon_web: '/images/iconos/urlRojo.svg',

        //Lista de contrataciones
        contrataciones: contrataciones

    });
}

module.exports = contratistaCtrl;