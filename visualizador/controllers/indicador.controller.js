const helper = require('../common/helper');
const indicadorCtrl = {};

indicadorCtrl.getInfo = (req, res) => {
    res.render('indicador',{
        paramYear : req.params.year,
        paramEntity : req.params.entity,
        paramImplementer : req.params.implementer,
        title: 'Indicadores',
        title_detalle: '',
        description: '',

        //Mostrar Filtros en barra de menú
        valor: '0',
        valor_1: '1'
    });
}

module.exports = indicadorCtrl;