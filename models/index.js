const db_config = require('../config/db');
const fs = require('fs');
const path = require('path');
const {Sequelize, DataTypes} = require('sequelize');

const config = require('../config/config');

//configuracion
const sequelize = new Sequelize(
    db_config.database, 
    db_config.username, 
    db_config.password,{
        host: db_config.host,
        dialect: db_config.dialect,
        operatorsAliases: false,
        pool: {
            max: db_config.pool.max,
            min: db_config.pool.min,
            acquire: db_config.pool.acquire,
            idle: db_config.pool.idle,
        },
        //logs de la app
        logging: config.logging,
    },
    
);

//autenticamos y conectamos
sequelize.authenticate().then(() =>{
    console.log('connected...')
}).catch(err =>{
    console.log(err);
});

//cargamos ambos sequelize
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//CARGAMOS LOS MODELOS
const filebasename = path.basename(__filename);
fs.readdirSync(__dirname)
.filter((file) => { const returnFile = (file.indexOf('.') !== 0) && (file !== filebasename) && (file.slice(-3) === '.js');
    return returnFile;
})
.forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes)
    db[model.name] = model;
});
Object.keys(db).forEach((modelName) => {
  //console.log(db[modelName]);
  if (db[modelName].associate) {
    
    db[modelName].associate(db);
  }
})





//sincronizamos la base de datos para actualizar los modelos
// db.sequelize.sync({force: true}).then(()=>{
db.sequelize.sync(config.squelizeSync).then(()=>{
    console.log('db:OK');

    //console.log(sequelize.models);
    // Object.keys(sequelize.models).forEach(model => {
    //     console.log(sequelize.models[model].associations);
    // });
    

    createModelsFile();
});

module.exports = db;



function createModelsFile(){

    var jsonModels = {};

    console.log('');
    console.log('Generando modelos.json');

    Object.keys(sequelize.models).forEach(modelName => {


        
        var model = sequelize.models[modelName];
        
        //declaramos los campos
        jsonModels[model.name] = {'fields': {},'associations': {}};

        Object.keys(model.associations).forEach(attributeName => {

            jsonModels[model.name]['associations'][attributeName] = {
                'name': attributeName,
                'target': model.associations[attributeName]['target']['name'],
                'type': model.associations[attributeName]['associationType'],
                'field': model.associations[attributeName]['foreignKey'],
            }
        });

        //recorremos los campos
        Object.keys(model.getAttributes()).forEach(attributeName => {
            
            //campos excluidos
            if(!['createdAt','updatedAt'].includes(attributeName)){

                //cargamos el atributo
                let attributeActual = model.getAttributes()[attributeName];                

                //creamos un obj para representar el atributo del modelo
                jsonModels[model.name]['fields'][attributeName] = {
                    type : attributeActual['type']['key'],
                    name : attributeActual['field'],
                    label: attributeName.replace('_',' '),
                };

                //INT
                if(attributeActual['type']['key'] == 'INTEGER'){
                    //si tiene un valor por defecto
                    if(model.getAttributes()[attributeName]['default'] != null){
                        jsonModels[model.name]['fields'][attributeName]['default_value'] = model.getAttributes()[attributeName]['default'];
                    }
                }

                //STRING
                if(attributeActual['type']['key'] == 'STRING'){
                    //console.log(attribute['type']['_length']);
                    //largo de la cadena
                    if(attributeActual['type']['_length'] > 0){
                        jsonModels[model.name]['fields'][attributeName]['maxlenght'] = attributeActual['type']['_length']
                    }
                }

                //ENUM
                if(attributeActual['type']['key'] == 'ENUM'){
                    //valores posibles
                    jsonModels[model.name]['fields'][attributeName]['values'] = model.getAttributes()[attributeName]['values'];
                    jsonModels[model.name]['fields'][attributeName]['default_value'] = model.getAttributes()[attributeName]['defaultValue'];
                }

                if(attributeActual.hasOwnProperty('value')) jsonModels[model.name]['fields'][attributeName].value = attributeActual['value'];
                if(attributeActual.hasOwnProperty('allowNull')) jsonModels[model.name]['fields'][attributeName].allowNull = attributeActual['allowNull'];
            }
            
        });
    });
    let json_models_rute = path.join(__dirname, '../config/models.json');
    //console.log(jsonModels);
    crearOActualizarArchivoJSON(json_models_rute, jsonModels);
    
}

