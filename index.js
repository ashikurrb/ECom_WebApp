import express from "express";
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import catagoryRoutes from "./routes/catagoryRoutes.js";
import productRoutes from './routes/productRoute.js';
import cors from 'cors';


//configure env
dotenv.config();

//databaseConfig
connectDB();

//rest object
const app = express();


//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/catagory', catagoryRoutes)
app.use('/api/v1/product', productRoutes)



//rest API
app.get('/', (req, res) => {
    res.send("<h1>ECom_WebApp: Node Server is Running Successfully</h1>")
})

//PORT
const PORT = process.env.PORT || 5000;

//run listen

app.listen(PORT, () => {
    console.log(`Server running on: ${PORT}`)
});
