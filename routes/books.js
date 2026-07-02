const express = require("express");
const books = require("../data/books.json");
const {users} = require("../data/users.json");

const router = express.Router();

// **
//  route: /books
//  method: GET
//  description: get all the books in the system
//  access: public
//  parameters: none

router.get("/",(req,res)=>{
    res.status(200).json({
        success: true,
        data:books
    })
}) 

// route: /books/:id
// method: GET
// description: get a single book by id
// access: public
// parameters: id   

router.get('/:id',(req,res)=>{

    const {id} = req.params;
    const book = books.find((each)=>each.id === id);        
    
    if(!book){
        return res.status(404).json({
            success: false,
            message: `book not found for id: ${id}`
        })
    }
    res.status(200).json({
        success: true,
        data: book
    })
})

// route: /books
// method: POST
// description: Create/register a new book
// access: public
// parameters: none

router.post("/",(req,res)=>{
    const {id,name,author,genre,price,publisher} = req.body;

    // check if all the required fields are present
    if(!id || !name || !author || !genre || !price || !publisher){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }
    // check if the book with the same id already exists
    const existingBook = books.find((each)=>each.id === id);
    if(existingBook){   
        return res.status(400).json({
            success: false,
            message: `book with id ${id} already exists`
        })
    }

    // add the new book to the books array

    books.push({id,name,author,genre,price,publisher});
    res.status(201).json({
        success: true,
        data: {id,name,author,genre,price,publisher}
    })
})

// route: /books/:id
// method: PUT
// description: update a book by id
// access: public
// parameters: id

router.put('/:id',(req,res)=>{
    const {id} = req.params;
    const {data} = req.body;

    // check if the book exists
    const book = books.find((each)=>each.id === id);
    if(!book){
        return res.status(404).json({
            success: false,
            message: `book not found for id: ${id}`
        })
    }

    // update the book with the new data
    // object.assign(book,data);

    const updatedBook = books.map((each)=>{
        if(each.id === id){
            return {
                ...each,
                ...data
            }
        }
        return each
    })
   

    res.status(200).json({
        success: true,
        message: "book updated successfully",
        data: updatedBook
    })
})

// route: /books/:id
// method: DELETE
// description: delete a book by id
// access: public
// parameters: id

 router.delete('/:id',(req,res)=>{
    const {id} = req.params;

    // check if the book exists
    const book = books.find((each)=>each.id === id);
    if(!book){  

        return res.status(404).json({   
            success: false,
            message: `book not found for id: ${id}`
        })
    }
    // remove the book from the books array
    const updatedBooks = books.filter((each)=>each.id !== id);
    res.status(200).json({
        success: true,
        message: `book deleted successfully for id: ${id}`,
        data: updatedBooks
    })
})

// route: /books/issued
// method: get
// description: get all issued books
// access: public
// parameters: id

router.get('/issued/for-users',(req,res)=>{

    const userWithIssuedBook = users.filter((each) => {
        if (each.issuedBook) {
            return each;
        }
        
    });

    const issuedBooks = [];
    userWithIssuedBook.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);
         
        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    });

    if (issuedBooks === 0) {
        return res.status(404).json({
            success: false,
            message: "No books have been issued to any user."
        });
    }

    res.status(200).json({
        success: true,
        data: issuedBooks
    });
});





module.exports = router;