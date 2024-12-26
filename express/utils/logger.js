const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/app.log');

const logError = (message) => {
	const timestamp = new Date().toISOString();
	const logMessage = `[ERROR] [${timestamp}] ${message}\n`;
	fs.appendFileSync(logFilePath, logMessage);
};

const logInfo = (message) => {
	const timestamp = new Date().toISOString();
	const logMessage = `[INFO] [${timestamp}] ${message}\n`;
	fs.appendFileSync(logFilePath, logMessage);
};

module.exports = { logError, logInfo };
