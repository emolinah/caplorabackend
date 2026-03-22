module.exports = (sequelize, DataTypes) => {
  const Etiqueta = sequelize.define('Etiqueta', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_creador_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    etiqueta_base_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    proceso_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    proyecto_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, 
  {
    tableName: 'etiquetas',
  });

  Etiqueta.associate = function(models) {
    Etiqueta.belongsTo(models.Usuario, { foreignKey: 'usuario_creador_id', as: 'creador' });
    Etiqueta.belongsTo(models.EtiquetaBase, { foreignKey: 'etiqueta_base_id', as: 'etiqueta_base' });
    Etiqueta.belongsTo(models.Proceso, { foreignKey: 'proceso_id', as: 'proceso' });
    Etiqueta.belongsTo(models.Producto, { foreignKey: 'producto_id', as: 'producto' });
    Etiqueta.belongsTo(models.Proyecto, { foreignKey: 'proyecto_id', as: 'proyecto' });
  };

  return Etiqueta;
};