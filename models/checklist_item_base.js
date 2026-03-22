module.exports = (sequelize, DataTypes) => {
    const ChecklistItemBase = sequelize.define('ChecklistItemBase', {
        
        //IDENTIFICACION
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        nombre: { type: DataTypes.STRING(100), allowNull: true, },
        check: { type: DataTypes.BOOLEAN, allowNull: true,},

        //fecha
        fecha_check: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },

    }, 
    {
        tableName: 'checklist_items_base'
    });
    
    ChecklistItemBase.associate = function(models) {


    };
  
    return ChecklistItemBase
}