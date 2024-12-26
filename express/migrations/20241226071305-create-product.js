'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('products', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			invoice_number: {
				type: Sequelize.STRING
			},
			item_name: {
				type: Sequelize.STRING
			},
			quantity: {
				type: Sequelize.INTEGER
			},
			total_cost: {
				type: Sequelize.FLOAT
			},
			total_price: {
				type: Sequelize.FLOAT
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
		await queryInterface.dropTable('products');
	}
};
