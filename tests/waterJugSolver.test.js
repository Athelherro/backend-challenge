const waterJugSolver = require('../services/waterJugSolver');

describe('waterJugSolver', () => {
  test('solves classic case (2, 10, 4)', () => {
    const result = waterJugSolver(2, 10, 4);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[result.length - 1].status).toBe('Solved');
    expect(
      result[result.length - 1].bucketX === 4 || result[result.length - 1].bucketY === 4
    ).toBe(true);
  });

  test('solves (2, 100, 96)', () => {
    const result = waterJugSolver(2, 100, 96);
    expect(result.length).toBeGreaterThan(0);
    expect(result[result.length - 1].status).toBe('Solved');
    expect(
      result[result.length - 1].bucketX === 96 || result[result.length - 1].bucketY === 96
    ).toBe(true);
  });

  test('returns empty array for unsolvable case (2, 6, 5)', () => {
    const result = waterJugSolver(2, 6, 5);
    expect(result).toEqual([]);
  });

  test('returns empty array if z > max(x, y)', () => {
    const result = waterJugSolver(3, 5, 9);
    expect(result).toEqual([]);
  });

  test('solves (3, 5, 4)', () => {
    const result = waterJugSolver(3, 5, 4);
    expect(result.length).toBeGreaterThan(0);
    expect(result[result.length - 1].status).toBe('Solved');
    expect(
      result[result.length - 1].bucketX === 4 || result[result.length - 1].bucketY === 4
    ).toBe(true);
  });
}); 