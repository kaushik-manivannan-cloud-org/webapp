# Cloud Native Web Application

A high-performance, cloud-native web application built with modern DevOps practices and cloud-first architecture. This application provides robust user management capabilities with secure authentication, profile image handling, health monitoring, and automated deployment pipelines. Designed for scalability and resilience, it leverages containerization, infrastructure as code, and automated testing to ensure reliable deployment across cloud environments.

The application follows cloud-native principles including:
- Microservices-based architecture
- Containerized deployment
- Infrastructure as Code (IaC)
- Automated CI/CD pipeline
- Health monitoring and logging
- Stateless application design
- Cloud-native storage with PostgreSQL and S3
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
- Email Verification System
- Profile Picture Management
- Basic Authentication
- Health Check Endpoints
- Database Integration with PostgreSQL
- S3 Integration for File Storage
- Comprehensive Error Handling
- Detailed Logging System
- Metrics Collection with StatsD
- Input Validation
- Cache Control Headers
- CI/CD Integration

## Technology Stack
- **Runtime**: Node.js 22
- **Framework**: Express.js
- **Database**: PostgreSQL 13
- **ORM**: Sequelize
- **Authentication**: Basic Auth
- **Storage**: AWS S3
- **Email**: AWS SNS, Lambda, SendGrid
- **Testing**: Jest, Supertest
- **Logging**: Winston
- **Metrics**: StatsD
- **Validation**: Joi
- **CI/CD**: GitHub Actions
- **Infrastructure**: Packer, AWS
- **File Upload**: Multer

## Project Structure
```
webapp/
├── .github/
│   └── workflows/           # GitHub Actions workflow files
├── scripts/                 # Deployment and setup scripts
│   ├── update_and_install.sh
│   ├── create_user_and_directory.sh
│   ├── install_cloudwatch_agent.sh
│   ├── setup_application.sh
│   └── cleanup.sh
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # Database configuration
│   │   └── initDatabase.js
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   ├── models/              # Sequelize models
│   ├── routes/              # API routes
│   ├── schemas/             # Validation schemas
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   └── app.js               # Application entry point
└── webapp.service           # Systemd service file
```

## Prerequisites
- Node.js (v22 or higher)
- PostgreSQL (v13 or higher)
- npm (latest version)
- AWS Account with appropriate permissions
- SendGrid API key for email notifications

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/kaushik-manivannan-cloud-org/webapp.git
cd webapp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following configuration:
```env
# Database Configuration
DB_NAME=your_database_name
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432

# Application Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
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
  - Triggers verification email
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
  - Requires email verification
  - No request body

- `PUT /v1/user/self`
  - Update user details
  - Requires basic authentication
  - Requires email verification
  - Request body (all fields optional):
    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "password": "NewPass123!"
    }
    ```

### Profile Picture Management
- `POST /v1/user/self/pic`
  - Upload profile picture
  - Requires basic authentication
  - Requires email verification
  - Multipart form data with 'profilePic' field
  - Supports JPEG, JPG, PNG formats
  - Max file size: 10MB

- `GET /v1/user/self/pic`
  - Get profile picture
  - Requires basic authentication
  - Requires email verification

- `DELETE /v1/user/self/pic`
  - Delete profile picture
  - Requires basic authentication
  - Requires email verification

### Email Verification
- `GET /v1/user/verify`
  - Verify user email
  - Requires verification token as query parameter
  - Token expires in 2 minutes

## Testing

Run the test suite:
```bash
npm test
```

## CI/CD Pipeline

The application uses GitHub Actions for continuous integration and deployment. The pipeline is triggered when a pull request is merged to the main branch and consists of the following stages:

1. **Integration Tests**
   - Runs on Ubuntu latest with PostgreSQL 13
   - Sets up Node.js 22 environment
   - Configures test database using GitHub secrets
   - Executes integration test suite
   - Validates application functionality

2. **Artifact Creation**
   - Creates deployment artifact containing:
     - Source code
     - Package configuration
     - Environment variables
     - Service definition files
   - Uploads artifact for subsequent stages

3. **Packer Build**
   - Configures AWS credentials
   - Downloads application artifact
   - Builds AMI using Packer with:
     - Base Ubuntu 24.04 LTS image
     - Application code and dependencies
     - System configurations
     - Monitoring setup (CloudWatch, CollectD)
   - Retrieves and stores the newly created AMI ID

4. **Auto Scaling Group Update**
   - Executes only for dev and demo environments
   - Uses environment-specific AWS credentials
   - Creates new Launch Template version with the latest AMI
   - Initiates rolling update of the Auto Scaling Group:
     - Maintains 90% minimum healthy instances
     - Monitors refresh status until completion
     - Validates successful deployment
   - Handles environment-specific configurations using GitHub variables

The pipeline ensures:
- All tests pass before deployment
- Zero-downtime deployments through rolling updates
- Environment-specific configurations are properly applied
- Infrastructure is updated safely and systematically
- Failed deployments can be detected and handled

Environment variables and secrets are managed through GitHub Secrets and include:
- Database configuration
- AWS credentials
- Infrastructure settings
- Application configuration

The pipeline supports multiple environments (dev, demo) with appropriate access controls and configurations for each environment.