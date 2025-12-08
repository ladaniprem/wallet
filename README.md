# Expense Tracker Backend API

A robust RESTful API built with Node.js, Express, and PostgreSQL (Neon) for managing expense tracking with rate limiting and user authentication support.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Flow](#api-flow)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Rate Limiting](#rate-limiting)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)

---

## ✨ Features

- ✅ **Transaction Management**: Create, read, and delete financial transactions
- ✅ **User-based Filtering**: Transactions isolated per user
- ✅ **Financial Summary**: Real-time income, expense, and balance calculation
- ✅ **Rate Limiting**: Upstash Redis-based rate limiting (4 requests per 60 seconds)
- ✅ **CORS Enabled**: Cross-origin resource sharing for frontend integration
- ✅ **Auto Database Initialization**: Creates tables automatically on startup
- ✅ **Indian Currency Formatting**: Built-in INR formatting for summaries

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **Neon PostgreSQL** | Serverless PostgreSQL database |
| **Upstash Redis** | Rate limiting with Redis |
| **dotenv** | Environment variable management |
| **Clerk** | User authentication (client-side) |

---

## 🏗️ Architecture

```mermaid
graph TB
    A[Client Request] --> B{Rate Limiter}
    B -->|Allowed| C[Express Router]
    B -->|Blocked| D[429 Too Many Requests]
    C --> E[Controller]
    E --> F[Neon PostgreSQL]
    F --> G[Response]
    G --> H[Client]
    
    style A fill:#4CAF50
    style B fill:#FF9800
    style C fill:#2196F3
    style E fill:#9C27B0
    style F fill:#00BCD4
    style D fill:#F44336
```

### Component Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Express Server                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │            Middleware Layer                      │   │
│  │  • CORS                                          │   │
│  │  • JSON Parser                                   │   │
│  │  • Rate Limiter (Upstash Redis)                  │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │            Routes                                │   │
│  │  • /api/transactions/:userId (GET)               │   │
│  │  • /api/transactions (POST)                      │   │
│  │  • /api/transactions/:id (DELETE)                │   │
│  │  • /api/summary/:userId (GET)                    │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │            Controllers                           │   │
│  │  • getTransactionsByUserId()                     │   │
│  │  • createTransaction()                           │   │
│  │  • deleteTransaction()                           │   │
│  │  • getSummaryByUserId()                          │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │            Database (Neon PostgreSQL)            │   │
│  │  • tractions table                               │   │
│  │  • Auto initialization                           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 API Flow

### Request Flow Diagram

```mermaid
sequenceDiagram
    participant Client
    participant RateLimiter
    participant Router
    participant Controller
    participant Database
    
    Client->>RateLimiter: HTTP Request
    RateLimiter->>RateLimiter: Check Redis Counter
    alt Rate Limit Exceeded
        RateLimiter-->>Client: 429 Too Many Requests
    else Within Limit
        RateLimiter->>Router: Forward Request
        Router->>Controller: Route to Handler
        Controller->>Database: SQL Query
        Database-->>Controller: Query Result
        Controller-->>Router: Formatted Response
        Router-->>Client: JSON Response
    end
```

### Transaction Creation Flow

```mermaid
flowchart TD
    A[POST /api/transactions] --> B{Validate Input}
    B -->|Missing Fields| C[400 Bad Request]
    B -->|Valid| D[Parse Amount to Number]
    D --> E[SQL INSERT Query]
    E --> F{Query Success?}
    F -->|No| G[500 Internal Error]
    F -->|Yes| H[Format Amount as Float]
    H --> I[201 Created Response]
    
    style A fill:#4CAF50
    style C fill:#F44336
    style G fill:#F44336
    style I fill:#4CAF50
```

### Summary Calculation Flow

```mermaid
flowchart LR
    A[GET /api/summary/:userId] --> B[Fetch All User Transactions]
    B --> C{Categorize by Category}
    C -->|Contains 'exp'| D[Negate Amount]
    C -->|Contains 'inc'| E[Use Absolute Amount]
    C -->|Other| F[Use Amount As-Is]
    D --> G[Calculate Totals]
    E --> G
    F --> G
    G --> H[Balance = Income - Expense]
    H --> I[Format as INR]
    I --> J[Return JSON Response]
    
    style A fill:#2196F3
    style J fill:#4CAF50
```

---

## 🗄️ Database Schema

### Table: `tractions`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing unique ID |
| `user_id` | VARCHAR(255) | NOT NULL | User identifier from Clerk |
| `title` | VARCHAR(255) | NOT NULL | Transaction description |
| `amount` | DECIMAL(10,2) | NOT NULL | Transaction amount (max: 99999999.99) |
| `category` | VARCHAR(255) | NOT NULL | Category (e.g., "Income", "Expense") |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

### Example Data

```sql
INSERT INTO tractions (user_id, title, amount, category)
VALUES 
  ('user_abc123', 'Salary', 50000.00, 'Income'),
  ('user_abc123', 'Groceries', 2500.50, 'Expense');
```

---

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Neon PostgreSQL account
- Upstash Redis account (for rate limiting)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/ladaniprem/wallet-api.git
   cd wallet-api/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file**

   ```bash
   touch .env
   ```

4. **Configure environment variables** (see below)

5. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify server is running**

   ```
   Server is running on port 5000
   Database initialized successfully
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=5001

# Neon PostgreSQL Database
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Upstash Redis (for Rate Limiting)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

### How to Get Credentials

1. **Neon Database URL**
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string from the dashboard

2. **Upstash Redis**
   - Sign up at [upstash.com](https://upstash.com)
   - Create a new Redis database
   - Copy REST URL and Token from the dashboard

---

## 📡 API Endpoints

### Base URL

```
http://localhost:5001/api
```

---

### 1. Get All Transactions for a User

**Endpoint:** `GET /api/transactions/:userId`

**Description:** Fetch all transactions for a specific user, sorted by creation date (newest first).

**Request:**

```bash
GET /api/transactions/user_abc123
```

**Response:** `200 OK`

```json
{
  "transactions": [
    {
      "id": 1,
      "user_id": "user_abc123",
      "title": "Salary",
      "amount": 50000.00,
      "category": "Income",
      "created_at": "2025-12-08T10:30:00Z"
    },
    {
      "id": 2,
      "user_id": "user_abc123",
      "title": "Groceries",
      "amount": 2500.50,
      "category": "Expense",
      "created_at": "2025-12-07T15:45:00Z"
    }
  ]
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "message": "Internal server error"
}
```

---

### 2. Create a New Transaction

**Endpoint:** `POST /api/transactions`

**Description:** Add a new transaction for a user.

**Request Body:**

```json
{
  "user_id": "user_abc123",
  "title": "Netflix Subscription",
  "amount": 499.00,
  "category": "Expense"
}
```

**Response:** `201 Created`

```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "id": 3,
    "user_id": "user_abc123",
    "title": "Netflix Subscription",
    "amount": 499.00,
    "category": "Expense",
    "created_at": "2025-12-08T12:00:00Z"
  }
}
```

**Validation Errors:**

- `400 Bad Request` - Missing required fields

```json
{
  "error": "All fields are required: title, amount, category, user_id"
}
```

---

### 3. Delete a Transaction

**Endpoint:** `DELETE /api/transactions/:id`

**Description:** Delete a specific transaction by ID.

**Request:**

```bash
DELETE /api/transactions/3
```

**Response:** `200 OK`

```json
{
  "message": "Transaction deleted successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid ID

```json
{
  "message": "Invalid transaction ID"
}
```

- `404 Not Found` - Transaction doesn't exist

```json
{
  "message": "Transaction not found"
}
```

---

### 4. Get Financial Summary

**Endpoint:** `GET /api/summary/:userId`

**Description:** Calculate total balance, income, and expenses for a user.

**Request:**

```bash
GET /api/summary/user_abc123
```

**Response:** `200 OK`

```json
{
  "balance": 47499.50,
  "income": 50000.00,
  "expense": 2500.50,
  "formatted": {
    "balance": "₹47,499.50",
    "income": "₹50,000.00",
    "expense": "₹2,500.50"
  }
}
```

**Logic:**

- **Income** = Sum of all amounts where category contains "inc" (case-insensitive)
- **Expense** = Sum of all amounts where category contains "exp" (case-insensitive)
- **Balance** = Income - Expense

---

## ⏱️ Rate Limiting

### Configuration

- **Library:** Upstash Redis with Sliding Window algorithm
- **Limit:** 4 requests per 60 seconds
- **Identifier:** Currently using a fixed key (`"my-rate-limit"`)
- **Recommended:** Use user ID or IP address in production

### How It Works

1. Every request passes through the `rateLimiter` middleware
2. Redis tracks the request count in a 60-second sliding window
3. If count exceeds 4, return `429 Too Many Requests`
4. Otherwise, forward the request to the controller

```mermaid
graph LR
    A[Request] --> B{Check Redis}
    B -->|Count < 4| C[Increment Counter]
    C --> D[Allow Request]
    B -->|Count >= 4| E[Block Request]
    E --> F[429 Response]
    
    style D fill:#4CAF50
    style F fill:#F44336
```

### Why Rate Limiting?

✅ **Prevent Abuse:** Stop malicious users from overwhelming the system  
✅ **Protect Resources:** Keep server performance stable  
✅ **Fair Usage:** Ensure all users get equal access  
✅ **Cost Control:** Reduce unnecessary database queries

### Testing Rate Limit

```bash
# Make 5 requests rapidly
for i in {1..5}; do
  curl http://localhost:5001/api/transactions/user_abc123
done

# 5th request will return:
# {"message": "Too many requests, please try again later."}
```

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # Neon PostgreSQL connection & table initialization
│   │   └── upstash.js         # Upstash Redis rate limiter config
│   ├── controllers/
│   │   └── transactionsController.js  # Business logic for all endpoints
│   ├── middleware/
│   │   └── rateLimiter.js     # Rate limiting middleware
│   ├── routes/
│   │   └── transactionsRoute.js  # API route definitions
│   └── server.js              # Express app entry point
├── .env                       # Environment variables (DO NOT commit!)
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

### File Responsibilities

| File | Purpose |
|------|---------|
| `server.js` | Initialize Express, middleware, routes, and start server |
| `db.js` | Connect to Neon PostgreSQL and create tables |
| `upstash.js` | Configure Upstash Redis rate limiter |
| `rateLimiter.js` | Middleware to enforce rate limits |
| `transactionsRoute.js` | Define API routes |
| `transactionsController.js` | Handle request/response logic and database queries |

---

## 🚨 Error Handling

### Standard Error Responses

| Status Code | Meaning | When It Occurs |
|-------------|---------|----------------|
| `200 OK` | Success | Successful GET/DELETE request |
| `201 Created` | Resource created | Successful POST request |
| `400 Bad Request` | Invalid input | Missing fields, invalid ID format |
| `404 Not Found` | Resource missing | Transaction doesn't exist |
| `429 Too Many Requests` | Rate limit hit | Exceeded 4 requests/60s |
| `500 Internal Server Error` | Server error | Database failure, unexpected errors |

### Error Response Format

```json
{
  "message": "Error description here",
  "error": "Detailed error info (only in 400 responses)"
}
```

---

## 🔧 Development

### Running in Development Mode

```bash
npm run dev
```

This uses `nodemon` to auto-restart the server on file changes.

### Running in Production

```bash
npm start
```

### Testing Endpoints with cURL

**Get Transactions:**

```bash
curl http://localhost:5001/api/transactions/user_123
```

**Create Transaction:**

```bash
curl -X POST http://localhost:5001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "title": "Coffee",
    "amount": 150,
    "category": "Expense"
  }'
```

**Delete Transaction:**

```bash
curl -X DELETE http://localhost:5001/api/transactions/1
```

**Get Summary:**

```bash
curl http://localhost:5001/api/summary/user_123
```

---

## 🔄 Data Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                      REQUEST LIFECYCLE                       │
└─────────────────────────────────────────────────────────────┘

1. Client sends HTTP request
   ↓
2. CORS middleware validates origin
   ↓
3. Express parses JSON body
   ↓
4. Rate Limiter checks Redis
   ├─ Limit exceeded → Return 429
   └─ Within limit → Continue
   ↓
5. Router matches endpoint
   ↓
6. Controller function executes
   ├─ Validates input
   ├─ Queries Neon PostgreSQL
   └─ Formats response
   ↓
7. Response sent to client
```

---

## 📊 Database Query Examples

### Raw SQL Queries Used

**Fetch Transactions:**

```sql
SELECT * FROM tractions
WHERE user_id = $1
ORDER BY created_at DESC;
```

**Create Transaction:**

```sql
INSERT INTO tractions (title, amount, category, user_id)
VALUES ($1, $2, $3, $4)
RETURNING *;
```

**Delete Transaction:**

```sql
DELETE FROM tractions
WHERE id = $1;
```

**Calculate Summary:**

```sql
SELECT
    COALESCE(SUM(normalized), 0) AS balance,
    COALESCE(SUM(CASE WHEN normalized > 0 THEN normalized ELSE 0 END), 0) AS income,
    COALESCE(SUM(CASE WHEN normalized < 0 THEN -normalized ELSE 0 END), 0) AS expense
FROM (
    SELECT
        CASE
            WHEN lower(COALESCE(category, '')) LIKE '%exp%' THEN -ABS(amount)
            WHEN lower(COALESCE(category, '')) LIKE '%inc%' THEN ABS(amount)
            ELSE amount
        END AS normalized
    FROM tractions
    WHERE user_id = $1
) s;
```

---

## 🌐 CORS Configuration

CORS is enabled by default to allow frontend apps to access the API from different origins.

**Current Setup:**

```javascript
app.use(cors());  // Allows all origins
```

**Production Recommendation:**

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

---

## 🔒 Security Considerations

✅ **Environment Variables:** Sensitive data stored in `.env` (not committed to Git)  
✅ **Rate Limiting:** Prevents brute force and DDoS attacks  
✅ **Input Validation:** Checks for required fields and data types  
✅ **SQL Injection Protection:** Uses parameterized queries via Neon  
⚠️ **Authentication:** Currently relies on client-side Clerk authentication  
⚠️ **Authorization:** No server-side validation of user permissions (to be added)

### Recommended Improvements

1. Add JWT verification middleware
2. Implement user-based rate limiting (instead of global)
3. Add request logging
4. Implement field-level encryption for sensitive data

---

## 📝 License

ISC

---

## 👤 Author

**Prem Ladani**

- GitHub: [@ladaniprem](https://github.com/ladaniprem)
- Repository: [wallet-api](https://github.com/ladaniprem/wallet-api)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with ❤️ for the Expense Tracker App**
