var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: [
		'babel-polyfill',
		'./client/src/index'
	],
	output: {
		path: path.join(__dirname, 'public', 'assets'),
		filename: 'bundle.min.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.scss', '.css'],
		alias: {
			styles: path.resolve(__dirname, 'client', 'assets', 'scss'),
			root: __dirname
		}
	},
	plugins: [
		new ExtractTextPlugin('main.min.css'),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false,
				unused: true,
				dead_code: true
			}
		})
	],
	module: {
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
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
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
