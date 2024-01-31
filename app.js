const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require("cors"); 
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

// routes 
const userRoutes = require("./routes/userRoutes"); 
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require('./routes/orderRoutes');
const roomRoutes = require('./routes/roomRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');

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
app.use('/api/rooms', roomRoutes);
// app.use('/api/bookings', bookingRoutes);
 
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
