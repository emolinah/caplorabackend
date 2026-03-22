module.exports = (sequelize, DataTypes) => {
  const rol = sequelize.define('Rol', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(1000),
        allowNull: true,
    },
    estado: {
        type: DataTypes.ENUM(['ACTIVO', 'INACTIVO', 'BLOQUEADO']),
        allowNull: true,
        defaultValue: 'ACTIVO',
    }
  }, 
  {
    tableName: 'roles'
  });
  rol.associate = function(models) {

    rol.belongsToMany(models.Usuario, {through: 'UsuarioRol', foreignKey: 'rol_id', as: 'usuario'});

  };
  return rol
}
