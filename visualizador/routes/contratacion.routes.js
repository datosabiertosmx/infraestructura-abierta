const express = require('express');
const router = express.Router();
const contratacionCtrl = require('../controllers/contratacion.controller');

router.get('/contrataciones/', contratacionCtrl.getInfo);

router.get('/contrataciones/:year/:entity/:implementer', contratacionCtrl.getInfo);

router.get('/contratacion/:prefixOCID&:ocid', contratacionCtrl.getInfoDetalle);

module.exports = router;