module.exports = (sequelize, DataTypes) => {
    const usuario_reset = sequelize.define('Usuario_reset', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },         
        reset_code: {
            type: DataTypes.STRING(100),
            default: 0
        },      
        estado_proceso: {
            type: DataTypes.ENUM({
                values: ['ACTIVO', 'REALIZADO']
            })
        },
        hora_proceso: {
            type: DataTypes.DATE,
            default: new Date()
        },
    },
        {
            tableName: 'usuario_resets'
        });
        usuario_reset.associate = function (models) {
            usuario_reset.belongsTo(models.Usuario, {foreignKey: 'usuario_id', as: 'usuarios'});
    };
    return usuario_reset;
}