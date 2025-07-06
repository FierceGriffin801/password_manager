# Password Manager

A secure password management application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- 🔐 Secure user authentication (signup/login)
- 🔒 Encrypted password storage
- 📝 CRUD operations for password entries
- 🛡️ User-specific password access
- 🎨 Modern, responsive UI

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Material-UI** - UI component library

## Project Structure

```
password_manager/
├── backend/          # Node.js + Express server
├── frontend/         # React application
├── README.md         # This file
└── .gitignore        # Git ignore rules
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd password_manager
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
   - Create `.env` files in both `backend/` and `frontend/` directories
   - Add necessary environment variables (see Environment Variables section)

5. Start the development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/password_manager
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Passwords
- `GET /api/passwords` - Get all passwords (authenticated)
- `POST /api/passwords` - Create new password entry
- `PUT /api/passwords/:id` - Update password entry
- `DELETE /api/passwords/:id` - Delete password entry

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Encrypted password storage
- User-specific data access
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Roadmap

- [ ] Password strength meter
- [ ] Password generator
- [ ] Two-factor authentication
- [ ] Export/import functionality
- [ ] Dark mode
- [ ] Mobile app 