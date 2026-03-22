const swaggerUi = require('swagger-ui-express');
const app_routes = require('../routes');

function getHttpMethod(actionName) {
    if (actionName.indexOf('_create') !== -1) return 'post';
    if (actionName.indexOf('_update') !== -1) return 'put';
    if (actionName.indexOf('_delete') !== -1) return 'delete';
    return 'get';
}

function buildPaths() {
    const paths = {};

    // Auth endpoints
    paths['/auth/login'] = {
        post: {
            tags: ['Auth'],
            summary: 'Iniciar sesión',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                user: { type: 'string', example: 'admin' },
                                password: { type: 'string', example: '1234' }
                            },
                            required: ['user', 'password']
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Login exitoso, retorna token JWT' },
                500: { description: 'Error del servidor' }
            }
        }
    };

    paths['/auth/logout'] = {
        post: {
            tags: ['Auth'],
            summary: 'Cerrar sesión',
            security: [{ bearerAuth: [] }],
            responses: { 200: { description: 'Sesión cerrada' } }
        }
    };

    paths['/upload_files'] = {
        post: {
            tags: ['Archivos'],
            summary: 'Subir archivo',
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                files: { type: 'string', format: 'binary' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Archivo subido' } }
        }
    };

    paths['/download_file'] = {
        get: {
            tags: ['Archivos'],
            summary: 'Descargar archivo',
            security: [{ bearerAuth: [] }],
            parameters: [{ in: 'query', name: 'id', required: true, schema: { type: 'integer' } }],
            responses: { 200: { description: 'Archivo' } }
        }
    };

    // Rutas dinámicas por rol
    for (const roleName in app_routes) {
        const controllers = app_routes[roleName]['controllers'] ?? [];

        controllers.forEach(controller => {
            for (const actionName in controller) {
                const method = getHttpMethod(actionName);
                const path = `/${roleName}/${actionName}`;

                if (paths[path]) continue; // evitar duplicados

                const isGet = method === 'get';
                const isDelete = method === 'delete';
                const tag = actionName.split('_')[0];

                const endpoint = {
                    tags: [`${roleName} / ${tag}`],
                    summary: `${method.toUpperCase()} ${actionName}`,
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'OK' },
                        403: { description: 'Token requerido' },
                        500: { description: 'Error del servidor' }
                    }
                };

                if (isGet || isDelete) {
                    endpoint.parameters = [
                        { in: 'query', name: 'id', schema: { type: 'integer' }, description: 'ID del recurso' },
                        { in: 'query', name: 'offset', schema: { type: 'integer', default: 0 } },
                        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
                        { in: 'query', name: 'params', schema: { type: 'string' }, description: 'Filtros JSON: {"campo":"valor"}' }
                    ];
                } else {
                    endpoint.requestBody = {
                        content: {
                            'application/json': {
                                schema: { type: 'object' }
                            }
                        }
                    };
                }

                paths[path] = { [method]: endpoint };
            }
        });
    }

    return paths;
}

function buildSpec() {
    return {
        openapi: '3.0.0',
        info: {
            title: 'Caplora Backend API',
            version: '1.0.0',
            description: 'API REST para gestión de proyectos y ciclo de vida de productos'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        paths: buildPaths()
    };
}

function setup(app) {
    const spec = buildSpec();
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
    app.get('/api-docs.json', (req, res) => res.json(spec));
}

module.exports = { setup };
