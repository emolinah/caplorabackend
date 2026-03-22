const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const ModuloProducto = require('../modules/module_producto');
const ModuleMain = require('../modules/module_main');
const module_proceso_venta = require('../modules/module_proceso_venta');

module.exports = {

    'producto_index': async (req, res) => {
        let where = {};
        
        if (req.query.nombre) {
            where.nombre = {
                [op.like]: `%${req.query.nombre}%`
            };
        }

        if (req.query.codigo) {
            where.codigo = {
                [op.like]: `%${req.query.codigo}%`
            };
        }

        if (req.query.proyecto_id) {
            where.proyecto_id = req.query.proyecto_id;
        }

        //include default de todas las etiquetas
        let includeEtiquetas = { 
            model: db.Etiqueta, 
            as: 'etiquetas',
            include: [
                { model: db.EtiquetaBase, as: 'etiqueta_base' }
            ]
        };

        //filtros por etiquetas base
        if (req.query.etiqueta_base_ids) {
            let array = JSON.parse(req.query.etiqueta_base_ids);
            includeEtiquetas.where = {
                etiqueta_base_id: {
                    [op.in]: array
                },
            };
            required: true,
            includeEtiquetas.required = true;
        }

        let setup = {
            where: where,
            include: [
                includeEtiquetas
            ],
            offset: parseInt(req.query.queryOffset) || 0,
            limit: parseInt(req.query.queryLimit) || 10,
        };

        let producto_list = await db.Producto.findAndCountAll(setup);

        const etiqueta_list = await db.EtiquetaBase.findAll({where: {'modelo': 'PRODUCTO'},});


        res.status(200).send({
            data: {
                etiquetas: etiqueta_list,
                productos: producto_list.rows,
            },
            count: producto_list.count,
            error_description: ""
        });
    },

    'producto_proceso_edit': async (req, res) => {

        const proyecto_id = req.query.proyecto_id;

        //obtenemos el PROCESO VENTA para en la pantalla mostrar los totales de productos
        let proyecto = await db.Proyecto.findOne({ where: { id: proyecto_id }, });

        //listado de PRODUCTOS
        let data = await KQuery.findAll({
            model: db.Producto,
            req: req,
            include: [
                //{ model: db.Etapa, as: 'etapa' },
                //{ model: db.ProcesoVenta, as: 'proceso_venta' },
                //{ model: db.CatalogoItem, as: 'catalogo_item' },
                {
                    model: db.Etiqueta, as: 'etiquetas', required: false, include: [
                       
                    ]
                },
                
                {
                    model: db.Imprevisto, as: 'imprevistos', required: false, include: []
                },
                // { model: db.Checklist, as: 'checklist', required: false, include: [
                //     { model: db.ChecklistItem, as: 'items', required: false, include: [
                //         { model: db.Usuario, as: 'responsable' },
                //     ],},
                // ]},

            ]
        });

        let return_data = { proceso_venta: proyecto, productos: data.rows };
        res.status(200).send({ data: return_data, count: data.count, error_description: "" });
    },
    'producto_create': async (req, res) => {

        var parameters = req.body;
        
        parameters.empresa_id = req.user.user.empresa_id;
        //MODULO before create

        let model_instance = await KQuery.create({ model: db.Producto, req: req });
        if (model_instance.dataValues.estado != null) {
            await db.Historico.create({
                actividad: `Producto Creado.`,
                propiedad: 'estado',
                propiedad_valor: model_instance.dataValues.estado,
                modelo: 'PRODUCTO',
                modelo_id: model_instance.dataValues.id,
                producto_id: model_instance.dataValues.id,
            });
        }        
        var usuario = await db.Usuario.findOne({
            where: { id: req.user.user.id },
        });

        // Una vez terminada la creación del producto actualizamos los totales
        await module_proceso_venta.updateTotales(req.body.proceso_venta_id, req.user.user.empresa_id);

        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'producto_edit': async (req, res) => {
        let model_instance = await KQuery.edit({
            model: db.Producto,
            req: req,
            include: [
                
                { model: db.Proyecto, as: 'proyecto' },
                
                { 
                    model: db.Etiqueta, 
                    as: 'etiquetas',
                    include: [
                        { model: db.EtiquetaBase, as: 'etiqueta_base' },
                    ]
                },
                
                { model: db.Mensaje, as: 'mensajes' },
                { model: db.Historico, as: 'historial' },
                {
                    model: db.Imprevisto, as: 'imprevistos',
                    required: false,
                    include: [
                        { model: db.Usuario, as: 'supervisor' },
                        { model: db.Usuario, as: 'encargado' },
                    ]
                },
                {
                    model: db.Nota, as: 'notas',

                    required: false,
                    include: [
                        { model: db.Usuario, as: 'usuario_creador' },
                    ]
                },
                {
                    model: db.Checklist, as: 'checklist',
                    required: false,
                    include: [
                        {
                            model: db.ChecklistItem, as: 'items',
                            required: false,
                            include: [
                                { model: db.Usuario, as: 'responsable' },
                            ],
                        },
                    ]
                },

            ]
        });
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'producto_update': async (req, res) => {
        var before = req.body;
       

        after = await db.Producto.findOne({ where: { id: before.id, empresa_id: req.user.user.empresa_id } });

        var model_instance = await db.Producto.update(req.body, { where: { id: req.body.id } },);

        if (after.dataValues.estado != null) {
            await db.Historico.create({
                actividad: `Producto Actualizado.`,
                propiedad: 'estado',
                propiedad_valor: after.dataValues.estado,
                modelo: 'PRODUCTO',
                modelo_id: after.dataValues.id,
                producto_id: after.dataValues.id,
            });
        }

        //ModuleMain.actualizarUpdateProcesoVentaTotales(before, after.dataValues);

        res.status(200).send({ data: model_instance, error_description: "" });
    },
    
    'producto_import_create': async (req, res) => {

        var parameters = req.body;
        
        parameters.empresa_id = req.user.user.empresa_id;

        // let model_instance = await KQuery.create({ model: db.Producto, req: req });
        // if (model_instance.dataValues.estado != null) {
        //     await db.Historico.create({
        //         actividad: `Producto Creado.`,
        //         propiedad: 'estado',
        //         propiedad_valor: model_instance.dataValues.estado,
        //         modelo: 'Producto',
        //         modelo_id: model_instance.dataValues.id,
        //         producto_id: model_instance.dataValues.id,
        //     });
        // }        

        res.status(200).send({ data: model_instance, error_description: "", });
    },


    'productolist_create': async (req, res) => {
        try {
            const { producto_catalogo_id, cantidad, proyecto_id, proceso_id } = req.body;

            /// 🔒 VALIDACIONES
            if (!producto_catalogo_id) {
                return res.status(400).json({
                    ok: false,
                    message: 'producto catalogo es requerido'
                });
            }

            if (!cantidad || cantidad <= 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'cantidad debe ser mayor a 0'
                });
            }

            if (!proyecto_id) {
                return res.status(400).json({
                    ok: false,
                    message: 'proyecto es requerido'
                });
            }

            /// 🔍 BUSCAR EN CATALOGO
            const catalogoItem = await db.CatalogoItem.findOne({
                where: { id: producto_catalogo_id }
            });

            if (!catalogoItem) {
            return res.status(404).json({
                ok: false,
                message: 'CatalogoItem no encontrado'
            });
            }

            const empresa_id = req.user.user.empresa_id;

            /// 🔥 ARMAR DATA PARA BULK INSERT
            const data = Array.from({ length: cantidad }, () => ({
                codigo: catalogoItem.codigo,
                sku: catalogoItem.sku,
                nombre: catalogoItem.nombre,
                descripcion: catalogoItem.descripcion,
                caracteristicas: catalogoItem.caracteristicas,
                marca: catalogoItem.marca,
                modelo: catalogoItem.modelo,
                ano: catalogoItem.ano,
                fabricante: catalogoItem.fabricante,
                peso: catalogoItem.peso,
                volumen: catalogoItem.volumen,
                medida_ancho: catalogoItem.medida_ancho,
                medida_alto: catalogoItem.medida_alto,
                medida_unidad: catalogoItem.medida_unidad,
                materiales: catalogoItem.materiales,
                color: catalogoItem.color,

                /// relaciones
                //producto_catalogo_id: producto_catalogo_id,
                proyecto_id: proyecto_id || null,
                proceso_id: proceso_id || null,
                empresa_id: empresa_id,

                /// timestamps (por si acaso)
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            /// BULK INSERT
            const result = await db.Producto.bulkCreate(data);


            return res.json({
                ok: true,
                message: 'Productos creados desde catálogo',
                data: result
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                ok: false,
                message: 'Error al crear productos',
                error: error.message
            });
        }
    }

}

