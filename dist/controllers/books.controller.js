"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksController = void 0;
const tslib_1 = require("tslib");
const books_service_1 = tslib_1.__importDefault(require("@services/books.service"));
class BooksController {
    constructor() {
        this.bookService = new books_service_1.default();
        this.getBooks = async (req, res, next) => {
            try {
                const { title, author, genre } = req.query;
                let findAllBooksData;
                if (title || author || genre) {
                    const searchQuery = title || author || genre;
                    findAllBooksData = await this.bookService.searchBooks(searchQuery);
                }
                else {
                    findAllBooksData = await this.bookService.findAllBooks();
                }
                res.status(200).json({ data: findAllBooksData, message: 'List of books' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getBookById = async (req, res, next) => {
            try {
                const bookId = Number(req.params.id);
                const findOneBookData = await this.bookService.findBookById(bookId);
                res.status(200).json({ data: findOneBookData, message: 'Book details' });
            }
            catch (error) {
                next(error);
            }
        };
        this.createBook = async (req, res, next) => {
            try {
                const bookData = req.body;
                const createBookData = await this.bookService.createBook(bookData);
                res.status(201).json({ data: createBookData, message: 'Book created' });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.BooksController = BooksController;
//# sourceMappingURL=books.controller.js.map