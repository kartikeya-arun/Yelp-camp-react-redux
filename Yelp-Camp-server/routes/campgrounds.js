const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const campground=require('../models/campgrounds')

const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl
        // req.flash('error','You must be signed in first!')
        console.log(`🙍🏼‍♂️:${req.user}`)
        return res.json('You need to be logged in.🔐')
        // return res.redirect('/login')
    }
    next()
}

const isAuthor=async(req,res,next)=>{
    const {id}=req.params
    const updateCampground=await campground.findById(id)
    if(!updateCampground.author.equals(req.user._id)){
        // req.flash('error','You do not have permission to do that!')
        console.log(`🙍🏼‍♂️:${req.user}`)
        return res.json('You are not authorized to make this change.❌')
        // return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

router.route('/')
    .get(async (req,res,next)=>{
            try {
                const campgrounds=await campground.find({})
                return res.json(campgrounds)   
            } catch (error) {
                next(error)
            }
    })
    .post(isLoggedIn,async (req,res)=>{
        try {
            // const geoData=await geocoder.forwardGeocode({
            //     query:req.body.campground.location,
            //     limit:1
            // }).send()
            const newCampground = new campground(req.body)
            // newCampground.geometry=geoData.body.features[0].geometry
            // newCampground.images=req.files.map(f=>({url:f.path,filename:f.filename}))
            // newCampground.author=req.user._id
            await newCampground.save()
            return res.json(newCampground)    
        } catch (error) {
            return next(error)
        }
    })

    router.route('/:id')
        .get(async (req,res,next)=>{
            try {
                const Campground=await campground.findById(req.params.id)
                // .populate({
                //     path:'reviews',
                //     populate:{
                //         path:'author'
                //     }
                // }).populate('author')
                // if(!Campground){
                //     res.json('Cannot find that campground!!')
                //     return res.redirect('/campgrounds')
                // }
                return res.json(Campground)    
            } catch (error) {
                return next(error)
            }
        })
        .put(isLoggedIn,isAuthor,async(req,res)=>{
            try {
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
                return res.json(camp)    
            } catch (error) {
                return next(error)
            }
        })
        .delete(isLoggedIn,isAuthor,async(req,res)=>{
            try {
                const {id}=req.params
                await campground.findByIdAndDelete(id)
                return res.json('Deleted successfully')    
            } catch (error) {
                return next(error)
            }
        })

module.exports=router