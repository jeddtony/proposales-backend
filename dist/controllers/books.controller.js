"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BooksController", {
    enumerable: true,
    get: function() {
        return BooksController;
    }
});
const _booksservice = /*#__PURE__*/ _interop_require_default(require("../services/books.service"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let BooksController = class BooksController {
    constructor(){
        _define_property(this, "bookService", new _booksservice.default());
        _define_property(this, "getBooks", async (req, res, next)=>{
            try {
                const { title, author, genre } = req.query;
                let findAllBooksData;
                if (title || author || genre) {
                    const searchQuery = title || author || genre;
                    findAllBooksData = await this.bookService.searchBooks(searchQuery);
                } else {
                    findAllBooksData = await this.bookService.findAllBooks();
                }
                res.status(200).json({
                    data: findAllBooksData,
                    message: 'List of books'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getBookById", async (req, res, next)=>{
            try {
                const bookId = Number(req.params.id);
                const findOneBookData = await this.bookService.findBookById(bookId);
                res.status(200).json({
                    data: findOneBookData,
                    message: 'Book details'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "createBook", async (req, res, next)=>{
            try {
                const bookData = req.body;
                const createBookData = await this.bookService.createBook(bookData);
                res.status(201).json({
                    data: createBookData,
                    message: 'Book created'
                });
            } catch (error) {
                next(error);
            }
        });
    }
};

//# sourceMappingURL=books.controller.js.map