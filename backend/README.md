# Briefcase Backend

Welcome to the backend repository for Briefcase. This contains all the necessary code to power the Briefcase application's backend services.

---

## Getting Started

To get the backend server running on your local machine, follow these steps:

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add the following environment variables:
    ```
    MONGODB_URI=<your_mongodb_connection_string>
    PORT=5000
    BACKEND_BASEURL=http://localhost:5000
    ENCRYPTION_SALT=10
    NODE_ENV=development
    JWT_SECRET=<your_jwt_secret>
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```
    The server will start on `http://localhost:5000`.

---

## API Endpoints

-   **/api/users**: User authentication and management.
-   **/api/incomes**: Manage user income.
-   **/api/expenses**: Manage user expenses.
-   **/api/goals**: Manage user financial goals.

---

## Technologies Used

-   **Node.js**
-   **Express**
-   **MongoDB** with **Mongoose**
-   **JWT** for authentication
-   **bcrypt** for password hashing
-   **TypeScript**

---

## License

This project is licensed under the MIT License.
