const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

module.exports = {

    'usuario_index' :async(req, res) => {
        let data = await KQuery.findAll({
            model: db.Usuario, 
            req: req,
            include: [
               {model: db.Rol, as: 'roles'},
            ],            
            where: {empresa_id: req.user.user.empresa_id}
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    'usuario_create' : async (req, res) => {
        let model_instance = await KQuery.create({model: db.Usuario, req: req});
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'usuario_edit' : async(req, res) => {
        let model_instance = await KQuery.edit({
            model: db.Usuario, 
            req: req,
            include: [
               {model: db.Rol, as: 'roles'},
            ]
        });
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'usuario_update' : async(req, res) => {
        let model_instance = KQuery.update({ model: db.Usuario, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });
    },    
    'usuario_byrol_index' :async(req, res) => {

        let rol_id = parseInt(req.query.rol_id);

        let data = await KQuery.findAll({
            model: db.Usuario, 
            req: req,
            include: [
               {model: db.Rol, as: 'roles', where: {id: rol_id}},
            ]
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    'usuario_reset_index' :async(req, res) => {
        let data = await KQuery.findAll({
            model: db.Usuario_reset, 
            req: req,
            include: [
               {model: db.Rol, as: 'usuarios'},
            ]
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    'usuario_reset_create' : async (req, res) => {
        let model_instance = await KQuery.create({model: db.Usuario_reset, req: req});
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'usuario_reset_update' : async(req, res) => {
        let model_instance = KQuery.update({ model: db.Usuario_reset, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });
    },

  }

