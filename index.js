const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// static
app.use(express.static(path.join(__dirname, 'frontend/html')));
app.use('/js',     express.static(path.join(__dirname, 'frontend/js')));
app.use('/images', express.static(path.join(__dirname, 'frontend/html/images')));
app.use('/styles.css', express.static(path.join(__dirname, 'frontend/styles.css')));

// API
app.use('/api/menu', require('./server/routes/menu'));
app.use('/api/inventory', require('./server/routes/inventory'));
app.use('/api/orders',    require('./server/routes/orders'));
app.use('/api/employees', require('./server/routes/employees'));

app.get('/', (_,res)=>res.sendFile(path.join(__dirname,'frontend/html/index.html')));
app.listen(PORT, ()=>console.log(`http://localhost:${PORT}`));
