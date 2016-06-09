var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: [
		'babel-polyfill',
		'webpack-hot-middleware/client?path=/__webpack_hmr',
		'./client/src/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.NoErrorsPlugin()
	],
	resolve: {
		extensions: ['', '.js', '.jsx', '.scss', '.css'],
		alias: {
			styles: path.resolve(__dirname, 'client', 'assets', 'scss'),
			root: __dirname
		}
	},
	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				loaders: ['eslint-loader'],
				exclude: /node_modules/,
				include: path.join(__dirname, 'client', 'src')
			}
		],
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				include: path.join(__dirname, 'client', 'src'),
				query: {
					cacheDirectory: true,
					plugins: ['transform-runtime'],
					presets: ['es2015', 'react', 'stage-0'],
					env: {
						production: {
							presets: ['react-optimize']
						}
					}
				}
			}, {
				test: /\.s?css$/,
				loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
			}, {
				test: /\.json$/,
				loader: 'json-loader'
			}
		]
	},
	postcss: function() {
		return [autoprefixer];
	}
};
