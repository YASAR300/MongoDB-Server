const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection details
const uri = process.env.MONGODB_URI || "mongodb+srv://yasarkhancg:787898@cluster0.ftdfl.mongodb.net/codinggita?retryWrites=true&w=majority"; 

// Define the student schema
const studentSchema = new mongoose.Schema({
  name: String,
  rollNumber: Number,
  department: String,
  year: Number,
  coursesEnrolled: { type: [String], default: [] },  // Default to an empty array
});

// Create a model based on the schema
const Student = mongoose.model('Student', studentSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

initializeDatabase();

// GET: List all students
app.get('/students', async (req, res) => {
    try {
        const allStudents = await Student.find();
        res.status(200).json(allStudents);
    } catch (err) {
        res.status(500).send("Error fetching students: " + err.message);
    }
});

// POST: Add a new student and return updated list
app.post('/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        const allStudents = await Student.find();
        res.status(201).json(allStudents); // Return updated data
    } catch (err) {
        res.status(500).send("Error adding student: " + err.message);
    }
});

// PUT: Update a student completely
app.put('/students/:rollNumber', async (req, res) => {
    try {
        const rollNumber = parseInt(req.params.rollNumber);
        const updatedStudent = req.body;
        await Student.replaceOne({ rollNumber }, updatedStudent);
        const allStudents = await Student.find();
        res.status(200).json(allStudents); // Return updated data
    } catch (err) {
        res.status(500).send("Error updating student: " + err.message);
    }
});

// PATCH: Partially update a student
app.patch('/students/:rollNumber', async (req, res) => {
    try {
        const rollNumber = parseInt(req.params.rollNumber);
        const updates = req.body;
        await Student.updateOne({ rollNumber }, { $set: updates });
        const allStudents = await Student.find();
        res.status(200).json(allStudents); // Return updated data
    } catch (err) {
        res.status(500).send("Error partially updating student: " + err.message);
    }
});

// DELETE: Remove a student
app.delete('/students/:rollNumber', async (req, res) => {
    try {
        const rollNumber = parseInt(req.params.rollNumber);
        await Student.deleteOne({ rollNumber });
        const allStudents = await Student.find();
        res.status(200).json(allStudents); // Return updated data
    } catch (err) {
        res.status(500).send("Error deleting student: " + err.message);
    }
});

