const express = require('express');
const router = express.Router();
var db_conf = require('../../captura/db_conf');

router.get('/', async (req, res) => {
    db_conf.edca_db.task(function (t) {
        return this.batch([
            this.manyOrNone('SELECT * FROM public.edcapi_project_sectors;'), 
            this.manyOrNone('SELECT * FROM public.edcapi_project_statuses;'), 
            this.manyOrNone('SELECT * FROM public.edcapi_project_types;')
        ]);
    }).then(function (data) {
        res.render('index',{
            //Params
            paramYear : 0,
            paramEntity : 0,
            paramImplementer : 0,
            //Banner
            title: 'Infraestructura Abierta',
            title_detalle: '',
            description: 'Portal de publicación de información de proyectos de infraestructura.',

            //Breadcrum
            valor: '',

            //Mapa
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
    
});

router.get('/:year/:entity/:implementer', async (req, res) => {
    db_conf.edca_db.task(function (t) {
        return this.batch([
            this.manyOrNone('SELECT * FROM public.edcapi_project_sectors;'), 
            this.manyOrNone('SELECT * FROM public.edcapi_project_statuses;'), 
            this.manyOrNone('SELECT * FROM public.edcapi_project_types;')
        ]);
    }).then(function (data) {
        res.render('index',{
            //Params
            paramYear : req.params.year,
            paramEntity : req.params.entity,
            paramImplementer : req.params.implementer,
            //Banner
            title: 'Infraestructura Abierta',
            title_detalle: '',
            description: 'Portal de publicación de información de proyectos de infraestructura.',

            //Breadcrum
            valor: '',

            //Mapa
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
    
});

router.get('/acerca', (req, res) => {
    res.render('acerca',{
        //Banner
        title: 'Acerca de Infraestructura Abierta',
        title_detalle: '',
        description: '',

        //Mostrar Filtros en barra de menú
        valor: '0',
        valor_1: '1'
    });
});

router.get('/glosario', (req, res) => {
    res.render('glosario',{
        //Banner
        title: 'Glosario',
        title_detalle: 'En la Plataforma se encuentran distintos conceptos que aquí se detallan.',
        description: '',

        //Mostrar Filtros en barra de menú
        valor: '0',
        valor_1: '1'
    });
});

module.exports = router;