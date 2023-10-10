const express = require('express')
const app = express()

// use ejs files to prepare tempaltes for views
const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
	res.render('index')
})


app.listen(3001, () =>{
	console.log('Example app is started att http://localhost:3001')
})