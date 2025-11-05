require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');

const app = express();
connectDB();

const allowedOrigins = [
    'http://localhost:5173'
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Root route working");
});