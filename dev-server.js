var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var config = require('./webpack.config.dev');

var app = new (require('express'))();
var port = 8082;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
	noInfo: true,
	stats: {
		colors: true,
		chunks: false
	},
	publicPath: '/static/'
}));
app.use(webpackHotMiddleware(compiler));

app.use(function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.listen(port, function(error) {
	if (error) {
		console.error(error);
	}
});
