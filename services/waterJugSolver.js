function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function waterJugSolver(x, y, z) {
  // Check for impossible cases
  if (z > Math.max(x, y) || z % gcd(x, y) !== 0) {
    return [];
  }

  // Helper to generate step object
  function makeStep(step, bucketX, bucketY, action, solved = false) {
    const obj = { step, bucketX, bucketY, action };
    if (solved) obj.status = 'Solved';
    return obj;
  }

  // BFS setup
  const visited = new Set();
  const queue = [];
  // Each node: {x, y, path: [steps]}
  queue.push({ x: 0, y: 0, path: [] });
  visited.add('0,0');

  let stepCount = 0;

  while (queue.length > 0) {
    const { x: currX, y: currY, path } = queue.shift();
    stepCount = path.length + 1;

    // Check if solved
    if (currX === z || currY === z) {
      const solvedStep = makeStep(
        stepCount,
        currX,
        currY,
        'Target reached',
        true
      );
      return [...path, solvedStep];
    }

    // Generate all possible next states
    const nextStates = [];
    // 1. Fill X
    nextStates.push({
      x: x,
      y: currY,
      action: `Fill bucket X`,
    });
    // 2. Fill Y
    nextStates.push({
      x: currX,
      y: y,
      action: `Fill bucket Y`,
    });
    // 3. Empty X
    nextStates.push({
      x: 0,
      y: currY,
      action: `Empty bucket X`,
    });
    // 4. Empty Y
    nextStates.push({
      x: currX,
      y: 0,
      action: `Empty bucket Y`,
    });
    // 5. Transfer X -> Y
    {
      const transfer = Math.min(currX, y - currY);
      nextStates.push({
        x: currX - transfer,
        y: currY + transfer,
        action: `Transfer from bucket X to Y`,
      });
    }
    // 6. Transfer Y -> X
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

  // No solution found
  return [];
}

module.exports = waterJugSolver;
