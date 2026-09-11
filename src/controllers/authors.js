import { getAllAuthors as getAllAuthorsFromDb } from '../models/authors.js';

const getAllAuthors = async (req, res) => {
    try {
        const authors = await getAllAuthorsFromDb();
        return res.status(200).json(authors);
    } catch (error) {
        return res.status(500).json({ message: 'Unable to retrieve authors.' });
    }
};

const getAuthorById = async (req, res) => {
    try {
        const { id } = req.params;
        const author = await getAuthorByIdFromDb(id);

        if (!author) {
            return res.status(404).json({ message: 'Author not found.' });
        }

        return res.status(200).json(author);
    } catch (error) {
        return res.status(500).json({ message: 'Unable to retrieve author.' });
    }
};

const createAuthor = async (req, res) => {
    try {
        const { id, name, birthYear } = req.body;

        if (!id || !name || birthYear === undefined) {
            return res.status(400).json({ message: 'Missing required author fields.' });
        }

        if (!isIsoDate(birthYear.toString())) {
            return res.status(400).json({ message: 'birthYear must be a valid ISO date string (YYYY-MM-DD).' });
        }

        const existingAuthor = await getAuthorByIdFromDb(id);
        if (existingAuthor) {
            return res.status(409).json({ message: 'Author id already exists.' });
        }

        const createdAuthor = await createAuthorFromDb({ id, name, birthYear });

        return res.status(201).json(createdAuthor);

    } catch (error) {
        return res.status(500).json({ message: 'Unable to create author.' });
    }
};

const updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, birthYear } = req.body;

        if (!name || birthYear === undefined) {
            return res.status(400).json({ message: 'Missing required author fields.' });
        }

        if (!isIsoDate(birthYear.toString())) {
            return res.status(400).json({ message: 'birthYear must be a valid ISO date string (YYYY-MM-DD).' });
        }

        const existingAuthor = await getAuthorByIdFromDb(id);
        if (!existingAuthor) {
            return res.status(404).json({ message: 'Author not found.' });
        }

        const updatedAuthor = await updateAuthorFromDb(id, { name, birthYear });
        return res.status(200).json(updatedAuthor);
    } catch (error) {
        return res.status(500).json({ message: 'Unable to update author.' });
    }
};

const deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;

        const existingAuthor = await getAuthorByIdFromDb(id);
        if (!existingAuthor) {
            return res.status(404).json({ message: 'Author not found.' });
        }

        if (await authorHasBooks(id)) {
            return res.status(409).json({ message: 'Author cannot be deleted because they still have books.' });
        }

        await deleteAuthorFromDb(id);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Unable to delete author.' });
    }
};

function isIsoDate(str) {
    // 1. Check the structural format (YYYY-MM-DD)
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!str.match(regex)) return false;

    // 2. Parse the individual date parts
    const [year, month, day] = str.split('-').map(Number);

    // 3. Verify calendar validity using JavaScript's Date object
    // Note: JavaScript months are 0-indexed (January is 0, December is 11)
    const date = new Date(year, month - 1, day);

    // Check if the generated components match the input values
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };