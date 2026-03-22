var nodemailer = require('nodemailer');
const UsuarioController = require('../controllers/UsuarioController')
const Data = {
    "host": "mail.kuu-qa.cl",
    "port": "465",
    "secure": "true",
    "auth": {
        "type": "login",
        "user": "testing_2@kuu-qa.cl",
        "pass": "Qwepoizxcmnb123"
    }
};
class Email {
    constructor(oConfig) {
        this.createTransport = nodemailer.createTransport(oConfig);
    }
    enviarCorreo(oEmail) {
        try {
            this.createTransport.sendMail(oEmail, function (error, info) {
                if (error) {
                    console.log("error");
                } else {
                    console.log("Correo enviado exitosamente");
                    this.createTransport.close();
                }
            });
        } catch (x) {
            console.log(`${Email.enviarCorreo} --Error--` + x);
        }
    }
}
const createResetCode = async (userId, newResetCode) => {

    try {
        const req = { body: { reset_code: newResetCode, estado_proceso: "ACTIVO", hora_proceso: new Date(), usuario_id: userId } };
        const res = { status: (code) => ({ send: (response) => { } }) };
        await UsuarioController.usuario_reset_create(req, res);
    } catch (error) {
        console.error('Error Generando nuevo usuario_reset_create:', error);
    }
};
function generateCode(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"·$%&/()=';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
function correoBody(bodyObject) {
    try {
        const oEmail = new Email(Data);
        let email = {
            from: `testing_2@kuu-qa.cl`,
            to: `${bodyObject.email_destino}`,
            subject: `${bodyObject.asunto}`,
            html: `<div>
            <h1>${bodyObject.encabezado}</h1>        
            ${bodyObject.cuerpo}
            </div>`
        };
        oEmail.enviarCorreo(email);
        email = null;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

function correoBodyRecuperar(bodyObject) {
    try {
        const oEmail = new Email(Data);
        const new_code = generateCode;
        let email_recuperar = {
            from: `testing_2@kuu-qa.cl`,
            to: `${bodyObject.email_destino}`,
            subject: `${bodyObject.asunto}`,
            html: `<div>
            <h1>${bodyObject.encabezado}</h1>
            <br>
            <p><b>Esta es la clave temporal:</b> <h2>${new_code}</h2> para poder recuperar su Cuenta</p>
            <br>
            ${bodyObject.cuerpo}
            </div>`
        };
        oEmail.enviarCorreo(email_recuperar);
        email_recuperar = null;
        createResetCode(bodyObject.user_id, new_code);        
    } catch (error) {
        console.error('Error al enviar el correo de recuperación:', error);
    }
}

module.exports = {
    correoBody: correoBody,
    correoBodyRecuperar: correoBodyRecuperar
};
