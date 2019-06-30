module.exports = (sequelize, type) => {
    return sequelize.define('playList', {
      id:{
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement:true
      },
      title: type.STRING,
      image: type.STRING,
      description: type.STRING,
      status: type.BOOLEAN,
      external_id: { type: type.STRING, defaultValue: type.UUIDV4 }
      },{
      createdAt:'date_create',
      updatedAt:'date_update'
    });
}