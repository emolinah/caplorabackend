module.exports = (sequelize, DataTypes) => {
    const ProcesoCategoria = sequelize.define('ProcesoCategoria', {

        // IDENTIFICADOR
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        

        nombre: { type: DataTypes.STRING(100), allowNull: true, },

        
        fecha_creacion: { type: DataTypes.DATE, allowNull: true,},


    },
        {
            tableName: 'proceso_categorias'
        });

    ProcesoCategoria.associate = function (models) {

    };

    return ProcesoCategoria;
}
