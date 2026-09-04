import { getDb } from "../db/connect.js";


const getAllBooks = async()=>{
    const db = getDb();
    const collections = db.collection('books');
    const books = await collections.find({}).toArray();
    return books;
}

const getBookById = async (bookId) => {
    const db = getDb();
    const collections = db.collection('books');
    const book = await collections.findOne({ _id: bookId });
    return book;
};
export {getAllBooks, getBookById};