const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'projects.json');
const SECRET_KEY = "diya123"; // Your secret key

// Initialize JSON file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// 1. Get all projects
app.get('/api/projects', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

// 2. Add a project (Admin Only)
app.post('/api/projects', (req, res) => {
    const { key, project } = req.body;
    if (key !== SECRET_KEY) return res.status(401).json({ error: "Unauthorized" });

    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const newProject = { ...project, id: Date.now().toString() };
    data.push(newProject);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(newProject);
});

// 3. Delete a project (Admin Only)
app.delete('/api/projects/:id', (req, res) => {
    const { key } = req.body;
    if (key !== SECRET_KEY) return res.status(401).json({ error: "Unauthorized" });

    let data = JSON.parse(fs.readFileSync(DATA_FILE));
    data = data.filter(p => p.id !== req.params.id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));