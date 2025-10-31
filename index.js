const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;

// serve the static frontend files
app.use(express.static(path.join(__dirname, '/frontend/html')));

// default route -> serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/index.html'));
});

app.listen(port, () => {
  console.log(`✅ Listening on http://localhost:${port}`);
});
