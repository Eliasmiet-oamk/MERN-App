import express from 'express';
import mongoose  from 'mongoose';
import dotenv from 'dotenv';
import cors  from 'cors'
import usersRoute from './routes/usersRoute.js';
import productRoute from './routes/productRoute.js';


dotenv.config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());





mongoose.connect(process.env.MONGODB_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.on('open', () => console.log('Connected'))





app.use('/api/products', productRoute)

 


app.use('/api/users', usersRoute)





app.listen((8000), function() {
    console.log("Server running")
});