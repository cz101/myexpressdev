const { response } = require("express")
const express = require("express")
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')


router.get('/', async (req,res)=>{

    let searchOptions = {}
    if( req.query.name != null && req.query.name !== ''){

        searchOptions.name = new RegExp (req.query.name , 'i')
    }
    try {
          const authors = await Author.find(searchOptions)
          res.render( 'authors/index', {
              authors: authors,
              searchOptions : req.query
            })
    }
    catch{

        res.redirect('/')

    }
})


router.get('/new', (req,res)=>{
    res.render('authors/new',{author: new Author()})   
    })



router.post('/', async(req,res)=>{

        let author = new Author({name : req.body.name})
        // res.send('create')   


        try {

            const newAuthor= await author.save()
            //res.redirect(`authors/${newAuthor.id}`)
            res.redirect(`authors`)
        }
        catch{
            res.render('authors/new', { 
                   author: author,
                   errorMessage: 'Error in creating author'
            })
        }

        // author.save((err, newAuthor)=>{
        //     if(err){ 
        //         res.render('author/new',{ 
        //         author: author,
        //         errorMessage: 'Error in creating author'
        //     })
        // }
        //     else{ res.redirect(`authors`)}

        // })  
        //res.send(req.body.name)

    })

    router.get('/:id', async (req, res) => {
      try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.render('authors/show', {
          author: author,
          booksByAuthor: books
        })
      } catch {
        res.redirect('/')
      }
    })



router.get('/:id/edit', async (req, res) => {
  try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
        //res.send ('Edit Author :' + req.params.id)
      } catch (err){
        console.log(err)
        res.redirect('/authors')
      }
    })

/*
    router.get('/:id',(req, res) => {
        console.log("here i am ")
        res.send ('Show Author : ' + req.params.id)
    })    
*/
    
      router.put('/:id', async (req, res) => {
        let author
        try {
          const author = await Author.findById(req.params.id)
          author.name = req.body.name
          await author.save()
          res.redirect(`/authors/${author.id}`)

          // res.render('authors/edit', { author: author })
          // res.send ('Update Author : ' + req.params.id)
        } catch  {
          
           if (author == null){  res.redirect('/')} else { res.render('auhtors/edit', { 
             author : author,
             errorMessage: 'Error updating Author'
           })}
         
        }
      })  

      router.delete('/:id', async (req, res) => {
        let author
        try {
          const author = await Author.findById(req.params.id)
          await author.remove()
          res.redirect(`/authors`)

          // res.render('authors/edit', { author: author })
          // res.send ('Update Author : ' + req.params.id)
        } catch {
          
           if (author == null){  res.redirect('/')} else { res.redirect(`/authors/${author.id}`)}
         
        }
      })  

module.exports = router
