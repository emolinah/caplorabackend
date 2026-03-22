var auth = require('./middlewares/auth');

const app_routes = {
    
    administracion: {
        authFunction: auth.verifyToken,
        controllers: [

            //base
            require('./controllers/UsuarioController'),
            require('./controllers/ProyectoController'),
            require('./controllers/ProcesoController'),
            require('./controllers/ProductoController'),
            require('./controllers/HistoricoController'),
            require('./controllers/MensajeController'),
            require('./controllers/NotaController'),
            require('./controllers/EmpresaController'),
            require('./controllers/EtiquetaController'),
            require('./controllers/CatalogoItemController'),

            

        ],
    },
    supervisor: {
        authFunction: auth.verifyToken,
        controllers: [
            
            require('./controllers/UsuarioController'),
            require('./controllers/CatalogoItemController'),
            require('./controllers/ProyectoController'),
            require('./controllers/ProductoController'),
            require('./controllers/HistoricoController'),
            require('./controllers/MensajeController'),
            require('./controllers/NotaController'),
            require('./controllers/EmpresaController'),
            require('./controllers/ProcesoController'),
            require('./controllers/EtiquetaController'),

        ],
    },
    operador: {
        authFunction: auth.verifyToken,
        controllers: [
            
        ],
    },
    
}

module.exports = app_routes;