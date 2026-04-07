import { getMockedDB } from './utils/test-db-mock';
import { Sequelize } from 'sequelize';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { DashboardRoute } from '@routes/dashboard.route';
import { TestServer } from './utils/test-server';

const SECRET_KEY = 'randOmSecretKeyForJWT';
const makeAuthToken = (userId: number) => sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' });

let testServer: TestServer;

beforeAll(async () => {
  testServer = new TestServer([new DashboardRoute()]);
  await testServer.start();
});

afterAll(async () => {
  if (testServer) {
    await testServer.stop();
  }
});

describe('Testing Dashboard', () => {
  describe('[GET] /dashboard/stats', () => {
    it('returns 401 when no auth token is provided', async () => {
      return request(testServer.getServer()).get('/dashboard/stats').expect(401);
    });

    it('returns dashboard stats when authenticated', async () => {
      const DB = getMockedDB();
      DB.Users.findByPk = jest.fn().mockReturnValue({ id: 1, email: 'admin@test.com' });

      DB.ProposalRequest.findAndCountAll = jest
        .fn()
        .mockResolvedValueOnce({ rows: [], count: 42 })        // total RFPs
        .mockResolvedValueOnce({ rows: [], count: [{}, {}, {}] }) // unique clients
        .mockResolvedValueOnce({ rows: [], count: 8 })          // RFPs last 7 days
        .mockResolvedValueOnce({ rows: [], count: 10 })         // draft (has proposal_generated_at)
        .mockResolvedValueOnce({ rows: [], count: 5 });         // pending (no proposal_generated_at)

      (Sequelize as any).authenticate = jest.fn();

      const token = makeAuthToken(1);
      const response = await request(testServer.getServer())
        .get('/dashboard/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toEqual({
        total_rfps: 42,
        total_clients: 3,
        rfps_last_7_days: 8,
        proposal_stats: [
          { label: 'Draft', percentage: 100, count: '10 Proposals', highlight: true },
          { label: 'Pending', percentage: 50, count: '5 RFPs' },
        ],
      });
      expect(response.body.message).toBe('Dashboard stats retrieved successfully');
    });

    it('returns zeros and 0% pending when there are no proposal requests', async () => {
      const DB = getMockedDB();
      DB.Users.findByPk = jest.fn().mockReturnValue({ id: 1, email: 'admin@test.com' });

      DB.ProposalRequest.findAndCountAll = jest
        .fn()
        .mockResolvedValueOnce({ rows: [], count: 0 })
        .mockResolvedValueOnce({ rows: [], count: [] })
        .mockResolvedValueOnce({ rows: [], count: 0 })
        .mockResolvedValueOnce({ rows: [], count: 0 })
        .mockResolvedValueOnce({ rows: [], count: 0 });

      (Sequelize as any).authenticate = jest.fn();

      const token = makeAuthToken(1);
      const response = await request(testServer.getServer())
        .get('/dashboard/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toEqual({
        total_rfps: 0,
        total_clients: 0,
        rfps_last_7_days: 0,
        proposal_stats: [
          { label: 'Draft', percentage: 100, count: '0 Proposals', highlight: true },
          { label: 'Pending', percentage: 0, count: '0 RFPs' },
        ],
      });
    });

    it('calculates pending percentage relative to draft count', async () => {
      const DB = getMockedDB();
      DB.Users.findByPk = jest.fn().mockReturnValue({ id: 1, email: 'admin@test.com' });

      DB.ProposalRequest.findAndCountAll = jest
        .fn()
        .mockResolvedValueOnce({ rows: [], count: 100 })
        .mockResolvedValueOnce({ rows: [], count: [{}, {}] })
        .mockResolvedValueOnce({ rows: [], count: 15 })
        .mockResolvedValueOnce({ rows: [], count: 842 })  // draft
        .mockResolvedValueOnce({ rows: [], count: 690 }); // pending → 690/842 ≈ 82%

      (Sequelize as any).authenticate = jest.fn();

      const token = makeAuthToken(1);
      const response = await request(testServer.getServer())
        .get('/dashboard/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.proposal_stats).toEqual([
        { label: 'Draft', percentage: 100, count: '842 Proposals', highlight: true },
        { label: 'Pending', percentage: 82, count: '690 RFPs' },
      ]);
    });
  });
});
