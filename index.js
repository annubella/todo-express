const express = require('express')
const app = express()
const fs = require('fs')

// use ejs files to prepare tempaltes for views
const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
		// get data from file
	fs.readFile(filename,'utf8', (err, data) => {
		if (err){
			console.error(err);
			return
		}
		//task list data from file
	    const tasks = JSON.parse(data) 
	    resolve(tasks)
	});
  })
}

app.get('/', (req, res) => {
	// tasks list data from file
	readFile('./tasks.json')
		.then(tasks => {
			console.log(tasks)
			res.render('index', {tasks: tasks})
	})
})

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true}));

app.post('/', (req, res) => {
	// tasks list data from file
	readFile('./tasks.json')
		.then(tasks => {
			//add new task
			// create new id automatically
			let index
			if(tasks.length == 0)
			{
				index = 0
			} else {
				index = tasks[tasks.length-1].id + 1;
			}
			//create task object
			const newTask = {
				'id' : index,
				'task' : req.body.task
			}
			console.log(newTask)
			//add form sent task to tasks array
			tasks.push(newTask)
			console.log(tasks)
			data = JSON.stringify(tasks, null, 2)
			console.log(data)
			fs.writeFile('./tasks.json', data, 'utf-8', err => {
				if (err) {
				console.log(err);
				return;
			} else {
				console.log('saved')
			}
			// redirect to / to see result
			res.redirect('/')

		})
	})
})
app.listen(3001, () =>{
	console.log('Example app is started at http://localhost:3001')
})
// vaja teha edasilt yl 5 andmete kustutamine