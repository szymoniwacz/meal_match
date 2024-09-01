process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const environment = require('./environment');
const path = require('path');

// Define the public path dynamically
const publicPath = path.resolve(__dirname, '../../public');

module.exports = environment.toWebpackConfig();

module.exports.devServer = {
  static: {
    directory: publicPath, // Dynamic public directory path
  },
  historyApiFallback: true, // Ensure 404s fallback to index.html
  compress: true,
  port: process.env.WEBPACK_DEV_SERVER_PORT || 8080, // Allow dynamic port configuration
};
