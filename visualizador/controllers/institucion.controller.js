const helper = require('../common/helper');
const institucionCtrl = {};

// INSTITUCIONES
institucionCtrl.getInfo = (req, res) => {
    console.log(`### getInfo value: ${JSON.stringify(req.body)}`)
    var instituciones = new Array();
    var institucion = new Object({
        //Lista de instituciones
        identificador: 'SIASI-000128',
        nombre_institucion: 'Secretaría de Salud',
        icono_lista_1: '/images/iconos/institucionespublicasrojo.svg',
        cantidad_proyecto: '3',
        cantidad_contrataciones: '8',
        icono_contacto: '/images/iconos/contratistarojo.svg',
        contacto: 'Jesús Salvador Pérez Rodríguez',
        icono_url: '/images/iconos/urlRojo.svg',
        url: 'http://prueba.com',
        monto: '$214,017,134'
    });

    instituciones.push(institucion);

    res.render('instituciones',{
        // Banner
        paramYear : req.params.year,
        paramEntity : req.params.entity,
        paramImplementer : req.params.implementer,
        texto_identificador: '',
        identificador_banner: '',
        texto_fecha_actualizacion: '',
        icono_fecha_actualizacion: '',
        fecha_actualizacion: '',
        title: 'Instituciones públicas',
        description: 'Lista de instituciones que han participado en proyectos de infraestructura y/o contrataciones públicas.',
        dato_1: '',
        dato_2: '',
        icono_1 : '/images/iconos/institucionespublicasblanco.svg',
        icono_2 : '/images/iconos/proyectoblanco.svg',
        icono_3 : '/images/iconos/contratacionesblanco.svg',
        cifra_1: '0',
        cifra_2: '0',
        cifra_3: '0',
        texto_1: 'Instituciones públicas',
        texto_2: 'Promedio de proyectos',
        texto_3: 'Promedio de contrataciones',

        //Mostrar Filtros en barra de menú
        valor: '0',
    
        //Lista de instituciones
        instituciones: instituciones
    });

}

// INSTITUCIONES DETALLE
institucionCtrl.getInfoDetalle = (req, res) => {
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

    res.render('institucion',{
        //Banner
        prefixOC4ID: req.params.prefixOC4ID,
        partyid: req.params.partyid,

        texto_identificador: 'RFC:',
        identificador_banner: '',
        texto_fecha_actualizacion: '',
        icono_fecha_actualizacion: '',
        fecha_actualizacion: '',
        title: '',
        texto_legalname: 'Razón social:',
        descriptionL: '',
        texto_contacto: 'Contacto:',
        descriptionC: '',
        texto_direccion: 'Dirección:',
        descriptionD: '',
        icono_1 : '/images/iconos/proyectos1/dinerosimbolo_blanco.svg',
        icono_2 : '/images/iconos/proyectoblanco.svg',
        icono_3 : '/images/iconos/contratacionesblanco.svg',
        cifra_1: '$ 0',
        cifra_2: '0',
        cifra_3: '0',
        texto_1: 'Monto contratado (MXN)',
        texto_2: 'Proyectos',
        texto_3: 'Contrataciones',

        //Mostrar Filtros en barra de menú
        valor: '0',

        //Datos de contacto
        emailDI: '',
        phoneDI: '',
        webDI: '',
        icon_email: '/images/iconos/correoelectronicoRojo.svg',
        icon_phone: '/images/iconos/telefonoRojo.svg',
        icon_web: '/images/iconos/urlRojo.svg',

        //Lista de contrataciones
        contrataciones: contrataciones

    });
}

module.exports = institucionCtrl;