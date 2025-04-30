# PocketWise Backend

Backend server for the PocketWise Finance Tracker application.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a MySQL database:
   ```sql
   CREATE DATABASE pocketwise;
   ```

4. Copy the `.env.example` file to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

5. Update the following environment variables in `.env`:
   - `DB_HOST`: Your MySQL host (default: localhost)
   - `DB_USER`: Your MySQL username (default: root)
   - `DB_PASSWORD`: Your MySQL password
   - `DB_NAME`: Your database name (default: pocketwise)
   - `JWT_SECRET`: A secret key for JWT token generation
   - `CORS_ORIGIN`: Your frontend URL (default: http://localhost:3000)

## Running the Application

### Development

To run the application in development mode:

```bash
npm run dev
```

This will start the server with nodemon, which will automatically restart when files change.

### Production

To run the application in production mode:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Transactions

- `GET /api/transactions/:userId` - Get all transactions for a user
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Budgets

- `GET /api/budgets/:userId` - Get all budgets for a user
- `POST /api/budgets` - Create a new budget
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget

### Categories

- `GET /api/categories/:userId` - Get all categories for a user
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

## Testing

To run tests:

```bash
npm test
```

## Linting

To check for linting errors:

```bash
npm run lint
```

To automatically fix linting errors:

```bash
npm run format
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 