'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
const randomIpv4 = require('random-ipv4');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post_Tag)
      User.hasOne(models.UserDetail)
    }
  }
  User.init({
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    ip: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((data) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);
    const randomIp = randomIpv4();

    data.password = hash
    data.ip = randomIp
  })
  
  return User;
};