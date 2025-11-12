// const express = require('express');
// const path = require('path');
// const app = express();
// const port = process.env.PORT || 4000;
//
// // serve the static frontend files
// app.use(express.static(path.join(__dirname, '/html')));
//
// // default route -> serve index.html
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../html/index.html'));
// });
//
//
//
// app.listen(port, () => {
//   console.log(`✅ Listening on http://localhost:${port}`);
// });

// react-pos/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Home from "./home.jsx";
import "./index.css"; // keep your styles import

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Home />
    </BrowserRouter>
);

