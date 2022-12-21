const helper = require('../common/helper');
const indexCtrl = {};

indexCtrl.getPhoneNumber = async (req, res) => {
    console.log(`### getPhoneNumber value: ${JSON.stringify(req.body)}`)
    helper.displayErrorLog();
}

module.exports = indexCtrl;