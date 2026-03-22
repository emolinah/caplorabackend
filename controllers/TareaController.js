const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const ModuloTarea = require('../modules/module_cotizacion');

module.exports = {

    'tarea_index': async (req, res) => {
        let data = await KQuery.findAll({
            model: db.Tarea,
            req: req,
            include: [
                { model: db.Usuario, as: 'encargado' },
                { model: db.Usuario, as: 'supervisor' },
                { model: db.Multimedia, as: 'adjuntos' },
                { model: db.Mensaje, as: 'mensajes' },
                { model: db.Historico, as: 'historial' },
                {
                    model: db.Imprevisto, as: 'imprevistos',
                    required: false,
                    include: [
                        { model: db.Usuario, as: 'usuario_creador' },
                        { model: db.Usuario, as: 'usuario_resolucion' },
                    ]
                },
            ],            
            where: {empresa_id: req.user.user.empresa_id}
        });
        res.status(200).send({ data: data.rows, count: data.count, error_description: "" });
    },
    'tarea_create': async (req, res) => {
        var model_instance = req.body;       
        model_instance.empresa_id = req.user.user.empresa_id;

        let instance = await KQuery.create({ model: db.Tarea, req: { body: model_instance } });

        if (instance['estado'] != null) {
            await db.Historico.create({
                actividad: `Tarea Creada.`,
                propiedad: 'estado',
                propiedad_valor: instance['estado'],
                modelo: 'TAREA',
                modelo_id: instance['id'],
                tar_id: instance['id'],
                usuario_id: req.user.user.id,
            });
        }
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'tarea_edit': async (req, res) => {
        let model_instance = await KQuery.edit({
            model: db.Tarea,
            req: req,
            include: [
                { model: db.Usuario, as: 'encargado' },
                { model: db.Usuario, as: 'supervisor' },
                { model: db.Multimedia, as: 'adjuntos' },
                { model: db.Mensaje, as: 'mensajes' },
                { model: db.Historico, as: 'historial' },
                { model: db.Imprevisto, as: 'imprevistos', required: false, },

            ]
        });
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'tarea_update': async (req, res) => {

        var model_instance = req.body;

        await KQuery.update({ model: db.Tarea, req: { body: model_instance } });

        if (model_instance['estado'] != null) {
            await db.Historico.create({
                actividad: `Tarea Actualizada.`,
                propiedad: 'estado',
                propiedad_valor: model_instance['estado'],
                modelo: 'TAREA',
                modelo_id: model_instance['id'],
                tar_id: model_instance['id'],
                usuario_id: req.user.user.id,
            });
        }
        res.status(200).send({ data: model_instance, error_description: "", });

    },

}

