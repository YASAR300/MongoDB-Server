const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection details
const uri = process.env.MONGODB_URI || "mongodb+srv://yasarkhancg:787898@cluster0.ftdfl.mongodb.net/"; 
const dbName = "codinggita";

// Middleware
app.use(cors());
app.use(express.json());

let db, students;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        students = db.collection("students");

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
        const allStudents = await students.find().toArray();
        res.status(200).json(allStudents);
    } catch (err) {
        res.status(500).send("Error fetching students: " + err.message);
    }
});

// POST: Add a new student and return updated list
app.post('/students', async (req, res) => {
    try {
        const newStudent = req.body;
        await students.insertOne(newStudent);
        const allStudents = await students.find().toArray();
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
        await students.replaceOne({ rollNumber }, updatedStudent);
        const allStudents = await students.find().toArray();
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
        await students.updateOne({ rollNumber }, { $set: updates });
        const allStudents = await students.find().toArray();
        res.status(200).json(allStudents); // Return updated data
    } catch (err) {
        res.status(500).send("Error partially updating student: " + err.message);
    }
});

// DELETE: Remove a student
app.delete('/students/:rollNumber', async (req, res) => {
    try {
        const rollNumber = parseInt(req.params.rollNumber);
        await students.deleteOne({ rollNumber });
        const allStudents = await students.find().toArray();
        res.status(200).json(allStudents); // Return updated data
    } catch (err) {
        res.status(500).send("Error deleting student: " + err.message);
    }
});
