module.exports = (sequelize, DataTypes) => {
    
    const Nota = sequelize.define('Nota', {
        
        //IDENTIFICACION
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true }, 
        fecha_creacion: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW, },
        
        //DETALLES
        titulo: { type: DataTypes.STRING(100), allowNull: true, },
        nota: { type: DataTypes.STRING(1000), allowNull: true, },
        

    }, 
    {
        tableName: 'notas'
    });
    
    Nota.associate = function(models) {
        
        Nota.belongsTo(models.Usuario,              {foreignKey: 'usuario_creador_id', as: 'usuario_creador'});
        
    };
  
    return Nota;
  }