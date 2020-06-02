var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookOwnerSchema = new Schema({
    id_book: String,
    token_user: String,
    number: Number,
    date_bought: { type: Date, default: Date.now  }
});

module.exports = mongoose.model('bookOwner', bookOwnerSchema);
