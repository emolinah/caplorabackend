module.exports = {
    // Clave secreta para generar tokens JWT (cambiar por una clave segura)
    secret_key: "CAMBIAR_POR_CLAVE_SEGURA",
    // Tiempo de expiración del token
    Expires_In: "7h",
    Email: {
        "host": "mail.tudominio.com",
        "port": "465",
        "secure": "true",
        "auth": {
            "type": "login",
            "user": "correo@tudominio.com",
            "pass": "CAMBIAR_POR_CLAVE_EMAIL"
        }
    },
}
