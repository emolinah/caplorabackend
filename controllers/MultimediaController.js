const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports = {

    'multimedia_index' :async(req, res) => {
        let data = await KQuery.findAll({
            model: db.Multimedia, 
            req: req,
            include: [
               {model: db.Usuario, as: 'propietario'},

            ]
        });
        res.status(200).send({data: data.rows, count: data.count, error_description: ""});
    },
    'multimedia_create' : async (req, res) => {

        let model_instance = await KQuery.create({model: db.Multimedia, req: req});
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'multimedia_edit' : async(req, res) => {
        let model_instance = await KQuery.edit({
            model: db.Multimedia, 
            req: req,
            include: [
               {model: db.Usuario, as: 'propietario'},

            ]
        });
        res.status(200).send({data: model_instance, error_description: "",});
    },
    'multimedia_update' : async(req, res) => {

        let model_instance = KQuery.update({ model: db.Multimedia, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },

  }

