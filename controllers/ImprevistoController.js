const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

module.exports = {

    'imprevisto_index': async (req, res) => {
        let data = await KQuery.findAll({
            model: db.Imprevisto,
            req: req,
            include: [
                
                { model: db.Usuario, as: 'usuario_creador' },
                { model: db.Usuario, as: 'usuario_resolucion' },
                { model: db.Proyecto, as: 'proyecto' },
                { model: db.Producto, as: 'producto' },
                { model: db.Tarea, as: 'tarea' },

            ],
        });
        res.status(200).send({ data: data.rows, count: data.count, error_description: "" });
    },
    'imprevisto_create': async (req, res) => {
        let model_instance = await KQuery.create({ model: db.Imprevisto, req: req });
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'imprevisto_edit': async (req, res) => {
        let model_instance = await KQuery.edit({
            model: db.Imprevisto,
            req: req,
            include: [
                { model: db.Usuario, as: 'usuario_creador' },
                { model: db.Usuario, as: 'usuario_resolucion' },
                { model: db.Proyecto, as: 'proyecto' },
                { model: db.Producto, as: 'producto' },
                { model: db.Tarea, as: 'tarea' },
            ]
        });
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'imprevisto_update': async (req, res) => {

        let model_instance = KQuery.update({ model: db.Imprevisto, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },

}

