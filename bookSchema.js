const mongoose = require('mongoose')
const { Schema } = mongoose

const bookSchema = new Schema({
  title: String,
  comments: [String]
})

module.exports = bookSchema
