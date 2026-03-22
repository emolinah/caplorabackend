const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

module.exports = {

    'etiqueta_index' :async(req, res) => {
        let data = await KQuery.findAll({
            model: db.Etiqueta, 
            req: req,
            include: [
               {model: db.Usuario, as: 'encargado'},
            ]
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    'etiqueta_create' : async (req, res) => {
        let model_instance = await KQuery.create({model: db.Etiqueta, req: req});
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'etiqueta_multiple_create' : async (req, res) => {

        try {

            const ids = req.body.ids;
            const field = req.body.model_field;
            const etiqueta_base_id = req.body.etiqueta_base_id;

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({
                    data: {},
                    error_description: "ids vacíos",
                });
            }

            if (!field) {
                return res.status(400).json({
                    data: {},
                    error_description: "model_field requerido",
                });
            }

            const registros = ids.map(id => ({
                [field]: id,
                etiqueta_base_id: etiqueta_base_id
            }));

            console.log(registros);

            const result = await db.Etiqueta.bulkCreate(registros);

            res.status(200).send({
                data: registros,
                error_description: "",
            });

        } catch (error) {

            console.error(error);

            res.status(500).send({
                data: {},
                error_description: error.message,
            });

        }
    },
    'etiqueta_edit' : async(req, res) => {
        let model_instance = await KQuery.edit({
            model: db.Etiqueta, 
            req: req,
            include: [
               {model: db.Usuario, as: 'encargado'},

            ]
        });
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'etiqueta_update' : async(req, res) => {

        let model_instance = KQuery.update({ model: db.Etiqueta, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },
    'etiqueta_delete' : async(req, res) => {

        let model_instance = KQuery.destroy({ model: db.Etiqueta, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },
    'etiqueta_base_index' :async(req, res) => {
        let data = await KQuery.findAll({
            req: req,
            model: db.EtiquetaBase            
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },




    'etiqueta_base_create' : async (req, res) => {
        let model_instance = await KQuery.create({model: db.EtiquetaBase, req: req});
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'etiqueta_base_edit' : async(req, res) => {
        let model_instance = await KQuery.edit({
            model: db.EtiquetaBase, 
            req: req
        });
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'etiqueta_base_update' : async(req, res) => {

        let model_instance = KQuery.update({ model: db.EtiquetaBase, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },
    'etiqueta_base_delete' : async(req, res) => {

        let model_instance = KQuery.destroy({ model: db.EtiquetaBase, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },


  }

