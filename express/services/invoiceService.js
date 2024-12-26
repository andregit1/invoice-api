const { Op } = require('sequelize');
const xlsx = require('xlsx');
const dayjs = require('dayjs');
const { Invoice, Product, sequelize } = require('../models');

class InvoiceService {
	static async createInvoice(data) {
		const transaction = await sequelize.transaction();
		try {
			const existingInvoice = await Invoice.findOne({
				where: { invoice_number: data.invoice_number },
				transaction
			});

			if (existingInvoice) {
				throw { status: 400, message: 'Invoice number already exists' };
			}

			const invoice = await Invoice.create(data, { transaction });
			const products = await Product.bulkCreate(
				data.products.map((product) => ({
					...product,
					invoice_number: invoice.invoice_number
				})),
				{ transaction }
			);

			await transaction.commit();
			return { ...invoice.toJSON(), products };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	static async getAllInvoices(date, size, page) {
		const where = {};
		if (date) {
			where.date = {
				[Op.between]: [new Date(date).setHours(0, 0, 0, 0), new Date(date).setHours(23, 59, 59, 999)]
			};
		}

		const { count, rows } = await Invoice.findAndCountAll({
			where,
			include: [Product],
			limit: size,
			offset: (page - 1) * size,
			order: [['date', 'DESC']]
		});

		// Calculate profits and cash transactions
		let totalProfit = 0;
		let totalCashTransactions = 0;

		rows.forEach((invoice) => {
			if (invoice.payment_type === 'CASH') {
				totalCashTransactions++;
			}

			invoice.Products.forEach((product) => {
				totalProfit += product.total_price - product.total_cost;
			});
		});

		return {
			invoices: rows,
			totalPages: Math.ceil(count / size),
			currentPage: page,
			totalRecords: count,
			totalProfit,
			totalCashTransactions
		};
	}

	static async getInvoiceById(id) {
		return await Invoice.findOne({ where: { id }, include: [Product] });
	}

	static async updateInvoice(id, data) {
		const transaction = await sequelize.transaction();
		try {
			const invoice = await Invoice.findOne({ where: { id }, transaction });

			if (!invoice) {
				throw { status: 404, message: 'Invoice not found' };
			}

			// Update invoice data
			await invoice.update(data, { transaction });

			// Update products if necessary
			if (data.products && data.products.length > 0) {
				await Product.destroy({ where: { invoice_number: invoice.invoice_number }, transaction });
				const updatedProducts = await Product.bulkCreate(
					data.products.map((product) => ({
						...product,
						invoice_number: invoice.invoice_number
					})),
					{ transaction }
				);
				invoice.products = updatedProducts;
			}

			await transaction.commit();
			return { ...invoice.toJSON(), products: invoice.products };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	static async deleteInvoice(id) {
		const transaction = await sequelize.transaction();
		try {
			const invoice = await Invoice.findOne({ where: { id }, transaction });

			if (!invoice) {
				throw { status: 404, message: 'Invoice not found' };
			}

			await Product.destroy({ where: { invoice_number: invoice.invoice_number }, transaction });
			await invoice.destroy({ transaction });

			await transaction.commit();
			return { message: 'Invoice deleted successfully', ...invoice.toJSON() };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	static async importFromExcel(filePath) {
		const workbook = xlsx.readFile(filePath);
		const invoiceSheet = xlsx.utils.sheet_to_json(workbook.Sheets['invoice']);
		const productSheet = xlsx.utils.sheet_to_json(workbook.Sheets['product sold']);

		const validInvoices = [];
		const errors = [];

		// Process each invoice
		for (const invoiceRow of invoiceSheet) {
			const invoiceErrors = [];

			// Validate invoice fields
			if (!invoiceRow['invoice no']) invoiceErrors.push('Missing invoice number');
			if (!invoiceRow['date']) invoiceErrors.push('Missing date');
			if (!invoiceRow['customer']) invoiceErrors.push('Missing customer');
			if (!invoiceRow['salesperson']) invoiceErrors.push('Missing salesperson');
			if (!['CASH', 'CREDIT'].includes(invoiceRow['payment type'])) {
				invoiceErrors.push('Invalid payment type');
			}

			// Find related products
			const products = productSheet
				.filter((p) => p['Invoice no'] === invoiceRow['invoice no'])
				.map((p) => ({
					item_name: p.item,
					quantity: p.quantity,
					total_cost: p['total cogs'],
					total_price: p['total price']
				}));

			if (products.length === 0) {
				invoiceErrors.push('No products found for invoice');
			}

			// Validate products
			products.forEach((product) => {
				if (!product.item_name || product.item_name.length < 5) {
					invoiceErrors.push(`Invalid item name: ${product.item_name}`);
				}
				if (!product.quantity || product.quantity < 1) {
					invoiceErrors.push(`Invalid quantity for ${product.item_name}`);
				}
				if (typeof product.total_cost !== 'number' || product.total_cost < 0) {
					invoiceErrors.push(`Invalid total cost for ${product.item_name}`);
				}
				if (typeof product.total_price !== 'number' || product.total_price < 0) {
					invoiceErrors.push(`Invalid total price for ${product.item_name}`);
				}
			});

			if (invoiceErrors.length > 0) {
				errors.push({
					invoiceNo: invoiceRow['invoice no'],
					errors: invoiceErrors
				});
			} else {
				validInvoices.push({
					invoice_number: invoiceRow['invoice no'],
					date: new Date(invoiceRow['date']),
					customer_name: invoiceRow['customer'],
					salesperson_name: invoiceRow['salesperson'],
					payment_type: invoiceRow['payment type'],
					notes: invoiceRow['notes'] || '',
					products
				});
			}
		}

		// If there are errors, return them without saving
		if (errors.length > 0) {
			return {
				success: false,
				insertedCount: 0,
				errorCount: errors.length,
				errors
			};
		}

		// Insert valid invoices
		let insertedCount = 0;
		if (validInvoices.length > 0) {
			const transaction = await sequelize.transaction();

			try {
				for (const invoice of validInvoices) {
					const createdInvoice = await Invoice.create(invoice, { transaction });
					for (const product of invoice.products) {
						await Product.create({ ...product, invoice_number: createdInvoice.invoice_number }, { transaction });
					}
					insertedCount++;
				}
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
		}

		return {
			success: true,
			insertedCount,
			errorCount: errors.length,
			errors
		};
	}
}

module.exports = InvoiceService;
