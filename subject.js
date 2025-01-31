const express = require('express');
const { MongoClient,ObjectId } = require('mongodb');
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
        students = db.collection("courses");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: List all students
app.get('/courses', async (req, res) => {
    try {
        const allStudents = await courses.find().toArray();
        res.status(200).json(allStudents);
    } catch (err) {
        res.status(500).send("Error fetching students: " + err.message);
    }
});

// POST: Add a new student
app.post('/courses', async (req, res) => {
    try {
        const newStudent = req.body;
        const result = await courses.insertOne({ _id : new ObjectId(_id) },newStudent);
        res.status(201).send(`Student added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding student: " + err.message);
    }
});

// PUT: Update a student completely
app.put('/courses/:_id', async (req, res) => {
    try {
        const rollNumber = parseInt(req.params._id);
        const updatedStudent = req.body;
        const result = await courses.replaceOne({ _id : new ObjectId(_id) }, updatedStudent);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating student: " + err.message);
    }
});

// PATCH: Partially update a student
app.patch('/courses/:_id', async (req, res) => {
    try {
        const rollNumber = parseInt(req.params._id);
        const updates = req.body;
        const result = await courses.updateOne({ _id : new ObjectId(_id) }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating student: " + err.message);
    }
});

// DELETE: Remove a student
app.delete('/courses/:_id', async (req, res) => {
    try {
        const rollNumber = parseInt(req.params._id);
        const result = await courses.deleteMany({ _id : new ObjectId(_id) });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting student: " + err.message);
    }
});
