const express = require('express');
const router = express.Router();
const proyectoCtrl = require('../controllers/proyecto.controller');

router.get('/proyectos/', proyectoCtrl.getInfo);

router.get('/proyectos/:year/:entity/:implementer', proyectoCtrl.getInfo);

router.get('/proyecto/:prefixOC4ID&:identifier', proyectoCtrl.getInfoDetalle);

module.exports = router;