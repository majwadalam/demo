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
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const corsOptions = {
  origin: [
    "http://localhost:3000",
"https://demo-three-navy.vercel.app"    
  ],
  credentials:"true", 
  optionSuccessStatus:200
};

app.use(cors(corsOptions));

require('dotenv').config()



app.use(cors(corsOptions));

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
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handler
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Connect to the database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to the database'))
  .catch((error) => console.log('Error connecting to the database:', error));

// Start the server

app.listen(process.env.PORT || 3001, () => console.log(`running on port ${process.env.PORT || 3001}`));
