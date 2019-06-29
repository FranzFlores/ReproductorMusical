module.exports = (sequelize, type) => {
    return sequelize.define('album', {
        id:{
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement:true
        },
        title:type.STRING,
        description: type.STRING,
        year: type.INTEGER,
        status: type.BOOLEAN,
        image: type.STRING,
        external_id: { type: type.STRING, defaultValue: type.UUIDV4 }
        },{
        createdAt:'date_create',
        updatedAt:'date_update'
      });
  }