module.exports = (sequelize, DataTypes) => {

    const Empresa = sequelize.define('Empresa', {

        //IDENTIFICACION
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        fecha_creacion: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW, },

        //DETALLES
        nombre: { type: DataTypes.STRING(100), allowNull: true, },
        telefono: { type: DataTypes.STRING(100), allowNull: true, },
        email: { type: DataTypes.STRING(100), allowNull: true, },
        web: { type: DataTypes.STRING(1000), allowNull: true, },
        actividad_economica: { type: DataTypes.STRING(1000), allowNull: true, },
        direccion: { type: DataTypes.STRING(1000), allowNull: true, },
        ciudad: { type: DataTypes.STRING(100), allowNull: true, },
        comuna: { type: DataTypes.STRING(100), allowNull: true, },
        pais: { type: DataTypes.STRING(100), allowNull: true, },

    },
        {
            tableName: 'empresas'
        });

    Empresa.associate = function (models) {

    };

    return Empresa;
}