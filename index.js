const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payments');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Allow only renters-frontend.vercel.app
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? 'https://renters-frontend.vercel.app'
        : '*', // allow all in dev
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true
};

app.use(cors(corsOptions));

db.getConnection((err, connection) => {
    if (err) console.error('❌ Initial DB connection error:', err.message);
    else {
        console.log('✅ Database connected initially');
        connection.release();
    }
});

// Routes
app.use('/api/payments', paymentRoutes);

// Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
