import { getMockedDB } from './utils/test-db-mock';
import { Sequelize } from 'sequelize';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { SettingsRoute } from '@routes/settings.route';
import { TestServer } from './utils/test-server';

const SECRET_KEY = 'randOmSecretKeyForJWT';

const makeAuthToken = (userId: number) => sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' });

let testServer: TestServer;

beforeAll(async () => {
  testServer = new TestServer([new SettingsRoute()]);
  await testServer.start();
});

afterAll(async () => {
  if (testServer) {
    await testServer.stop();
  }
});

describe('Testing Settings', () => {
  describe('[GET] /settings', () => {
    it('returns 401 when no auth token is provided', async () => {
      return request(testServer.getServer()).get('/settings').expect(401);
    });

    it('returns settings when authenticated', async () => {
      const DB = getMockedDB();
      const mockSettings = { id: 1, llm_provider: 'claude' };

      DB.Users.findByPk = jest.fn().mockReturnValue({ id: 1, email: 'admin@test.com' });
      DB.Settings.findOne = jest.fn().mockReturnValue(mockSettings);

      (Sequelize as any).authenticate = jest.fn();

      const token = makeAuthToken(1);
      const response = await request(testServer.getServer())
        .get('/settings')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toEqual(mockSettings);
      expect(response.body.message).toBe('Settings retrieved successfully');
    });

    it('returns 404 when settings do not exist', async () => {
      const DB = getMockedDB();

      DB.Users.findByPk = jest.fn().mockReturnValue({ id: 1, email: 'admin@test.com' });
      DB.Settings.findOne = jest.fn().mockReturnValue(null);

      (Sequelize as any).authenticate = jest.fn();

      const token = makeAuthToken(1);
      return request(testServer.getServer())
        .get('/settings')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('[PUT] /settings', () => {
    it('returns 401 when no auth token is provided', async () => {
      return request(testServer.getServer()).put('/settings').send({ llm_provider: 'openai' }).expect(401);
    });

    it('updates settings when authenticated', async () => {
      const DB = getMockedDB();
      const updatedSettings = { id: 1, llm_provider: 'openai' };

      DB.Users.findByPk = jest.fn().mockReturnValue({ id: 1, email: 'admin@test.com' });
      DB.Settings.findOne = jest.fn().mockReturnValue({
        id: 1,
        llm_provider: 'claude',
        update: jest.fn().mockResolvedValue(updatedSettings),
      });

      (Sequelize as any).authenticate = jest.fn();

      const token = makeAuthToken(1);
      const response = await request(testServer.getServer())
        .put('/settings')
        .set('Authorization', `Bearer ${token}`)
        .send({ llm_provider: 'openai' })
        .expect(200);

      expect(response.body.data).toEqual(updatedSettings);
      expect(response.body.message).toBe('Settings updated successfully');
    });

    it('returns 404 when settings do not exist', async () => {
      const DB = getMockedDB();

      DB.Users.findByPk = jest.fn().mockReturnValue({ id: 1, email: 'admin@test.com' });
      DB.Settings.findOne = jest.fn().mockReturnValue(null);

      (Sequelize as any).authenticate = jest.fn();

      const token = makeAuthToken(1);
      return request(testServer.getServer())
        .put('/settings')
        .set('Authorization', `Bearer ${token}`)
        .send({ llm_provider: 'openai' })
        .expect(404);
    });
  });
});
