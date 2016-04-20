var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: [
		'./client/src/index'
	],
	output: {
		path: path.join(__dirname, 'public', 'assets', 'js'),
		filename: 'bundle.min.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	plugins: [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			}
		})
	],
	module: {
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
