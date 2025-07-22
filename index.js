const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payments');
const db = require('./db');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
db.getConnection((err, connection) => {
    if (err) console.error('❌ Initial DB connection error:', err.message);
    else {
        console.log('✅ Database connected initially');
        connection.release();
    }
})

app.use('/api/payments', paymentRoutes);


app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
