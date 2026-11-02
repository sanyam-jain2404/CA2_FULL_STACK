import express from "express";
import mongoose from "mongoose";
import Feedback from "../models/Feedback.js";
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const {
            studentName,
            courseName,
            message,
            rating
        } = req.body;
        if (!studentName || !courseName || !message || rating == null) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }
        const feedback = await Feedback.create({
            studentName,
            courseName,
            message,
            rating
        });
        res.status(201).json({
            message: "Feedback submitted successfully",
            feedback
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 5);
        const skip = (page - 1) * limit;
        const feedback = await Feedback.find().skip(skip).limit(limit);
        const totalRecords = await Feedback.countDocuments();
        res.status(200).json({
            currentPage: page,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            feedback
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid feedback ID"
            });
        }
        if (!["Pending", "Reviewed"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }
        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );
        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }
        res.status(200).json({
            message: "Status updated successfully",
            feedback
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
export default router;