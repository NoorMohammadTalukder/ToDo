// basic library import
const express=require("express");
const router=require("./src/routes/api");
const app=new express();
const bodyParser=require("body-parser");
const dotenv=require('dotenv');

// security middleware library import
const rateLimit=require("express-rate-limit");
const helmet=require("helmet");
const moongoseSanitize=require("express-mongo-sanitize");
const xss=require("xss-clean");
const hpp=require("hpp");
const cors=require("cors");

// database library import
const mongoose=require("mongoose");

// security middleware implement
app.use(cors());
app.use(hpp());
app.use(xss());
app.use(moongoseSanitize());
app.use(helmet());
app.use(rateLimit());

// body-parse implement
app.use(bodyParser.json());

//request rate limit
const limiter=rateLimit({windowMs:15*60*1000,max:3000});
app.use(limiter);

//dotenv implement
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// routing implement
app.use("/api/v1",router)

// undefined route
app.use("*",(req,res)=>{
    res.status(404).json({
        message:"undefined route",
        data:"No data found"
    })
})

module.exports=app;