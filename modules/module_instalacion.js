const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const { Op, literal } = require('sequelize');
const modulesConfig = require('../config/modules_config');

module.exports = {

    //before y after de acciones
    beforeCreate : async(instance) => instance,
    beforeUpdate : async(instance) => instance,
    afterCreate : async(instance) => {},
    afterUpdate : async(instance) => {},

    //estados
    validar : async(instance) => {

        //DESPACHO
        await db.Instalacion.update({ estado: 'VALIDA' }, { where: { id: instance.id } });

        //DESPACHO ITEM
        await db.InstalacionItem.update({ estado: 'TERMINADO' }, { where: { instalacion_id: instance.id } });

        //PRODUCTO COMPONENTE
        await db.ProductoComponente.update({ estado_instalacion: 'FINALIZADO', estado: 'INSTALADO',},  { where: {instalacion_id : instance.id} });
    },
    

}