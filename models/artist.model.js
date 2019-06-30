module.exports = (sequelize, type) => {
    return sequelize.define('artist', {
      id:{
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement:true
      },
      name:type.STRING,
      description: type.STRING,
      image: type.STRING,
      status: type.BOOLEAN,
      external_id: { type: type.STRING, defaultValue: type.UUIDV4 }
      },{
        createdAt:'date_create',
        updatedAt:'date_update'
      });
  }
  