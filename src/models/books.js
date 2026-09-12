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
    const book = await collections.findOne({ id: bookId });
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
    await collections.updateOne({ id: bookId }, { $set: book });
    return { id: book}
}

const deleteBook = async (bookId) => {
    const db = getDb();
    const collections = db.collection('books');
    const result = await collections.deleteOne({ id: bookId });
    return result;
};

const authorExists = async (authorId) => {
    getAuthorById(authorId).then((author) => {
        return author !== null;
    }).catch((err) => {
        console.error(err);
        return false;
    });
}

export {getAllBooks, getBookById, createBook, updateBook, deleteBook, authorExists};