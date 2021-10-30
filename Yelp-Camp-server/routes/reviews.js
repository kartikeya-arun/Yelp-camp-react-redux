import express from 'express';
import campground from '../models/campgrounds'
import review from '../models/review'
const router=express.Router({mergeParams:true})

const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl
        // req.flash('error','You must be signed in first!')
        console.log(`🙍🏼‍♂️:${req.user} isAuthenticated👉🏼${req.isAuthenticated()}`)
        return res.json('You need to be logged in.🔐')
        // return res.redirect('/login')
    }
    next()
}

const isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params
    const review=await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

function validateReview(req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// router.post('/',isLoggedIn,validateReview,async (req,res,next)=>{
router.post('/',isLoggedIn,async (req,res,next)=>{
    try {
        const Campground=await campground.findById(req.params.id)
        const Review=new review(req.body.review)
        Review.author=req.user._id
        Campground.reviews.push(Review)
        await Review.save()
        await Campground.save()
        return res.redirect(`/campgrounds/${Campground._id}`)
    } catch (error) {
        return next(error)
    }
})

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, async (req,res,next)=>{
    try {
        const {id,reviewId}=req.params
        campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
        await review.findByIdAndDelete(reviewId)
        return res.redirect(`/campgrounds/${id}`)
    } catch (error) {
        return next(error)
    }
})