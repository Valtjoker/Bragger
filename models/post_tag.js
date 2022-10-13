'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post_Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post_Tag.belongsTo(models.User)
      Post_Tag.belongsTo(models.Tag)
      Post_Tag.belongsTo(models.Post)
    }
  }
  Post_Tag.init({
    comment: DataTypes.TEXT,
    reaction: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    PostId: DataTypes.INTEGER,
    TagId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post_Tag',
  });
  return Post_Tag;
};