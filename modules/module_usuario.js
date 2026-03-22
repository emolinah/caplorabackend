const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');
const op = Sequelize.Op;

module.exports = {

    //before y after de acciones
    beforeCreate: async (instance) => { },
    beforeUpdate: async (instance) => { },
    afterCreate: async (instance) => { },
    afterUpdate: async (instance) => { },

    //campos
    passwordReset: async (unscrypted_password) => {
        try {
            const encripted_password = await bcryptjs.hash(unscrypted_password, 8);
            return encripted_password;
        } catch (error) {
            throw new Error('Error al encriptar la contraseña: ' + error.message);
        }
    },
    // estadoValidar : async(instance) => {

    //     await db.Rectificacion.update({estado: 'VALIDA'}, {where: {id : instance.id}});
    //     await db.Item.update({estado: 'PRODUCCION_PLANIFICACION'}, {where: {rectificacion_id : instance.id}});

    // },

}