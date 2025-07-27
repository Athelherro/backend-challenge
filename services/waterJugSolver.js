const redisClient = require('../utils/redisClient');

function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

async function waterJugSolver(x, y, z) {
  const cacheKey = `jug:${x},${y},${z}`;
  // Try to get from Redis
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Check for impossible cases
  if (z > Math.max(x, y) || z % gcd(x, y) !== 0) {
    await redisClient.set(cacheKey, JSON.stringify([]));
    return [];
  }

  function makeStep(step, bucketX, bucketY, action, solved = false) {
    const obj = { step, bucketX, bucketY, action };
    if (solved) obj.status = 'Solved';
    return obj;
  }

  const visited = new Set();
  const queue = [];
  queue.push({ x: 0, y: 0, path: [] });
  visited.add('0,0');

  let stepCount = 0;

  while (queue.length > 0) {
    const { x: currX, y: currY, path } = queue.shift();
    stepCount = path.length + 1;

    if (currX === z || currY === z) {
      const solvedStep = makeStep(
        stepCount,
        currX,
        currY,
        'Target reached',
        true
      );
      const solution = [...path, solvedStep];
      await redisClient.set(cacheKey, JSON.stringify(solution));
      return solution;
    }

    const nextStates = [];
    nextStates.push({ x: x, y: currY, action: `Fill bucket X` });
    nextStates.push({ x: currX, y: y, action: `Fill bucket Y` });
    nextStates.push({ x: 0, y: currY, action: `Empty bucket X` });
    nextStates.push({ x: currX, y: 0, action: `Empty bucket Y` });
    {
      const transfer = Math.min(currX, y - currY);
      nextStates.push({
        x: currX - transfer,
        y: currY + transfer,
        action: `Transfer from bucket X to Y`,
      });
    }
    {
      const transfer = Math.min(currY, x - currX);
      nextStates.push({
        x: currX + transfer,
        y: currY - transfer,
        action: `Transfer from bucket Y to X`,
      });
    }

    for (const state of nextStates) {
      const key = `${state.x},${state.y}`;
      if (!visited.has(key)) {
        visited.add(key);
        const stepObj = makeStep(
          stepCount,
          state.x,
          state.y,
          state.action
        );
        queue.push({
          x: state.x,
          y: state.y,
          path: [...path, stepObj],
        });
      }
    }
  }

  await redisClient.set(cacheKey, JSON.stringify([]));
  return [];
}

module.exports = waterJugSolver;
