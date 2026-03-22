module.exports = (sequelize, DataTypes) => {
    const Tarea = sequelize.define('Tarea', {

        // IDENTIFICADOR
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        titulo: { type: DataTypes.STRING(100), allowNull: true },
        descripcion: { type: DataTypes.STRING(1000), allowNull: true },

        // FECHAS
        fecha_vencimiento: { type: DataTypes.DATE, allowNull: true },
        fecha_inicio: { type: DataTypes.DATE, allowNull: true, },
        fecha_termino: { type: DataTypes.DATE, allowNull: true, },

    },
        {
            tableName: 'tareas'
        });

    Tarea.associate = function (models) {

        //usuario        
        Tarea.belongsTo(models.Usuario, { foreignKey: 'encargado_id', as: 'encargado' });
        Tarea.belongsTo(models.Usuario, { foreignKey: 'supervisor_id', as: 'supervisor' });

        //multimedia
        Tarea.hasMany(models.Multimedia, { foreignKey: 'tarea_adjunto_id', as: 'adjuntos' });

        //mensajes
        Tarea.hasMany(models.Mensaje, { foreignKey: 'tarea_id', as: 'mensajes' });
        Tarea.hasMany(models.Historico, { foreignKey: 'tarea_id', as: 'historial' });

        //imprevistos
        Tarea.hasMany(models.Imprevisto, { foreignKey: 'tarea_id', as: 'imprevistos' });

        //Empresa
        Tarea.belongsTo(models.Empresa, { foreignKey: 'empresa_id', as: 'empresa' });


    };

    return Tarea;
}