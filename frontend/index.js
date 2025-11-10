const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'frontend/html')));
app.use('/js',     express.static(path.join(__dirname, 'frontend/js')));
app.use('/images', express.static(path.join(__dirname, 'frontend/html', 'images')));
app.use('/styles.css', express.static(path.join(__dirname, 'frontend', 'styles.css')));

app.get('/', (_,res)=>res.sendFile(path.join(__dirname,'frontend/html/index.html')));
app.listen(PORT, ()=>console.log(`http://localhost:${PORT}`));
