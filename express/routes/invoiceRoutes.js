const express = require('express');
const multer = require('multer');
const { validateInvoice } = require('../utils/validation');
const invoiceController = require('../controllers/invoiceController');
const router = express.Router();

const upload = multer({
	dest: 'uploads/',
	fileFilter: (req, file, cb) => {
		if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
			cb(null, true);
		} else {
			cb(new Error('Only .xlsx files are allowed'));
		}
	}
});

router.post('/create', validateInvoice, invoiceController.createInvoice);
router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.put('/update/:id', validateInvoice, invoiceController.updateInvoice);
router.delete('/delete/:id', invoiceController.deleteInvoice);
router.post('/import', upload.single('file'), invoiceController.importInvoices);

module.exports = router;
