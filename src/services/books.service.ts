import { Book } from '@interfaces/books.interface';
import { DB } from '@database';
import { CreateBookDto } from '@dtos/books.dto';

class BookService {
  public books = DB.Books;

  public async findAllBooks(): Promise<Book[]> {
    const allBooks = await this.books.findAll();
    return allBooks;
  }

  public async findBookById(bookId: number): Promise<Book> {
    const book = await this.books.findByPk(bookId);
    return book;
  }

  private async checkBookExists(title: string, author: string): Promise<Book> {
    const existingBook = await this.books.findOne({
      where: {
        title,
        author,
      },
    });
    return existingBook;
  }

  public async createBook(bookData: CreateBookDto): Promise<Book> {
    const existingBook = await this.checkBookExists(bookData.title, bookData.author);

    if (existingBook) {
      throw new Error(`A book with title "${bookData.title}" by "${bookData.author}" already exists`);
    }

    const bookToCreate = {
      ...bookData,
      is_available: bookData.stock_quantity > 0,
    };

    const book = await this.books.create(bookToCreate);
    return book;
  }

  public async searchBooks(query: string): Promise<Book[]> {
    const { Op } = require('sequelize');
    const books = await this.books.findAll({
      where: {
        [Op.or]: [{ title: { [Op.like]: `%${query}%` } }, { author: { [Op.like]: `%${query}%` } }, { genre: { [Op.like]: `%${query}%` } }],
      },
    });
    return books;
  }
}

export default BookService;
