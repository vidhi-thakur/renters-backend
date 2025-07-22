const experss = require('express');
const router = experss.Router();
const db = require('../db');

const { v4: uuidv4 } = require('uuid');


router.post('/', (req, res) => {

    const { building_name, unit_number, tenant_name, amount, payment_method } = req.body;

    // Basic validation
    if (!building_name || !unit_number || !tenant_name || !amount || !payment_method) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const transaction_id = uuidv4();
    const sql = `
        INSERT INTO payments
        (transaction_id, building_name, unit_number, tenant_name, amount, payment_method)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        transaction_id,
        building_name,
        unit_number,
        tenant_name,
        amount,
        payment_method
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('❌ DB Insert Error:', err.message);
            return res.status(500).json({ message: 'Error saving payment', error: err.message });
        }

        res.status(201).json({
            message: 'Payment recorded successfully!',
            paymentId: result.insertId,
            transaction_id: transaction_id
        });
    });

});

router.get('/', (req, res) => {

    const sql = 'SELECT * FROM payments';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ DB Fetch Error:', err.message);
            return res.status(500).json({ message: 'Database fetch error', error: err.message });
        }
        res.status(200).json(results);
    });

});

router.patch('/', (req, res) => {
    const { id, key, value } = req.body;

    // Basic validation
    if (!id || !key || value === undefined) {
        return res.status(400).json({ message: 'id, key, and value are required' });
    }

    const allowedKeys = ['verified', 'building_name', 'unit_number', 'tenant_name', 'amount', 'payment_method', 'transaction_id'];
    if (!allowedKeys.includes(key)) {
        return res.status(400).json({ message: 'Invalid field/key provided' });
    }

    const sql = `UPDATE payments SET ${key} = ? WHERE id = ?`;

    db.query(sql, [value, id], (err, result) => {
        if (err) {
            console.error('❌ DB Update Error:', err.message);
            return res.status(500).json({ message: 'Database update error', error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({ message: `${key} updated successfully` });
    });
});

module.exports = router;
