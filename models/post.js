'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.hasMany(models.Post_Tag)
      Post.belongsToMany(models.Tag, { 
        foreignKey: "PostId",
        through: "Post_Tag" 
      })
    }
  }
  Post.init({
    title: DataTypes.STRING,
    contentURL: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Post',
  });

  Post.beforeCreate((data) => {
    let url = data.contentURL
    let convertedUrl = url.replace('watch?v=', 'embed/')
    
    data.contentURL = convertedUrl
  })
  return Post;
};