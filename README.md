[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/tRxoBzS5)
Add design docs in *images/*

## Instructions: Running the Fake StackOverflow Web Application

**A. GENERAL BACKGROUND:**
The Fake StackOverflow web application is a simulated platform resembling the popular Stack Overflow website, where users can ask and answer questions related to programming and technology. The application comprises both a frontend built using React and a backend implemented with Node.js and MongoDB. React is used for the frontend interface, while Node.js serves as the backend server, handling data storage and retrieval using MongoDB as the database.

**Salient Features:**
- Frontend built with React framework.
- Backend server powered by Node.js with Express framework.
- Data storage and retrieval managed by MongoDB.
- User authentication and password hashing implemented for security.
- Axios library used for client-server communication.
- CORS middleware enabled for seamless client-server interaction during development.

**B. INSTRUCTIONS:**

1. **Preparation:**
   - Ensure Node.js and npm (Node Package Manager) are installed on your system.
   - Install MongoDB and start a local instance. Refer to the official MongoDB documentation for installation instructions.
   - Clone the Fake StackOverflow repository.

2. **Setting Up the Server:**
   - Navigate to the `server` directory of the cloned repository.
   - Install necessary dependencies by running:
     ```
     $ npm install express axios mongoose bcrypt nodemon connect-mongo express-session cors
     ```
   - Start the MongoDB server with the command:
     ```
     $ mongod
     ```
   - Initialize the backend server by running:
     ```
     $ nodemon server/server.js
     ```

3. **Starting the Client Application:**
   - Navigate to the `client` directory of the cloned repository.
   - Install React dependencies by running:
     ```
     $ npm install react axios
     ```
   - Start the React application with the command:
     ```
     $ npm start
     ```

4. **Accessing the Application:**
   - Once both the server and client are running, open your web browser.
   - Access the Fake StackOverflow application at `http://localhost:8000`.

5. **Exploring the Application:**
   - Use the interface to browse questions, ask new questions, and provide answers.
   - User authentication features may be available based on the implementation.
   - Explore various functionalities and interact with the application as desired.

**C. SPECIAL NOTICES:**
- Ensure that MongoDB is properly installed and running before starting the server.
- Use caution with sensitive operations, such as modifying the database schema or running scripts.
- CORS middleware is enabled for development purposes and should be disabled in production environments for security reasons.

## Christian's Contribution
Users and Admin
User and Admin profiles
Tag creation
Sessions
Tags Page
Search
Posting new questions (backend)
Posting new answers (backend)
Sort by filter
Reputation System
Editing and Deleting Questions
Editing and Deleting Tags

## Varia's Contribution
Welcome page
Question page
Question Details Page
Comments
Posting new questions (frontend)
Posting new answers (frontend)
