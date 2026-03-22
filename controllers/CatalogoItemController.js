const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

module.exports = {

    'catalogoitem_index' :async(req, res) => {
        let data = await KQuery.findAll({
            model: db.CatalogoItem, 
            req: req,
            include: [
            //    {model: db.Multimedia, as: 'imagen_principal'},
            //    {model: db.Multimedia, as: 'imagenes'},
            ],
            //where: {empresa_id: req.user.user.empresa_id}
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    'catalogoitem_create' : async (req, res) => {        
        let model_instance = req.body;        
        model_instance.empresa_id = req.user.user.empresa_id;
        
        model_instance = await KQuery.create({model: db.CatalogoItem, req: req});
        
        
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'catalogoitem_edit' : async(req, res) => {
        let model_instance = await KQuery.edit({
            model: db.CatalogoItem, 
            req: req,
            include: [
               {model: db.Multimedia, as: 'imagen_principal'},
               {model: db.Multimedia, as: 'imagenes'},
            ],
            where: {empresa_id: req.user.user.empresa_id}
        });
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'catalogoitem_update' : async(req, res) => {

        let model_instance = KQuery.update({ model: db.CatalogoItem, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },

  }

