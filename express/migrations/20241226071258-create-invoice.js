'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('invoices', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			invoice_number: {
				type: Sequelize.STRING
			},
			date: {
				type: Sequelize.DATE
			},
			customer_name: {
				type: Sequelize.STRING
			},
			salesperson_name: {
				type: Sequelize.STRING
			},
			payment_type: {
				type: Sequelize.ENUM('CASH', 'CREDIT', 'NOTCASHORCREDIT')
			},
			notes: {
				type: Sequelize.TEXT
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('invoices');
	}
};
