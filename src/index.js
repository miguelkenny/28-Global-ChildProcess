const express = require('express')
const engine = require('ejs-mate')
const routes = require('./routes/index')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const parseArgs = require('minimist')

//Inicializaciones
const app = express()
require('./database')
require('./passport/local-auth')

const args = parseArgs(process.argv.slice(2), {
	alias: {
		p: 'port',
	},
	default: {
		port: 8080,
	},
})
console.log(args.port)

//Congiguracion
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine)
app.set('view engine', 'ejs')

//Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(session({
	secret: 'coderhouse',
	resave: false,
	saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
	app.locals.signupMessage = req.flash('signupMessage')
	app.locals.signinMessage = req.flash('signinMessage')
	app.locals.user = req.user
	next()
})

//Rutas
app.use('/', routes)

//Inicializar Servidor
app.set('port', args.port || 3000)

// Escuchando puerto con minimist
app.listen(args.port, () => {
	console.log(`Servidor escuchando puerto', ${args.port}`)
})