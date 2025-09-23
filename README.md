# Software Design Project

This is a full-stack application for the Software Design Project.

## Project Structure

- `/backend` - Node.js Express server
- `/frontend` - React frontend application

## Setup Instructions

1. Install dependencies for the entire project:

```bash
npm run install:all
```

2. Start the development servers:

```bash
npm start
```

This will concurrently run both the backend server and the React development server.

## Available Scripts

- `npm start` - Runs both frontend and backend servers
- `npm run server` - Runs only the backend server
- `npm run server:dev` - Runs the backend server with nodemon for auto-reloading
- `npm run client` - Runs only the frontend development server
- `npm test` - Runs tests for both frontend and backend

## Technology Stack

- **Backend**: Node.js, Express
- **Frontend**: React
- **Database**: MongoDB (configured but not required to start)
