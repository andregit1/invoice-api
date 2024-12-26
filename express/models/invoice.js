'use strict';
const { Model } = require('sequelize');
const dayjs = require('dayjs');
module.exports = (sequelize, DataTypes) => {
	class Invoice extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Invoice.hasMany(models.Product, {
				foreignKey: 'invoice_number',
				sourceKey: 'invoice_number',
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			});
		}
	}
	Invoice.init(
		{
			invoice_number: { type: DataTypes.STRING, allowNull: false, unique: true },
			date: {
				type: DataTypes.DATE,
				allowNull: false
				// get() {
				// 	const value = this.getDataValue('date');
				// 	return dayjs(value).format('YYYY-MM-DD'); // Format the date as 'YYYY-MM-DD'
				// }
			},
			customer_name: { type: DataTypes.STRING, allowNull: false },
			salesperson_name: { type: DataTypes.STRING, allowNull: false },
			payment_type: { type: DataTypes.ENUM('CASH', 'CREDIT', 'NOTCASHORCREDIT'), allowNull: false },
			notes: { type: DataTypes.TEXT }
		},
		{
			sequelize,
			modelName: 'Invoice',
			tableName: 'invoices'
		}
	);
	return Invoice;
};
