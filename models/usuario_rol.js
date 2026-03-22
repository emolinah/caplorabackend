module.exports = (sequelize, DataTypes) => {
  const usuario_rol = sequelize.define('UsuarioRol', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
  }, 
  {
    tableName: 'usuarios_rol'
  });
  usuario_rol.associate = function(models) {
    usuario_rol.belongsTo(models.Usuario, {foreignKey: 'usuario_id'});
    usuario_rol.belongsTo(models.Rol, {foreignKey: 'rol_id'});
  };

  return usuario_rol
}