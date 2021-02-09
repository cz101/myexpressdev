const express = require("express")
const router = express.Router()
//const path = require('path')
//const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif','images/jpg']


router.get('/', async (req,res)=>{
 
 let query = Book.find()
  if ( req.query.title != null && req.query.title!=''){
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if ( req.query.publishedBefore != null && req.query.publishedBefore!=''){
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if ( req.query.publishedAfter != null && req.query.publishedAfter!=''){
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
      const books = await Book.exec()
      res.render('books/index', {
      books: books,
      searchOptions : req.query
    })

 } 
 catch{
   res.redirect('/')
 }
 
})


router.get('/new',  async (req,res)=>{
    renderNewPage(res, new Book())
})


router.post('/',  async(req,res)=>{
  //    res.send('Create Book')
    
  //const filename  = req.file !=null ? req.file.filename : null 
  let book = new Book({
      title : req.body.title,
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      pageCount:req.body.pageCount,
      description:req.body.description
                })

      saveCover(book,req.body.cover)
        try {

            const newBook= await book.save()
            //res.redirect(`authors/${newAuthor.id}`)
            res.redirect('books')
        }
        catch{
            renderNewPage(res,book,true)
        }
    })
/*
function removeBookCover (fielname) {

   fs.unlink (path.join(uploadPath, filename), err=>{
      if (err) console.error(err)
   })

 }
*/
 async function renderNewPage(res, book, hasError = false) {
        try {
         const authors = await Author.find({})
         const params = {
            authors: authors,
            book: book
          }
          if (hasError) {
            // console.log(" the error is "+ params)
            params.errorMessage = 'Error Creating The Book'

          }
          res.render('books/new', params)
        } catch {
          res.redirect('/books')
        }
      }

 function saveCover(book, coverEncoded) {
     console.log ("saving the cover")
     
    if (coverEncoded == null) return
      cover = JSON.parse(coverEncoded)
    
        
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      console.log ("....>")
       
          book.coverImage = new Buffer.from(cover.data, 'base64')
          book.coverImageType = cover.type
        }
      }
      
      

module.exports = router
