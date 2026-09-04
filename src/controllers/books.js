import { getAllBooks } from "../models/books";

const getBooksHandler = async(req, res)=>{
    try{
    const books = getAllBooks();
    return res.staus(200).json(books);
    }catch{
        console.error('GET /books failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export {getBooksHandler};