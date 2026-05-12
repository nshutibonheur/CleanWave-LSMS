require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

//  MIDDLEWARE 
app.use(cors());
app.use(express.json());

// ROUTES 
app.use("/api/auth",       require("./routes/auth"));
app.use("/api/customers",  require("./routes/customers"));
app.use("/api/orders",     require("./routes/orders"));
app.use("/api/payments",   require("./routes/payments"));
app.use("/api/deliveries", require("./routes/deliveries"));

//  HEALTH CHECK 
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 HANDLER 
app.use((req, res) => {
    res.status(404).json({ message: "Route not found." });
});

//  GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack || err.message);
    res.status(500).json({ message: "An internal server error occurred." });
});

// START SERVER 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🔥 LSMS server running on port ${PORT}`);
});
