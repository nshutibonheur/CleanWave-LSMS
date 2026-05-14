const express = require("express");
const router = express.Router();
const db = require("../db");
const { body, param, validationResult } = require("express-validator");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

const VALID_STATUSES = ["received", "sorting", "washing", "drying", "ironing", "ready", "delivered"];

// GET ALL ORDERS 
router.get(
    "/",
    authenticateToken,
    authorizeRole("admin", "counter", "technician"),
    (req, res) => {
        const sql = `
            SELECT
                orders.id,
                customers.full_name,
                orders.status,
                orders.total_amount,
                orders.order_date
            FROM orders
            JOIN customers ON orders.customer_id = customers.id
            ORDER BY orders.order_date DESC
        `;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ message: "Failed to retrieve orders." });
            res.json(results);
        });
    }
);

//  CREATE ORDER 
router.post(
    "/",
    authenticateToken,
    authorizeRole("admin", "counter"),
    [
        body("customer_id").isInt({ min: 1 }).withMessage("Valid customer ID is required."),
        body("total_amount").isFloat({ min: 0 }).withMessage("Total amount must be a positive number.")
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { customer_id, total_amount } = req.body;

        db.query(
            "INSERT INTO orders (customer_id, total_amount) VALUES (?, ?)",
            [customer_id, total_amount],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Failed to create order." });
                res.status(201).json({ message: "Order created successfully.", order_id: result.insertId });
            }
        );
    }
);

//  UPDATE ORDER STATUS 
router.put(
    "/:id",
    authenticateToken,
    authorizeRole("admin"),
    [
        param("id").isInt({ min: 1 }).withMessage("Valid order ID is required."),
        body("status").isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(", ")}.`)
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        db.query(
            "UPDATE orders SET status = ? WHERE id = ?",
            [req.body.status, req.params.id],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Failed to update order." });
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Order not found." });
                }
                res.json({ message: "Order status updated." });
            }
        );
    }
);

module.exports = router;
