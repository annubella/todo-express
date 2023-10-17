const express = require('express')
const app = express()
const fs = require('fs')

// use ejs files to prepare tempaltes for views
const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
	// get data from file
	fs.readFile('./tasks','utf8', (err, data) => {
		if (err){
			console.error(err);
			return
		}
		//task list data
	    const tasks = data.split("\n") 
	    res.render('index', {tasks: tasks})
	});
})


app.listen(3001, () =>{
	console.log('Example app is started att http://localhost:3001')
})