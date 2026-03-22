module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {

    //IDENTIFICACION
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    user: {
      type: DataTypes.STRING(100),
      unique: 'user',
      allowNull: false,
      validate: {
        len: [8, 100],
      },
    },
    email: { type: DataTypes.STRING(100), unique: 'email', },
    password: { type: DataTypes.STRING(1000), allowNull: false, },

    //ESTADO
    estado: { type: DataTypes.ENUM(['ACTIVO', 'INACTIVO', 'BLOQUEADO', 'RECUPERAR_CLAVE',]), defaultValue: 'ACTIVO', },

    //DETALLES
    nombre: { type: DataTypes.STRING(100), allowNull: true, },
    apellido: { type: DataTypes.STRING(100), allowNull: true, },
    rut: { type: DataTypes.STRING(100), allowNull: true, },
    segundo_apellido: { type: DataTypes.STRING(100), allowNull: true, },
    fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: true, },
    fecha_contrato: { type: DataTypes.DATEONLY, allowNull: true, },
    cargo: { type: DataTypes.STRING(100), allowNull: true, },

    //CONTACTO
    telefono: { type: DataTypes.STRING(100), allowNull: true, },
    direccion: { type: DataTypes.STRING(1000), allowNull: true, },

  },
    {
      tableName: 'usuarios'
    });

  Usuario.associate = function (models) {

    //roles
    Usuario.belongsToMany(models.Rol, { through: 'UsuarioRol', foreignKey: 'usuario_id', as: 'roles' });

    //Recordatorio
    Usuario.belongsToMany(models.Recordatorio, { through: 'RecordatorioUsuario', foreignKey: 'usuario_id', as: 'recordatorios' });

    //Empresa
    Usuario.belongsTo(models.Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

  };

  return Usuario;
}