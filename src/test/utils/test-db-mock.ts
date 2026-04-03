// Mock the database connection for tests
jest.mock('@database', () => ({
  DB: {
    Users: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      scope: jest.fn().mockReturnThis(),
    },
    Books: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      decrement: jest.fn(),
    },
    ShoppingCart: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
    ShoppingCartItems: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
    Order: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
    OrderItems: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
    Transaction: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
    sequelize: {
      sync: jest.fn().mockResolvedValue(undefined),
      authenticate: jest.fn().mockResolvedValue(undefined),
      transaction: jest.fn().mockImplementation(async callback => {
        const mockTransaction = {
          commit: jest.fn(),
          rollback: jest.fn(),
          LOCK: {
            UPDATE: 'UPDATE',
          },
        };

        if (callback) {
          await callback(mockTransaction);
        }

        return mockTransaction;
      }),
    },
  },
}));

// Helper function to get the mocked DB instance
export const getMockedDB = () => {
  const { DB } = require('@database');
  return DB;
};
