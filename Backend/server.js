const express = require("express");
const cors = require("cors");

const app = express();

const employeeRoutes = require("./routes/employeeRoutes");
const loggerMiddleware = require("./middleware/loggerMiddleware");

// Middleware
app.use(cors()); // ✅ Important
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.use("/employees", employeeRoutes);

app.get("/", (req, res) => {
  res.send("Employee Management API Running");
});

app.listen(5100, () => {
  console.log("Server Running on Port 5100");
});