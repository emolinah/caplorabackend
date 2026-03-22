const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./models');
const KQuery = require('./middlewares/kquery.js');
//const KSEE = require('./middlewares/KSSE.js'); 

const app = express();

// CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuración para subir archivos
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        console.log('file.originalname');
        console.log(path.extname(file.originalname));
        cb(null, uniqueSuffix)
    }
});
const upload = multer({limits: {fileSize: 20 * 1024 * 1024}, storage: storage});

//createProcesoVentas();


async function createProcesoVentas(){
    
    for (let index = 0; index < 200; index++) {
        await db.ProcesoVenta.create({
            nombre: `Proceso Venta ${index}`,
            proceso_codigo: `P${index}`, 
        })
        
    }
}


app.post("/upload_files", upload.array("files"), async function async (req, res) {
    var instance_properties = req.body;
    if (req.files.length > 0) {
        var file_instance = req.files[0];
        instance_properties['nombreGenerado'] = file_instance.filename;
        instance_properties['fecha_creacion'] = Date.now();
        instance_properties['nombreArchivo'] = file_instance.originalname;
        instance_properties['tamano'] = file_instance.size;
    }
    instance_properties['nombre'] = instance_properties['fileName'];
    instance_properties['descargas'] = 0;

    let model_instance = await db.Multimedia.create(instance_properties);
    
    res.status(200).send({ data: model_instance, error_description: "" });
});

// Ruta para acceder a archivos
app.get('/download_file', async (req, res) => {
    try {
        let model_instance = await KQuery.edit({ model: db.Multimedia, req: req });
        if (model_instance != null) {
            const filePath = path.join(__dirname, 'uploads', model_instance['nombreGenerado']);
            res.sendFile(filePath);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al recuperar archivo');
    }
});

// MODELOS
require('./models');

// Rutas
require('./middlewares/kroutes.js').loadRoutes(app);

// API
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`SERVER running on port ${PORT}`);
});

// Iniciar el servidor SSE en el puerto 3001
//KSEE.startSSEServer();
