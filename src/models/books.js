import { getDb } from "../db/connect";


const getAllBooks = async()=>{
    const db = getDB();
    const collections = db.collection('books');
    const books = collections.find({}).toArray();
    return books;
}
export {getAllBooks};