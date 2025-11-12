const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { router: authRoutes, initAuth } = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const managerRoutes = require('./routes/manager');
const userRoutes = require('./routes/user');

const app = express();
initAuth(app);

app.use(cors());
app.use(express.json());

// Mount route files
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));