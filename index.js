const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payments');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
