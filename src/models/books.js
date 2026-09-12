import { getDb } from "../db/connect.js";
import { getAuthorById } from "./authors.js";

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

const createBook = async (book) => {
    const db = getDb();
    const collections = db.collection('books');
    await collections.insertOne(book);
    return book;
};

const updateBook = async (bookId, book) => {
    const db = getDb();
    const collections = db.collection('books');
    await collections.updateOne({ _id: bookId }, { $set: book });
    return { _id: book}
}

const deleteBook = async (bookId) => {
    const db = getDb();
    const collections = db.collection('books');
    const result = await collections.deleteOne({ _id: bookId });
    return result;
};

const authorExists = async (authorId) => {
    try {
        const author = await getAuthorById(authorId);
        return author !== null;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export {getAllBooks, getBookById, createBook, updateBook, deleteBook, authorExists};