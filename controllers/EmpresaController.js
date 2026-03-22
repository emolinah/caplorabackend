const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

module.exports = {

    'empresa_index' :async(req, res) => {
        let data = await KQuery.findAll({
            model: db.Empresa, 
            req: req,
            include: [
                
            ]
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    'empresa_create' : async (req, res) => {
        let model_instance = await KQuery.create({model: db.Empresa, req: req});
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'empresa_edit' : async(req, res) => {
        let model_instance = await KQuery.edit({
            model: db.Empresa, 
            req: req,
            include: [
                
            ]
        });
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'empresa_update' : async(req, res) => {

        let model_instance = KQuery.update({ model: db.Empresa, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },

  }

