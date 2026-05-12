const express = require("express");
const router = express.Router();
const db = require("../db");
const { body, validationResult } = require("express-validator");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

// ─── GET ALL CUSTOMERS (admin + counter) ─────────────────────────────────────
router.get(
    "/",
    authenticateToken,
    authorizeRole("admin", "counter"),
    (req, res) => {
        db.query("SELECT * FROM customers", (err, results) => {
            if (err) return res.status(500).json({ message: "Failed to retrieve customers." });
            res.json(results);
        });
    }
);

// ─── CREATE CUSTOMER (admin + counter) ───────────────────────────────────────
router.post(
    "/",
    authenticateToken,
    authorizeRole("admin", "counter"),
    [
        body("full_name").trim().notEmpty().withMessage("Full name is required."),
        body("phone").trim().notEmpty().withMessage("Phone is required."),
        body("email").optional().isEmail().withMessage("Invalid email format."),
        body("address").optional().trim()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { full_name, phone, email, address } = req.body;

        const sql = "INSERT INTO customers (full_name, phone, email, address) VALUES (?, ?, ?, ?)";

        db.query(sql, [full_name, phone, email || null, address || null], (err) => {
            if (err) return res.status(500).json({ message: "Failed to create customer." });
            res.status(201).json({ message: "Customer created successfully." });
        });
    }
);

module.exports = router;
