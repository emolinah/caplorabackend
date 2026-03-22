module.exports = (sequelize, DataTypes) => {
    const ChecklistItem = sequelize.define('ChecklistItem', {
        
        //IDENTIFICACION
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        nombre: { type: DataTypes.STRING(100), allowNull: true, },
        check: { type: DataTypes.BOOLEAN, allowNull: true,},

        //fecha
        fecha_check: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },

    }, 
    {
        tableName: 'checklist_items'
    });
    
    ChecklistItem.associate = function(models) {

        ChecklistItem.belongsTo(models.Usuario,             {foreignKey: 'responsable_id', as: 'responsable'});

    };
  
    return ChecklistItem
}