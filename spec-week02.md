# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects, or an empty array if no books found

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `400` if the publicationDate is not in ISO format calendar date
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `400` if the date is not in ISO format calendar date
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal
Create the Author CRUD APIs

Create the Author API so they can be CRUDed.
### Data Model
author documents will be stored in the `authors` collection.

Required Author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthDate`: string, required in ISO format calendar date

Authors will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Books
Each author will be identified by a reference from the individual book objects. See book documentation for implementation

### Routes

#### GET /authors
Purpose: Return all Authors.

Success:
- Status code: `200`
- Response body: an array of author objects or an empty array if no authors are found

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by its custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a4",
      "name": "Terry Pratchett",
      "birthDate": "1948-04-28"
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the date is not in ISO format calendar date
- `409` if the id in the object body is already in use
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing Author.

Request body:

    {
      "name": "Updated Name",
      "birthDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing
- `404` if no author exists with that id
- `400` if the date is not in ISO format calendar date
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if author is still in use by books
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every author route.

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

### Concerns/Improvements/Out of Scope for week 2
- prevent html injection. apply input sanitizaiton
- apply pagination and data limiting
- apply authorization requirements
- mongodb ids are preferred to custom ids
- the check for the author id in books will lose performance as the databases grow

# Books API Week 02 Spec - Version 02

## Purpose
Update the Week 01 book API to support full CRUD operations, establish an author reference relationship, and introduce a standalone Author CRUD API. Every route must be documented and testable via Swagger.

## Data Model
MongoDB database: `cse341-books-db`

### Collection: `books`
Book object fields:
- `id`: string, custom unique ID such as `b1` (required)
- `authorId`: string, references the `id` field of an author document (required)
- `title`: string (required)
- `publicationDate`: string in ISO 8601 calendar date format, for example "2026-01-15" (required)

*Note: Books will continue to use custom string IDs instead of MongoDB `_id` values for route parameters.*

### Collection: `authors`
Author object fields:
- `id`: string, custom unique ID such as `a1` (required)
- `name`: string (required)
- `birthDate`: string in ISO 8601 calendar date format, for example "1948-04-28" (required)

*Note: Authors will continue to use custom string IDs instead of MongoDB `_id` values for route parameters.*

## Endpoints

### Feature 1: Book CRUD Operations

#### 1. GET /books
- Description: Return all books.
- Success status: 200
- Error status: 500
- Success response body example (or an empty array `[]` if no books found):
[
  {
    "id": "b4",
    "authorId": "a1",
    "title": "Example Book Title",
    "publicationDate": "2026-01-15"
  }
]

#### 2. GET /books/:id
- Description: Return one book by its custom id.
- Success status: 200
- Not found status: 404
- Error status: 500
- Success response body example:
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
- Not found response body example:
{
  "message": "Book not found"
}

#### 3. POST /books
- Description: Create a new book. The submitted `authorId` must match an existing author document.
- Request body example:
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
- Success status: 201
- Client error status: 400
- Error status: 500
- Success response body example:
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
- Client error response body examples:
  - *Missing field / Author does not exist*:
  {
    "message": "Required field is missing or authorId does not match an existing author"
  }
  - *ID already exists*:
  {
    "message": "Book ID already exists"
  }
  - *Malformed date*:
  {
    "message": "publicationDate is not in ISO format calendar date (YYYY-MM-DD)"
  }

#### 4. PUT /books/:id
- Description: Update an existing book by its custom id. The submitted `authorId` must match an existing author document.
- Request body example:
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
- Success status: 200
- Client error status: 400
- Not found status: 404
- Error status: 500
- Success response body example:
{
  "id": "b4",
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
- Client error response body example:
{
  "message": "Required field missing, malformed date, or authorId does not match an existing author"
}
- Not found response body example:
{
  "message": "Book not found"
}

#### 5. DELETE /books/:id
- Description: Delete an existing book by its custom id.
- Success status: 204
- Not found status: 404
- Error status: 500
- Success response body example: *None*
- Not found response body example:
{
  "message": "Book not found"
}

---

### Feature 2: Author CRUD Operations

#### 6. GET /authors
- Description: Return all authors.
- Success status: 200
- Error status: 500
- Success response body example (or an empty array `[]` if no authors found):
[
  {
    "id": "a4",
    "name": "Terry Pratchett",
    "birthDate": "1948-04-28"
  }
]

#### 7. GET /authors/:id
- Description: Return one author by its custom id.
- Success status: 200
- Not found status: 404
- Error status: 500
- Success response body example:
{
  "id": "a4",
  "name": "Terry Pratchett",
  "birthDate": "1948-04-28"
}
- Not found response body example:
{
  "message": "Author not found"
}

#### 8. POST /authors
- Description: Create a new author.
- Request body example:
{
  "id": "a4",
  "name": "Terry Pratchett",
  "birthDate": "1948-04-28"
}
- Success status: 201
- Client error status: 400
- Conflict status: 409
- Error status: 500
- Success response body example:
{
  "id": "a4",
  "name": "Terry Pratchett",
  "birthDate": "1948-04-28"
}
- Client error response body example:
{
  "message": "Required field missing or birthDate is not in ISO format calendar date (YYYY-MM-DD)"
}
- Conflict response body example:
{
  "message": "Author ID is already in use"
}

#### 9. PUT /authors/:id
- Description: Update an existing author by its custom id.
- Request body example:
{
  "name": "Updated Name",
  "birthDate": "2026-02-20"
}
- Success status: 200
- Client error status: 400
- Not found status: 404
- Error status: 500
- Success response body example:
{
  "id": "a4",
  "name": "Updated Name",
  "birthDate": "2026-02-20"
}
- Client error response body example:
{
  "message": "Required field missing or birthDate is not in ISO format calendar date (YYYY-MM-DD)"
}
- Not found response body example:
{
  "message": "Author not found"
}

#### 10. DELETE /authors/:id
- Description: Delete an existing author by its custom id. Cannot delete an author currently assigned to a book.
- Success status: 204
- Not found status: 404
- Conflict status: 409
- Error status: 500
- Success response body example: *None*
- Not found response body example:
{
  "message": "Author not found"
}
- Conflict response body example:
{
  "message": "Cannot delete author; author is still in use by one or more books"
}

## Error Handling
- Do not return stack traces to clients.
- Return a simple message for 500 errors:
{
  "message": "Internal server error"
}

## Implementation Notes
- Use the MongoDB database named `cse341-books-db` containing two collections: `books` and `authors`.
- Seed both collections with sample documents needed for end-to-end integration testing.
- Use environment variables for the MongoDB connection string (`MONGODB_URI`).
- Ensure the live Swagger UI page at `/api-docs` matches these exact contract states for browser testing on Render.

## Concerns/Improvements/Out of Scope for week 2
- Prevent HTML injection (input sanitization)
- Apply pagination parameters and explicit document limits
- Implement API authentication and authorization controls
- Standardize native MongoDB default ObjectIds (`_id`) across paths instead of custom string IDs
- Relational integrity lookup performance checks will degrade at scale as datasets expand


