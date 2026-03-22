const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const modulos = require('../config/modules_config');
const op = Sequelize.Op;
const module_proceso_venta = require('./module_proceso_venta');

module.exports = {

    //before y after de acciones
    beforeCreate: async (instance) => instance,
    beforeUpdate: async (instance) => instance,
    afterCreate: async (instance) => {},
    afterUpdate: async (instance) => { },
    //Generacion y Actualizacion de Productos, Componentes y Totales en Proceso de Venta
    validar: async function (instance) {
        //buscamos la COTIZACION y las propiedades necesarias
        let cotizacion_instance = await db.Cotizacion.findOne({
            where: { id: instance.id },
            include: [
                {
                    model: db.CotizacionItem, as: 'items', include: [
                        {
                            model: db.CatalogoItem, as: 'producto', include: [
                                { model: db.CatalogoComponente, as: 'componentes' }
                            ]
                        },
                    ]
                },
            ]
        });
        //existe el PROCESO VENTA
        let procesoventa_instance = {};
        if (instance.proceso_venta_id == null) {
            procesoventa_instance = await db.ProcesoVenta.create({
                proceso_numero: cotizacion_instance.numero,
                proceso_codigo: cotizacion_instance.codigo,
                fecha_inicio: cotizacion_instance.fecha_inicio,
                fecha_termino: cotizacion_instance.fecha_termino,
                nombre: cotizacion_instance.cliente_nombre,
                fecha_creacion: new Date(),
                direccion: cotizacion_instance.direccion,
                comuna: cotizacion_instance.comuna,
                cotizacion_numero: cotizacion_instance.numero,
                supervisor_id: cotizacion_instance.supervisor_id,
            });
        }
        else {
            procesoventa_instance.id = instance.proceso_venta_id;
            is_new_proceso_venta = false;
        }

        //Actualizamos la cotizacion
        await db.Cotizacion.update({ proceso_venta_id: procesoventa_instance.id, estado: 'APROBADA' }, { where: { id: instance.id } });

        // Recorremos ITEMS COTIZACION y creamos los PRODUCTOS 
        for (const cotizacion_item of cotizacion_instance['items']) {

            // Clonamos el PRODUCTO para crear una plantilla e insertar
            var producto_clonado = cotizacion_item['producto'];
            var producto_nuevo = {
                'proceso_venta_id': procesoventa_instance.id,
                'cotizacion_id': producto_clonado.id,

                'nombre': producto_clonado.nombre,
                'codigo': producto_clonado.codigo,
                'descripcion': producto_clonado.descripcion,
                'caracteristicas': producto_clonado.caracteristicas,
                'marca': producto_clonado.marca,
                'modelo': producto_clonado.modelo,
                'ano': producto_clonado.ano,
                'fabricante': producto_clonado.fabricante,
                'peso': producto_clonado.peso,
                'volumen': producto_clonado.volumen,

                'medida_ancho': producto_clonado.medida_ancho,
                'medida_alto': producto_clonado.medida_alto,
                'medida_unidad': producto_clonado.medida_unidad,
                'materiales': producto_clonado.materiales,
                'color': producto_clonado.color,

                'costo_produccion': producto_clonado.costo_produccion,
                'venta_margen': producto_clonado.venta_margen,
                'venta_comision': producto_clonado.venta_comision,
                'impuesto': producto_clonado.impuesto,
                'neto': producto_clonado.neto,
                'total': producto_clonado.total,
                'precio_costo': producto_clonado.precio_costo,
            }

            // Según la CANTIDAD del ITEM creamos tantos PRODUCTOS
            var cantidad_item = cotizacion_item['cantidad'];

            for (let i = 0; i < cantidad_item; i++) {

                let producto_instance = await db.Producto.create(producto_nuevo);

                // Creamos los COMPONENTES del PRODUCTO
                for (const componente_producto of producto_clonado['componentes']) {

                    var componente_nuevo = {
                        'producto_id': producto_instance.id,
                        'proceso_venta_id': procesoventa_instance.id,
                        'cotizacion_id': cotizacion_instance.id,
                        'tipo': componente_producto.tipo,
                        'codigo': componente_producto.codigo,
                        'nombre': componente_producto.nombre,
                        'descripcion': componente_producto.descripcion,
                        'material': componente_producto.material,
                        'medida_ancho': componente_producto.medida_ancho,
                        'medida_alto': componente_producto.medida_alto,
                        'medida_unidad': componente_producto.medida_unidad,
                    }

                    await db.ProductoComponente.create(componente_nuevo);
                }
            }
        }

        // Una vez terminada la creación de productos y componentes, actualizamos los totales
        await module_proceso_venta.updateTotales(procesoventa_instance.id);

    },
}