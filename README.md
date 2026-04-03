# Digital Library API - Divest Assessment

This project is a **Digital Library API** built as an assessment for Divest. It's a RESTful API that provides functionality for managing books, users, shopping carts, and orders.

## ⚠️ Assessment Notice

This project was developed as an assessment for Divest, and as such, certain features are intentionally limited:

- **Authentication**: Basic JWT-based authentication is implemented
- **User Model**: Simplified user model with only email and password (no first name, last name, or other details as they weren't necessary for this assessment)
- **Database**: Uses MySQL with Sequelize ORM
- **Testing**: Unit tests are included but may not cover all edge cases
- **Security**: Basic security measures are in place but may not be production-ready
- **Error Handling**: Standard error handling is implemented
- **Documentation**: API documentation is provided via Swagger UI

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jeddtony/divest-assessment.git
   cd divest-assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a file named `.env.development.local` in the root directory with the following variables:
   
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3000
   SECRET_KEY=your-secret-key-here
   
   # Database Configuration
   DB_USER=your-database-username
   DB_PASSWORD=your-database-password
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=your-database-name
   
   # CORS Configuration
   ORIGIN=http://localhost:3000
   CREDENTIALS=true
   
   # Logging Configuration
   LOG_FORMAT=combined
   LOG_DIR=logs
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   The application will start on port 3000 and automatically run database migrations to set up the required tables.

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation at:

**http://localhost:3000/api-docs/**

The documentation includes all available endpoints with request/response examples and authentication requirements.

## 🏗️ Project Structure

```
src/
├── app.ts                 # Express app configuration
├── server.ts             # Server entry point
├── config/               # Configuration files
├── controllers/          # Route controllers
├── database/             # Database configuration and migrations
├── dtos/                 # Data Transfer Objects
├── exceptions/           # Custom exception classes
├── http/                 # HTTP request examples
├── interfaces/           # TypeScript interfaces
├── middlewares/          # Express middlewares
├── models/               # Sequelize models
├── routes/               # API routes
├── services/             # Business logic services
├── test/                 # Test files
└── utils/                # Utility functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run migration:run` - Run database migrations

## 🗄️ Database

The application uses MySQL with Sequelize ORM. The following tables are automatically created when the application starts:

- **users** - User accounts and authentication
- **books** - Book catalog with inventory
- **shopping_carts** - User shopping carts
- **shopping_cart_items** - Items in shopping carts
- **orders** - User orders
- **order_items** - Items in orders
- **transactions** - Payment transactions

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication with a cookie-based approach. When users log in, the JWT token is automatically stored as an HttpOnly cookie, which means:

- **No manual token handling**: You don't need to manually send the JWT token with every request
- **Device-specific authentication**: Each device/browser maintains its own authentication session
- **Automatic token management**: The token is automatically included in requests and cleared on logout
- **Enhanced security**: HttpOnly cookies prevent XSS attacks from accessing the token

For API testing tools that don't support cookies, you can still use the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📋 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /logout` - User logout

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Books
- `GET /books` - Get all books (with search)
- `GET /books/:id` - Get book by ID
- `POST /books` - Create book (admin only)

### Shopping Cart
- `GET /shopping-cart` - Get user's shopping cart
- `POST /shopping-cart` - Add book to cart

### Orders
- `POST /order` - Create order from cart
- `GET /order/history` - Get user's order history
- `PATCH /order/:id/pay` - Mark order as paid

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

The tests cover:
- Authentication endpoints
- User management
- Book operations
- Shopping cart functionality
- Order processing

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MySQL, Sequelize ORM
- **Authentication**: JWT, bcrypt
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest
- **Development**: Nodemon, ESLint, Prettier

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | development |
| `PORT` | Server port | Yes | 3000 |
| `SECRET_KEY` | JWT secret key | Yes | - |
| `DB_USER` | Database username | Yes | - |
| `DB_PASSWORD` | Database password | Yes | - |
| `DB_HOST` | Database host | Yes | localhost |
| `DB_PORT` | Database port | Yes | 3306 |
| `DB_DATABASE` | Database name | Yes | - |
| `ORIGIN` | CORS origin | No | http://localhost:3000 |
| `CREDENTIALS` | CORS credentials | No | true |
| `LOG_FORMAT` | Log format | No | combined |
| `LOG_DIR` | Log directory | No | logs |

## 🤝 Contributing

This is an assessment project, but if you have suggestions or find issues, feel free to provide feedback.

## 📄 License

This project is created for assessment purposes.

---

**Note**: This API is designed for demonstration and assessment purposes. For production use, additional security measures, error handling, and testing would be required. 