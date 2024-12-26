const validateInvoice = (req, res, next) => {
	const { invoice_number, date, customer_name, salesperson_name, payment_type, notes, products } = req.body;

	const errors = [];

	if (!invoice_number || typeof invoice_number !== 'string' || invoice_number.length < 1) {
		errors.push('Invalid invoice number');
	}

	if (!date || isNaN(new Date(date).getTime())) {
		errors.push('Invalid date');
	}

	if (!customer_name || typeof customer_name !== 'string' || customer_name.length < 2) {
		errors.push('Invalid customer name');
	}

	if (!salesperson_name || typeof salesperson_name !== 'string' || salesperson_name.length < 2) {
		errors.push('Invalid salesperson name');
	}

	if (!payment_type || !['CASH', 'CREDIT', 'NOTCASHORCREDIT'].includes(payment_type)) {
		errors.push('Invalid payment type');
	}

	if (notes && (typeof notes !== 'string' || notes.length < 5)) {
		errors.push('Notes must be at least 5 characters long');
	}

	if (!Array.isArray(products) || products.length === 0) {
		errors.push('Products array is required');
	} else {
		products.forEach((product, index) => {
			if (!product.item_name || typeof product.item_name !== 'string' || product.item_name.length < 5) {
				errors.push(`Invalid item name for product at index ${index}`);
			}
			if (!product.quantity || product.quantity < 1) {
				errors.push(`Invalid quantity for product at index ${index}`);
			}
			if (typeof product.total_cost !== 'number' || product.total_cost < 0) {
				errors.push(`Invalid total cost for product at index ${index}`);
			}
			if (typeof product.total_price !== 'number' || product.total_price < 0) {
				errors.push(`Invalid total price for product at index ${index}`);
			}
		});
	}

	if (errors.length > 0) {
		return res.status(400).json({ errors });
	}

	next();
};

module.exports = { validateInvoice };
