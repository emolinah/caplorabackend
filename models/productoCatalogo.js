module.exports = (sequelize, DataTypes) => {
    
    const productoCatalogo = sequelize.define('ProductoCatalogo', {
        
        //IDENTIFICACION
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true }, 
        codigo: { type: DataTypes.STRING(100), allowNull: true,},
        
        sku: { type: DataTypes.STRING(100), allowNull: true, },
        serial: { type: DataTypes.STRING(100), allowNull: true, },
        

        //FECHAS
        fecha_creacion: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW, },

        //DETALLES
        nombre: { type: DataTypes.STRING(100), allowNull: true, },
        descripcion: { type: DataTypes.STRING(1000), allowNull: true, },
        caracteristicas: { type: DataTypes.STRING(1000), allowNull: true, },
        marca: { type: DataTypes.STRING(100), allowNull: true, },
        modelo: { type: DataTypes.STRING(100), allowNull: true, },
        ano: { type: DataTypes.INTEGER, allowNull: true, },
        fabricante: { type: DataTypes.STRING(100), allowNull: true, },
        peso: { type: DataTypes.STRING(100), allowNull: true, },
        volumen: { type: DataTypes.STRING(100), allowNull: true, },
        
        //RECTIFICACION
        medida_ancho: { type: DataTypes.FLOAT, allowNull: true, },
        medida_alto: { type: DataTypes.FLOAT, allowNull: true, },
        medida_unidad: { type: DataTypes.ENUM('MM', 'CM', 'MT'), allowNull: true, defaultValue: 'MM', },
        materiales: { type: DataTypes.STRING(100), allowNull: true, },
        color: { type: DataTypes.STRING(100), allowNull: true, },

    }, 
    {
        tableName: 'productos_catalogo'
    });
    
    productoCatalogo.associate = function(models) {
        

        
    };
  
    return productoCatalogo;
  }