const path = require('path')
const express = require('express')
const webpack = require('webpack')
const ngrok = require('ngrok')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const webpackConfig = require('../internals/webpack/webpack.config.dev.babel')
const logger = require('./logger')
const env = require('../env.json')

const app = express()

const isTunnel = process.env.NODE_ENV === 'tunnel'
const port = Number(env.CLIENTPORT.split(':').pop())

// use webpack
const compiler = webpack(webpackConfig)
const wpdevmiddleware = webpackDevMiddleware(compiler, {
	noInfo: true,
	publicPath: webpackConfig.output.publicPath,
	silent: true,
	stats: 'errors-only',
})
app.use(wpdevmiddleware)
app.use(webpackHotMiddleware(compiler))

// Since webpackDevMiddleware uses memory-fs internally to store build
// artifacts, we use it instead
const fs = wpdevmiddleware.fileSystem

app.get('*', (req, res) => {
	const file = fs.readFileSync(path.join(compiler.outputPath, 'index.html'))
	res.send(file.toString())
})

// Start the app
app.listen(port, (err) => {
	if (err) return logger.error(err)

	// connect to ngrok if tunnel mode
	if (isTunnel) {
		ngrok.connect(port, (innerErr, url) => {
			if (innerErr) return logger.error(innerErr)

			logger.appStarted(port, url)
		})
	} else {
		logger.appStarted(port)
	}
})
