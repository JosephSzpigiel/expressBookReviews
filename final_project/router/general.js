const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = {}
  book[isbn] = books[isbn]
  return res.status(200).json(book);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase()
  const isbns= Object.keys(books)
  const results = {}

  isbns.forEach(isbn => {
    if(books[isbn].author.toLowerCase().replace(/ /g, '_').includes(author)){
      results[isbn] = books[isbn]
    }
  });
  return res.status(200).json({results});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase()
  const isbns= Object.keys(books)
  const results = {}

  isbns.forEach(isbn =>{
    if(books[isbn].title.toLowerCase().replace(/ /g, '_').includs(title)){
      results[isbn] = books[isbn]
    }
  })
  return res.status(200).json(results);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  return res.status(200).json({'results': book['reviews']});
});

module.exports.general = public_users;