function crearOActualizarArchivoJSON(nombreArchivo, objetoParametro) {
    try {
      // Lee el archivo JSON existente (si existe)
      let datosArchivo = {};
      if (fs.existsSync(nombreArchivo)) {
        const archivoExistente = fs.readFileSync(nombreArchivo);
        datosArchivo = JSON.parse(archivoExistente);
      }
  
      // Combina los datos existentes con el objeto parámetro
      const nuevosDatos = Object.assign(datosArchivo, objetoParametro);
      //const nuevosDatos = { ...datosArchivo, ...objetoParametro };
  
      // Convierte los datos combinados a formato JSON
      const datosJSON = JSON.stringify(nuevosDatos, null, 2);
  
      // Escribe los datos en el archivo
      fs.writeFileSync(nombreArchivo, datosJSON);
  
      console.log('models.json updated.');
    } catch (error) {
      console.error('Error al crear o actualizar el archivo JSON:', error);
    }
}



// function createModelsFile(){

//     var jsonModels = {};
//     var modelsDir = path.join(__dirname, '');


//     fs.readdirSync(modelsDir)
//     .filter(function(file) {
//         return !file.endsWith('index.js') && file.match(/\.js/);
//     })
//     .forEach(function(file) {
//         var model = require(path.join(__dirname, '', file))(sequelize, DataTypes);
        
//         //declaramos los campos
//         jsonModels[model.name] = {'fields': {}};
        
//         console.log('//////////////////////////');
//         console.log(model.name);
//         console.log(model.associations);

//         //recorremos los campos
//         Object.keys(model.rawAttributes).forEach(attributeName => {
            
//             //campos excluidos
//             if(!['createdAt','updatedAt'].includes(attributeName)){
//                 let attribute = model.rawAttributes[attributeName];

                

//                 jsonModels[model.name]['fields'][attributeName] = {
//                     type : attribute['type']['key'],
//                     name : attribute['field'],
//                     label: attributeName.replace('_',' '),
//                 };

//                 //INT
//                 if(attribute['type']['key'] == 'INTEGER'){
//                     //si tiene un valor por defecto
//                     if(model.rawAttributes[attributeName]['default'] != null){
//                         jsonModels[model.name]['fields'][attributeName]['default_value'] = model.rawAttributes[attributeName]['default'];
//                     }
//                 }

//                 //STRING
//                 if(attribute['type']['key'] == 'STRING'){
//                     //console.log(attribute['type']['_length']);
//                     //largo de la cadena
//                     if(attribute['type']['_length'] > 0){
//                         jsonModels[model.name]['fields'][attributeName]['maxlenght'] = attribute['type']['_length']
//                     }
//                 }

//                 //ENUM
//                 if(attribute['type']['key'] == 'ENUM'){
//                     //valores posibles
//                     jsonModels[model.name]['fields'][attributeName]['values'] = model.rawAttributes[attributeName]['values'];
//                     jsonModels[model.name]['fields'][attributeName]['default_value'] = model.rawAttributes[attributeName]['defaultValue'];
//                 }

//                 if(attribute.hasOwnProperty('value')) jsonModels[model.name]['fields'][attributeName].value = attribute['value'];
//                 if(attribute.hasOwnProperty('allowNull')) jsonModels[model.name]['fields'][attributeName].allowNull = attribute['allowNull'];
//             }
            
//         });
//     });
//     let json_models_rute = path.join(__dirname, '../config/models.json');
//     //console.log(jsonModels);
//     crearOActualizarArchivoJSON(json_models_rute, jsonModels);
    
// }

// function crearOActualizarArchivoJSON(nombreArchivo, objetoParametro) {
//     try {
//       // Lee el archivo JSON existente (si existe)
//       let datosArchivo = {};
//       if (fs.existsSync(nombreArchivo)) {
//         const archivoExistente = fs.readFileSync(nombreArchivo);
//         datosArchivo = JSON.parse(archivoExistente);
//       }
  
//       // Combina los datos existentes con el objeto parámetro
//       const nuevosDatos = Object.assign(datosArchivo, objetoParametro);
//       //const nuevosDatos = { ...datosArchivo, ...objetoParametro };
  
//       // Convierte los datos combinados a formato JSON
//       const datosJSON = JSON.stringify(nuevosDatos, null, 2);
  
//       // Escribe los datos en el archivo
//       fs.writeFileSync(nombreArchivo, datosJSON);
  
//       console.log('Archivo JSON actualizado correctamente.');
//     } catch (error) {
//       console.error('Error al crear o actualizar el archivo JSON:', error);
//     }
// }

