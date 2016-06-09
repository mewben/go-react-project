const path = require('path')
const exec = require('shelljs').exec
const child = require('child_process')
const gulp = require('gulp')
const { log, colors } = require('gulp-util')
const notifier = require('node-notifier')
const ip = require('ip')

let env = require('./env.json')
let server = null
let basename = path.basename(__dirname)
let client_loaded = false
let client_error = false
let config = {
	server_port: Number(env.SERVERPORT.split(':').pop()),
	client_port: Number(env.CLIENTPORT.split(':').pop()),
}

const logChanges = (event) => {
	log(colors.green('File ' + event.type + ': ') + colors.magenta(path.basename(event.path)))
	prompt()
}

const prompt = () => {
	log('')
	log('')
	log(colors.bold('        =========== GO-REACT-PROJECT ==========='))
	log('')
	log(colors.bold('        Client URLs:'), colors.green('✓'))
	log(colors.cyan('        ----------------------------------------'))
	log('        Localhost:', colors.magenta(`http://localhost:${config.client_port}`))
	log('              LAN:', colors.magenta(`http://${ip.address()}:${config.client_port}`))
	log(colors.cyan('        ----------------------------------------'))
	log('')
	log(colors.bold('        Server URLs:'), colors.green('✓'))
	log(colors.cyan('        ----------------------------------------'))
	log('        Localhost:', colors.magenta(`http://localhost:${config.server_port}`))
	log('              LAN:', colors.magenta(`http://${ip.address()}:${config.server_port}`))
	log(colors.cyan('        ----------------------------------------'))
	log('        Press CTRL-C to stop')
	log('')
	log('')
}

// default task
gulp.task('default', ['client:serve', 'server:spawn', 'server:watch'], (cb) => {
	if (!client_error) {
		prompt()
	}

	cb()
})

gulp.task('server', ['server:spawn', 'server:watch'])

gulp.task('client:serve', (cb) => {
	let client = exec('cross-env NODE_ENV=development node dev-server', {async: true, silent: true})
	// let client = child.spawnSync('npm', ['start'])

	client.stdout.on('data', (data) => {
		// get the last word
		// console.log('data', data)
		if (data.match(/ERROR/)) {
			log(data)
			client_error = true
			if (!client_loaded) {
				client_loaded = true
				cb()
			}
		}

		let client_ms = data.split(' ').pop()
		// if it returns e.g. 9384ms, build was successful
		if (client_ms.match(/.ms/)) {
			client_error = false
			if (!client_loaded) {
				client_loaded = true
				cb()
			} else {
				log(data)
				prompt()
			}
		}
	})

	client.stderr.on('data', (data) => {
		log(data)
		client_error = true
		if (!client_loaded) {
			client_loaded = true
			cb()
		}
	})
})

gulp.task('server:spawn', ['server:build'], () => {
	if (server) {
		server.kill()
	}

	server = child.spawn(basename)

	server.stdout.on('data', (data) => {
		log(colors.cyan('SERVER LOG:'), data.toString())
	})

	// Print errors to stdout
	server.stderr.on('data', (data) => {
		log(colors.magenta('SERVER ERROR:'), data.toString())
		// process.stdout.write(data.toString())
	})
})

gulp.task('server:build', () => {
	let build = child.spawnSync('go', ['install'])

	if (build.stderr.length) {
		// error building go files
		let lines = build.stderr.toString()
			.split('\n').filter((line) => {
				return line.length
			})
		for (let l in lines) {
			log(colors.red(
				'Error (go install): ' + lines[l]
			))
		}
		notifier.notify({
			title: 'Error (go install)',
			message: lines,
		})
	} else {
		return build
	}
})

gulp.task('server:watch', () => {
	gulp.watch('./**/*.go', ['server:spawn']).on('change', logChanges)
	gulp.watch('./**/*.html', ['server:spawn']).on('change', logChanges)
})
