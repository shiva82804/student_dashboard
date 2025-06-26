const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const studentRoutes = require('./routes/studentRoutes');
const Student = require('./models/Student');
const { calcScore } = require('./utils/fetchScores');
const cron = require('node-cron');
dotenv.config();
const app = express()
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.log('MongoDB connection failed:', err.message);
});
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Server is up and running');
});
// student routes
app.use('/api/students', studentRoutes);
// cron job to update scores everyday at 12:01 AM
cron.schedule('1 0 * * *', async () => {
    console.log('Updating student scores...');
    try {
        const students = await Student.find();
        for (let i = 0; i < students.length; i++) {
            const score = await calcScore(students[i]);
            students[i].score = score;
            await students[i].save();
        }
        console.log('All scores updated');
    } catch (error) {
        console.log('Error while updating scores:', error);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
