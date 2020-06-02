module.exports = function(app, Book, User, bookOwner)
{
    var body;
    var header;

    app.get('/api/books', function(req,res){
        header = req.header;
        Book.find(function(err, books){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(books);
        })
    });

    app.get('/api/books/:book_id', function(req, res){
        Book.findOne({_id: req.params.book_id}, function(err, book){
            if(err) return res.status(500).json({error: err});
            if(!book) return res.status(404).json({error: 'book not found'});
            res.json(book);
        })
    });

    app.get('/api/books/author/:author', function(req, res){
        Book.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1},  function(err, books){
            if(err) return res.status(500).json({error: err});
            if(books.length === 0) return res.status(404).json({error: 'book not found'});
            res.json(books);
        })
    });

    app.post('/api/books', function(req, res){
        var book = new Book();
        book.title = req.body.title;
        book.author = req.body.author;
        book.published_date = new Date(req.body.published_date);

        book.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }

            res.json({result: 1});

        });
    });

    app.put('/api/books/:book_id', function(req, res){
        Book.update({ _id: req.params.book_id }, { $set: req.body }, function(err, output){
            if(err) res.status(500).json({ error: 'database failure' });
            console.log(output);
            if(!output.n) return res.status(404).json({ error: 'book not found' });
            res.json( { message: 'book updated' } );
        })
    });

    app.delete('/api/books/:book_id', function(req, res){
        Book.remove({ _id: req.params.book_id }, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });
            res.status(204).end();
        })
    });

    app.post('/api/user/login', function(req, res){
        body = req.body;
        User.findOne({username: body.username, passwordhash: body.passwordhash},  function(err, user){
            if(err) return res.status(500).json({error: err});
            if(!user) return res.status(404).json({error: false});
            res.json({"token": user.token});
        })
    });

    app.post('/api/buy-book', function(req, res){
        body = req.body;
        bookOwner.findOne({id_book: body.id_book, token_user: body.token_user},  function(err, getOwner){
            if(err) return res.status(500).json({error: err});
            if(!getOwner) {
                var canBuy = require('../querys/canBuy');
                const cost = canBuy(body.id_book, body.token_user);
                if (cost) {
                    User.findOneAndUpdate({ token: body.token_user }, {$inc : { 'money': -cost}},  function(err, status){
                        var owner = new bookOwner();
                        owner.id_book = body.id_book
                        owner.token_user = body.token_user;
                        owner.date_bought = body.date_bought;
                        owner.number = body.number;
                        owner.save(function(err){
                            if(err){
                                res.json({status: false});
                                return;
                            }
                
                            res.json({status: true});
                
                        });
                    });
                } else {
                    res.json({status: false});
                }
            } else {
                res.json({status: false});
            }
        })
    });

    app.post('/api/user/register', function(req, res){
        body = req.body;
        User.findOne({username: body.username, passwordhash: body.passwordhash},  function(err, getUser){
            if(err) return res.status(500).json({error: err});
            if(!getUser) {
                var user = new User();
                var jwt = require('jsonwebtoken');
                var bcrypt = require('bcryptjs');
                var token = bcrypt.hashSync(body.username + body.passwordhash, 8);
                user._id = token.substring(10, 18)
                user.username = body.username;
                user.passwordhash = body.passwordhash;
                user.token = token;
                user.money = 100000;
                user.save(function(err){
                    if(err){
                        res.json({result: "Error Signup"});
                        return;
                    }
        
                    res.json({token: token});
        
                });
            } else {
                res.json({status: false});
            }
        })
    });
     
}
