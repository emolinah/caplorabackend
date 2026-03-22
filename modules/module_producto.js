const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

module.exports = {

    //before y after de acciones
    beforeCreate : async(instance) => {
        instance['estado_rectificacion'] = 'PLANIFICACION';
        return instance;
    },
    beforeUpdate : async(instance) => instance,
    afterCreate : async(instance) => {},
    afterUpdate : async(instance) => instance,

    //campos
    imprevisto:  async(instance) => {},
    imprevistoResuelto:  async(instance) => {},
    // estadoValidar : async(instance) => {
        
    //     await db.Rectificacion.update({estado: 'VALIDA'}, {where: {id : instance.id}});
    //     await db.Item.update({estado: 'PRODUCCION_PLANIFICACION'}, {where: {rectificacion_id : instance.id}});
        
    // },

}