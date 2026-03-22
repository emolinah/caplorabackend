module.exports = (sequelize, DataTypes) => {
    const Proyecto = sequelize.define('Proyecto', {

        // IDENTIFICADOR
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        numero: { type: DataTypes.INTEGER, allowNull: true },
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

        //VENTAS
        cotizacion_numero: { type: DataTypes.STRING(100), allowNull: true },
        cantidad_productos: { type: DataTypes.INTEGER, allowNull: true },
        

        // total_impuesto: { type: DataTypes.FLOAT, allowNull: true, },
        // total_neto: { type: DataTypes.FLOAT, allowNull: true, },
        // total: { type: DataTypes.FLOAT, allowNull: true, },


    },
        {
            tableName: 'proyectos'
        });

    Proyecto.associate = function (models) {

        //usuario
        Proyecto.belongsTo(models.Usuario, { foreignKey: 'supervisor_id', as: 'supervisor' });


        //productos y componentes
        Proyecto.hasMany(models.Producto, { foreignKey: 'proyecto_id', as: 'productos' });

        //adjuntos
        Proyecto.hasMany(models.Multimedia, { foreignKey: 'proyecto_adjunto_id', as: 'adjuntos' });

        //mensaje
        Proyecto.hasMany(models.Mensaje, { foreignKey: 'proyecto_id', as: 'mensajes' });
        
        Proyecto.hasMany(models.Historico, { foreignKey: 'proyecto_id', as: 'historial' });

        //imprevistos
        Proyecto.hasMany(models.Imprevisto, { foreignKey: 'proyecto_id', as: 'imprevistos' });

        //notas
        Proyecto.hasMany(models.Nota, { foreignKey: 'proyecto_id', as: 'notas' });

        //checklist
        Proyecto.hasMany(models.Checklist, { foreignKey: 'proyecto_id', as: 'checklist' });

        //etiquetas
        Proyecto.hasMany(models.Etiqueta, { foreignKey: 'proyecto_id', as: 'etiquetas' });

        //Empresa
        Proyecto.belongsTo(models.Empresa, { foreignKey: 'empresa_id', as: 'empresa' });


    };

    return Proyecto;
}
