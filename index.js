
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config();
mongoose
    .connect(process.env.MONGO_URL)
    .then(()=> console.log("DB Connection Successfull!!"))
    .catch((err)=>console.log(err));
app.use(cors());
app.use("/api/users", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/product"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/carts", require("./routes/cart"));
app.use("/api/checkout", require("./routes/cart"));
app.get("/",(req,res)=>{res.send("Hello")});

    
app.listen(process.env.PORT||5000,()=>{
    console.log("Server is running");
})
