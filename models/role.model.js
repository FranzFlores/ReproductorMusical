module.exports = (sequelize, type) => {
    return sequelize.define('role', {
      id:{
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    name:type.STRING,
    external_id: { type: type.STRING, defaultValue: type.UUIDV4 }
    },{
      timestamps: false
  });
  }
  