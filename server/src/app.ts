import * as dotenv from 'dotenv';
dotenv.config();
import express,{Application,NextFunction,Request,Response} from 'express'
import {PORT} from './config/index'
import mongoose from 'mongoose';
import cors from 'cors'
import passport from "passport";
require('./lib/passport')(passport)
//importing routes
import {authRoutes} from "./routes/authRoutes"
import {userRoutes} from "./routes/userRoutes"


const  app:Application =express()
app.use(express.json());

app.use((req:Request, res:Response, next:NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
//database setup
mongoose.connect('mongodb+srv://Test2:Db@test.8zhgx.mongodb.net/test?w=majority&retryWrites=true',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }).then(() => console.log('Database connected'))
  .catch(err => console.log(err));

 app.use(cors())

 

//routes defination
app.use("/api/auth",authRoutes)
 app.use("/api/user", userRoutes)
 
 app.use(express.json());
app.listen(PORT, ()=>console.log("server is listnening at port 5000"))

