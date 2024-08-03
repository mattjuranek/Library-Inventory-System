const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  location: { type: String, required: true },
  genre: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true, default: 1 }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
