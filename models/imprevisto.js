module.exports = (sequelize, DataTypes) => {
    const Imprevisto = sequelize.define('Imprevisto', {

        // IDENTIFICADOR
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        titulo: { type: DataTypes.STRING(100), allowNull: true },
        fecha_imprevisto: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        prioridad: {
            type: DataTypes.ENUM('NORMAL', 'PRIORIZAR', 'IMPORTANTE', 'URGENTE'),
            allowNull: false,
            defaultValue: 'NORMAL',
        },
        causa: { type: DataTypes.STRING(1000), allowNull: true },
        resolucion: { type: DataTypes.STRING(1000), allowNull: true },
        estado: {
            type: DataTypes.ENUM('ACTIVO', 'RESUELTO'),
            allowNull: false,
            defaultValue: 'ACTIVO',
        },        
    },
        {
            tableName: 'imprevistos'
        });

    Imprevisto.associate = function (models) {
        //usuario
        Imprevisto.belongsTo(models.Usuario, { foreignKey: 'usuario_creador_id', as: 'supervisor' });
        Imprevisto.belongsTo(models.Usuario, { foreignKey: 'usuario_resolucion_id', as: 'encargado' });
        
        //modulos
        Imprevisto.belongsTo(models.Proyecto, { foreignKey: 'proyecto_id', as: 'proyecto' });
        Imprevisto.belongsTo(models.Producto, { foreignKey: 'producto_id', as: 'producto' });
        Imprevisto.belongsTo(models.Tarea, { foreignKey: 'tar_id', as: 'tarea' });
        
        
    };

    return Imprevisto;
}