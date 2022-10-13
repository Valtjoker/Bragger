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
    gender: {
      type : DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'gender cant be Empty' },
      }
    },
    catchphrase: { 
      type : DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'catchphrase cant be Empty' },
      }
    },
    description: {
      type : DataTypes.TEXT,
      validate: {
        notEmpty: { msg: 'description cant be Empty' },
      }
    }
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