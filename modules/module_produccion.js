const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const modulos = require('../config/modules_config');
const op = Sequelize.Op;
const modulesConfig = require('../config/modules_config');


module.exports = {

    //before y after de acciones
    beforeCreate: async (instance) => instance,
    beforeUpdate: async (instance) => instance,
    afterCreate: async (instance) => { },
    afterUpdate: async (instance) => { },

    //estados

    validar: async function (instance) {

        //PRODUCCION
        await db.Produccion.update({ estado: 'VALIDA' }, { where: { id: instance.id } });

        //PRODUCCION ITEM
        await db.ProduccionItem.update({ estado: 'TERMINADO', }, { where: { produccion_id: instance.id } });

        //parametros COMPONENTES
        let parametros_actualizacion = {};
        if(modulos.moduloDespachoActivado) parametros_actualizacion = {estado: 'BODEGA' , 'estado_despacho': 'PENDIENTE', 'estado_produccion': 'FINALIZADO'};
        else if(modulos.moduloInstalacionActivado) parametros_actualizacion= {estado: 'ENTREGADO' , 'estado_instalacion': 'PENDIENTE', 'estado_produccion': 'FINALIZADO'};

        //actualizamos COMPONENTES
        await db.ProductoComponente.update( parametros_actualizacion, { where: { produccion_id: instance.id }});

       
    },

}