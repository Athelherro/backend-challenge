# Water Jug Challenge API

## Overview
This project implements a RESTful API to solve the classic Water Jug Riddle. Given two jugs of capacities X and Y, and a target amount Z, the API computes the sequence of steps required to measure exactly Z gallons using the allowed actions: Fill, Empty, and Transfer.

## Features
- RESTful API built with Express.js
- Efficient BFS algorithm to find the shortest solution
- **Redis caching for high performance and scalability**
- Input validation and error handling
- JSON responses with detailed solution steps
- Unit and integration tests (Jest & Supertest)

## Setup & Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd backend-challenge
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start Redis server:**
   - Make sure you have Redis installed and running on `localhost:6379` (default).
   - [Redis Quick Start](https://redis.io/docs/getting-started/)
4. **Run the server:**
   ```bash
   npm run dev
   # or
   npm start
   ```
   The server will start on `http://localhost:3000` by default.

## API Documentation
### Endpoint
`POST /solve`

### Request Body
```
{
  "x_capacity": 2,
  "y_capacity": 10,
  "z_amount_wanted": 4
}
```
- All fields are required and must be positive integers.

### Successful Response
```
{
  "solution": [
    {"step": 1, "bucketX": 2, "bucketY": 0, "action": "Fill bucket X"},
    {"step": 2, "bucketX": 0, "bucketY": 2, "action": "Transfer from bucket X to Y"},
    {"step": 3, "bucketX": 2, "bucketY": 2, "action": "Fill bucket X"},
    {"step": 4, "bucketX": 0, "bucketY": 4, "action": "Transfer from bucket X to Y", "status": "Solved"}
  ]
}
```

### No Solution Response
```
{
  "solution": "No solution possible."
}
```

### Error Response (Invalid Input)
```
{
  "error": "All inputs must be positive integers."
}
```

## Example Requests
**Request:**
```
POST /solve
{
  "x_capacity": 2,
  "y_capacity": 10,
  "z_amount_wanted": 4
}
```
**Response:**
```
{
  "solution": [
    {"step": 1, "bucketX": 2, "bucketY": 0, "action": "Fill bucket X"},
    {"step": 2, "bucketX": 0, "bucketY": 2, "action": "Transfer from bucket X to Y"},
    {"step": 3, "bucketX": 2, "bucketY": 2, "action": "Fill bucket X"},
    {"step": 4, "bucketX": 0, "bucketY": 4, "action": "Transfer from bucket X to Y", "status": "Solved"}
  ]
}
```

**Unsolvable Example:**
```
POST /solve
{
  "x_capacity": 2,
  "y_capacity": 6,
  "z_amount_wanted": 5
}
```
**Response:**
```
{
  "solution": "No solution possible."
}
```

## Algorithm Explanation
The API uses a Breadth-First Search (BFS) algorithm to find the shortest sequence of steps to reach the target amount Z. Each state is represented by the current amount in each jug. The allowed actions are:
- Fill either jug to its capacity
- Empty either jug
- Transfer water from one jug to the other until one is empty or the other is full

The algorithm explores all possible states, tracking visited states to avoid cycles. If Z is not a multiple of the GCD of X and Y, or Z is greater than both jug capacities, the problem is unsolvable.

## Caching & Scalability
This API uses **Redis** to cache solutions for common (X, Y, Z) requests. When a request is received, the API first checks Redis for a cached solution. If found, it returns the cached result instantly. If not, it computes the solution, stores it in Redis, and returns it. This greatly improves performance and scalability for repeated or high-volume requests.

- Redis must be running for the API to work.
- Cached solutions are stored as JSON strings with keys like `jug:2,10,4`.

## Testing
- **Run all tests:**
  ```bash
  npm test
  ```
- **Test coverage:**
  ```bash
  npx jest --coverage
  ```

Unit tests cover the algorithm, and integration tests cover the API endpoint and error handling.

## License
MIT 