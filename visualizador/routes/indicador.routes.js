const express = require('express');
const router = express.Router();
const indicadorCtrl = require('../controllers/indicador.controller');

router.get('/indicadores/', indicadorCtrl.getInfo);

router.get('/indicadores/:year/:entity/:implementer', indicadorCtrl.getInfo);

module.exports = router;