import { getMockedDB } from './utils/test-db-mock';
import { Sequelize } from 'sequelize';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { ProposalRoute } from '@routes/proposal.route';
import { TestServer } from './utils/test-server';

jest.mock('@utils/proposalesClient', () => ({
  proposalesClient: {
    getProposal: jest.fn(),
    createProposal: jest.fn(),
  },
}));

import { proposalesClient } from '@utils/proposalesClient';

const SECRET_KEY = 'randOmSecretKeyForJWT';
const makeAuthToken = (userId: number) => sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' });

const mockProposal = {
  uuid: 'test-uuid-1234',
  title: 'Test Proposal',
  title_md: '# Test Proposal',
  description_html: '<p>Description</p>',
  description_md: 'Description',
  status: 'draft',
  currency: 'SEK',
  value_with_tax: 1000,
  value_without_tax: 800,
  recipient_name: 'Jane Doe',
  recipient_email: 'jane@example.com',
  recipient_phone: '+46701234567',
  company_name: 'Acme AB',
  company_email: 'info@acme.se',
  company_phone: '+46701111111',
  contact_name: 'John Smith',
  contact_email: 'john@acme.se',
  expires_at: null,
  archived_at: null,
  blocks: [],
  attachments: [],
  signatures: [],
  language: 'en',
  data: {},
};

let testServer: TestServer;

beforeAll(async () => {
  testServer = new TestServer([new ProposalRoute()]);
  await testServer.start();
});

afterAll(async () => {
  if (testServer) {
    await testServer.stop();
  }
});

describe('Testing Proposals', () => {
  describe('[GET] /proposals/:uuid', () => {
    it('returns 401 when no auth token is provided', async () => {
      return request(testServer.getServer()).get('/proposals/test-uuid-1234').expect(401);
    });

    it('returns proposal data when authenticated', async () => {
      const DB = getMockedDB();
      DB.Users.findByPk = jest.fn().mockReturnValue({ id: 1, email: 'admin@test.com' });

      (proposalesClient.getProposal as jest.Mock).mockResolvedValue({ data: mockProposal });
      (Sequelize as any).authenticate = jest.fn();

      const token = makeAuthToken(1);
      const response = await request(testServer.getServer())
        .get('/proposals/test-uuid-1234')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual(mockProposal);
      expect(proposalesClient.getProposal).toHaveBeenCalledWith('test-uuid-1234');
    });

    it('returns 500 when the external API call fails', async () => {
      const DB = getMockedDB();
      DB.Users.findByPk = jest.fn().mockReturnValue({ id: 1, email: 'admin@test.com' });

      (proposalesClient.getProposal as jest.Mock).mockRejectedValue(new Error('API error 500: Internal Server Error'));
      (Sequelize as any).authenticate = jest.fn();

      const token = makeAuthToken(1);
      return request(testServer.getServer())
        .get('/proposals/nonexistent-uuid')
        .set('Authorization', `Bearer ${token}`)
        .expect(500);
    });
  });

  describe('[POST] /proposals', () => {
    const proposalPayload = {
      language: 'en',
      title_md: '# New Proposal',
      description_md: 'Proposal description',
      recipient: { email: 'client@example.com', first_name: 'Client', last_name: 'Name' },
      blocks: [],
    };

    it('returns 401 when no auth token is provided', async () => {
      return request(testServer.getServer()).post('/proposals').send(proposalPayload).expect(401);
    });

    it('creates a proposal and returns 201', async () => {
      const DB = getMockedDB();
      DB.Users.findByPk = jest.fn().mockReturnValue({ id: 1, email: 'admin@test.com' });

      (proposalesClient.createProposal as jest.Mock).mockResolvedValue({
        proposal: { uuid: mockProposal.uuid, url: 'https://proposales.com/p/test-uuid-1234' },
      });
      (proposalesClient.getProposal as jest.Mock).mockResolvedValue({ data: mockProposal });
      (Sequelize as any).authenticate = jest.fn();

      const token = makeAuthToken(1);
      const response = await request(testServer.getServer())
        .post('/proposals')
        .set('Authorization', `Bearer ${token}`)
        .send(proposalPayload)
        .expect(201);

      expect(response.body).toEqual(mockProposal);
    });

    it('links the created proposal to a proposal request when proposal_request_id is provided', async () => {
      const DB = getMockedDB();
      const mockUpdate = jest.fn().mockResolvedValue({});
      DB.Users.findByPk = jest.fn().mockReturnValue({ id: 1, email: 'admin@test.com' });
      DB.ProposalRequest.findByPk = jest.fn().mockReturnValue({ id: 5, update: mockUpdate });

      (proposalesClient.createProposal as jest.Mock).mockResolvedValue({
        proposal: { uuid: mockProposal.uuid, url: 'https://proposales.com/p/test-uuid-1234' },
      });
      (proposalesClient.getProposal as jest.Mock).mockResolvedValue({ data: mockProposal });
      (Sequelize as any).authenticate = jest.fn();

      const token = makeAuthToken(1);
      await request(testServer.getServer())
        .post('/proposals')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...proposalPayload, proposal_request_id: 5 })
        .expect(201);

      expect(DB.ProposalRequest.findByPk).toHaveBeenCalledWith(5);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          proposal_uuid: mockProposal.uuid,
          proposal_url: 'https://proposales.com/p/test-uuid-1234',
        }),
      );
    });

    it('still creates a proposal when proposal_request_id is not found in the DB', async () => {
      const DB = getMockedDB();
      DB.Users.findByPk = jest.fn().mockReturnValue({ id: 1, email: 'admin@test.com' });
      DB.ProposalRequest.findByPk = jest.fn().mockReturnValue(null);

      (proposalesClient.createProposal as jest.Mock).mockResolvedValue({
        proposal: { uuid: mockProposal.uuid, url: 'https://proposales.com/p/test-uuid-1234' },
      });
      (proposalesClient.getProposal as jest.Mock).mockResolvedValue({ data: mockProposal });
      (Sequelize as any).authenticate = jest.fn();

      const token = makeAuthToken(1);
      const response = await request(testServer.getServer())
        .post('/proposals')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...proposalPayload, proposal_request_id: 999 })
        .expect(201);

      expect(response.body).toEqual(mockProposal);
    });

    it('returns 500 when the external API call fails', async () => {
      const DB = getMockedDB();
      DB.Users.findByPk = jest.fn().mockReturnValue({ id: 1, email: 'admin@test.com' });

      (proposalesClient.createProposal as jest.Mock).mockRejectedValue(new Error('API error 500: Internal Server Error'));
      (Sequelize as any).authenticate = jest.fn();

      const token = makeAuthToken(1);
      return request(testServer.getServer())
        .post('/proposals')
        .set('Authorization', `Bearer ${token}`)
        .send(proposalPayload)
        .expect(500);
    });
  });
});
