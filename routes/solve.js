const express = require('express');
const router = express.Router();
const waterJugSolver = require('../services/waterJugSolver');

router.post('/', async (req, res) => {
  const { x_capacity, y_capacity, z_amount_wanted } = req.body;

  // Input validation
  if (!Number.isInteger(x_capacity) || x_capacity <= 0 ||
    !Number.isInteger(y_capacity) || y_capacity <= 0 ||
    !Number.isInteger(z_amount_wanted) || z_amount_wanted <= 0) {
    return res.status(400).json({ error: 'All inputs must be positive integers.' });
  }

  try {
    const solution = await waterJugSolver(x_capacity, y_capacity, z_amount_wanted);
    if (!solution || solution.length === 0) {
      return res.status(200).json({ solution: 'No solution possible.' });
    }
    return res.json({ solution });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
});

module.exports = router; 