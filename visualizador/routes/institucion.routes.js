const express = require('express');
const router = express.Router();
const institucionCtrl = require('../controllers/institucion.controller');

router.get('/instituciones/', institucionCtrl.getInfo);

router.get('/instituciones/:year/:entity/:implementer', institucionCtrl.getInfo);

router.get('/institucion/:prefixOC4ID&:partyid', institucionCtrl.getInfoDetalle);

module.exports = router;