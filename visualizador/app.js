const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const globals = require('./common/globals');
const cors = require('cors');
const app = express();

// Settings
app.set('port', process.env.PORT || globals.site.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({origin: `http://localhost:5000`}));

// Routes
app.use(require('./routes/index'))
app.use(require('./routes/contratacion.routes'))
app.use(require('./routes/contratista.routes'))
app.use(require('./routes/indicador.routes'))
app.use(require('./routes/institucion.routes'))
app.use(require('./routes/proyecto.routes'))

// Server start
app.listen(app.get('port'), () => {
    console.log(`servidor en el puerto ${app.get('port')}`)
})