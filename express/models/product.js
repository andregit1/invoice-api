'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Product.belongsTo(models.Invoice, {
				foreignKey: 'invoice_number',
				targetKey: 'invoice_number',
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			});
		}
	}
	Product.init(
		{
			invoice_number: { type: DataTypes.STRING, allowNull: false },
			item_name: { type: DataTypes.STRING, allowNull: false },
			quantity: { type: DataTypes.INTEGER, allowNull: false },
			total_cost: { type: DataTypes.FLOAT, allowNull: false },
			total_price: { type: DataTypes.FLOAT, allowNull: false }
		},
		{
			sequelize,
			modelName: 'Product',
			tableName: 'products'
		}
	);
	return Product;
};
