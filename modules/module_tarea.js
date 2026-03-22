const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

module.exports = {

    //before y after de acciones
    beforeCreate : async(instance) => instance,
    beforeUpdate : async(instance) => instance,
    afterCreate : async(instance) => {},
    afterUpdate : async(instance) => {},


}