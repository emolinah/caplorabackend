const db = require('../models/index.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SK = require('./SK.js');
const module_usuario = require('../modules/module_usuario.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const path = require('path');
const fs = require('fs');
const modulesConfigPath = path.join(__dirname, '../config/modules_config');
const modulesConfig = require('../config/modules_config.js');
const { createPDF } = require('../pdf/pdf.js');
module.exports = {
    // Login
    'login': async (req, res) => {
        // buscar usuario
        let user_data = await db.Usuario.findOne({
            where: { user: req.body.user },
            include: [{ model: db.Rol, as: 'roles' }]
        }).then(async user => {

            if (!user) {
                res.status(200).json({
                    data: {},
                    login: false,
                    error_description: "Usuario no encontrado",
                });
            }
            else {
                // Cargar datos de configuración de módulos

                // Creamos token
                let token = jwt.sign({ user: user }, SK.secret_key, {
                    expiresIn: SK.Expires_In
                });
                var empresa = await db.Empresa.findOne({
                    where: { id: user.empresa_id }
                })
                if (empresa) {

                    modulesConfig.moduloEtapas = empresa.modulo_etapa;
                    modulesConfig.moduloProduccionActivado = empresa.modulo_produccion;
                    modulesConfig.moduloInstalacionActivado = empresa.modulo_instalacion;
                    modulesConfig.moduloCotizacionActivado = empresa.modulo_cotizacion;
                    modulesConfig.moduloEtiquetaActivado = empresa.modulo_etiqueta;
                    modulesConfig.moduloRectificacionActivado = empresa.modulo_rectificacion;
                    modulesConfig.moduloDespachoActivado = empresa.modulo_despacho;
                    modulesConfig.moduloMultimediaActivado = empresa.modulo_multimedia;
                    modulesConfig.moduloChecklistActivado = empresa.modulo_checklist;
                }
                res.json({
                    user: user,
                    token: token,
                    login: true,
                    error_description: "Usuario Encontrado",
                    modules: modulesConfig, // Añadimos la configuración de los módulos
                });
            }
        }).catch(err => {
            res.status(500).json(err);
        })



    },
    'index': async (req, res) => {

        let pagination = {
            offset: 0,
            limit: 10,
        };
        var filters = {};

        if (req.query.offset && req.query.offset !== null) pagination.offset = parseInt(req.query.offset);
        if (req.query.limit && req.query.limit !== null) pagination.limit = parseInt(req.query.limit);

        var final_filters = {};
        if (req.query.params) {
            var params = JSON.parse(req.query.params);
            Object.keys(params).forEach(filter => {
                final_filters[filter] = {
                    [Op.like]: `${params[filter]}%`
                }
            });
        }

        let data = await db.Usuario.findAndCountAll({
            where: final_filters,
            offset: pagination.offset,
            limit: pagination.limit
        });

        res.status(200).send({
            data: data.rows,
            count: data.count,
            offset: pagination.offset,
            limit: pagination.limit,
            error_description: ""
        });

    },
    'create': async (req, res) => {
        //obtengo el password, para encriptarlo
        let uncripted_password = req.body.password;
        //encripto el passwrd para el almacenado
        bcryptjs.hash(uncripted_password, 8).then(encripted_password => {
            //creo el usuario para almacenar
            var t_usuario = req.body;
            //modificamos la password por la encriptada
            t_usuario.password = encripted_password;
            //guardamos el usuario
            db.Usuario.create(t_usuario).then(saved_user => {
                //retornamos el usuario al frontend
                res.status(200).send(saved_user);
            }).catch(err => {
                //error
                res.status(500).json(err);
            });
        });
    },
    'edit': async (req, res) => {
        let _id = req.params.id;
        let usuario_inst = await db.Usuario.findOne({
            where: { id: _id },
            include: [
                { model: db.Rol, as: 'roles' }
            ]

        });
        res.status(200).send({
            data: usuario_inst,
            error_description: "",
        });
    },
    'update': async (req, res) => {

        let _id = req.params.id;
        let usuario_inst = await db.Usuario.update(req.body, { where: { id: _id } });
        res.status(200).send(usuario_inst);
    },
    'delete': async (req, res) => {
        let _id = req.params.id;
        let usuario_inst = await db.Usuario.destroy({ where: { id: _id } });
        res.status(200).send('REMOVED');
    },
    'logout': async (req, res) => {
        const authHeader = req.headers["authorization"];
        jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
            if (logout) {
                res.send({ msg: 'Has sido desconectado' });
            } else {
                res.send({ msg: 'Error' });
            }
        });
    },
    'verifyToken': function (req, res, next) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        //console.log(token);
        if (token == null) return res.sendStatus(403);
        jwt.verify(token, SK.secret_key, (err, user) => {
            if (err) return res.sendStatus(404);
            req.user = user;
            next();
        });
    },
    'reset_password_update': async (req, res) => {
        let password_encriptado = await module_usuario.passwordReset(req.body.password);
        let req_usuario = { body: Object.assign({}, req.body) };
        req_usuario.body.password = password_encriptado;
        let model_instance = KQuery.update({ model: db.usuario, req: req_usuario, });
        res.status(200).send({ data: model_instance, error_description: "", });
    },
    'create_pdf': async (req, res) => {
        const cotizacion = req.body;
        console.log(req.body)
        console.log("aca")
        try {
            const pdfBytes = await createPDF(cotizacion);
            res.status(200).contentType('application/pdf').send(pdfBytes);
        } catch (err) {
            console.error('Error al generar PDF:', err);
            res.status(500).send('Error al generar el PDF');
        }
    }
}