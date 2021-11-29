/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const mongoose = require('mongoose')
const bookSchema = require('../bookSchema')
let Book = mongoose.model('Book', bookSchema)
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })

const getBook = async (data, done) => {
  let book = Book.find(data, (err, docs) => {
    if (err) return console.log(err)
    done(null, docs)
  })
}

const createBook = async (data, done) => {
  let book = new Book({
    ...data
  })
  book.save( (err, doc) => {
    if (err) return console.log(err)
    done(null, doc)
  })
}

const deleteBook = async (data, done) => {
  let delDoc = Book.deleteMany(data, (err, docs) => {
    if (err) return console.log(err)
    done(null, docs)
  })
}

const addBookComment = async (data, done) => {
  let doc = Book.findOneAndUpdate(
    { _id: data.bookid },
    { $push: { comments: data.comment }},
    { returnDocument: 'after' },
    (err, doc) => {
      if (err) return console.log(err)
      done(null, doc)
    }
  )
}

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let docs = await getBook({}, (err, docs) => {
        if (err) return console.log(err)
        let books = []
        for (let i in docs) {
          books.push({
            _id: docs[i]._id,
            title: docs[i].title,
            comments: docs[i].comments,
            commentcount: docs[i].comments.length,
          })
        }
        res.json(books)
      })
    })

    .post(async (req, res) => {
      //response will contain new book object including atleast _id and title
      if (!req.body.title) return res.json('missing required field title')
      let title = req.body.title;
      let doc = await createBook({
        title: title,
      }, (err, data) => {
        if (err) return console.log(err)
        res.json({
          _id: data._id,
          title: data.title,
          comments: data.comments,
          commentcount: data.comments.length,
        })
      })
    })

    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      let docs = await deleteBook({}, (err, docs) => {
        if (err) return console.log(err)
        res.json('complete delete successful')
      })
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let doc = await getBook({
        _id: bookid,
      }, (err, doc) => {
        // console.log(doc)
        if (err || doc.length === 0) return res.json('no book exists')
        res.json({
          _id: doc[0]._id,
          title: doc[0].title,
          comments: doc[0].comments,
          commentcount: doc[0].comments.length,
        })
      })
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      let doc = await addBookComment({
        bookid: bookid,
        comment: comment
      }, (err, doc) => {
        if (err) return console.log(err)
        res.json({
          _id: doc._id,
          title: doc.title,
          comments: doc.comments,
          commentcount: doc.comments.length,
        })
      })
    })

    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      let doc = await deleteBook({
        _id: bookid
      }, (err, docs) => {
        if (err) return console.log(err)
        res.json('delete successful')
      })
    });

};
