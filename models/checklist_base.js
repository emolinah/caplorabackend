module.exports = (sequelize, DataTypes) => {
    const CheckListBase = sequelize.define('ChecklistBase', {

        // IDENTIFICADOR
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        titulo: { type: DataTypes.STRING(100), allowNull: true },
        codigo: { type: DataTypes.STRING(100), allowNull: true },
        descripcion: { type: DataTypes.STRING(1000), allowNull: true },
        
        

    },
        {
            tableName: 'checklists_base'
        });

    CheckListBase.associate = function (models) {

        //cliente
        CheckListBase.hasMany(models.ChecklistItemBase, { foreignKey: 'checklist_id', as: 'items' });
    };

    return CheckListBase;
}