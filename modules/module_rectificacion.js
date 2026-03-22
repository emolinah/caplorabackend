const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const modulos = require('../config/modules_config');

module.exports = {

    //before y after de acciones
    beforeCreate: async (instance) => instance,
    beforeUpdate: async (instance) => instance,
    afterCreate: async (instance) => { },
    afterUpdate: async (instance) => { },
    //estados
    validar: async function (instance) {

        //VALIDAMOS la RECTIFICACION
        await db.Rectificacion.update({ estado: 'VALIDA' }, { where: { id: instance.id } });

        //PRODUCCION ITEM
        await db.RectificacionItem.update({ estado: 'TERMINADO' }, { where: { rectificacion_id: instance.id } });

        //RECTIFICAMOS los PRODUCTOS
        await db.Producto.update({ estado: 'RECTIFICADO' }, { where: { rectificacion_id: instance.id } });

        //creamos un LISTADO IDS de los PRODUCTOS rectificados
        const rectificacion_productos = await db.Producto.findAll({ attributes: ['id'],  where: { rectificacion_id: instance.id } });
        const ids_productos = rectificacion_productos.map(r => r.id);

        //parametros de actualizacion para INICIAR al primer modulo que este ACTIVO
        let parametros_actualizacion = {estado: 'RECTIFICADO' };
        if(modulos.moduloProduccionActivado) parametros_actualizacion = {estado: 'PRODUCCION' , 'estado_produccion': 'PENDIENTE'};
        else if(modulos.moduloDespachoActivado) parametros_actualizacion = {estado: 'BODEGA' , 'estado_despacho': 'PENDIENTE'};
        else if(modulos.moduloInstalacionActivado) parametros_actualizacion= {estado: 'ENTREGADO' , 'estado_instalacion': 'PENDIENTE'};

        //actualizamos los COMPONENTES para comenzar su flujo
        await db.ProductoComponente.update(parametros_actualizacion, { 
            where: { producto_id: {[op.in]: ids_productos} }
        });
        
    },

    agregarProducto: async function (producto_id, rectificacion_id, proceso_venta_id, responsable_id) {
        //actualizamos la el producto
        await db.Producto.update({
            'estado': 'RECTIFICANDO',
            'rectificacion_id': rectificacion_id,
            'proceso_venta_id': proceso_venta_id,
        }, { where: { id: producto_id } });

        await db.Historico.create({
            actividad: `Se agregó el producto #${producto_id}`,
            modelo: 'Producto',
            modelo_id: producto_id,
            rect_id: rectificacion_id,
            usuario_id: responsable_id,
        });

        //actualizamos los componentes del producto
        await db.ProductoComponente.update({
            'rectificacion_id': rectificacion_id,
            'proceso_venta_id': proceso_venta_id,
        }, { where: { 'producto_id': producto_id } });

        var proceso_venta = await db.ProcesoVenta.findOne({
            where: { 'id': proceso_venta_id },
        });
        var producto = await db.Producto.findOne({
            where: { 'id': producto_id },
        });
        await db.ProcesoVenta.update({
            'total_impuesto': producto.dataValues.impuesto + proceso_venta.dataValues.total_impuesto,
            'total_neto': producto.dataValues.neto + proceso_venta.dataValues.total_neto,
            'total': producto.dataValues.total + proceso_venta.dataValues.total,
        }, { where: { 'id': proceso_venta.dataValues.id } });

    },

}