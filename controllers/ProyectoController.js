const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const KServer = require('../middlewares/kserver');

const ModuloMain = require('../modules/module_main');

//const KSEE = require('../middlewares/KSSE');

module.exports = {

    'proyecto_index': async (req, res) => {
        
        try {
            let result = await KQuery.findAll({
                model: db.Proyecto,
                req: req,
                include: [
                    // { model: db.Usuario, as: 'supervisor' },
                    // { model: db.Etiqueta, as: 'etiquetas' },
                    
                    // {
                    //     model: db.Imprevisto, as: 'imprevistos',
                    //     where: { estado: "ACTIVO" },
                    //     required: false,
                    // },
                ],
                // order: [[{ model: db.Historico, as: 'historial' }, 'createdAt', 'DESC']],
                //where: {empresa_id: req.user.user.empresa_id}
            });
            KServer.response({ res: res, status: 200, result: result.rows, count: result.count });
        } catch (error) {
            KServer.response({ res: res, status: 500, });
        }
    },

    'proyecto_create': async (req, res) => {
        var model_instance = req.body;
        model_instance.empresa_id = req.user.user.empresa_id;
        model_instance = await KQuery.create({ model: db.Proyecto, req: { body: model_instance } });
        
        await db.Historico.create({
            actividad: `Proceso Venta creado`,
            propiedad: 'estado',
            propiedad_valor: model_instance['estado'],
            modelo: 'PROYECTO',
            modelo_id: model_instance['id'],
            proc_venta_id: model_instance['id'],
            usuario_id: req.user.user.id,
        });


        res.status(200).send({ data: model_instance, error_description: "", });

    },

    'proyecto_edit': async (req, res) => {
        try {
            let model_instance = await db.Proyecto.findOne({
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

    'proyecto_update': async (req, res) => {
        //MODULO acciones

        var model_instance = req.body;

        await KQuery.update({ model: db.Proyecto, req: { body: model_instance } });

        if (model_instance['estado'] != null) {
            await db.Historico.create({
                actividad: `Proyecto Actualizado.`,
                propiedad: 'estado',
                propiedad_valor: model_instance['estado'],
                modelo: 'PROYECTO',
                modelo_id: model_instance['id'],
                proc_venta_id: model_instance['id'],
                usuario_id: req.user.user.id,
            });
        }
        //KSEE.listenToEvent('proceso_venta_update', req.user.user.id, model_instance);

        res.status(200).send({ data: model_instance, error_description: "", });


    },

}
