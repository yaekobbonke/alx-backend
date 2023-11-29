const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

// Create a Redis client
const redisClient = redis.createClient();

// Promisify Redis methods
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Define the list of products
const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 }
];

// Function to get an item by ID
function getItemById(id) {
  return listProducts.find((item) => item.id === id);
}

// Function to reserve stock for an item by ID
async function reserveStockById(itemId, stock) {
  await setAsync(`item.${itemId}`, stock);
}

// Function to get the current reserved stock for an item by ID
async function getCurrentReservedStockById(itemId) {
  const reservedStock = await getAsync(`item.${itemId}`);
  return parseInt(reservedStock) || 0;
}

// Create the Express server
const app = express();
const port = 1245;

// Route to get the list of available products
app.get('/list_products', (req, res) => {
  const availableProducts = listProducts.filter((item) => item.stock > 0);
  res.json(availableProducts);
});

// Route to get the product details and current available stock
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);

  const item = getItemById(itemId);
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }

  const currentStock = item.stock - await getCurrentReservedStockById(itemId);

  res.json({
    item: {
      id: item.id,
      name: item.name,
      price: item.price
    },
    stock: currentStock
  });
});

// Route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);

  const item = getItemById(itemId);
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }

  const currentStock = item.stock - await getCurrentReservedStockById(itemId);
  if (currentStock <= 0) {
    res.status(400).json({ error: 'Item out of stock' });
    return;
  }

  await reserveStockById(itemId, currentStock - 1);

  res.json({
    message: 'Item reserved successfully'
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
