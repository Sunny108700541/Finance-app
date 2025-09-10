# Personal Finance Tracker

A full-stack MERN application for managing personal finances with complete CRUD functionality for tracking income and expenses.

## Features

- **Transaction Management**: Add, edit, delete, and view financial transactions
- **Categorization**: Organize transactions by categories (Food, Transportation, Bills, etc.)
- **Filtering & Search**: Filter by category, type, date range, and search by title
- **Financial Summary**: View total income, expenses, and balance
- **Pagination**: Handle large datasets efficiently
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Validation**: Client and server-side form validation
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with custom design system

## Project Structure

\`\`\`
personal-finance-tracker/
├── backend/
│   ├── models/
│   │   └── Transaction.js
│   ├── routes/
│   │   └── transactions.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmDialog.js
│   │   │   ├── FormField.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── Navbar.js
│   │   │   └── Toast.js
│   │   ├── hooks/
│   │   │   └── useAPI.js
│   │   ├── pages/
│   │   │   ├── AddTransaction.js
│   │   │   ├── Dashboard.js
│   │   │   ├── DeleteTransaction.js
│   │   │   └── EditTransaction.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── .env
│   ├── .env.production
│   ├── .gitignore
│   └── package.json
└── README.md
\`\`\`

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd personal-finance-tracker
   \`\`\`

2. **Setup Backend**
   \`\`\`bash
   cd backend
   npm install
   
   # Create .env file and configure environment variables
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   
   # Start the server
   npm run dev
   \`\`\`

3. **Setup Frontend**
   \`\`\`bash
   cd frontend
   npm install
   
   # Create .env file for frontend configuration
   cp .env.example .env
   # Edit .env with your API URL
   
   # Start the development server
   npm start
   \`\`\`

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Environment Configuration

### Backend (.env)
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/personal-finance-tracker
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
\`\`\`

### Frontend (.env)
\`\`\`env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=Personal Finance Tracker
REACT_APP_VERSION=1.0.0
\`\`\`

## API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-api-domain.com/api`

### Endpoints

#### Health Check
- **GET** `/health`
- **Description**: Check API status
- **Response**: 
  \`\`\`json
  {
    "message": "Personal Finance Tracker API is running!",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "environment": "development"
  }
  \`\`\`

#### Transactions

##### Get All Transactions
- **GET** `/transactions`
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 50, max: 100)
  - `category` (string): Filter by category
  - `type` (string): Filter by type (income/expense)
  - `search` (string): Search in transaction titles
  - `startDate` (date): Filter from date
  - `endDate` (date): Filter to date
  - `minAmount` (number): Minimum amount filter
  - `maxAmount` (number): Maximum amount filter
  - `sortBy` (string): Sort field (default: date)
  - `order` (string): Sort order (asc/desc, default: desc)

- **Response**:
  \`\`\`json
  {
    "transactions": [...],
    "summary": {
      "totalIncome": 5000,
      "totalExpenses": 3000,
      "balance": 2000,
      "count": 25
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
  \`\`\`

##### Get Single Transaction
- **GET** `/transactions/:id`
- **Response**: Transaction object

##### Create Transaction
- **POST** `/transactions`
- **Body**:
  \`\`\`json
  {
    "title": "Grocery Shopping",
    "amount": -150.50,
    "date": "2024-01-01",
    "category": "Food"
  }
  \`\`\`

##### Update Transaction
- **PUT** `/transactions/:id`
- **Body**: Same as create transaction

##### Delete Transaction
- **DELETE** `/transactions/:id`
- **Response**: Confirmation message

### Transaction Schema
\`\`\`javascript
{
  title: String (required, max 100 chars),
  amount: Number (required, cannot be 0),
  date: Date (required),
  category: String (required, enum: [
    "Food", "Transportation", "Entertainment", 
    "Shopping", "Bills", "Healthcare", "Education", 
    "Income", "Investment", "Other"
  ]),
  type: String (auto-generated: "income" or "expense"),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Development

### Available Scripts

#### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

#### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Style
- Use ES6+ features
- Follow consistent naming conventions
- Add comments for complex logic
- Use semantic HTML elements
- Implement proper error handling

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
