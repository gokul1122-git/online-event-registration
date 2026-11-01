
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Registration = require("./models/Registration");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(
        `${new Date().toLocaleString()} - ${req.method} ${req.url}`
    );
    next();
});

// Connect to MongoDB and start the server
async function startServer() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/eventDB");

        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Event Registration API running on port ${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
    }
}

// CREATE: Save a registration
app.post("/api/registrations", async (req, res) => {
    try {
        const registration = await Registration.create({
            name: req.body.name,
            email: req.body.email,
            event: req.body.event,
            date: req.body.date
        });

        res.status(201).json({
            message: "Registration saved successfully",
            registration
        });
    } catch (error) {
        res.status(400).json({
            message: "Could not save registration",
            error: error.message
        });
    }
});

// READ: Get all registrations
app.get("/api/registrations", async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ _id: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE: Edit a registration
app.put("/api/registrations/:id", async (req, res) => {
    try {
        const registration = await Registration.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                event: req.body.event,
                date: req.body.date
            },
            { new: true, runValidators: true }
        );

        if (!registration) {
            return res.status(404).json({ message: "Registration not found" });
        }

        res.json({
            message: "Registration updated successfully",
            registration
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE: Remove a registration
app.delete("/api/registrations/:id", async (req, res) => {
    try {
        const registration = await Registration.findByIdAndDelete(
            req.params.id
        );

        if (!registration) {
            return res.status(404).json({ message: "Registration not found" });
        }

        res.json({ message: "Registration deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

startServer();
