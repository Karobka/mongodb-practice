var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./Book.model');
var port = 8080;
var db = 'mongodb://localhost/example';

//connect to the database
mongoose.connect(db);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

//index route location
app.get('/', function(req, res){
    res.send("Happy to be here!");
});

app.get('/books', function(req, res){
    console.log('Getting all books, please wait...');
    Book.find()
    .exec(function(err, books){
        if(err){
            res.send('Error, something blew up!');
        }else {
            console.log(books);
            res.json(books);
            
        }
    });
});


//id route
app.get('/books/:id', function(req, res){
    console.log("Getting one book...");
    Book.find.One({
        _id:req.params.id
    })
    .exec(function(err, book){
        if (err) {
            console.log("errorzzzz");
        }else {
            console.log(book);
            res.json(book);
        }
    })
});

//POST endpoint route
app.post('/book', function(req, res){
    var newBook = new Book();

    newBook.title = req.body.title;
    newBook.author = req.body.author;
    newBook.category = req.body.category;
    
    newBook.save(function(err, book){
        if(err){
            res.send('error saving the book');
        }else {
            console.log(book);
            res.send(book);
        }
    });
});

//POST another way to do a post endpoint using the ENTIRE request.body
app.post('/book2', function(req, res){
    Book.create(req.body, function(err, book){
        if(err) {
            res.send("error saving book");
        }else {
            console.log(book);
            res.send(book);
        }
    });
});

//PUT endpoint UPDATING an object
app.put('/book/:id', function (req, res) {
    Book.findOneAndUpdate({
        _id: req.params.id
    },
    { $set: { title: req.body.title }},
        { upsert: true},
        function (err, newBook){
            if(err) {
                res.send("error, unable to update");
            }else {
                console.log(newBook);
                res.send(newBook);
            }
        });
});

app.listen(port, function() {
    console.log('Your app is listsening on port ' + port);
});