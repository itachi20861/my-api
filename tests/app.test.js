const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('returns status ok and uptime', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(500); // intentionally wrong to trigger failure
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
  });
});

describe('GET /joke', () => {
  it('returns a joke from the API', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ type: 'general', setup: 'Why?', punchline: 'Because.' }),
      })
    );

    const res = await request(app).get('/joke');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('setup');
    expect(res.body).toHaveProperty('punchline');

    global.fetch.mockRestore();
  });

  it('returns 502 when upstream fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('network error')));

    const res = await request(app).get('/joke');
    expect(res.status).toBe(502);
    expect(res.body.error).toBe('Failed to fetch joke');

    global.fetch.mockRestore();
  });
});

describe('GET /info', () => {
  it('returns version, env, and hostname', async () => {
    const res = await request(app).get('/info');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('env');
    expect(res.body).toHaveProperty('hostname');
  });
});
