const express = require("express");
const cors = require("cors");
const predictRoute = require("./routes/predictRoute");

const app = express();
app.use(express.json());
app.use(cors({
   origin: 'https://pcos.vercel.app/',
    methods: ['GET', 'POST',"PUT","DELETE"] 
}));

// Use prediction routes
app.use("/predict", predictRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
