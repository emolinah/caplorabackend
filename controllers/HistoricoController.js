const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

module.exports = {

    'historico_index' :async(req, res) => {
        let data = await KQuery.findAll({
            model: db.Historico, 
            req: req,
            include: [
                {model: db.Usuario ,as: 'responsable'}
            ]
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    'historico_create' : async (req, res) => {
        let model_instance = await KQuery.create({model: db.Historico, req: req});
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'historico_edit' : async(req, res) => {
        let model_instance = await KQuery.edit({
            model: db.Historico, 
            req: req,
            include: [
                {model: db.Usuario ,as: 'responsable'}
            ]
        });
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'historico_update' : async(req, res) => {

        let model_instance = KQuery.update({ model: db.Historico, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },

  }

