# Health Check API Project

This project implements a health check API for a web application, providing a way to monitor the health of the application and its database connection.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

* Node.js (v14.0.0 or higher)
* npm (v6.0.0 or higher)
* PostgreSQL (v12.0 or higher)

## Setting Up the Project

To set up the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/kaushik-manivannan/webapp.git
   cd webapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=localhost
   DB_PORT=5432
   PORT=3000
   NODE_ENV=development
   ```
   Replace the values with your actual database credentials.

4. Set up the database:
   - Ensure PostgreSQL is running on your machine.
   - Create a new database that matches the `DB_NAME` in your `.env` file.

## Running the Application Locally

To run the application locally, use the following command:

```
npm start
```

The server will start, and you should see a message indicating it's running on the specified port (default is 3000).

## Testing the Health Check API

Once the application is running, you can test the health check API:

1. Using curl:
   ```
   curl -v http://localhost:3000/healthz
   ```

2. Using a REST Client (like Postman, Bruno) or a Web Browser:
   Navigate to `http://localhost:3000/healthz`

A successful response should return a 200 OK status. If there are any issues with the database connection, it will return a 503 Service Unavailable status.

## Contributing

Contributions to this project are welcome. Please ensure you follow the existing code style and add unit tests for any new features.