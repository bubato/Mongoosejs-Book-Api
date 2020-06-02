module.exports = async function(idBook, tokenUser)
{
    var Book = require('../models/book');
    var User = require('../models/user');
    var getBook = await Book.findOne({_id: idBook});
    var getUser = await User.findOne({token: tokenUser});
    if (getBook.cost < getUser.money) return getBook.cost;
    return false;
}