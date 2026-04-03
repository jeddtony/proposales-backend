import { Router } from 'express';
import { BooksController } from '@controllers/books.controller';
import { CreateBookDto } from '@dtos/books.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@middlewares/auth.middleware';

export class BooksRoute implements Routes {
  public path = '/books';
  public router = Router();
  public books = new BooksController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.books.getBooks);
    this.router.get(`${this.path}/:id`, AuthMiddleware, this.books.getBookById);
    this.router.post(`${this.path}`, AuthMiddleware, ValidationMiddleware(CreateBookDto), this.books.createBook);
  }
}
