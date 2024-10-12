const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Blog Schema
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

// Middleware to check password
const checkPassword = (req, res, next) => {
    const { password } = req.body;
    if (password === process.env.BLOG_PASSWORD) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Incorrect password' });
    }
};

// API Routes
app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.find();
    res.json(blogs);
});

app.post('/api/blogs', checkPassword, async (req, res) => {
    const { title, content } = req.body;
    const newBlog = new Blog({ title, content });
    await newBlog.save();
    res.status(201).json(newBlog);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
