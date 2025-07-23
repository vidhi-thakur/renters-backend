const validatePaymentInput = (req, res, next) => {
    const { building_name, unit_number, tenant_name, amount, payment_method } = req.body;

    if (!building_name || !unit_number || !tenant_name || !amount || !payment_method) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a valid number greater than 0' });
    }

    next();
};

const validateVerifyInput = (req, res, next) => {
    const { verified } = req.body;
    const { id } = req.params;

    if (!id || typeof verified !== 'boolean') {
        return res.status(400).json({ message: 'Valid id and verified are required' });
    }
    next();
};

module.exports = { validatePaymentInput, validateVerifyInput };
