module.exports = (sequelize, DataTypes) => {
    const Multimedia = sequelize.define('Multimedia', {
        
        //IDENTIFICACION
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        orden: { type: DataTypes.INTEGER, allowNull: true,},

        //FECHAS
        fecha_creacion: { type: DataTypes.DATE, allowNull: true },

        //DETALLES
        nombre: { type: DataTypes.STRING(100), allowNull: true,},
        descripcion: { type: DataTypes.STRING(1000), allowNull: true,},
        nombreArchivo: { type: DataTypes.STRING(100), allowNull: true,},
        nombreGenerado: { type: DataTypes.STRING(100), allowNull: true,},
        tamano: { type: DataTypes.INTEGER, allowNull: true,},
        formato: { type: DataTypes.STRING(100), allowNull: true,},
        
        //FILES
        ubicacion: { type: DataTypes.STRING(1000), allowNull: true},
        url: { type: DataTypes.STRING(1000), allowNull: true,},
        url_original: {type: DataTypes.STRING(1000),allowNull: true,},
        descargas: { type: DataTypes.INTEGER, allowNull: true },
        
    }, 
    {
      tableName: 'multimedia'
    });
    Multimedia.associate = function(models) {

        //usuario creador
        Multimedia.belongsTo(models.Usuario,        {foreignKey: 'usuario_id', as: 'creador'});

        //proceso venta
        Multimedia.belongsTo(models.Proyecto,       {foreignKey: 'proyecto_id', as: 'proyecto'});
    };
  
    return Multimedia
  }