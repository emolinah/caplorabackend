const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

module.exports = {

    'mensaje_index' :async(req, res) => {
        let data = await KQuery.findAll({
            model: db.Mensaje, 
            req: req,
            include: [
               {model: db.Usuario, as: 'emisor'},
               {model: db.Usuario, as: 'receptor'},

            ],
            order: [[ 'createdAt', 'DESC']]
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    'mensaje_create' : async (req, res) => {
        let model_instance = await KQuery.create({model: db.Mensaje, req: req});
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'mensaje_edit' : async(req, res) => {
        let model_instance = await KQuery.edit({
            model: db.Mensaje, 
            req: req,
            include: [
               {model: db.Usuario, as: 'emisor'},
               {model: db.Usuario, as: 'receptor'},

            ]
        });
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'mensaje_update' : async(req, res) => {

        let model_instance = KQuery.update({ model: db.Mensaje, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },

  }

