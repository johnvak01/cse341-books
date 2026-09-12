import { getAllBooks, getBookById, createBook, updateBook, deleteBook, authorExists } from "../models/books.js";

const getBooksHandler = async(req, res)=>{
    try{
    const books = await getAllBooks();
    return res.status(200).json(books);
    }catch(error){
        console.error('GET /books failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getBookByIdHandler = async(req, res)=>{
    const bookId = req.params.id;
    try{
        const book = await getBookById(bookId);
        if(!book){
            return res.status(404).json({ message: 'Book not found' });
        }
        return res.status(200).json(book);
    }catch(error){
        console.error(`GET /books/${bookId} failed:`, error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const createBookHandler = async(req, res)=>{
    
        const { _id, title, authorId, publicationDate } = req.body;
        if(!_id || !title || !authorId || publicationDate === undefined){
            return res.status(400).json({ message: 'Missing required book fields' });
        }else if(!await authorExists(authorId)){
            return res.status(400).json({ message: 'Author does not exist' });
        }
        try{
            const existingBook = await getBookById(_id);
            if(existingBook){
                return res.status(400).json({ message: 'Book id already exists' });
            }
            const createdBook = await createBook({ _id, title, authorId, publicationDate });
            return res.status(201).json(createdBook);
        }catch(error){
            console.error('POST /books failed:', error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

const updateBookHandler = async(req, res)=>{
    const bookId = req.params.id;
    const { title, authorId, publicationDate } = req.body;
    if(!title || !authorId || publicationDate === undefined){
        return res.status(400).json({ message: 'Missing required book fields' });
    } else if (!await authorExists(authorId)){
        return res.status(400).json({ message: 'Author does not exist' });
    }
    try{
        const existingBook = await getBookById(bookId);
        if(!existingBook){
            return res.status(404).json({ message: 'Book not found' });
        }
        const updatedBook = await updateBook(bookId, { title, authorId, publicationDate });
        return res.status(200).json(updatedBook);
    }catch(error){
        console.error(`PUT /books/${bookId} failed:`, error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteBookHandler = async(req, res)=>{
    const bookId = req.params.id;
    try{
        const existingBook = await getBookById(bookId);
        if(!existingBook){
            return res.status(404).json({ message: 'Book not found' });
        }
        await deleteBook(bookId);
        return res.status(204).send();
    }catch(error){
        console.error(`DELETE /books/${bookId} failed:`, error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export {getBooksHandler, getBookByIdHandler, createBookHandler, updateBookHandler, deleteBookHandler};