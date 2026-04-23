require('dotenv').config()
const cors = require('cors');
const express = require('express');
const app = express();

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('Connection failed', err.message))
app.use(express.json())
app.use(cors());
app.use('/api/profiles', require('./routes/profile'));

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))