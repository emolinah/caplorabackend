const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

module.exports = {

    'usuariorol_index' :async(req, res) => {
        let data = await KQuery.findAll({
            model: db.UsuarioRol, 
            req: req,
            include: [
               {model: db.Rol, as: 'rol'},
               {model: db.UsuarioRol, as: 'usuario'},
            ]
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    // 'usuariorol_index' :async(req, res) => {
    //     let data = await KQuery.findAll({
    //         model: db.UsuarioRol, 
    //         req: req,
    //         include: [
    //            {model: db.Rol, as: 'rol'},
    //            {model: db.UsuarioRol, as: 'usuario'},
    //         ]
    //     });
    //     res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    // },
    'usuariorol_create' : async (req, res) => {
        
        let model_instance = await KQuery.create({model: db.UsuarioRol, req: req});
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'usuariorol_edit' : async(req, res) => {
        let model_instance = await KQuery.edit({
            model: db.UsuarioRol, 
            req: req,
            include: [
               {model: db.Rol, as: 'rol'},
               {model: db.UsuarioRol, as: 'usuario'},
            ]
        });
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'usuariorol_update' : async(req, res) => {

        let model_instance = KQuery.update({ model: db.UsuarioRol, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },
    'usuariorol_delete' : async(req, res) => {

        //let model_instance = await KQuery.edit({model: db.Tarea, req: req,include: []});
        let model_id = req.body.id;
        await db.UsuarioRol.destroy({ where: { id: model_id } });

        res.status(200).send({data: model_id, error_description: "",});

    },

  }

