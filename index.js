const express = require('express');
const path = require('path');
const studentRouter = require('./routes/student-router');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use('/api/auth', studentRouter)
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});