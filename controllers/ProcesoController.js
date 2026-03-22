const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const KServer = require('../middlewares/kserver');

const ModuloMain = require('../modules/module_main');


module.exports = {

    'proceso_index': async (req, res) => {
        
        try {

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

            let setup = {
                where: where,

                include: [
                    { 
                        model: db.Etiqueta, 
                        as: 'etiquetas',
                        include: [
                            { model: db.EtiquetaBase, as: 'etiqueta_base' }
                        ]
                    }
                ],

                offset: parseInt(req.query.queryOffset) || 0,
                limit: parseInt(req.query.queryLimit) || 10,
            };

            let result = await db.Proceso.findAndCountAll(setup);

            KServer.response({ res: res, status: 200, result: result.rows, count: result.count });
        } catch (error) {
            KServer.response({ res: res, status: 500, });
        }
    },

    'proceso_create': async (req, res) => {
        var model_instance = req.body;
        model_instance.empresa_id = req.user.user.empresa_id;
        model_instance = await KQuery.create({ model: db.Proceso, req: { body: model_instance } });
        
        await db.Historico.create({
            actividad: `Proceso creado`,
            propiedad: 'estado',
            propiedad_valor: model_instance['estado'],
            modelo: 'PROCESO',
            modelo_id: model_instance['id'],
            proc_venta_id: model_instance['id'],
            usuario_id: req.user.user.id,
        });


        res.status(200).send({ data: model_instance, error_description: "", });

    },
    'proceso_categoria_index' :async(req, res) => {
        let data = await KQuery.findAll({
            model: db.ProcesoCategoria, 
            req: req,
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    'proceso_edit': async (req, res) => {
        try {
            let model_instance = await db.Proceso.findOne({
                where: {id : req.query.id},
                include: [
                    { 
                        model: db.Etiqueta, 
                        as: 'etiquetas',
                        include: [
                            { model: db.EtiquetaBase, as: 'etiqueta_base' },
                        ]
                    },
                    // { model: db.Usuario, as: 'supervisor' },
                    // { model: db.Etiqueta, as: 'etiquetas' },
                    
                    // {
                    //     model: db.Imprevisto, as: 'imprevistos',
                    //     where: { estado: "ACTIVO" },
                    //     required: false,
                    // },
                ],
            }); 
            res.status(200).send({ data: model_instance, error_description: "" });
        } catch (error) {
            KServer.response({ res: res, status: 500, });
        }
    },

    'proceso_update': async (req, res) => {
        //MODULO acciones

        var model_instance = req.body;

        await KQuery.update({ model: db.Proceso, req: { body: model_instance } });

        if (model_instance['estado'] != null) {
            await db.Historico.create({
                actividad: `Proceso Actualizado.`,
                propiedad: 'estado',
                propiedad_valor: model_instance['estado'],
                modelo: 'PROCESO',
                modelo_id: model_instance['id'],
                proc_venta_id: model_instance['id'],
                usuario_id: req.user.user.id,
            });
        }

        res.status(200).send({ data: model_instance, error_description: "", });


    },

}
