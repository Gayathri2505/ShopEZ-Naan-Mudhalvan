# ShopEZ: E-Commerce Application

## Project Overview
ShopEZ is a full-featured e-commerce platform aimed at providing a seamless shopping experience for users and efficient management tools for administrators. The platform allows customers to browse, filter, and purchase a diverse selection of products across categories like beauty, electronics, accessories, fashion, groceries, and stationery. Users can securely register, log in, and manage their profiles, with session handling enabled by JWT tokens and bcrypt-secure password hashing.

## Contents
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup Instructions](#setup-instructions)

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime for building the backend.
- **Express.js** - Web framework for Node.js.
- **MongoDB** - Database for storing users, products, and orders.
- **Mongoose** - MongoDB ODM (Object Data Modeling) library for managing MongoDB data.
- **bcrypt** - Password hashing for secure authentication.
- **jsonwebtoken** - Used for JWT authentication tokens.
- **express-validator** - Middleware to validate and sanitize incoming data.

### Frontend
- **React** - JavaScript library for building the user interface.
- **Axios** - HTTP client for making API calls.
- **React Router** - For handling routing and navigation.
- **React Icons** - Icons used throughout the application.
- **React Infinite Scroll Component** - For infinite scrolling in product listings.

 ### Database
- **MongoDB**: NoSQL database for storing user, product, order, cart and wishlist information.

## Features
### Customer Features
- **User Authentication**: Secure registration and login using JWT.
- **Product Filters**: View product listings with filters by price, category, and gender.
- **Product Browsing**: Search for products using keywords and categories.
- **Shopping Cart and Wishlist**: Add items to the cart or wishlist for easy purchasing.
- **Profile Management**: View order history and manage profile details.
- **Order Tracking**: Track order status from placement to delivery.

### Admin Features
- **Admin Dashboard**: Overview of users, products, and orders.
- **Product Management**: Add, update, or delete products.
- **Order Management**: Manage and update order statuses.
- **User Management**: View and manage registered users.

## Setup Instructions

To set up and run the **ShopEZ** e-commerce application, follow these steps:

### 1. Install Prerequisites:
- **Node.js (Version 20.x)**: Download and install from the [Node.js official website](https://nodejs.org/), which includes npm (Node Package Manager).
- **MongoDB**: Set up MongoDB using [MongoDB Compass](https://www.mongodb.com/products/compass) for a local instance or create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for a cloud-based setup.
- **Git**: Install Git from the [Git downloads](https://git-scm.com/) for version control.
- **npm**: npm comes with Node.js, so it will be installed automatically when you install Node.js.
- **Code Editor**: Use Visual Studio Code or your preferred IDE for development.

### 2. Download Project Files:
- Clone the repository or download the project files.
- Place all project files in a dedicated project directory on your local machine.

### 3. Install Dependencies:
- Open a terminal, navigate to the project directory client and server side seperated, and install the required dependencies by running:
  i) **Server Dependencies**
  ```bash
  cd server
  npm install
  ```
  ii) **Client Dependencies**
  ```bash
  cd client
  npm install
  ```

### 4. Set Up Environment Variables
- In the server, create a .env file to store environment-specific variables: database connection strings and JWT secrets. Contents in the .env file is as follows:
  ```bash
  PORT= 3001 
  MONGO_URI=<mongodb-connection-string>
  JWT_SECRET=<jwt-secret>

### 5. Run the application
To start the application in develoment mode
  1. **Start the backend server**:
   ```bash
   cd server
   node index.js
   ```
  2. **Start the frontend**:
  ```bash
  cd client
  npm start
  ```
  Open http://localhost:3000 to view the frontend and interact with the application

## Demo Video 
[ShopEZ Demo](https://drive.google.com/file/d/1Jb7d1SN6HxgXltrtZ5N8u4vYwXsfyX52/view?usp=drive_link)

