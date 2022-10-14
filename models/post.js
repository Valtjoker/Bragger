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
     get titlePost() {
      return this.title
    }

    showType() {
      let checkURL = this.contentURL.includes('youtube')
      if (checkURL) {
        return "Video"
      } else {
        return "Image"
      }
    }

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
    title: {
      type : DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Title cant be null' },
        notEmpty: { msg: 'Title cant be Empty' },
      }
    },
    contentURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'contentURL cant be null' },
        notEmpty: { msg: 'contentURL cant be Empty' },
      }
    },
    type: {
      type: DataTypes.STRING,
    },
    description: {
      type : DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: 'description cant be null' },
        notEmpty: { msg: 'description cant be Empty' },
      }
    }
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