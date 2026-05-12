const express = require("express");
const router = express.Router();
const db = require("../db");
const { body, param, validationResult } = require("express-validator");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

const VALID_DELIVERY_STATUSES = ["pending", "on_route", "delivered"];

// ─── GET ALL DELIVERIES (admin + driver) ─────────────────────────────────────
router.get(
    "/",
    authenticateToken,
    authorizeRole("admin", "driver"),
    (req, res) => {
        const sql = `
            SELECT
                deliveries.id,
                deliveries.status,
                deliveries.delivery_date,
                orders.id AS order_id,
                customers.full_name AS customer_name,
                users.full_name AS driver_name
            FROM deliveries
            JOIN orders ON deliveries.order_id = orders.id
            JOIN customers ON orders.customer_id = customers.id
            LEFT JOIN users ON deliveries.driver_id = users.id
            ORDER BY deliveries.delivery_date DESC
        `;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ message: "Failed to retrieve deliveries." });
            res.json(results);
        });
    }
);

// ─── CREATE DELIVERY / ASSIGN DRIVER (admin only) ────────────────────────────
router.post(
    "/",
    authenticateToken,
    authorizeRole("admin"),
    [
        body("order_id").isInt({ min: 1 }).withMessage("Valid order ID is required."),
        body("driver_id").isInt({ min: 1 }).withMessage("Valid driver ID is required.")
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { order_id, driver_id } = req.body;

        db.query(
            "INSERT INTO deliveries (order_id, driver_id) VALUES (?, ?)",
            [order_id, driver_id],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Failed to create delivery." });
                res.status(201).json({ message: "Delivery assigned.", delivery_id: result.insertId });
            }
        );
    }
);

// ─── UPDATE DELIVERY STATUS (admin + driver) ─────────────────────────────────
router.put(
    "/:id",
    authenticateToken,
    authorizeRole("admin", "driver"),
    [
        param("id").isInt({ min: 1 }).withMessage("Valid delivery ID is required."),
        body("status")
            .isIn(VALID_DELIVERY_STATUSES)
            .withMessage(`Status must be one of: ${VALID_DELIVERY_STATUSES.join(", ")}.`)
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        db.query(
            "UPDATE deliveries SET status = ?, delivery_date = NOW() WHERE id = ?",
            [req.body.status, req.params.id],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Failed to update delivery." });
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Delivery not found." });
                }
                res.json({ message: "Delivery status updated." });
            }
        );
    }
);

module.exports = router;
