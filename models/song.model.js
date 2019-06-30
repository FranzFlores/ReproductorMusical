module.exports = (sequelize, type) => {
    return sequelize.define('song', {
      id:{
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement:true
      },
      number:type.INTEGER,
      title: type.STRING,
      file: type.STRING,
      status: type.BOOLEAN,
      listeners: type.INTEGER,
      external_id: { type: type.STRING, defaultValue: type.UUIDV4 }
    },{
      createdAt:'date_create',
      updatedAt:'date_update'
    });
}