# API Blogging Platform
 A simple RESTful API with basic CRUD operations for a personal blogging platform.

## Goals
 - The goals of this project are to help you:
  - Understand what the RESTful APIs are including best practices and conventions
  - Learn how to create a RESTful API
  - Learn about common HTTP methods like GET, POST, PUT, PATCH, DELETE
  - Learn about status codes and error handling in APIs
  - Learn how to perform CRUD operations using an API
  - Learn how to work with databases

## Features
 - You should create a RESTful API for a personal blogging platform. The API should allow users to perform the following operations:
  - Create a new blog post
  - Update an existing blog post
  - Delete an existing blog post
  - Get a single blog post
  - Get all blog posts
  - Filter blog posts by a search term

## Tech Stack
  - Node.js with Express.js
 

## What I installed to this app

1. npm install express mongoose express-rate-limit dotenv nodemon
2. npm install moment-timezone  express-async-handler


## Installation

1. Make sure you have [Node.js](https://nodejs.org) installed.

2. Clone or download this project.

3. First you need to install using **`npm i`** in terminal.

4. To run use this command : **`npm start`**
    - Usage:  `http://localhost:4000/posts/add_post`
      - Search via Web: 

          - ## BLOG POST
          - **GET** - **`http://localhost:4000/posts/get_specific_post/:id`** to get specific post.
          - **GET** - **`http://localhost:4000/posts/get_all_post`** to get all posts.
          - **POST** - **`http://localhost:4000/posts/add_post`** to add new post.
          - **PUT** - **`http://localhost:4000/posts/update_post/:id/`** to update the post.
          - **DELETE** - **`http://localhost:4000/posts/delete_post/:id`** to delete the post.

5. https://roadmap.sh/projects/blogging-platform-api



