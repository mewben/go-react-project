const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// PostCSS plugins
const cssnext = require('postcss-cssnext')
const postcssFocus = require('postcss-focus')
const postcssReporter = require('postcss-reporter')

module.exports = require('./webpack.config.base.babel')({
	// in production, we skill all hot reloading stuff
	entry: [
		path.join(process.cwd(), 'client', 'index.jsx'),
	],
	// Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
	output: {
		filename: 'assets/[name].[chunkhash].js',
		chunkFilename: 'assets/[name].[chunkhash].chunk.js',
	},

  // We use ExtractTextPlugin so we get a seperate CSS file instead
  // of the CSS being in the JS and injected as a style tag
	cssLoaders: ExtractTextPlugin.extract(
		'style-loader',
		'css-loader!postcss-loader!sass-loader'
  ),

  // In production, we minify our CSS with cssnano
	postcssPlugins: [
		postcssFocus(),
		cssnext({
			browsers: ['last 2 versions', 'IE > 10'],
		}),
		postcssReporter({
			clearMessages: true,
		}),
	],
	plugins: [

    // OccurrenceOrderPlugin is needed for long-term caching to work properly.
    // See http://mxs.is/googmv
		new webpack.optimize.OccurrenceOrderPlugin(true),

    // Merge all duplicate modules
		new webpack.optimize.DedupePlugin(),

    // Minify and optimize the JavaScript
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				dead_code: true,
				unused: true,
				warnings: false, // ...but do not show warnings in the console (there is a lot of them)
			},
		}),

    // Minify and optimize the index.html
		new HtmlWebpackPlugin({
			template: 'internals/templates/index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
			inject: true,
		}),

    // Extract the CSS into a seperate file
		new ExtractTextPlugin('assets/[name].[contenthash].css'),
	],
})
