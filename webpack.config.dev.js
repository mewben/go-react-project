var path = require('path');
var webpack = require('webpack');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: [
		'webpack-hot-middleware/client',
		'./client/src/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin()
	],
	resolve: {
		extensions: ['', '.js', '.jsx']
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
				loaders: ['babel-loader'],
				exclude: /node_modules/,
				include: path.join(__dirname, 'client', 'src')
			}
		]
	}
};
