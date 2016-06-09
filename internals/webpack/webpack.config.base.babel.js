const path = require('path')
const webpack = require('webpack')

module.exports = (options) => ({
	entry: options.entry,

	// merge output with dev output
	output: Object.assign({
		path: path.resolve(process.cwd(), 'public'),
		publicPath: '/',
	}, options.output),

	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				loaders: ['eslint-loader'],
				exclude: /node_modules/,
				include: path.resolve(process.cwd(), 'client'),
			},
		],
		loaders: [{
			test: /\.jsx?$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			include: path.resolve(process.cwd(), 'client'),
		}, {
			test: /\.s?css$/,
			loader: options.cssLoaders,
		}, {
			test: /\.(jpg|png|gif)$/,
			loader: 'file-loader',
		}, {
			test: /\.html$/,
			loader: 'html-loader',
		}, {
			test: /\.json$/,
			loader: 'json-loader',
		}],
	},
	plugins: options.plugins.concat([
		// new webpack.optimize.CommonsChunkPlugin('common.js'),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		// Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV),
			},
		}),
	]),
	postcss: () => options.postcssPlugins,
	resolve: {
		// modules: ['client', 'node_modules'],
		root: path.resolve(process.cwd(), 'client'),
		extensions: [
			'',
			'.js',
			'.jsx',
			'.react.js',
		], /*
		packageMains: [
			'jsnext:main',
			'main',
		], */
		alias: {
			base: path.resolve(process.cwd()),
			styles: path.resolve(process.cwd(), 'internals', 'styles'),
		},
	},
	devtool: options.devtool,
	target: 'web', // Make web variables accessible to webpack, e.g. window
	stats: false, // Don't show stats in the console
	progress: true,
})
