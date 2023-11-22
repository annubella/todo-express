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

const writeFile = (filename, data) => {
	return new Promise ((resolve, reject) => {
		//get data from file
		fs.writeFile(filename, data, 'utf-8', err => {
			if(err){
				console.error(err);
				return;
			}
			resolve(true)
		});
	})
}

app.get('/', (req, res) => {
	// tasks list data from file
	readFile('./tasks.json')
		.then(tasks => {
			res.render('index', {
				tasks: tasks,
				error: null
			})
		})
})

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true}));

app.post('/', (req, res) => {
	// control data from list
	let error = null
	if(req.body.task.trim().length == 0){
		error = 'Please insert correct task data'
		readFile('./tasks.json')
		.then(tasks =>{
			res.render('index',{
				tasks: tasks,
				error: error
			})
		})
	} else {
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

			//add form sent task to tasks array
			tasks.push(newTask)
			data = JSON.stringify(tasks, null, 2)
			writeFile('tasks.json', data)
			res.redirect('/')
		})
	}
})

app.post('/edit-task', (req, res) => {
	// control data from list
	const editTask = req.body
	let error = null
	if(req.body.task.trim().length == 0){
		error = 'Please insert correct task data'
		readFile('./tasks.json')
		.then(tasks =>{
			res.render('edit',{
				task: {task: editTask.task, id: editTask.taskId},
				error: error
			})
		})
	} else {
	// tasks list data from file
		readFile('./tasks.json')
		.then(tasks => {
			//edit task
			tasks.forEach((task, index) => {
			if(task.id === parseInt(req.body.taskId)){
				task.task = req.body.task
			}
		})
		data = JSON.stringify(tasks, null, 2)
		writeFile('tasks.json', data)
		res.redirect('/')
		})
	}
})

app.get('/delete-task/:taskId', (req,res)=> {
	let deletedTaskId = parseInt(req.params.taskId)
	readFile('./tasks.json')
	.then(tasks => {
		tasks.forEach((task, index) => {
			if(task.id === deletedTaskId){
				tasks.splice(index, 1)
			}
		})
		data = JSON.stringify(tasks, null, 2)
		writeFile('tasks.json', data)
		// redirect to / to see result
		res.redirect('/')
	})
})

app.get('/edit-task/:taskId', (req,res)=> {
	let editTaskId = parseInt(req.params.taskId)
	readFile('./tasks.json')
	.then(tasks => {
		tasks.forEach((task, index) => {
			if(task.id === editTaskId){
				res.render('edit',{
				task: task,
				error: null
			})
			}
		})
	})
})


// clear all button 
app.get('/delete-tasks', (req,res)=> {
	readFile('./tasks.json')
	.then(tasks => {
		tasks = []
		data = JSON.stringify(tasks, null, 2)
		writeFile('tasks.json', data)
	})
		// redirect to / to see result
		res.redirect('/')
})

app.listen(3001, () =>{
	console.log('Example app is started at http://localhost:3001')
})
// vaja teha edasilt yl 5 andmete kustutamine