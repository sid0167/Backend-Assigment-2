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
        return JSON.parse(fs.readFileSync('tasks.json'));
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
    const showCompleted = req.query.showCompleted === 'true';
    res.render('tasks', { tasks, showCompleted });
});

app.post('/add-task', (req, res) => {
    const tasks = readTasks();
    tasks.push({ id: Date.now(), text: req.body.text, completed: false, createdAt: new Date().toLocaleString() });
    writeTasks(tasks);
    res.redirect('/tasks');
});

app.post('/delete-task', (req, res) => {
    writeTasks(readTasks().filter(task => task.id !== parseInt(req.body.id)));
    res.json({ success: true });
});

app.post('/toggle-task', (req, res) => {
    const tasks = readTasks().map(task => {
        if (task.id === parseInt(req.body.id)) task.completed = !task.completed;
        return task;
    });
    writeTasks(tasks);
    res.json({ success: true });
});

app.post('/edit-task', (req, res) => {
    const tasks = readTasks().map(task => {
        if (task.id === parseInt(req.body.id)) task.text = req.body.newText;
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