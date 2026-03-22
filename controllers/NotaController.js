const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

module.exports = {

    'nota_index': async (req, res) => {
        let data = await KQuery.findAll({
            model: db.Nota,
            req: req,
            include: [
                { model: db.Usuario, as: 'usuario_creador' },
            ],
        });
        res.status(200).send({ data: data.rows, count: data.count, error_description: "" });
    },
    'nota_create': async (req, res) => {
        let model_instance = await KQuery.create({ model: db.Nota, req: req });
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'nota_edit': async (req, res) => {
        let model_instance = await KQuery.edit({
            model: db.Nota,
            req: req,
            include: [
                { model: db.Usuario, as: 'usuario_creador' },
            ]
        });
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'nota_update': async (req, res) => {

        let model_instance = KQuery.update({ model: db.Nota, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },

}

