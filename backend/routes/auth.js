const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

// ─── REGISTER ────────────────────────────────────────────────────────────────
router.post(
    "/register",
    [
        body("full_name").trim().notEmpty().withMessage("Full name is required."),
        body("phone")
            .trim()
            .notEmpty().withMessage("Phone is required.")
            .isLength({ min: 7 }).withMessage("Phone must be at least 7 characters."),
        body("role")
            .isIn(["admin", "counter", "driver", "technician"])
            .withMessage("Role must be admin, counter, driver, or technician."),
        body("password")
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters.")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { full_name, phone, role, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (full_name, phone, role, password) VALUES (?, ?, ?, ?)";

        db.query(sql, [full_name, phone, role, hashedPassword], (err) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ message: "Phone number already registered." });
                }
                return res.status(500).json({ message: "Registration failed." });
            }
            res.status(201).json({ message: "User registered successfully." });
        });
    }
);

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post(
    "/login",
    [
        body("phone").trim().notEmpty().withMessage("Phone is required."),
        body("password").notEmpty().withMessage("Password is required.")
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { phone, password } = req.body;

        db.query("SELECT * FROM users WHERE phone = ?", [phone], async (err, results) => {
            if (err) return res.status(500).json({ message: "Login failed." });

            if (results.length === 0) {
                return res.status(401).json({ message: "Invalid phone or password." });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: "Invalid phone or password." });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.json({
                message: "Login successful.",
                token,
                role: user.role,
                name: user.full_name
            });
        });
    }
);

module.exports = router;
