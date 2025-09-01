const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('public'),
    filename: 'bundle.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.module\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: true },
          },
        ],
      },
      {
        test: /\.css$/i,
        exclude: /\.module\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
            {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader', // Add this
        ],
      },
      
      {
  test: /\.svg$/i,
  issuer: /\.[jt]sx?$/,
  use: ['@svgr/webpack'],
}

    ],
  },
  resolve: {
  extensions: ['.js', '.jsx', '.css'],
},
stats: {
  modules: true,
  reasons: true,
  errorDetails: true,
},

};
