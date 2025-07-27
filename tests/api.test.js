const request = require('supertest');
const express = require('express');
const solveRouter = require('../routes/solve');

const app = express();
app.use(express.json());
app.use('/solve', solveRouter);

describe('/solve API', () => {
  it('returns solution for valid input', async () => {
    const res = await request(app)
      .post('/solve')
      .send({ x_capacity: 2, y_capacity: 10, z_amount_wanted: 4 });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.solution)).toBe(true);
    expect(res.body.solution[res.body.solution.length - 1].status).toBe('Solved');
  });

  it('returns no solution for unsolvable input', async () => {
    const res = await request(app)
      .post('/solve')
      .send({ x_capacity: 2, y_capacity: 6, z_amount_wanted: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.solution).toBe('No solution possible.');
  });

  it('returns 400 for invalid input (negative)', async () => {
    const res = await request(app)
      .post('/solve')
      .send({ x_capacity: -1, y_capacity: 10, z_amount_wanted: 4 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 for invalid input (non-integer)', async () => {
    const res = await request(app)
      .post('/solve')
      .send({ x_capacity: 2.5, y_capacity: 10, z_amount_wanted: 4 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 for missing fields', async () => {
    const res = await request(app)
      .post('/solve')
      .send({ x_capacity: 2, y_capacity: 10 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
}); 