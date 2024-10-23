# Cloud Native Web Application

A high-performance, cloud-native web application built with modern DevOps practices and cloud-first architecture. This application provides robust user management capabilities with secure authentication, health monitoring, and automated deployment pipelines. Designed for scalability and resilience, it leverages containerization, infrastructure as code, and automated testing to ensure reliable deployment across cloud environments.

The application follows cloud-native principles including:
- Microservices-based architecture
- Containerized deployment
- Infrastructure as Code (IaC)
- Automated CI/CD pipeline
- Health monitoring and logging
- Stateless application design
- Cloud-native storage with PostgreSQL
- DevOps-oriented development practices

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)

## Features
- User Management (Create, Read, Update)
- Basic Authentication
- Health Check Endpoints
- Database Integration with PostgreSQL
- Comprehensive Error Handling
- Detailed Logging System
- Input Validation
- Cache Control Headers
- CI/CD Integration

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: Basic Auth
- **Testing**: Jest, Supertest
- **Logging**: Winston
- **Validation**: Joi
- **CI/CD**: GitHub Actions
- **Infrastructure**: Packer, AWS

## Project Structure
```
webapp/
├── .github/
│   └── workflows/           # GitHub Actions workflow files
├── src/
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── schemas/           # Validation schemas
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── app.js             # Application entry point
├── scripts/               # Shell scripts for deployment
├── tests/                 # Test files
└── .env                   # Environment variables
```

## Prerequisites
- Node.js (v22 or higher)
- PostgreSQL (v13 or higher)
- npm (latest version)

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/kaushik-manivannan/webapp.git
cd webapp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following configuration:
```env
DB_NAME=your_database_name
DB_USER=your_root_db_username
DB_PASSWORD=your_root_db_password
DB_HOST=localhost
DB_PORT=5432
PORT=3000
LOG_LEVEL=debug
NODE_ENV=development
```

4. Start the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
- `GET /healthz`
  - Returns 200 OK if application is healthy
  - Returns 503 if database is unavailable
  - No request body or query parameters allowed

### User Management
- `POST /v1/user`
  - Create new user
  - No authentication required
  - Request body:
    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "password": "SecurePass123!"
    }
    ```

- `GET /v1/user/self`
  - Get user details
  - Requires basic authentication
  - No request body

- `PUT /v1/user/self`
  - Update user details
  - Requires basic authentication
  - Request body (all fields optional):
    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "password": "NewPass123!"
    }
    ```

## Testing

Run the test suite:
```bash
npm test
```

The test suite includes:
- Integration tests
- API endpoint tests
- Database connection tests
- Authentication tests
- Input validation tests

## CI/CD Pipeline

The application uses GitHub Actions for continuous integration and deployment:

1. **Run Application Tests (`ci-tests.yml`)**
   - Triggered on pull requests to main
   - Sets up test environment
   - Runs test suite
   - Validates code quality

2. **Packer Build (`packer-build.yml`)**
   - Triggered when PR is merged to main
   - Creates application artifact
   - Builds AMI using Packer
   - Deploys to AWS

3. **Packer Validate (`packer-validate.yml`)**
   - Validates Packer configuration
   - Checks formatting
   - Runs on pull requests
