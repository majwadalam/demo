const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require("cors"); 
const bodyParser = require('body-parser');



// routes 
const userRoutes = require("./routes/userRoutes"); 
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require('./routes/orderRoutes');

require('dotenv').config()
app.use(cors())
// Middleware to parse JSON bodies
app.use(express.json());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes); 
 
// Connect to the database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to the database'))
  .catch((error) => console.log('Error connecting to the database:', error));

// Start the server

const port = 3001;
app.listen(port, () => console.log(`running on port ${port}`));
