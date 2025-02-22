const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const readTasks = () => {
    try {
        const data = fs.readFileSync('tasks.json');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

const writeTasks = (tasks) => {
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
};

app.get('/', (req, res) => {
    res.redirect('/tasks');
});

app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.render('tasks', { tasks });
});

app.post('/add-task', (req, res) => {
    const tasks = readTasks();
    const newTask = { 
        id: Date.now(), 
        text: req.body.text, 
        completed: false, 
        createdAt: new Date().toLocaleString() 
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.redirect('/tasks');
});

app.post('/delete-task', (req, res) => {
    let tasks = readTasks();
    tasks = tasks.filter(task => task.id !== parseInt(req.body.id));
    writeTasks(tasks);
    res.json({ success: true });
});

app.post('/toggle-task', (req, res) => {
    let tasks = readTasks();
    tasks = tasks.map(task => {
        if (task.id === parseInt(req.body.id)) {
            task.completed = !task.completed;
        }
        return task;
    });
    writeTasks(tasks);
    res.json({ success: true });
});

app.post('/edit-task', (req, res) => {
    let tasks = readTasks();
    tasks = tasks.map(task => {
        if (task.id === parseInt(req.body.id)) {
            task.text = req.body.newText;
        }
        return task;
    });
    writeTasks(tasks);
    res.json({ success: true });
});

app.post('/clear-tasks', (req, res) => {
    writeTasks([]);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
