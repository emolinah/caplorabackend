//const auth = require('../middlewares/auth');
const app_routes = require('../routes');
var express = require('express');
var auth = require('../middlewares/auth');
const kemail = require('../middlewares/kemail');
function loadController(controller, authFunction, router){

    //recorremos las acciones del controlador
    //dependiendo del nombre de la accion (formato establecido) se establece
    //el tipo de ruta POST PUT GET DELETE
    for (const actionName in controller) {
        
        if(actionName.indexOf('_create') !== -1){
            router.post(`/${actionName}`, authFunction, controller[actionName]);
        }
        if(actionName.indexOf('_update') !== -1){
            router.put(`/${actionName}`, authFunction, controller[actionName]);
        }
        if(actionName.indexOf('_index') !== -1 || actionName.indexOf('_edit') !== -1){
            router.get(`/${actionName}`, authFunction, controller[actionName]);
        }
        if(actionName.indexOf('_delete') !== -1){
            router.delete(`/${actionName}`, authFunction, controller[actionName]);
        }
    }    

    return router;
}

function loadRoutes(app) {
    let router_login = express.Router();
    router_login.post(`/login`, auth.login);
    router_login.post(`/logout`, auth.logout);
    router_login.post(`/index`, auth.index);    
    app.use(`/auth`, router_login);

    //rutas de Correo
    
    let router_email = express.Router();
    router_email.post('/email', (req, res, next) => { kemail.correoBody(req.body.bodyObject); res.sendStatus(200); });
    router_email.post('/recuperar', (req, res, next) => { kemail.correoBodyRecuperar(req.body.bodyObject); res.sendStatus(200); });
    app.use(`/email`, router_email);

    //recorremos las rutas del archivo

    for (const route_name in app_routes) {

        //listado de rutas definidas

        let controller_list = app_routes[route_name]['controllers'] ?? [];
        let authFunction = app_routes[route_name]['authFunction'] ?? null;

        //router de express

        let router = express.Router();

        //recorrer los controladores que tiene asignada la ruta

        controller_list.forEach(controller => {
            router = loadController(controller, authFunction, router);
        });
        app.use(`/${route_name}`, router);
    }
}

module.exports = {
    loadController: loadController,
    loadRoutes: loadRoutes
};