const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const { Op, literal } = require('sequelize');

module.exports = {


    //al crear un producto, se verifica si tiene componenetes de catalogo, si se cumple,
    //clonamos los componentes existentes en el catalogo y los entregamos al producto enviado
    verificarCatalogoItems: async (producto, usuario_id) => {

        var test = await db.CatalogoItem.findOne({
            where: { 'id': producto.catalogo_item_id },
            include: [
                { model: db.CatalogoComponente, as: 'componentes' },
            ],
        });

        test.componentes.forEach(async (componenteInstance) => {

            //creamos el componente del producto a traves de 
            let nueva_instance = await db.ProductoComponente.create({
                tipo: componenteInstance.tipo,
                codigo: componenteInstance.codigo,
                nombre: componenteInstance.nombre,
                descripcion: componenteInstance.descripcion,
                material: componenteInstance.material,
                medida_ancho: componenteInstance.medida_ancho,
                medida_alto: componenteInstance.medida_alto,
                medida_unidad: componenteInstance.medida_unidad,
                producto_id: producto.id,
                empresa_id: usuario_id
            });
            
        });
    },
    actualizarCreateProcesoVentaTotales: async (producto) => {
        var test = await db.ProcesoVenta.findOne({
            where: { 'id': producto.proceso_venta_id },
        });
        await db.ProcesoVenta.update({
            'total_impuesto': producto.impuesto + test.dataValues.total_impuesto,
            'total_neto': producto.neto + test.dataValues.total_neto,
            'total': producto.total + test.dataValues.total,
        }, { where: { 'id': test.dataValues.id } });



    },
    actualizarUpdateProcesoVentaTotales: async (before, after) => {
        const totalDifference = before.total - after.total;
        const impuestoDifference = before.impuesto - after.impuesto;
        const netoDifference = before.neto - after.neto;

        // Encontrar el ProcesoVenta correspondiente
        var proceso_venta = await db.ProcesoVenta.findOne({
            where: { 'id': after.proceso_venta_id },
        });

        if (proceso_venta) {

            // Actualización del proceso de venta según la diferencia
            await db.ProcesoVenta.update({
                'total_impuesto': proceso_venta.dataValues.total_impuesto + impuestoDifference,  // Se suma o resta la diferencia de impuesto
                'total_neto': proceso_venta.dataValues.total_neto + netoDifference,  // Se suma o resta la diferencia de neto
                'total': proceso_venta.dataValues.total + totalDifference,  // Se suma o resta la diferencia al total
            }, { where: { 'id': proceso_venta.dataValues.id } });

        } else {
            // Si no existe el ProcesoVenta, no hacer nada o manejar el caso
            console.log('No existe el proceso de venta para este producto');
        }

    },
    agregarEmpresa: async function (base_datos, usuario_id, id){
        var usuario = await db.Usuario.findOne({
            where: { 'id': usuario_id },
        });
        await base_datos.update({ empresa_id: usuario.empresa_id }, { where: {id:id}});
    }
    //RECTIFICACION/////////////////////////////////////////////////
    
    
   
   
    
   

}