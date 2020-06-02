var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    _id: String,
    title: String,
    author: String,
    published_date: { type: Date, default: Date.now  }
});

module.exports = mongoose.model('book', bookSchema);
