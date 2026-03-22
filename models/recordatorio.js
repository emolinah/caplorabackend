module.exports = (sequelize, DataTypes) => {
  const Recordatorio = sequelize.define('Recordatorio', {
    
    //IDENTIFICACION
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    tipo: { type: DataTypes.ENUM('NOTIFICACION', 'ALERTA', 'MENSAJE'), allowNull: true, defaultValue: 'NOTIFICACION', },

    //FECHAS
    fecha_notificacion: { type: DataTypes.DATE, allowNull: true },
    fecha_caducidad: { type: DataTypes.DATE, allowNull: true },
    fecha_visto: { type: DataTypes.DATE, allowNull: true },
    
    //DETALLE

    asunto: { type: DataTypes.STRING(100), allowNull: true },
    mensaje: { type: DataTypes.STRING(1000), allowNull: true },
    estado: { type: DataTypes.ENUM('ENVIADO', 'VISTO'), defaultValue: 'ENVIADO', allowNull: true },
    
    destacado: { type: DataTypes.BOOLEAN, allowNull: true },
    pinned: { type: DataTypes.BOOLEAN, allowNull: true },

  },
  {
      tableName: 'recordatorios'
  });

  Recordatorio.associate = function(models) {

    //USUARIOS
    //emisor
    Recordatorio.belongsTo(models.Usuario, {foreignKey: 'usuario_id', as: 'creador'});
    //destinatarios
    Recordatorio.belongsToMany(models.Usuario, {through: 'RecordatorioUsuario', foreignKey: 'recordatorio_id', as: 'destinatarios'});

    

    //modelos en los cuales hace Recordatorio
    Recordatorio.belongsTo(models.Proyecto,    {foreignKey: 'proyecto_id', as: 'proyecto'});

    //multimedia
    Recordatorio.belongsTo(models.Multimedia,      {foreignKey: 'recordatorio_image_id', as: 'imagen'});
    Recordatorio.hasMany(models.Multimedia,        {foreignKey: 'recordatorio_adjunto_id', as: 'adjuntos'}); 
 
  };
  return Recordatorio;
}
