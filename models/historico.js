module.exports = (sequelize, DataTypes) => {
    
    const Historico = sequelize.define('Historico', {
        
        //IDENTIFICACION
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true }, 
        fecha_creacion: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW, },
        
        //DETALLES
        actividad: { type: DataTypes.STRING(100), allowNull: true, },
        descripcion: { type: DataTypes.STRING(1000), allowNull: true, },

        estado: { type: DataTypes.STRING(100), allowNull: true, },
        
        prioridad: { type: DataTypes.STRING(100), allowNull: true, },

        propiedad: { type: DataTypes.STRING(100), allowNull: true, },
        propiedad_valor: { type: DataTypes.STRING(100), allowNull: true, },

        modelo: { type: DataTypes.STRING(100), allowNull: true, },
        modelo_id: { type: DataTypes.INTEGER, allowNull: true, },
        
        
    }, 
    {
        tableName: 'historico'
    });
    
    Historico.associate = function(models) {
        
        Historico.belongsTo(models.Usuario,              {foreignKey: 'usuario_id', as: 'responsable'});
        
    };
  
    return Historico;
  }