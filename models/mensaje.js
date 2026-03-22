module.exports = (sequelize, DataTypes) => {
    
    const Mensaje = sequelize.define('Mensaje', {
        
        //IDENTIFICACION
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true }, 
        fecha_creacion: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW, },
        fecha_visto: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW, },
        
        //DETALLES
        emisor_nombre: { type: DataTypes.STRING(100), allowNull: true, },
        etiqueta: { type: DataTypes.STRING(100), allowNull: true, },
        mensaje: { type: DataTypes.STRING(1000), allowNull: true, },
        visto: { type: DataTypes.BOOLEAN, defaultValue: false },
        
    }, 
    {
        tableName: 'mensajes'
    });
    
    Mensaje.associate = function(models) {
        
        Mensaje.belongsTo(models.Usuario,                  {foreignKey: 'emisor_id', as: 'emisor'});

        Mensaje.hasMany(models.Multimedia,                  { foreignKey: 'mensaje_adjunto_id', as: 'adjuntos' });
        
    };
  
    return Mensaje;
  }