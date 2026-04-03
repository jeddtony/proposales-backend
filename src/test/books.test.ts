import { getMockedDB } from './utils/test-db-mock';
import { Sequelize } from 'sequelize';
import request from 'supertest';
import { CreateBookDto } from '@dtos/books.dto';
import { BooksRoute } from '@routes/books.route';
import { TestServer } from './utils/test-server';

// Mock the auth middleware to always pass
jest.mock('@middlewares/auth.middleware', () => ({
  AuthMiddleware: (req: any, res: any, next: any) => next(),
}));

let testServer: TestServer;

beforeAll(async () => {
  testServer = new TestServer([new BooksRoute()]);
  await testServer.start();
}, 10000); // Increased timeout for server startup

afterAll(async () => {
  if (testServer) {
    await testServer.stop();
  }
}, 10000); // Increased timeout for server shutdown

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

describe('Testing Books', () => {
  describe('[GET] /books', () => {
    it('response findAll books', async () => {
      const DB = getMockedDB();

      DB.Books.findAll = jest.fn().mockReturnValue([
        {
          id: 1,
          title: 'The Lord of the Rings',
          author: 'J.R.R. Tolkien',
          genre: 'Fantasy',
          is_available: true,
          price: 2500,
          stock_quantity: 10,
          description: 'An epic fantasy novel',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Dune',
          author: 'Frank Herbert',
          genre: 'Science Fiction',
          is_available: true,
          price: 2200,
          stock_quantity: 5,
          description: 'A science fiction masterpiece',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          title: '1984',
          author: 'George Orwell',
          genre: 'Dystopian',
          is_available: false,
          price: 1800,
          stock_quantity: 0,
          description: 'A dystopian social science fiction novel',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      (Sequelize as any).authenticate = jest.fn();
      
      const response = await request(testServer.getServer()).get('/books');
      expect(response.status).toBe(200);
    });

    it('response findAll books with search by title', async () => {
      const DB = getMockedDB();

      DB.Books.findAll = jest.fn().mockReturnValue([
        {
          id: 1,
          title: 'The Lord of the Rings',
          author: 'J.R.R. Tolkien',
          genre: 'Fantasy',
          is_available: true,
          price: 2500,
          stock_quantity: 10,
          description: 'An epic fantasy novel',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      (Sequelize as any).authenticate = jest.fn();
      
      const response = await request(testServer.getServer()).get('/books?title=lord');
      expect(response.status).toBe(200);
    });

    it('response findAll books with search by author', async () => {
      const DB = getMockedDB();

      DB.Books.findAll = jest.fn().mockReturnValue([
        {
          id: 1,
          title: 'The Lord of the Rings',
          author: 'J.R.R. Tolkien',
          genre: 'Fantasy',
          is_available: true,
          price: 2500,
          stock_quantity: 10,
          description: 'An epic fantasy novel',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          title: 'The Hobbit',
          author: 'J.R.R. Tolkien',
          genre: 'Fantasy',
          is_available: true,
          price: 2000,
          stock_quantity: 8,
          description: 'A fantasy novel',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      (Sequelize as any).authenticate = jest.fn();
      
      const response = await request(testServer.getServer()).get('/books?author=tolkien');
      expect(response.status).toBe(200);
    });

    it('response findAll books with search by genre', async () => {
      const DB = getMockedDB();

      DB.Books.findAll = jest.fn().mockReturnValue([
        {
          id: 1,
          title: 'The Lord of the Rings',
          author: 'J.R.R. Tolkien',
          genre: 'Fantasy',
          is_available: true,
          price: 2500,
          stock_quantity: 10,
          description: 'An epic fantasy novel',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          title: 'The Hobbit',
          author: 'J.R.R. Tolkien',
          genre: 'Fantasy',
          is_available: true,
          price: 2000,
          stock_quantity: 8,
          description: 'A fantasy novel',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      (Sequelize as any).authenticate = jest.fn();
      
      const response = await request(testServer.getServer()).get('/books?genre=fantasy');
      expect(response.status).toBe(200);
    });
  });

  describe('[POST] /books', () => {
    it('response Create book', async () => {
      const bookData: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Test Genre',
        price: 1500,
        stock_quantity: 5,
        description: 'A test book description',
      };

      const DB = getMockedDB();

      // Mock that no existing book is found
      DB.Books.findOne = jest.fn().mockReturnValue(null);

      DB.Books.create = jest.fn().mockReturnValue({
        id: 1,
        ...bookData,
        is_available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      (Sequelize as any).authenticate = jest.fn();
      
      const response = await request(testServer.getServer()).post('/books').send(bookData);
      expect(response.status).toBe(201);
    });
  });

  describe('[GET] /books/:id', () => {
    it('response findOne book', async () => {
      const bookId = 1;

      const DB = getMockedDB();

      DB.Books.findByPk = jest.fn().mockReturnValue({
        id: 1,
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        is_available: true,
        price: 2500,
        stock_quantity: 10,
        description: 'An epic fantasy novel',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      (Sequelize as any).authenticate = jest.fn();
      
      const response = await request(testServer.getServer()).get(`/books/${bookId}`);
      expect(response.status).toBe(200);
    });
  });
});