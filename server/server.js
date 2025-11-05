// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
//
// const employeeRoutes = require('./routes/employee');
// // const managerRoutes = require('./routes/manager');
// // const userRoutes = require('./routes/user');
//
// const app = express();
//
// app.use(cors());
// app.use(express.json()); // parse JSON bodies
//
// // Mount route files
// app.use('/api/employees', employeeRoutes);
// // app.use('/api/managers', managerRoutes);
// // app.use('/api/users', userRoutes);
//
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// server/server.js
const express = require('express');
const path = require('path');

const app = express();
const FRONTEND = path.join(__dirname, '..', 'frontend');

//serve assets
app.use('/js', express.static(path.join(FRONTEND, 'js')));
app.use('/images', express.static(path.join(FRONTEND, 'html', 'images')));
//styles.css lives at frontend/styles.css and is requested as /styles.css
app.get('/styles.css', (_req, res) => {
    res.sendFile(path.join(FRONTEND, 'styles.css'));
});

//serve the HTML pages (root = frontend/html)
app.use('/', express.static(path.join(FRONTEND, 'html')));

//default route -> index.html
app.get('/', (_req, res) => {
    res.sendFile(path.join(FRONTEND, 'html', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
