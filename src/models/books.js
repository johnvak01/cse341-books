import { getDb } from "../db/connect.js";


const getAllBooks = async()=>{
    const db = getDb();
    const collections = db.collection('books');
    const books = await collections.find({}).toArray();
    return books;
}
export {getAllBooks};