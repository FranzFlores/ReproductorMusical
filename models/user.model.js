'use strict'
module.exports = (sequelize, type) => {
    return sequelize.define('user', {
      id:{
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement:true
      },
      firstName:type.STRING,
      lastName: type.STRING,
      userName: type.STRING,
      email: type.STRING,
      password: type.STRING,
      image: type.STRING,
      external_id: { type: type.STRING, defaultValue: type.UUIDV4 }
      },{
        createdAt:'date_create',
        updatedAt:'date_update'
    });
}