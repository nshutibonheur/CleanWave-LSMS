const express = require("express");
const router = express.Router();
const db = require("../db");
const { body, validationResult } = require("express-validator");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

const VALID_METHODS = ["cash", "mobile_money", "card"];

// GET ALL PAYMENTS 
router.get(
    "/",
    authenticateToken,
    authorizeRole("admin"),
    (req, res) => {
        const sql = `
            SELECT
                payments.id,
                payments.amount,
                payments.payment_method,
                payments.payment_date,
                orders.id AS order_id,
                customers.full_name
            FROM payments
            JOIN orders ON payments.order_id = orders.id
            JOIN customers ON orders.customer_id = customers.id
            ORDER BY payments.payment_date DESC
        `;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ message: "Failed to retrieve payments." });
            res.json(results);
        });
    }
);

//  CREATE PAYMENT
router.post(
    "/",
    authenticateToken,
    authorizeRole("admin", "counter"),
    [
        body("order_id").isInt({ min: 1 }).withMessage("Valid order ID is required."),
        body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be greater than 0."),
        body("payment_method")
            .isIn(VALID_METHODS)
            .withMessage(`Payment method must be one of: ${VALID_METHODS.join(", ")}.`)
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { order_id, amount, payment_method } = req.body;

        db.query(
            "INSERT INTO payments (order_id, amount, payment_method) VALUES (?, ?, ?)",
            [order_id, amount, payment_method],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Failed to record payment." });
                res.status(201).json({ message: "Payment recorded successfully.", payment_id: result.insertId });
            }
        );
    }
);
// update payment
router.put("/:id", (req, res) => {

    const { amount, payment_method } = req.body;

    const sql = `
        UPDATE payments
        SET amount = ?, payment_method = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [amount, payment_method, req.params.id],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Payment update failed"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Payment not found"
                });
            }

            res.json({
                message: "Payment updated successfully"
            });
        }
    );
});

module.exports = router;
