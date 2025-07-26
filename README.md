# Rewards

A rewards application with a Ruby on Rails API backend and React TypeScript frontend.

The application is available at https://ryshar.github.io/rewards/. The backend was deployed with Railway and the frontend with GitHub Pages.

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ryshar/rewards.git
cd rewards
```

### 2. Backend Setup (Rails API)

Navigate to the backend directory and set up the Rails application:

```bash
cd backend

bundle install

bin/rails db:prepare

bin/rails server
```

The Rails API will be available at `http://localhost:3000`

### 3. Frontend Setup (React TypeScript)

In a new terminal window, navigate to the frontend directory:

```bash
cd frontend

npm install

npm run dev
```

The React application will be available at `http://localhost:5173`

## Database

The application uses SQLite3.

## CORS Configuration

The backend is configured with CORS support to allow requests from the frontend.
