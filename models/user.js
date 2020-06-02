var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: String,
    username: String,
    passwordhash: String,
    token: String,
    money: Number
});

module.exports = mongoose.model('user', userSchema);
