const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { validatePaymentInput, validateVerifyInput } = require('../middleware/validatePayment');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', validatePaymentInput, (req, res, next) => {
    const { building_name, unit_number, tenant_name, amount, payment_method } = req.body;
    const transaction_id = uuidv4();

    const sql = `
        INSERT INTO payments
        (transaction_id, building_name, unit_number, tenant_name, amount, payment_method)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [transaction_id, building_name, unit_number, tenant_name, amount, payment_method];

    db.query(sql, values, (err, result) => {
        if (err) return next(err);
        res.status(201).json({
            message: 'Payment recorded successfully!',
            paymentId: result.insertId,
            transaction_id
        });
    });
});

router.get('/', (req, res, next) => {
    db.query('SELECT * FROM payments', (err, results) => {
        if (err) return next(err);
        res.status(200).json(results);
    });
});

router.patch('/', verifyToken, validateVerifyInput, (req, res, next) => {
    const { id, verified } = req.body;

    db.query(`UPDATE payments SET verified = ? WHERE id = ?`, [verified, id], (err, result) => {
        if (err) return next(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json({ message: 'Verification updated successfully' });
    });
});

module.exports = router;
