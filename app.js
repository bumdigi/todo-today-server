const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

const DBconfig = require('./config/DB.js')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// to allow CORS(Cross Origin Resource Sharing)
app.use(cors())

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// init mongoose connection
mongoose.Promise = global.Promise
mongoose.connect(DBconfig.DB, {useNewUrlParser: true, useUnifiedTopology: true}).then(
  () => {console.log(`Database is connected`)},
  err => {console.log(`Can not connect to the database ${err}`)}
)

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// www에 정의되어 있음
// run server
// app.listen(process.env.PORT || '4000', function() {
// 	console.log("server listen...")
// })

module.exports = app
