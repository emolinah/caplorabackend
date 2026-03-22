module.exports = (sequelize, DataTypes) => {
    
    const Producto = sequelize.define('Producto', {
        
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
        
        //UBICACION
        piso: { type: DataTypes.STRING(100), allowNull: true, },
        departamento: { type: DataTypes.STRING(100), allowNull: true, },
        lugar: { type: DataTypes.STRING(100), allowNull: true, },

        ///////////////////////////////////////////////////////////////
        //CAMPOS COMPARTIDOS CON ITEMS DEL CATALOGO////////////////////
        // costo_produccion: { type: DataTypes.FLOAT, allowNull: true, },
        // venta_margen: { type: DataTypes.FLOAT, allowNull: true, },
        // venta_comision: { type: DataTypes.FLOAT, allowNull: true, },
        // impuesto: { type: DataTypes.FLOAT, allowNull: true, },
        // neto: { type: DataTypes.FLOAT, allowNull: true, },
        // total: { type: DataTypes.FLOAT, allowNull: true, },
        // precio_costo: { type: DataTypes.FLOAT, allowNull: true, },
        ///////////////////////////////////////////////////////////////
        

    }, 
    {
        tableName: 'productos'
    });
    
    Producto.associate = function(models) {
    

        //proyecto
        Producto.belongsTo(models.Proyecto,                 {foreignKey: 'proyecto_id', as: 'proyecto'});

        //catalogo item
        Producto.belongsTo(models.ProductoCatalogo,         {foreignKey: 'producto_catalogo_id', as: 'producto_catalogo'});

        //mensaje
        Producto.hasMany(models.Mensaje,                    {foreignKey: 'producto_id', as: 'mensajes'});
        Producto.hasMany(models.Historico,                  {foreignKey: 'producto_id', as: 'historial'});

        //imprevistos
        Producto.hasMany(models.Imprevisto,                 { foreignKey: 'producto_id', as: 'imprevistos' });

        //notas
        Producto.hasMany(models.Nota,                       { foreignKey: 'producto_id', as: 'notas' });

        //checklist
        Producto.hasMany(models.Checklist,                  {foreignKey: 'producto_id', as: 'checklist'});

        //etiquetas
        Producto.hasMany(models.Etiqueta,                   {foreignKey: 'producto_id', as: 'etiquetas'});

        //Empresa
        Producto.belongsTo(models.Empresa,                  { foreignKey: 'empresa_id', as: 'empresa' });

        
    };
  
    return Producto;
  }