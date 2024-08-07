const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sequelize, Document } = require('./db');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Route to handle document upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { description } = req.body;
    const { filename } = req.file;

    // Create document URL
    const documentURL = `http://localhost:3000/uploads/${filename}`;

    // Save document information to the database
    const document = await Document.create({
      documentName: req.file.originalname,
      documentURL,
      description
    });

    res.status(201).json({ message: 'File uploaded successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Sync database and start the server
sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});
