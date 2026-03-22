module.exports = (sequelize, DataTypes) => {
    const EtiquetaBase = sequelize.define('EtiquetaBase', {

        // IDENTIFICADOR
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        fecha_inicio: { type: DataTypes.DATE, allowNull: true, },

        nombre: { type: DataTypes.STRING(100), allowNull: true },
        descripcion: { type: DataTypes.STRING(1000), allowNull: true },
        categoria: { type: DataTypes.STRING(100), allowNull: true },
        
        icono: { type: DataTypes.STRING(100), allowNull: true },
        color: { type: DataTypes.STRING(100), allowNull: true },
        modelo: { type: DataTypes.STRING(100), allowNull: true },

        

    },
    {
        tableName: 'etiquetas_base'
    });

    EtiquetaBase.associate = function (models) {      
        
        EtiquetaBase.belongsTo(models.EtiquetaBase,         { foreignKey: 'etiqueta_previa_id', as: 'etiqueta_previa' });

        EtiquetaBase.belongsTo(models.EtiquetaBase,         { foreignKey: 'etiqueta_siguiente_id', as: 'etiqueta_siguiente' });

        EtiquetaBase.belongsTo(models.Rol,                  { foreignKey: 'rol_id', as: 'rol' });
    };

    return EtiquetaBase;
}
