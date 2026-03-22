const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
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

        //DESPACHO
        await db.Despacho.update({ estado: 'VALIDO' }, { where: { id: instance.id } });

        //DESPACHO ITEM
        await db.DespachoItem.update({ estado: 'TERMINADO' }, { where: { despacho_id: instance.id } });
        
        //parametros COMPONENTES
        let parametros_actualizacion = { estado: 'FINALIZADO', estado_despacho: 'FINALIZADO', };
        if(modulesConfig.moduloInstalacionActivado) parametros_actualizacion = {estado: 'ENTREGADO' , 'estado_instalacion': 'PENDIENTE', estado_despacho: 'FINALIZADO',};

        //actualizamos COMPONENTES
        await db.ProductoComponente.update(parametros_actualizacion, { where: { despacho_id: instance.id } });
        
    },

}