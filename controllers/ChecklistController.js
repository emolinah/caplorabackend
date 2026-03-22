const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const ModuloMain = require('../modules/module_main');
const kquery = require('../middlewares/kquery');

module.exports = {

    'checklist_index': async (req, res) => {
        let data = await KQuery.findAll({
            model: db.Checklist,
            req: req,
            include: [
                { model: db.ChecklistItem, as: 'items' },
                { model: db.Multimedia, as: 'adjuntos' },

            ]
        });
        res.status(200).send({ data: data.rows, count: data.count, error_description: "" });
    },
    'checklist_create': async (req, res) => {
        var model_instance = req.body;
        model_instance = await ModuloChecklist.beforeCreate(model_instance);
        let instance = await KQuery.create({ model: db.Checklist, req: { body: model_instance } });

        await ModuloChecklist.afterCreate(model_instance);
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'checklist_edit': async (req, res) => {
        let model_instance = await KQuery.edit({
            model: db.Checklist,
            req: req,
            include: [
                {
                    model: db.ChecklistItem, as: 'items', include: [
                        { model: db.Usuario, as: 'responsable' },
                    ]
                },
                { model: db.Multimedia, as: 'adjuntos' },

            ]
        });
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'checklist_update': async (req, res) => {

        var model_instance = req.body;

        //MODULO acciones
        model_instance = await ModuloChecklist.beforeUpdate(model_instance);

        await KQuery.update({ model: db.Checklist, req: { body: model_instance } });

        res.status(200).send({ data: model_instance, error_description: "", });

    },


    //RECTIFICACION ITEM/////////////////////////////////
    'checklist_item_index': async (req, res) => {
        let data = await KQuery.findAll({
            model: db.ChecklistItem,
            req: req,
            include: [
                { model: db.Usuario, as: 'responsable' },
            ]
        });
        res.status(200).send({ data: data.rows, count: data.count, error_description: "" });
    },
    'checklist_item_create': async (req, res) => {
        delete req.body.id;
        let model_instance = await KQuery.create({ model: db.ChecklistItem, req: req });
        res.status(200).send({ data: model_instance, error_description: "", });;
    },
    'checklist_item_edit': async (req, res) => {
        let model_instance = await KQuery.edit({
            model: db.ChecklistItem,
            req: req,
            include: [
                { model: db.Usuario, as: 'responsable' },
            ]
        });
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'checklist_item_update': async (req, res) => {

        let model_instance = KQuery.update({ model: db.ChecklistItem, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },
    
    'checklist_item_delete': async (req, res) => {
        let model_instance = KQuery.destroy({ model: db.ChecklistItem, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },

}

