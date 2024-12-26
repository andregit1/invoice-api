# Invoice API Documentation

## 1. Create Invoice

Creates a new invoice with associated products.

**Endpoint:** POST `/api/invoices`

**Request Body:**

```json
{
	"invoice_number": "INV001",
	"date": "2024-01-01",
	"customer_name": "John Doe",
	"salesperson_name": "Jane Smith",
	"payment_type": "CASH",
	"notes": "Optional notes about the invoice",
	"products": [
		{
			"item_name": "Bluetooth Speaker",
			"quantity": 3,
			"total_cost": 630000,
			"total_price": 756000
		}
	]
}
```

**Success Response (201):**

```json
{
	"id": 1,
	"invoice_number": "INV001",
	"date": "2024-01-01T00:00:00.000Z",
	"customer_name": "John Doe",
	"salesperson_name": "Jane Smith",
	"payment_type": "CASH",
	"notes": "Optional notes about the invoice",
	"products": [
		{
			"id": 1,
			"item_name": "Bluetooth Speaker",
			"quantity": 3,
			"total_cost": 630000,
			"total_price": 756000,
			"invoice_number": "INV001"
		}
	]
}
```

## 2. Read Invoices

Retrieves a paginated list of invoices with optional date filtering.

**Endpoint:** GET `/api/invoices`

**Query Parameters:**

- `date` (optional): Filter invoices by date (YYYY-MM-DD)
- `size` (optional): Number of records per page (default: 10)
- `page` (optional): Page number (default: 1)

**Success Response (200):**

```json
{
	"invoices": [
		{
			"id": 1,
			"invoice_number": "INV001",
			"date": "2024-01-01T00:00:00.000Z",
			"customer_name": "John Doe",
			"salesperson_name": "Jane Smith",
			"payment_type": "CASH",
			"notes": "Optional notes",
			"products": [
				{
					"id": 1,
					"item_name": "Bluetooth Speaker",
					"quantity": 3,
					"total_cost": 630000,
					"total_price": 756000
				}
			]
		}
	],
	"totalPages": 1,
	"currentPage": 1,
	"totalRecords": 1,
	"totalProfit": 126000,
	"totalCashTransactions": 1
}
```

## 3. Update Invoice

Updates an existing invoice by ID.

**Endpoint:** PUT `/api/invoices/:id`

**Request Body:**

```json
{
	"invoice_number": "INV001",
	"date": "2024-01-01",
	"customer_name": "John Doe Updated",
	"salesperson_name": "Jane Smith",
	"payment_type": "CREDIT",
	"notes": "Updated notes",
	"products": [
		{
			"item_name": "Bluetooth Speaker",
			"quantity": 4,
			"total_cost": 840000,
			"total_price": 1008000
		}
	]
}
```

**Success Response (200):**

```json
{
	"message": "Invoice updated successfully"
}
```

## 4. Delete Invoice

Deletes an invoice by ID.

**Endpoint:** DELETE `/api/invoices/:id`

**Success Response (204):**
Empty response with status code 204

## 5. Import Invoices from Excel

Imports invoices from an Excel file.

**Endpoint:** POST `/api/invoices/import`

**Request:**

- Content-Type: multipart/form-data
- Body:
  - file: Excel file (.xlsx) containing two sheets:
    1. 'invoice' sheet with columns: invoice no, date, customer, salesperson, payment type, notes
    2. 'product sold' sheet with columns: Invoice no, item, quantity, total cogs, total price

**Success Response (200):**

```json
{
	"success": true,
	"insertedCount": 2,
	"errorCount": 0,
	"errors": []
}
```

**Success Response (400):**

```json
{
	"success": false,
	"insertedCount": 0,
	"errorCount": 3,
	"errors": [
		{
			"invoiceNo": 4,
			"errors": ["Invalid payment type"]
		},
		{
			"invoiceNo": 5,
			"errors": ["Missing salesperson"]
		},
		{
			"invoiceNo": 6,
			"errors": ["Invalid total cost for Headphone"]
		}
	]
}
```

## Error Responses

**Validation Error (400):**

```json
{
	"errors": ["Invalid invoice number", "Invalid payment type"]
}
```

**Not Found Error (404):**

```json
{
	"message": "Invoice not found"
}
```

**Server Error (500):**

```json
{
	"message": "Internal server error message"
}
```

## Data Validation Rules

### Invoice

- invoice_number: Required, string, min length 1
- date: Required, valid date
- customer_name: Required, string, min length 2
- salesperson_name: Required, string, min length 2
- payment_type: Required, enum ("CASH" | "CREDIT")
- notes: Optional, string, min length 5 if provided

### Product

- item_name: Required, string, min length 5
- quantity: Required, number, min value 1
- total_cost: Required, number, min value 0
- total_price: Required, number, min value 0
