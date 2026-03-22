module.exports = (sequelize, DataTypes) => {
    const Proceso = sequelize.define('Proceso', {

        // IDENTIFICADOR
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        numero: { type: DataTypes.INTEGER, allowNull: true },
        codigo: { type: DataTypes.STRING(100), allowNull: true },

        codigo: { type: DataTypes.STRING(100), allowNull: true },

        //FECHAS
        fecha_inicio: { type: DataTypes.DATE, allowNull: true, },
        fecha_termino: { type: DataTypes.DATE, allowNull: true, },

        nombre: { type: DataTypes.STRING(100), allowNull: true, },

        // FECHAS
        fecha_creacion: { type: DataTypes.DATE, allowNull: true },

        //UBICACION
        direccion: { type: DataTypes.STRING(1000), allowNull: true, },
        comuna: { type: DataTypes.STRING(100), allowNull: true },
        ciudad: { type: DataTypes.STRING(100), allowNull: true, },
        pais: { type: DataTypes.STRING(100), allowNull: true, },

        cantidad_productos: { type: DataTypes.INTEGER, allowNull: true },
        

        // total_impuesto: { type: DataTypes.FLOAT, allowNull: true, },
        // total_neto: { type: DataTypes.FLOAT, allowNull: true, },
        // total: { type: DataTypes.FLOAT, allowNull: true, },


    },
        {
            tableName: 'procesos'
        });

    Proceso.associate = function (models) {

        //usuario
        Proceso.belongsTo(models.Usuario, { foreignKey: 'supervisor_id', as: 'supervisor' });

        
        Proceso.belongsTo(models.Proyecto, { foreignKey: 'proyecto_id', as: 'proyecto' });

        Proceso.belongsTo(models.ProcesoCategoria, { foreignKey: 'proceso_categoria_id', as: 'categoria' });

        //productos y componentes
        Proceso.hasMany(models.Producto, { foreignKey: 'proceso_id', as: 'productos' });

        //adjuntos
        Proceso.hasMany(models.Multimedia, { foreignKey: 'proceso_adjunto_id', as: 'adjuntos' });

        //mensaje
        Proceso.hasMany(models.Mensaje, { foreignKey: 'proceso_id', as: 'mensajes' });
        
        Proceso.hasMany(models.Historico, { foreignKey: 'proceso_id', as: 'historial' });

        //imprevistos
        Proceso.hasMany(models.Imprevisto, { foreignKey: 'proceso_id', as: 'imprevistos' });

        //notas
        Proceso.hasMany(models.Nota, { foreignKey: 'proceso_id', as: 'notas' });

        //checklist
        Proceso.hasMany(models.Checklist, { foreignKey: 'proceso_id', as: 'checklist' });

        //etiquetas
        Proceso.hasMany(models.Etiqueta, { foreignKey: 'proceso_id', as: 'etiquetas' });

        //Empresa
        Proceso.belongsTo(models.Empresa, { foreignKey: 'empresa_id', as: 'empresa' });


    };

    return Proceso;
}
