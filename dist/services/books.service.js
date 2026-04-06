"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _database_1 = require("@database");
class BookService {
    constructor() {
        this.books = _database_1.DB.Books;
    }
    async findAllBooks() {
        const allBooks = await this.books.findAll();
        return allBooks;
    }
    async findBookById(bookId) {
        const book = await this.books.findByPk(bookId);
        return book;
    }
    async checkBookExists(title, author) {
        const existingBook = await this.books.findOne({
            where: {
                title,
                author,
            },
        });
        return existingBook;
    }
    async createBook(bookData) {
        const existingBook = await this.checkBookExists(bookData.title, bookData.author);
        if (existingBook) {
            throw new Error(`A book with title "${bookData.title}" by "${bookData.author}" already exists`);
        }
        const bookToCreate = Object.assign(Object.assign({}, bookData), { is_available: bookData.stock_quantity > 0 });
        const book = await this.books.create(bookToCreate);
        return book;
    }
    async searchBooks(query) {
        const { Op } = require('sequelize');
        const books = await this.books.findAll({
            where: {
                [Op.or]: [{ title: { [Op.like]: `%${query}%` } }, { author: { [Op.like]: `%${query}%` } }, { genre: { [Op.like]: `%${query}%` } }],
            },
        });
        return books;
    }
}
exports.default = BookService;
//# sourceMappingURL=books.service.js.map