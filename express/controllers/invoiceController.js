const fs = require('fs');
const xlsx = require('xlsx');
const InvoiceService = require('../services/invoiceService.js');
const { logError, logInfo } = require('../utils/logger');

exports.createInvoice = async (req, res) => {
	try {
		const invoice = await InvoiceService.createInvoice(req.body);
		res.status(201).json(invoice);
	} catch (error) {
		logError('Create invoice error:', error);
		res.status(error.status || 500).json({ message: error.message });
	}
};

exports.getAllInvoices = async (req, res) => {
	try {
		const { date, size = 10, page = 1 } = req.query;
		const result = await InvoiceService.getAllInvoices(date, parseInt(size), parseInt(page));
		res.status(200).json(result);
	} catch (error) {
		logError('Get invoices error:', error);
		res.status(500).json({ message: error.message });
	}
};

exports.getInvoiceById = async (req, res) => {
	try {
		const invoice = await InvoiceService.getInvoiceById(req.params.id);
		if (!invoice) {
			return res.status(404).json({ message: 'Invoice not found' });
		}
		res.status(200).json(invoice);
	} catch (error) {
		logError('Get invoice by ID error:', error);
		res.status(500).json({ message: error.message });
	}
};

exports.updateInvoice = async (req, res) => {
	try {
		const updatedInvoice = await InvoiceService.updateInvoice(req.params.id, req.body);
		if (!updatedInvoice) {
			return res.status(404).json({ message: 'Invoice not found' });
		}
		res.status(200).json(updatedInvoice);
	} catch (error) {
		logError('Update invoice error:', error);
		res.status(500).json({ message: error.message });
	}
};

exports.deleteInvoice = async (req, res) => {
	try {
		const deletedInvoice = await InvoiceService.deleteInvoice(req.params.id);
		if (!deletedInvoice) {
			return res.status(404).json({ message: 'Invoice not found' });
		}
		res.status(204).json(deletedInvoice);
	} catch (error) {
		logError('Delete invoice error:', error);
		res.status(500).json({ message: error.message });
	}
};

exports.importInvoices = async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: 'No file uploaded' });
	}

	try {
		const result = await InvoiceService.importFromExcel(req.file.path);
		const statusCode = result?.success ? 200 : 400;
		res.status(statusCode).json(result);
	} catch (error) {
		logError('Import invoices error:', error);
		res.status(500).json({ message: error.message });
	} finally {
		// Clean up uploaded file
		fs.unlinkSync(req.file.path);
	}
};
