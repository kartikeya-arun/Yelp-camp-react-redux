const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const campground=require('../models/campgrounds')

router.route('/')
    .get(async (req,res,next)=>{
            try {
                const campgrounds=await campground.find({})
                return res.json(campgrounds)   
            } catch (error) {
                next(error)
            }
    })
    .post(async (req,res)=>{
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
        .put(async(req,res)=>{
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
        .delete(async(req,res)=>{
            try {
                const {id}=req.params
                await campground.findByIdAndDelete(id)
                return res.json('Deleted successfully')    
            } catch (error) {
                return next(error)
            }
        })

module.exports=router