const express = require('express');
const router = express.Router();
const contratistaCtrl = require('../controllers/contratista.controller');

router.get('/contratistas/', contratistaCtrl.getInfo);

router.get('/contratistas/:year/:entity/:implementer', contratistaCtrl.getInfo);

router.get('/contratista/:prefixOCID&:partyid', contratistaCtrl.getInfoDetalle);

module.exports = router;