const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// GET - /books => books.json faylini o’qib barcha ma’lumotlarni chiqaring
app.get('/books', (req, res) => {
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    } else {
      const books = JSON.parse(data);
      res.json(books);
    }
  });
});

// GET - /books/:id => books.json faylidan :id bo’yicha qidiring, agar topilsa ma’lumotni qaytaring malumot yo'q bo'lsa malumot topilmadi
app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    } else {
      const books = JSON.parse(data);
      const book = books.find((b) => b.id === bookId);
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    }
  });
});

// POST - /books => books.json fayliga yangi ma’lumotni qo'shish
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    } else {
      const books = JSON.parse(data);
      const existingBook = books.find((b) => b.title === title);
      if (existingBook) {
        res.status(409).json({ error: 'Book already exists' });
      } else {
        const newBook = {
          id: books.length + 1,
          title,
          author,
        };
        books.push(newBook);
        fs.writeFile('books.json', JSON.stringify(books), (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
          } else {
            res.json(newBook);
          }
        });
      }
    }
  });
});

// PUT - /books/:id => books.json faylidan :id bo’yicha qidiring, malumot topilmadi !
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    } else {
      const books = JSON.parse(data);
      const bookIndex = books.findIndex((b) => b.id === bookId);
      if (bookIndex !== -1) {
        books[bookIndex].title = title;
        books[bookIndex].author = author;
        fs.writeFile('books.json', JSON.stringify(books), (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
          } else {
            res.json(books[bookIndex]);
          }
        });
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    }
  });
});

// DELETE - /books/:id => books.json faylidan #id bo’yicha qidirish
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    } else {
      const books = JSON.parse(data);
      const bookIndex = books.findIndex((b) => b.id === bookId);
      if (bookIndex !== -1) {
        const deletedBook = books[bookIndex];
        books.splice(bookIndex, 1);
        fs.writeFile('books.json', JSON.stringify(books), (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
          } else {
            res.json(deletedBook);
          }
        });
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});