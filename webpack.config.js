// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//   entry: './frontend/src/index.js',
//   output: {
//     path: path.resolve(__dirname, 'frontend/public'),
//     filename: 'bundle.js',
//     publicPath: '/',
//   },
//   mode: 'development',
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: [
//               ['@babel/preset-env', {
//                 targets: {
//                   browsers: ['last 2 versions']
//                 }
//               }],
//               ['@babel/preset-react', {
//                 runtime: 'automatic'
//               }]
//             ]
//           }
//         }
//       },
//       {
//         test: /\.css$/i,
//         use: ['style-loader', 'css-loader', 'postcss-loader'],
//       },
//       {
//         test: /\.svg$/i,
//         issuer: /\.[jt]sx?$/,
//         use: ['@svgr/webpack'],
//       },
//     ],
//   },
//   resolve: {
//     extensions: ['.js', '.jsx', '.css'],
//   },
//   devServer: {
//     static: {
//       directory: path.resolve(__dirname, 'frontend/public'),
//     },
//     historyApiFallback: true,
//     port: 8080,
//     host: '0.0.0.0', // Important for Docker
//     allowedHosts: 'all', // Important for Docker
//     hot: true,
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './frontend/public/index.html',
//     }),
//   ],
//   stats: {
//     modules: true,
//     reasons: true,
//     errorDetails: true,
//   },
// };

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',  // Changed: removed './frontend/'
  output: {
    path: path.resolve(__dirname, 'dist'),  // Changed: removed 'frontend/'
    filename: 'bundle.js',
    publicPath: '/',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['last 2 versions']
                }
              }],
              ['@babel/preset-react', {
                runtime: 'automatic'
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),  // Changed: removed 'frontend/'
    },
    historyApiFallback: true,
    port: 8080,
    host: '0.0.0.0',
    allowedHosts: 'all',
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',  // Changed: removed 'frontend/'
    }),
  ],
  stats: {
    modules: true,
    reasons: true,
    errorDetails: true,
  },
};