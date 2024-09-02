const { environment } = require('@rails/webpacker');
const webpack = require('webpack');
const BrotliPlugin = require('brotli-webpack-plugin');

environment.loaders.append('babel', {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
      ],
    },
  },
});


// Remove deprecated options from configuration if they were added earlier
environment.config.delete('node.dgram');
environment.config.delete('node.fs');
environment.config.delete('node.net');
environment.config.delete('node.tls');
environment.config.delete('node.child_process');

// Performance optimizations
environment.config.merge({
  performance: {
    hints: false,
    maxAssetSize: 1500000, // Increase the asset size limit
    maxEntrypointSize: 1500000, // Increase the entrypoint size limit
  },
});

// Add Brotli compression plugin only for production
if (process.env.NODE_ENV === 'production') {
  environment.plugins.append(
    'BrotliPlugin',
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    })
  );
}

// Ensure process and legacy OpenSSL provider compatibility
environment.plugins.append(
  'ProvidePlugin',
  new webpack.ProvidePlugin({
    process: 'process/browser',
    NODE_OPTIONS: JSON.stringify('--openssl-legacy-provider'),
  })
);

// Ensure NODE_ENV is consistent across all environments
environment.plugins.append(
  'DefinePlugin',
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  })
);

module.exports = environment;
