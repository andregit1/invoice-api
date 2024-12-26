'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'invoices',
			[
				{
					invoice_number: 'INV2024001',
					date: new Date('2024-01-15'),
					customer_name: 'Sarah Williams',
					salesperson_name: 'Michael Chen',
					payment_type: 'CREDIT',
					notes: 'Corporate bulk purchase for office supplies',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					invoice_number: 'INV2024002',
					date: new Date('2024-01-16'),
					customer_name: 'Robert Garcia',
					salesperson_name: 'Emma Thompson',
					payment_type: 'CASH',
					notes: 'Rush delivery requested',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					invoice_number: 'INV2024003',
					date: new Date('2024-01-17'),
					customer_name: 'Emily Parker',
					salesperson_name: 'David Wilson',
					payment_type: 'CREDIT',
					notes: 'Educational institution discount applied',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					invoice_number: 'INV2024004',
					date: new Date('2024-01-18'),
					customer_name: 'James Anderson',
					salesperson_name: 'Sophie Martinez',
					payment_type: 'CASH',
					notes: 'Bulk order for retail store',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					invoice_number: 'INV2024005',
					date: new Date('2024-01-19'),
					customer_name: 'Maria Rodriguez',
					salesperson_name: 'Alex Turner',
					payment_type: 'CREDIT',
					notes: 'Special pricing for loyal customer',
					createdAt: new Date(),
					updatedAt: new Date()
				}
			],
			{}
		);

		// insert related products
		await queryInterface.bulkInsert(
			'products',
			[
				{
					invoice_number: 'INV2024001',
					item_name: 'Mechanical Keyboard MX-500',
					quantity: 10,
					total_cost: 1500000,
					total_price: 2000000,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					invoice_number: 'INV2024001',
					item_name: 'Ergonomic Mouse Pro',
					quantity: 15,
					total_cost: 750000,
					total_price: 1125000,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					invoice_number: 'INV2024002',
					item_name: 'Ultra HD Webcam 4K',
					quantity: 5,
					total_cost: 2500000,
					total_price: 3250000,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					invoice_number: 'INV2024002',
					item_name: 'Professional Microphone Set',
					quantity: 3,
					total_cost: 1800000,
					total_price: 2400000,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					invoice_number: 'INV2024003',
					item_name: 'Wireless Presenter Remote',
					quantity: 20,
					total_cost: 1000000,
					total_price: 1600000,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					invoice_number: 'INV2024003',
					item_name: 'USB-C Docking Station',
					quantity: 8,
					total_cost: 3200000,
					total_price: 4000000,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					invoice_number: 'INV2024004',
					item_name: 'Gaming Monitor 27-inch',
					quantity: 6,
					total_cost: 6000000,
					total_price: 7800000,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					invoice_number: 'INV2024004',
					item_name: 'RGB Gaming Mouse Pad XL',
					quantity: 12,
					total_cost: 600000,
					total_price: 960000,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					invoice_number: 'INV2024005',
					item_name: 'Noise Cancelling Headset',
					quantity: 4,
					total_cost: 2000000,
					total_price: 2800000,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					invoice_number: 'INV2024005',
					item_name: 'Wireless Keyboard and Mouse Bundle',
					quantity: 7,
					total_cost: 2100000,
					total_price: 2940000,
					createdAt: new Date(),
					updatedAt: new Date()
				}
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		// remove products first due to foreign key constraint
		await queryInterface.bulkDelete('products', null, {});
		// remove invoices
		await queryInterface.bulkDelete('invoices', null, {});
	}
};
