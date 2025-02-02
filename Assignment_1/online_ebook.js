const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();
const port = 3000;

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: 'root@123', // Your MySQL password
  database: 'sys',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database');
});

// GET method to retrieve all books
app.get('/books', (req, res) => {
  const query = 'SELECT * FROM books';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error fetching books' });
    } else {
      res.json(results);
    }
  });
});

// POST method to add a new book
app.post('/books', (req, res) => {
  const { book_name, author_name, available, cost } = req.body;

  const query = 'INSERT INTO books (book_name, author_name, available, cost) VALUES (?, ?, ?, ?)';
  db.query(query, [book_name, author_name, available, cost], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error adding book' });
    } else {
      res.status(201).json({
        message: 'Book added successfully',
        book: {
          id: results.insertId,
          book_name,
          author_name,
          available,
          cost,
        },
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
