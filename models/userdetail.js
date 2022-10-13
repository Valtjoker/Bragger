'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDetail.belongsTo(models.User)
    }
  }
  UserDetail.init({
    gender: DataTypes.STRING,
    catchphrase: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'UserDetail',
  });
  UserDetail.beforeCreate((data) => {
    data.gender = "it's a secret.."
    data.catchphrase = "i have no catchphrase :("
    data.description = "hi"
  })
  return UserDetail;
};