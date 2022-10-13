'use strict';
const fs = require('fs')


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     const data = JSON.parse(fs.readFileSync("./data/tags.json", "utf-8")).map(e=>{
      delete e.id
      e.createdAt = new Date()
      e.updatedAt = new Date()
      return e
     })
     return queryInterface.bulkInsert("Tags", data)
  },

  down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.bulkDelete("Tags", null)

  }
};
