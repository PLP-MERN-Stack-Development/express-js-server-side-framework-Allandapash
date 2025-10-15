// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/// Authentication middleware
function authenticate(req, res, next) {
  const token = req.headers['authorization'];
  if (!token || token !== 'Bearer mysecrettoken') {
    return res.status(401).json({ error: 'Unauthorized access' });
  }
  next();
}

// Public route (no auth required)
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Protected routes (require auth)
app.post('/api/products', authenticate, (req, res) => {
  // ... create product
});
app.put('/api/products/:id', authenticate, (req, res) => {
  // ... update product
});
app.delete('/api/products/:id', authenticate, (req, res) => {
  // ... delete product
});


// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
// POST /api/products - Create a new product
// PUT /api/products/:id - Update a product
// DELETE /api/products/:id - Delete a product

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// ✅ GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});


// ✅ POST /api/products - Create a new product
app.post('/api/products', (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});


// ✅ PUT /api/products/:id - Update a product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updatedProduct = { ...products[productIndex], ...req.body };
  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
});


// ✅ DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = products.splice(productIndex, 1);
  res.json({ message: 'Product deleted', deleted });
});

// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 