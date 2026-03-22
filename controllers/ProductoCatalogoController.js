const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
//const ModuloProducto = require('../modules/module_producto');
const ModuleMain = require('../modules/module_main');

module.exports = {

    'producto_catalogo_index' :async(req, res) => {
        let data = await KQuery.findAll({
            model: db.ProductoCatalogo, 
            req: req,
            include: [

            ],            
            where: {empresa_id: req.user.user.empresa_id}
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    'producto_catalogo_create' : async (req, res) => {
        
        var parameters = req.body;               
        model_instance.empresa_id = req.user.user.empresa_id;
        
        let model_instance = await KQuery.create({model: db.ProductoCatalogo, req: req});
        
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'producto_catalogo_edit' : async(req, res) => {
        let model_instance = await KQuery.edit({
            model: db.ProductoCatalogo, 
            req: req,
            include: [
               {model: db.Proyecto, as: 'proyecto'},
               {model: db.Historico, as: 'historial'},
            ]
        });
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'producto_catalogo_update' : async(req, res) => {

        let model_instance = KQuery.update({ model: db.ProductoCatalogo, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },


  }

