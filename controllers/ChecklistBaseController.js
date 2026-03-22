const db = require('../models');
const KQuery = require('../middlewares/kquery');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const ModuloChecklist = require('../modules/module_checklist');
const ModuloMain = require('../modules/module_main');
const kquery = require('../middlewares/kquery');

module.exports = {

    'checklist_base_index': async (req, res) => {
        let data = await KQuery.findAll({
            model: db.CheckListBase,
            req: req,
            include: [
                { model: db.ChecklistItemBase, as: 'items' },

            ]
        });
        res.status(200).send({ data: data.rows, count: data.count, error_description: "" });
    },
    'checklist_base_create': async (req, res) => {
        var model_instance = req.body;
        console.log(req)
        model_instance = await ModuloChecklist.beforeCreate(model_instance);
        let instance = await KQuery.create({ model: db.ChecklistBase, req: { body: model_instance } });

        await ModuloChecklist.afterCreate(model_instance);
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'checklist_base_edit': async (req, res) => {
        let model_instance = await KQuery.edit({
            model: db.ChecklistBase,
            req: req,
            include: [
                {
                    model: db.ChecklistItemBase, as: 'items'
                },
                { model: db.Multimedia, as: 'adjuntos' },

            ]
        });
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'checklist_base_update': async (req, res) => {

        var model_instance = req.body;

        //MODULO acciones
        model_instance = await ModuloChecklist.beforeUpdate(model_instance);

        await KQuery.update({ model: db.ChecklistBase, req: { body: model_instance } });

        res.status(200).send({ data: model_instance, error_description: "", });

    },


    //RECTIFICACION ITEM/////////////////////////////////
    'checklist_item_base_index': async (req, res) => {
        let data = await KQuery.findAll({
            model: db.ChecklistItemBase,
            req: req,
            
        });
        res.status(200).send({ data: data.rows, count: data.count, error_description: "" });
    },
    'checklist_item_base_create': async (req, res) => {
        delete req.body.id;
        let model_instance = await KQuery.create({ model: db.ChecklistItemBase, req: req });
        res.status(200).send({ data: model_instance, error_description: "", });;
    },
    'checklist_item_base_edit': async (req, res) => {
        let model_instance = await KQuery.edit({
            model: db.ChecklistItemBase,
            req: req,
            
        });
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'checklist_item_base_update': async (req, res) => {

        let model_instance = KQuery.update({ model: db.ChecklistItemBase, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },
    
    'checklist_item_base_delete': async (req, res) => {
        let model_instance = KQuery.destroy({ model: db.ChecklistItemBase, req: req, });
        res.status(200).send({ data: model_instance, error_description: "", });

    },

}

