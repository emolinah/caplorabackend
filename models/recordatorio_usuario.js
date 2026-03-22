module.exports = (sequelize, DataTypes) => {
    const RecordatorioUsuario = sequelize.define('RecordatorioUsuario', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
    }, 
    {
      tableName: 'recordatorio_usuarios'
    });
    RecordatorioUsuario.associate = function(models) {
      
      //usuario
      RecordatorioUsuario.belongsTo(models.Usuario, {foreignKey: 'usuario_id'});
      
      //Recordatorio
      RecordatorioUsuario.belongsTo(models.Recordatorio, {foreignKey: 'recordatorio_id'});
      
    };
  
    return RecordatorioUsuario
  }