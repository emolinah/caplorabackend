module.exports = (sequelize, DataTypes) => {
    const CheckList = sequelize.define('Checklist', {

        // IDENTIFICADOR
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        titulo: { type: DataTypes.STRING(100), allowNull: true },
        codigo: { type: DataTypes.STRING(100), allowNull: true },
        descripcion: { type: DataTypes.STRING(1000), allowNull: true },
        
        

    },
        {
            tableName: 'checklists'
        });

    CheckList.associate = function (models) {

        //cliente
        CheckList.hasMany(models.ChecklistItem, { foreignKey: 'checklist_id', as: 'items' });

        //adjuntos
         CheckList.hasMany(models.Multimedia, { foreignKey: 'check_adjunto_id', as: 'adjuntos' });


    };

    return CheckList;
}