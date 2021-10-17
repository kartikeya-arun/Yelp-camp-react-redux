const express=require('express')
const app=express()
const campground=require('./models/campgrounds')
const mongoose=require('mongoose')
const {Schema}=mongoose
const bodyParser=require('body-parser')

const dbUrl='mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db=mongoose.connection
db.on("error",console.error.bind(console,"connection error:"))
db.once("open",()=>{
    console.log("Database connected")
})

app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.send("HomePage")
})

app.get('/campgrounds',async (req,res)=>{
    const campgrounds=await campground.find({})
    return res.json(campgrounds)
})

app.post('/campgrounds',async (req,res)=>{
    // const geoData=await geocoder.forwardGeocode({
    //     query:req.body.campground.location,
    //     limit:1
    // }).send()
    const newCampground = new campground(req.body)
    // newCampground.geometry=geoData.body.features[0].geometry
    // newCampground.images=req.files.map(f=>({url:f.path,filename:f.filename}))
    // newCampground.author=req.user._id
    await newCampground.save()
    res.json(newCampground)
})

app.get('/campgrounds/:id', async (req,res)=>{
    const Campground=await campground.findById(req.params.id)
    // .populate({
    //     path:'reviews',
    //     populate:{
    //         path:'author'
    //     }
    // }).populate('author')
    if(!Campground){
        res.json('Cannot find that campground!!')
        return res.redirect('/campgrounds')
    }
    return res.json(Campground)
})

app.post('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params
    // const camp=await campground.findByIdAndUpdate(id,{...req.body.campground})
    const camp=await campground.findByIdAndUpdate(id,{...req.body})
    // const imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
    // camp.images.push(...imgs)
    await camp.save()
    // if(req.body.deleteImages){
    //     for(let filename of req.body.deleteImages){
    //         await cloudinary.uploader.destroy(filename)
    //     }
    //     await camp.updateOne({$pull: {images:{filename:{$in:req.body.deleteImages}}}})
    // }
    // req.flash('success','Successfully updated campground!')
    res.json(camp)
})

app.delete('/campgrounds/:id', async(req,res)=>{
    const {id}=req.params
    await campground.findByIdAndDelete(id)
    res.json('Deleted successfully')
})

app.listen(process.env.PORT||8080,()=>{
    console.log('Yelp camp is listening on 8080')
})