let path = require('path');
let child = require('child_process');

let gulp = require('gulp');
let util = require('gulp-util');
let sync = require('gulp-sync')(gulp).sync;
let notifier = require('node-notifier');
let reload = require('gulp-livereload');

let env = require('./env.json');
let server = null;
let basename = path.basename(__dirname);
let config = {
	server_port: Number(env.SERVERPORT.split(':').pop()),
	client_port: Number(env.CLIENTPORT.split(':').pop())
};

let devServer = () => {
	require('./dev-server.js');
};

// ======= DEFAULT TASK ===== //
gulp.task('default', ['server:watch'], () => {
	devServer();
	console.log('🌎  ===> Server server at http://localhost:' + config.server_port);
	console.log('🌎  ===> Client at http://localhost:' + config.client_port);
});

// ======== SERVER:WATCH ==== //
gulp.task('server:watch', sync(['server:build', 'server:spawn']), () => {
	gulp.watch('./**/*.go', sync(['server:build', 'server:spawn'])).on('change', logChanges);
});

function logChanges(event) {
	util.log(
		util.colors.green('File ' + event.type + ': ') + util.colors.magenta(path.basename(event.path))
	);
}

// ======== SERVER:BUILD ==== //
gulp.task('server:build', () => {
	let build = child.spawnSync('go', ['install']);

	if (build.stderr.length) {
		// error building go files
		let lines = build.stderr.toString()
			.split('\n').filter(function(line) {
				return line.length;
			});
		for (let l in lines) {
			util.log(util.colors.red(
				'Error (go install): ' + lines[l]
			));
		}
		notifier.notify({
			title: 'Error (go install)',
			message: lines
		});
	} else {
		return build;
	}
});

// ======= SERVER:SPAWN ==== //
gulp.task('server:spawn', () => {
	if (server) {
		server.kill();
	}

	server = child.spawn(basename);

	server.stdout.once('data', function() {
		reload.reload('/');
	});

	server.stdout.on('data', function(data) {
		let lines = data.toString().split('\n');
		for (let l in lines) {
			if (lines[l].length) util.log(lines[l]);
		}
	});

	// Print errors to stdout
	server.stderr.on('data', function(data) {
		process.stdout.write(data.toString());
	});
});
