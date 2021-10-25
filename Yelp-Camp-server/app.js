const express=require('express')
const app=express()
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const errorHandler=require('./utils/error')
const session=require('express-session')
const passport=require('passport')
const localStrategy=require('passport-local')
const helmet=require('helmet')
const MongoDBStore=require('connect-mongo')
const campgroundRoutes=require('./routes/campgrounds')
const userRoutes=require('./routes/users')
const User=require('./models/user')

const dbUrl='mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db=mongoose.connection
db.on("error",console.error.bind(console,"connection error:"))
db.once("open",()=>{
    console.log("Database connected🔗")
})

const store=new MongoDBStore({
    mongoUrl:dbUrl,
    touchAfter:24*60*60,
    crypto:{
        secret:'thisshouldbeanevenbettersecret!'
    }
})

store.on('error',function(e){
    console.log('STORE ERROR😱',e)
})

const sessionConfig={
    store,
    name:'session',
    secret:'thisshouldbeanevenbettersecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig))
app.use(helmet())
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser=req.user
    next()
})

app.get('/',(req,res)=>{
    res.send("HomePage")
})
app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)

app.use(function (req,res,next){
    let err = new Error('Not Found');
    err.status=404;
    next(err);
})

app.use(errorHandler)

app.listen(process.env.PORT||8080,()=>{
    console.log('Yelp camp is listening on 8080 🚀')
})