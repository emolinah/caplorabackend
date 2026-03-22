const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const { fn, col } = require("sequelize");

module.exports = {

    //before y after de acciones
    beforeCreate: async (instance) => instance,
    beforeUpdate: async (instance) => instance,
    afterCreate: async (instance) => { },
    afterUpdate: async (instance) => instance,

    //campos
    imprevisto: async (instance) => { },
    imprevistoResuelto: async (instance) => { },
    updateTotales: async (instance, empresa_id) => {
        const results = await db.Producto.findAll({
            attributes: [
                "id",
                [fn("SUM", col("impuesto")), "impuesto"],
                [fn("SUM", col("neto")), "neto"],
                [fn("SUM", col("total")), "total"],
            ],
            where: {proceso_venta_id: instance, empresa_id: empresa_id}, // Agrupar por ID
        });
        const resultObject = results[0].get({ plain: true });



        await db.ProcesoVenta.update({
            'total_impuesto': resultObject.impuesto,
            'total_neto': resultObject.neto,
            'total': resultObject.total,
        }, 
        { where: { 'id': instance} });


    },
}