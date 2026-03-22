const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

module.exports = {

    'rol_index' :async(req, res) => {
        let data = await KQuery.findAll({
            model: db.Rol, 
            req: req,
            include: []
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    'rol_index' :async(req, res) => {
        let data = await KQuery.findAll({
            model: db.Rol, 
            req: req,
            include: []
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    'rol_create' : async (req, res) => {
        let model_instance = await KQuery.create({model: db.Rol, req: req});
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'rol_edit' : async(req, res) => {
        let model_instance = await KQuery.edit({
            model: db.Rol, 
            req: req,
            include: []
        });
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'rol_update' : async(req, res) => {

        let model_instance = KQuery.update({ model: db.Rol, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },

  }

