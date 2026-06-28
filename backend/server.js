const express = require("express");
const userRoutes = require("./routes/userRoutes");

const homeRoutes = require("./routes/homeRoutes");

const app = express();

app.use(express.json());

const PORT = 5000;

app.use("/", homeRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});