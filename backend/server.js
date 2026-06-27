const express = require("express");

const homeRoutes = require("./routes/homeRoutes");

const app = express();

const PORT = 5000;

app.use("/", homeRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});